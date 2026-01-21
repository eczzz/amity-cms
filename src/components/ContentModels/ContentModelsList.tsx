import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCubes, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ContentModel } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ContentModelsListProps {
  onEdit: (model: ContentModel | null) => void;
}

export function ContentModelsList({ onEdit }: ContentModelsListProps) {
  const [models, setModels] = useState<ContentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content model? This will also delete all entries for this model.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('content_models')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setModels(models.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error deleting model:', error);
      alert('Failed to delete content model');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1>Content Models</h1>
          <p className="text-text-muted mt-2">Loading...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="w-12 h-12 bg-bg-slate rounded-lg mb-4"></div>
              <div className="h-6 bg-bg-slate rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-bg-slate rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-bg-slate rounded w-1/4"></div>
                <div className="h-4 bg-bg-slate rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1>Content Models</h1>
          <p className="text-text-muted mt-2">Define custom content types with dynamic fields</p>
        </div>
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <FontAwesomeIcon icon={faCubes} className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-heading font-semibold text-text-primary mb-2">
            No Content Models Yet
          </h3>
          <p className="text-text-muted mb-6 max-w-md mx-auto">
            Content models define the structure of your content. Create your first model to start building dynamic content types.
          </p>
          <button
            onClick={() => onEdit(null)}
            className="btn-primary py-2 text-small inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Create First Model
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Content Models</h1>
          <p className="text-text-muted mt-2">Define custom content types with dynamic fields</p>
        </div>
        <button
          onClick={() => onEdit(null)}
          className="btn-primary py-2 text-small flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Create Model
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            className="card-hover p-6 cursor-pointer group"
            onClick={() => onEdit(model)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCubes}
                  className="w-6 h-6 text-white"
                />
              </div>
              {model.created_by === user?.id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(model);
                    }}
                    className="p-2 hover:bg-bg-light-gray rounded-md transition"
                    title="Edit model"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(model.id);
                    }}
                    className="p-2 hover:bg-red-50 rounded-md transition"
                    title="Delete model"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>

            <h3 className="font-heading font-semibold text-text-primary mb-2">
              {model.name}
            </h3>

            <p className="text-tiny text-text-muted mb-4 line-clamp-2">
              {model.description || 'No description provided'}
            </p>

            <div className="flex items-center justify-between text-tiny text-text-muted">
              <span>{model.fields.length} {model.fields.length === 1 ? 'field' : 'fields'}</span>
              <span className="font-mono">{model.api_identifier}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
