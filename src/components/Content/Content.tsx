import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown, faPencilAlt, faTrash, faCode, faEye, faEyeSlash, faArchive } from '@fortawesome/free-solid-svg-icons';
import { ContentModel, ContentEntry } from '../../types';
import { supabase } from '../../lib/supabase';
import { JsonViewer } from '../ContentModels/JsonViewer';
import { ContentEntryEditor } from '../ContentModels/ContentEntryEditor';

export function Content() {
  const [models, setModels] = useState<ContentModel[]>([]);
  const [allEntries, setAllEntries] = useState<(ContentEntry & { model?: ContentModel })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [viewingJson, setViewingJson] = useState<ContentEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<{ model: ContentModel; entry: ContentEntry | null } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch all models
      const { data: modelsData, error: modelsError } = await supabase
        .from('content_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (modelsError) throw modelsError;
      setModels(modelsData || []);

      // Fetch all entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('content_entries')
        .select('*')
        .order('updated_at', { ascending: false });

      if (entriesError) throw entriesError;

      // Attach model info to each entry
      const enrichedEntries = (entriesData || []).map((entry) => ({
        ...entry,
        model: modelsData?.find((m) => m.id === entry.content_model_id),
      }));

      setAllEntries(enrichedEntries);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingEntryId(id);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deletingEntryId) return;

    try {
      const { error } = await supabase
        .from('content_entries')
        .delete()
        .eq('id', deletingEntryId);

      if (error) throw error;
      setAllEntries(allEntries.filter((e) => e.id !== deletingEntryId));
      setDeletingEntryId(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
      setDeleteError('Failed to delete entry');
    }
  };

  const cancelDelete = () => {
    setDeletingEntryId(null);
    setDeleteError(null);
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

  // Filter entries by selected model
  const filteredEntries = selectedModelId
    ? allEntries.filter((e) => e.content_model_id === selectedModelId)
    : allEntries;

  // If editing an entry, show the editor
  if (editingEntry) {
    return (
      <ContentEntryEditor
        model={editingEntry.model}
        entry={editingEntry.entry}
        onBack={() => {
          setEditingEntry(null);
          loadData(); // Refresh the list
        }}
        onSave={() => {
          // Don't navigate, just refresh will happen when they click back
        }}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Content</h1>
          <p className="text-text-muted mt-2">Manage all your content entries across all models</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter by Model */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="btn-secondary py-2 text-small flex items-center gap-2"
            >
              {selectedModelId ? models.find((m) => m.id === selectedModelId)?.name : 'All Models'}
              <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-bg-slate rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setSelectedModelId(null);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-small hover:bg-bg-light-gray border-b border-bg-slate last:border-0 ${
                    selectedModelId === null ? 'bg-primary text-white' : ''
                  }`}
                >
                  All Models
                </button>
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModelId(model.id);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-small hover:bg-bg-light-gray border-b border-bg-slate last:border-0 ${
                      selectedModelId === model.id ? 'bg-primary text-white' : ''
                    }`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Content Button */}
          <div className="relative">
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="btn-primary py-2 text-small flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              Add Content
            </button>
            {showAddDropdown && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-bg-slate rounded-md shadow-lg z-10">
                {models.length === 0 ? (
                  <div className="px-4 py-3 text-tiny text-text-muted">
                    Create a content model first
                  </div>
                ) : (
                  models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setEditingEntry({
                          model,
                          entry: null // null indicates creating a new entry
                        });
                        setShowAddDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-small hover:bg-bg-light-gray border-b border-bg-slate last:border-0"
                    >
                      <div className="font-medium text-text-primary">{model.name}</div>
                      <div className="text-tiny text-text-muted">{model.api_identifier}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-text-muted">Loading entries...</div>
      ) : filteredEntries.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-text-muted mb-4">No entries found</p>
          <p className="text-tiny text-text-muted">
            {selectedModelId ? 'Create an entry for this model' : 'Create a content model and add your first entry'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-light-gray border-b border-bg-slate">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-text-primary">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-text-primary">Model</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-text-primary">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-text-primary">Updated</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-bg-slate last:border-0 hover:bg-bg-light-gray transition cursor-pointer"
                  onClick={() => {
                    if (entry.model) {
                      setEditingEntry({ model: entry.model, entry });
                    }
                  }}
                >
                  <td className="px-6 py-4 text-xs">
                    <div className="font-medium text-text-primary">{entry.title}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-text-muted">
                    {entry.model?.name || 'Unknown Model'}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(entry.status)}
                  </td>
                  <td className="px-6 py-4 text-xs text-text-muted">
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
                          if (entry.model) {
                            setEditingEntry({ model: entry.model, entry });
                          }
                        }}
                        className="p-2 hover:bg-bg-slate rounded-md transition"
                        title="Edit entry"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(entry.id);
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
      )}

      {viewingJson && (
        <JsonViewer
          title={viewingJson.title}
          data={viewingJson}
          onClose={() => setViewingJson(null)}
        />
      )}

      {deletingEntryId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="p-6">
              <h2 className="font-heading font-semibold text-text-primary text-lg mb-2">
                Delete Entry
              </h2>
              <p className="text-text-muted text-small mb-6">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>

              {deleteError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-small mb-6">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="btn-secondary py-2 px-4 text-small"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn-danger py-2 px-4 text-small"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
