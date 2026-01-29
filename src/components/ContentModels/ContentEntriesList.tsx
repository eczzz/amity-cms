import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faArrowLeft,
  faPencilAlt,
  faTrash,
  faCode,
  faEye,
  faEyeSlash,
  faArchive,
} from '@fortawesome/free-solid-svg-icons';
import { ContentModel, ContentEntry } from '../../types';
import { getSupabase } from '../../lib/supabase';
import { JsonViewer } from './JsonViewer';
import { resolveMediaFieldsForEntries } from '../../lib/contentHelpers';

interface ContentEntriesListProps {
  model: ContentModel;
  onBack: () => void;
  onEditEntry: (entry: ContentEntry | null) => void;
}

export function ContentEntriesList({ model, onBack, onEditEntry }: ContentEntriesListProps) {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingJson, setViewingJson] = useState<ContentEntry | null>(null);

  console.log('ContentEntriesList rendering with:', { model, entries, loading });

  useEffect(() => {
    console.log('Loading entries for model:', model.id);
    loadEntries();
  }, [model.id]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await getSupabase()
        .from('content_entries')
        .select('*')
        .eq('content_model_id', model.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const { error } = await getSupabase()
        .from('content_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(entries.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { label: 'Draft', icon: faEyeSlash, color: 'bg-gray-100 text-gray-700' },
      published: { label: 'Published', icon: faEye, color: 'bg-green-100 text-green-700' },
      archived: { label: 'Archived', icon: faArchive, color: 'bg-orange-100 text-orange-700' },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-pill text-tiny font-medium ${badge.color}`}>
        <FontAwesomeIcon icon={badge.icon} className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <button onClick={onBack} className="btn-secondary py-2 text-small mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            Back to Models
          </button>
          <h1>{model.name}</h1>
          <p className="text-text-muted mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="p-8">
        <button onClick={onBack} className="btn-secondary py-2 text-small mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          Back to Models
        </button>

        <div className="mb-6">
          <h1>{model.name}</h1>
          <p className="text-text-muted mt-2">{model.description || 'No description'}</p>
        </div>

        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-heading font-semibold text-text-primary mb-2">
            No Entries Yet
          </h3>
          <p className="text-text-muted mb-6 max-w-md mx-auto">
            Create your first {model.name.toLowerCase()} entry to get started.
          </p>
          <button
            onClick={() => onEditEntry(null)}
            className="btn-primary py-2 text-small inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Create Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button onClick={onBack} className="btn-secondary py-2 text-small mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        Back to Models
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>{model.name}</h1>
          <p className="text-text-muted mt-2">
            {model.description || 'No description'} • {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <button
          onClick={() => onEditEntry(null)}
          className="btn-primary py-2 text-small flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Create Entry
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-light-gray border-b border-bg-slate">
            <tr>
              <th className="text-left px-6 py-3 text-small font-medium text-text-primary">Title</th>
              <th className="text-left px-6 py-3 text-small font-medium text-text-primary">Status</th>
              <th className="text-left px-6 py-3 text-small font-medium text-text-primary">Updated</th>
              <th className="text-right px-6 py-3 text-small font-medium text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-bg-slate last:border-0 hover:bg-bg-light-gray transition cursor-pointer"
                onClick={() => {
                  console.log('Row clicked, entry:', entry);
                  onEditEntry(entry);
                }}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-text-primary">{entry.title}</div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(entry.status)}
                </td>
                <td className="px-6 py-4 text-text-muted">
                  {formatDate(entry.updated_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingJson(entry);
                      }}
                      className="p-2 hover:bg-bg-slate rounded-md transition"
                      title="View JSON"
                    >
                      <FontAwesomeIcon icon={faCode} className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEntry(entry);
                      }}
                      className="p-2 hover:bg-bg-slate rounded-md transition"
                      title="Edit entry"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry.id);
                      }}
                      className="p-2 hover:bg-red-50 rounded-md transition"
                      title="Delete entry"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingJson && (
        <JsonViewer
          title={viewingJson.title}
          data={viewingJson}
          model={model}
          onClose={() => setViewingJson(null)}
        />
      )}
    </div>
  );
}
