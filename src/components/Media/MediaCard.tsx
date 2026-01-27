import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCopy, faFileDownload, faFile, faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { Media } from '../../types';
import { formatFileSize } from '../../lib/fileValidation';
import { deleteMedia } from '../../lib/r2';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmationModal } from '../Common/ConfirmationModal';

interface MediaCardProps {
  media: Media;
  onDelete: () => void;
}

export function MediaCard({ media, onDelete }: MediaCardProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isImage = media.mime_type.startsWith('image/');
  const isPdf = media.mime_type === 'application/pdf';
  const isCsv = media.mime_type === 'text/csv';
  const isOwnFile = user?.id === media.uploaded_by;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(media.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteMedia(media.id);
      setShowDeleteConfirm(false);
      onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
      setDeleteError('Failed to delete file. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const getFileIcon = () => {
    if (isPdf) return faFilePdf;
    if (isCsv) return faFileExcel;
    return faFile;
  };

  const createdDate = new Date(media.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="card overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-square bg-bg-light-gray overflow-hidden">
        {isImage ? (
          <img
            src={media.url}
            alt={media.filename}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FontAwesomeIcon icon={getFileIcon()} className="w-12 h-12 text-text-muted" />
          </div>
        )}

        {/* Overlay with Actions */}
        {showActions && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2">
            <a
              href={media.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-text-primary p-2 rounded-md hover:bg-bg-light-gray transition"
              title="Download"
            >
              <FontAwesomeIcon icon={faFileDownload} className="w-5 h-5" />
            </a>
            <button
              onClick={handleCopyUrl}
              className="bg-white text-text-primary p-2 rounded-md hover:bg-bg-light-gray transition"
              title="Copy URL"
            >
              <FontAwesomeIcon icon={faCopy} className="w-5 h-5" />
            </button>
            {isOwnFile && (
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                title="Delete"
              >
                <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-small font-medium text-text-primary truncate mb-1" title={media.filename}>
          {media.filename}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-tiny text-text-muted">
            {formatFileSize(media.size)}
          </p>
          <p className="text-tiny text-text-muted">{createdDate}</p>
        </div>

        {/* Copy Confirmation */}
        {copied && (
          <p className="text-tiny text-green-600 mt-2">✓ URL copied</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete File"
        message={`Are you sure you want to delete "${media.filename}"? This action cannot be undone.${deleteError ? `\n\nError: ${deleteError}` : ''}`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete File'}
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        variant="danger"
      />
    </div>
  );
}
