import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { validateFile, formatFileSize } from '../../lib/fileValidation';
import { requestPresignedUrl, uploadToR2, saveMediaMetadata } from '../../lib/r2';
import { useAuth } from '../../contexts/AuthContext';

interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface MediaUploadProps {
  onUploadComplete: () => void;
}

export function MediaUpload({ onUploadComplete }: MediaUploadProps) {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFiles = async (files: File[]) => {
    const newUploads: UploadProgress[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    // Process each file
    for (let i = 0; i < newUploads.length; i++) {
      const uploadItem = newUploads[i];
      const index = uploads.length + i;

      try {
        // Validate file
        const validation = await validateFile(uploadItem.file);
        if (!validation.valid) {
          setUploads((prev) =>
            prev.map((u, idx) =>
              idx === index
                ? { ...u, status: 'error', error: validation.error }
                : u
            )
          );
          continue;
        }

        // Update status to uploading
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === index ? { ...u, status: 'uploading' } : u
          )
        );

        // Request presigned URL
        const { presignedUrl, publicUrl, filename } =
          await requestPresignedUrl(uploadItem.file.name, uploadItem.file.type);

        // Upload to R2
        await uploadToR2(uploadItem.file, presignedUrl, (progress) => {
          setUploads((prev) =>
            prev.map((u, idx) =>
              idx === index ? { ...u, progress } : u
            )
          );
        });

        // Save metadata to Supabase
        if (user) {
          await saveMediaMetadata(
            filename,
            publicUrl,
            uploadItem.file.type,
            uploadItem.file.size,
            user.id
          );
        }

        // Mark as success
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === index
              ? {
                  ...u,
                  status: 'success',
                  progress: 100,
                  url: publicUrl,
                }
              : u
          )
        );
      } catch (error: any) {
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === index
              ? {
                  ...u,
                  status: 'error',
                  error:
                    error.message ||
                    'Upload failed. Please try again.',
                }
              : u
          )
        );
      }
    }

    // Trigger refresh after all uploads complete
    setTimeout(() => {
      const allComplete = newUploads.every(
        (u) => uploads.length === 0 || u.status !== 'pending'
      );
      if (allComplete) {
        onUploadComplete();
      }
    }, 1000);
  };

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const successCount = uploads.filter((u) => u.status === 'success').length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-bg-slate bg-bg-light-gray hover:border-primary'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FontAwesomeIcon
          icon={faUpload}
          className="w-8 h-8 text-text-muted mb-3"
        />
        <p className="text-small font-medium text-text-primary mb-1">
          Drag files here to upload
        </p>
        <p className="text-tiny text-text-muted mb-4">
          or click to browse (PNG, JPG, SVG, PDF, CSV - max 10MB)
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary py-2 text-small inline-block"
        >
          Select Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.svg,.pdf,.csv,.gif,.webp,.txt"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {successCount > 0 && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-small">
              ✓ {successCount} file{successCount !== 1 ? 's' : ''} uploaded
              successfully
            </div>
          )}

          {uploads.map((upload, index) => (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-small font-medium text-text-primary truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-tiny text-text-muted">
                    {formatFileSize(upload.file.size)}
                  </p>
                </div>
                {upload.status !== 'pending' && (
                  <button
                    onClick={() => removeUpload(index)}
                    className="ml-2 p-1 text-text-muted hover:text-text-primary"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                  </button>
                )}
              </div>

              {upload.status === 'error' && (
                <div className="text-tiny text-red-600">{upload.error}</div>
              )}

              {upload.status === 'success' && (
                <div className="text-tiny text-green-600">✓ Uploaded</div>
              )}

              {(upload.status === 'uploading' || upload.status === 'pending') && (
                <>
                  <div className="w-full bg-bg-slate rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  <p className="text-tiny text-text-muted mt-1">
                    {upload.progress}%
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
