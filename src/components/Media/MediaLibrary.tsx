import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getSupabase } from '../../lib/supabase';
import { Media } from '../../types';
import { MediaCard } from './MediaCard';
import { MediaUpload } from './MediaUpload';

export function MediaLibrary() {
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    filterMedia();
  }, [media, searchTerm, filterType]);

  const loadMedia = async () => {
    setLoading(true);
    try {
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

  const filterMedia = () => {
    let filtered = media;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((m) => m.filename.toLowerCase().includes(term));
    }

    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'image') {
        filtered = filtered.filter((m) => m.mime_type.startsWith('image/'));
      } else if (filterType === 'document') {
        filtered = filtered.filter((m) => !m.mime_type.startsWith('image/'));
      }
    }

    setFilteredMedia(filtered);
  };

  const handleDeleteComplete = () => {
    loadMedia();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 bg-bg-slate rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Media Library</h1>
          <p className="text-text-muted mt-2">
            Upload and manage your media files (images, documents, etc.)
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary py-2 text-small"
        >
          {showUpload ? 'Cancel' : 'Upload Files'}
        </button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="mb-8">
          <MediaUpload onUploadComplete={handleDeleteComplete} />
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 px-4 py-2 text-small"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-md text-small transition ${
              filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-bg-light-gray text-text-primary hover:bg-bg-slate'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1 rounded-md text-small transition ${
              filterType === 'image'
                ? 'bg-primary text-white'
                : 'bg-bg-light-gray text-text-primary hover:bg-bg-slate'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setFilterType('document')}
            className={`px-3 py-1 rounded-md text-small transition ${
              filterType === 'document'
                ? 'bg-primary text-white'
                : 'bg-bg-light-gray text-text-primary hover:bg-bg-slate'
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-text-muted mb-4">
            {media.length === 0
              ? 'No files yet. Upload your first file to get started.'
              : 'No files match your search or filter.'}
          </p>
          {media.length === 0 && (
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary py-2 text-small inline-block"
            >
              Upload First File
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((m) => (
            <MediaCard
              key={m.id}
              media={m}
              onDelete={handleDeleteComplete}
            />
          ))}
        </div>
      )}

      {/* File Count */}
      {filteredMedia.length > 0 && (
        <p className="text-text-muted text-small mt-6">
          Showing {filteredMedia.length} of {media.length} file
          {media.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
