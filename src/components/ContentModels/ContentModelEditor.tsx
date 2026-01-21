import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { ContentModel, FieldDefinition } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { FieldBuilder } from './FieldBuilder';

interface ContentModelEditorProps {
  model: ContentModel | null;
  onBack: () => void;
  onSave: () => void;
}

export function ContentModelEditor({ model, onBack, onSave }: ContentModelEditorProps) {
  const [name, setName] = useState('');
  const [apiIdentifier, setApiIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('faFileAlt');
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (model) {
      setName(model.name);
      setApiIdentifier(model.api_identifier);
      setDescription(model.description);
      setIcon(model.icon);
      setFields(model.fields);
    }
  }, [model]);

  const generateApiIdentifier = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate API identifier only when creating new model
    if (!model && value) {
      setApiIdentifier(generateApiIdentifier(value));
    }
  };

  const validateApiIdentifier = (identifier: string): string | null => {
    if (!identifier) return 'API identifier is required';
    if (!/^[a-z][a-z0-9_]*$/.test(identifier)) {
      return 'API identifier must start with a letter and contain only lowercase letters, numbers, and underscores';
    }
    if (identifier.length < 2) return 'API identifier must be at least 2 characters';
    if (identifier.length > 50) return 'API identifier must be no more than 50 characters';
    return null;
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      setError('Model name is required');
      return;
    }

    const apiIdError = validateApiIdentifier(apiIdentifier);
    if (apiIdError) {
      setError(apiIdError);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const modelData = {
        name,
        api_identifier: apiIdentifier,
        description,
        icon,
        fields,
        updated_at: new Date().toISOString(),
      };

      if (model) {
        // Update existing model
        const { error: updateError } = await supabase
          .from('content_models')
          .update(modelData)
          .eq('id', model.id);

        if (updateError) throw updateError;
      } else {
        // Create new model
        const { error: insertError } = await supabase
          .from('content_models')
          .insert({
            ...modelData,
            created_by: user?.id,
          });

        if (insertError) throw insertError;
      }

      onSave();
    } catch (err: any) {
      console.error('Error saving model:', err);
      setError(err.message || 'Failed to save content model');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-bg-light-gray rounded-md transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </button>
        <div>
          <h1>{model ? 'Edit Content Model' : 'Create Content Model'}</h1>
          <p className="text-text-muted mt-1">
            {model ? 'Update your content model definition' : 'Define a new content type'}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-small">
          {error}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="card p-6">
            <h2 className="font-heading font-semibold text-text-primary mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-small font-medium text-text-primary mb-2">
                  Model Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2 text-small"
                  placeholder="Blog Article, Product, Author..."
                  required
                />
                <p className="text-tiny text-text-muted mt-1">
                  A descriptive name for this content type
                </p>
              </div>

              <div>
                <label className="block text-small font-medium text-text-primary mb-2">
                  API Identifier <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={apiIdentifier}
                  onChange={(e) => setApiIdentifier(e.target.value)}
                  className="w-full px-4 py-2 text-small font-mono"
                  placeholder="blog_article"
                  required
                />
                <p className="text-tiny text-text-muted mt-1">
                  Unique identifier for API access (lowercase, underscores allowed)
                </p>
              </div>

              <div>
                <label className="block text-small font-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 text-small resize-none"
                  placeholder="Describe the purpose of this content model..."
                />
                <p className="text-tiny text-text-muted mt-1">
                  Optional description to explain what this content type is for
                </p>
              </div>
            </div>
          </div>

          {/* Fields Card */}
          <div className="card p-6">
            <h2 className="font-heading font-semibold text-text-primary mb-4">
              Fields
            </h2>
            <FieldBuilder fields={fields} onChange={setFields} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">
              Summary
            </h3>
            <div className="space-y-3 text-small">
              <div>
                <div className="text-text-muted">Fields</div>
                <div className="text-text-primary font-medium">
                  {fields.length} {fields.length === 1 ? 'field' : 'fields'}
                </div>
              </div>
              <div>
                <div className="text-text-muted">Status</div>
                <div className="text-text-primary font-medium">
                  {model ? 'Active' : 'New'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !apiIdentifier.trim()}
            className="w-full btn-primary py-2 text-small flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
            {saving ? 'Saving...' : model ? 'Update Model' : 'Create Model'}
          </button>
        </div>
      </div>
    </div>
  );
}
