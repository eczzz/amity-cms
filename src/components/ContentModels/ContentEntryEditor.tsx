import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faEdit, faCode } from '@fortawesome/free-solid-svg-icons';
import { ContentModel, ContentEntry } from '../../types';
import { getSupabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { DynamicField } from './DynamicField';
import { validateAllFields } from './FieldValidation';
import { Toast } from '../Common/Toast';

interface ContentEntryEditorProps {
  model: ContentModel;
  entry: ContentEntry | null;
  onBack: () => void;
  onSave?: () => void;
}

export function ContentEntryEditor({ model, entry, onBack, onSave }: ContentEntryEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'json'>('edit');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [fields, setFields] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setStatus(entry.status);
      setFields(entry.fields);
    } else {
      // Initialize with default values
      const initialFields: Record<string, any> = {};
      model.fields.forEach((field) => {
        if (field.default_value !== undefined) {
          initialFields[field.api_identifier] = field.default_value;
        } else {
          // Set appropriate defaults based on field type
          switch (field.field_type) {
            case 'boolean':
              initialFields[field.api_identifier] = false;
              break;
            case 'number':
              initialFields[field.api_identifier] = 0;
              break;
            default:
              initialFields[field.api_identifier] = '';
          }
        }
      });
      setFields(initialFields);
    }
  }, [entry, model]);

  const handleFieldChange = (apiIdentifier: string, value: any) => {
    setFields((prev) => ({ ...prev, [apiIdentifier]: value }));
    // Clear error for this field when user starts typing
    if (errors[apiIdentifier]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[apiIdentifier];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    // Validate title
    if (!title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }

    // Validate all fields
    const fieldValidationErrors = validateAllFields(model, fields);
    if (fieldValidationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      fieldValidationErrors.forEach(err => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    try {
      setSaving(true);

      const entryData = {
        content_model_id: model.id,
        title: title.trim(),
        fields,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        created_by: user?.id,
      };

      if (entry) {
        // Update existing entry
        const { error } = await getSupabase()
          .from('content_entries')
          .update(entryData)
          .eq('id', entry.id);

        if (error) throw error;
        setToast({
          type: 'success',
          title: 'Entry updated',
          message: 'Your changes have been saved successfully',
        });
        onSave?.();
      } else {
        // Create new entry
        const { error } = await getSupabase()
          .from('content_entries')
          .insert([entryData]);

        if (error) throw error;
        setToast({
          type: 'success',
          title: 'Entry created',
          message: 'Your new entry has been created successfully',
        });
        onSave?.();
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      setToast({
        type: 'error',
        title: 'Failed to save entry',
        message: 'Please check your entries and try again',
      });
    } finally {
      setSaving(false);
    }
  };

  const generateJsonOutput = () => {
    return {
      id: entry?.id || 'new',
      model: model.api_identifier,
      title,
      status,
      published_at: entry?.published_at || null,
      fields,
      created_at: entry?.created_at || new Date().toISOString(),
      updated_at: entry?.updated_at || new Date().toISOString(),
    };
  };

  return (
    <div className="min-h-screen bg-bg-light-gray">
      <div className="p-8">
        <button onClick={onBack} className="btn-secondary py-2 text-small mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          Back to Entries
        </button>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="card overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-bg-slate flex">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-6 py-3 text-small font-medium flex items-center gap-2 transition ${
                    activeTab === 'edit'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-6 py-3 text-small font-medium flex items-center gap-2 transition ${
                    activeTab === 'json'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
                  JSON
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'edit' ? (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        Title <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 text-small"
                        placeholder="Enter title..."
                        required
                      />
                      {errors.title && (
                        <p className="text-tiny text-red-600 mt-1">{errors.title}</p>
                      )}
                    </div>

                    {/* Dynamic Fields */}
                    {model.fields.map((field) => (
                      <DynamicField
                        key={field.id}
                        field={field}
                        value={fields[field.api_identifier]}
                        onChange={(value) => handleFieldChange(field.api_identifier, value)}
                        error={errors[field.api_identifier]}
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold text-text-primary">
                        JSON Output
                      </h3>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(generateJsonOutput(), null, 2));
                          alert('JSON copied to clipboard!');
                        }}
                        className="btn-secondary py-1 px-3 text-tiny"
                      >
                        Copy JSON
                      </button>
                    </div>
                    <pre className="bg-slate-900 text-gray-100 p-4 rounded-md text-tiny font-mono whitespace-pre-wrap break-words w-full">
                      {JSON.stringify(generateJsonOutput(), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <div className="card p-6 sticky top-8">
              <h3 className="font-heading font-semibold text-text-primary mb-4">
                {entry ? 'Update Entry' : 'Create Entry'}
              </h3>

              <div className="space-y-4 mb-6">
                {/* Status */}
                <div>
                  <label className="block text-small font-medium text-text-primary mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2 text-small"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Model Info */}
                <div className="pt-4 border-t border-bg-slate">
                  <div className="text-tiny text-text-muted mb-1">Content Model</div>
                  <div className="text-small font-medium text-text-primary">{model.name}</div>
                </div>

                <div>
                  <div className="text-tiny text-text-muted mb-1">API Identifier</div>
                  <div className="text-small font-mono text-text-primary">{model.api_identifier}</div>
                </div>

                <div>
                  <div className="text-tiny text-text-muted mb-1">Fields</div>
                  <div className="text-small text-text-primary">
                    {model.fields.length} {model.fields.length === 1 ? 'field' : 'fields'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full btn-primary py-2 text-small flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                {saving ? 'Saving...' : entry ? 'Update Entry' : 'Create Entry'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
