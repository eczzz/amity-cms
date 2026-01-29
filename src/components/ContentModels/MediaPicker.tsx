import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes, faCheck, faUpload, faSpinner, faLink } from '@fortawesome/free-solid-svg-icons';
import { Media } from '../../types';
import { getSupabase } from '../../lib/supabase';
import { requestPresignedUrl, uploadToR2, saveMediaMetadata } from '../../lib/r2';
import { validateFile } from '../../lib/fileValidation';
import { useAuth } from '../../contexts/AuthContext';

interface MediaPickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function MediaPicker({ value, onChange }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'url'>('library');
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const isImage = value && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(value);

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
    setUrlInput(value || '');
    setUrlError(null);
    setUploadError(null);
    loadMedia();
  };

  const handleSelect = (item: Media) => {
    onChange(item.url);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const validation = await validateFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || 'Invalid file');
        setUploading(false);
        return;
      }

      const { presignedUrl, publicUrl, filename } = await requestPresignedUrl(
        file.name,
        file.type
      );

      await uploadToR2(file, presignedUrl, setUploadProgress);

      await saveMediaMetadata(
        filename,
        publicUrl,
        file.type,
        file.size,
        user.id
      );

      await loadMedia();

      // Emit the URL directly
      onChange(publicUrl);
      setIsOpen(false);

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

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError('Please enter a URL');
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      if (!trimmed.startsWith('/')) {
        setUrlError('Please enter a valid URL (https://... or /path)');
        return;
      }
    }
    setUrlError(null);
    onChange(trimmed);
    setIsOpen(false);
  };

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-md overflow-hidden bg-bg-light-gray flex items-center justify-center">
            {isImage ? (
              <img
                src={value}
                alt="Selected media"
                className="w-full h-full object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-text-muted" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-small text-text-primary font-medium truncate">
              {value}
            </div>
            <div className="text-tiny text-text-muted">
              {isImage ? 'Image' : 'File'} URL
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
                    Upload a file, choose from your library, or paste a URL
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-bg-light-gray rounded-md transition"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-bg-slate -mb-[1px]">
                <button
                  onClick={() => setActiveTab('library')}
                  className={`px-4 py-2 text-small font-medium flex items-center gap-2 transition border-b-2 ${
                    activeTab === 'library'
                      ? 'text-primary border-primary'
                      : 'text-text-muted border-transparent hover:text-text-primary'
                  }`}
                >
                  <FontAwesomeIcon icon={faImage} className="w-3.5 h-3.5" />
                  Library
                </button>
                <button
                  onClick={() => setActiveTab('url')}
                  className={`px-4 py-2 text-small font-medium flex items-center gap-2 transition border-b-2 ${
                    activeTab === 'url'
                      ? 'text-primary border-primary'
                      : 'text-text-muted border-transparent hover:text-text-primary'
                  }`}
                >
                  <FontAwesomeIcon icon={faLink} className="w-3.5 h-3.5" />
                  URL
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'library' ? (
                <>
                  {/* Upload Button */}
                  <div className="flex items-center gap-3 mb-6">
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

                  {/* Media Grid */}
                  {loading ? (
                    <div className="text-center py-12 text-text-muted">
                      Loading media...
                    </div>
                  ) : media.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-text-muted mb-4">No media files yet</p>
                      <p className="text-tiny text-text-muted">
                        Upload files using the button above
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
                            value === item.url ? 'ring-2 ring-primary' : ''
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
                          {value === item.url && (
                            <div className="flex items-center gap-1 text-primary mt-1">
                              <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                              <span className="text-tiny">Selected</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* URL Tab */
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-tiny text-blue-800">
                    Paste an external image or file URL. Supports absolute URLs (https://...) and relative paths (/images/...).
                  </div>

                  <div>
                    <label className="block text-small font-medium text-text-primary mb-2">
                      URL
                    </label>
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        setUrlError(null);
                      }}
                      className="w-full px-4 py-2 text-small border border-gray-300 rounded-md"
                      placeholder="https://example.com/image.jpg"
                      onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    />
                    {urlError && (
                      <p className="text-tiny text-red-600 mt-1">{urlError}</p>
                    )}
                  </div>

                  {/* URL Preview */}
                  {urlInput && !urlError && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(urlInput) && (
                    <div className="border border-gray-200 rounded-md p-3">
                      <p className="text-tiny text-text-muted mb-2">Preview:</p>
                      <img
                        src={urlInput}
                        alt="URL preview"
                        className="max-h-40 rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleUrlSubmit}
                    className="btn-primary py-2 px-6 text-small"
                  >
                    Use This URL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
