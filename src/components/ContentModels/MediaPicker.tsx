import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes, faCheck, faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Media } from '../../types';
import { getSupabase } from '../../lib/supabase';
import { requestPresignedUrl, uploadToR2, saveMediaMetadata } from '../../lib/r2';
import { validateFile } from '../../lib/fileValidation';
import { useAuth } from '../../contexts/AuthContext';

interface MediaPickerProps {
  value: string | null;
  onChange: (mediaId: string | null) => void;
}

export function MediaPicker({ value, onChange }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Load selected media on mount if value exists
  useEffect(() => {
    const loadSelectedMedia = async () => {
      if (!value) {
        setSelectedMedia(null);
        return;
      }

      // First check if we already have it in the media array
      const found = media.find(m => m.id === value);
      if (found) {
        setSelectedMedia(found);
        return;
      }

      // If not, fetch it directly
      try {
        const { data, error } = await getSupabase()
          .from('media')
          .select('*')
          .eq('id', value)
          .single();

        if (!error && data) {
          setSelectedMedia(data);
        }
      } catch (error) {
        console.error('Error loading selected media:', error);
      }
    };

    loadSelectedMedia();
  }, [value, media]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const { data, error } = await getSupabase()
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    loadMedia();
  };

  const handleSelect = (item: Media) => {
    onChange(item.id);
    setSelectedMedia(item);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSelectedMedia(null);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Validate file
      const validation = await validateFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || 'Invalid file');
        setUploading(false);
        return;
      }

      // Request presigned URL from backend
      const { presignedUrl, publicUrl, filename } = await requestPresignedUrl(
        file.name,
        file.type
      );

      // Upload to R2
      await uploadToR2(file, presignedUrl, setUploadProgress);

      // Save metadata to Supabase
      const { id } = await saveMediaMetadata(
        filename,
        publicUrl,
        file.type,
        file.size,
        user.id
      );

      // Reload media list and auto-select
      await loadMedia();

      // Find and select the newly uploaded file
      const { data: newMediaData } = await getSupabase()
        .from('media')
        .select('*')
        .eq('id', id)
        .single();

      if (newMediaData) {
        handleSelect(newMediaData);
      }

      setUploadProgress(100);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {selectedMedia ? (
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-md overflow-hidden bg-bg-light-gray flex items-center justify-center">
            {selectedMedia.mime_type.startsWith('image/') ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.filename}
                className="w-full h-full object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-text-muted" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-small text-text-primary font-medium">
              {selectedMedia.filename}
            </div>
            <div className="text-tiny text-text-muted">
              {(selectedMedia.size / 1024).toFixed(1)} KB
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary py-1 px-3 text-tiny"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleOpen}
            className="btn-primary py-1 px-3 text-tiny"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="w-full btn-secondary py-2 text-small flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
          Select Media
        </button>
      )}

      {/* Media Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-bg-slate">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading font-semibold text-text-primary">
                    Select Media
                  </h2>
                  <p className="text-tiny text-text-muted mt-1">
                    Choose an image or file from your media library
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-bg-light-gray rounded-md transition"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.csv,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="btn-primary py-2 text-small flex items-center gap-2"
                >
                  <FontAwesomeIcon
                    icon={uploading ? faSpinner : faUpload}
                    className={`w-4 h-4 ${uploading ? 'animate-spin' : ''}`}
                  />
                  {uploading ? `Uploading... ${uploadProgress}%` : 'Upload New File'}
                </button>

                {uploadError && (
                  <span className="text-tiny text-red-600">{uploadError}</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="text-center py-12 text-text-muted">
                  Loading media...
                </div>
              ) : media.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-muted mb-4">No media files yet</p>
                  <p className="text-tiny text-text-muted">
                    Upload files in the Media section first
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`card-hover p-3 text-left ${
                        value === item.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="aspect-square rounded-md overflow-hidden bg-bg-light-gray mb-2 flex items-center justify-center">
                        {item.mime_type.startsWith('image/') ? (
                          <img
                            src={item.url}
                            alt={item.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faImage}
                            className="w-8 h-8 text-text-muted"
                          />
                        )}
                      </div>
                      <div className="text-tiny text-text-primary truncate">
                        {item.filename}
                      </div>
                      {value === item.id && (
                        <div className="flex items-center gap-1 text-primary mt-1">
                          <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                          <span className="text-tiny">Selected</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
