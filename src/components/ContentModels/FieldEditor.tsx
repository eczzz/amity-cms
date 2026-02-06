import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { FieldDefinition, FieldType, ArrayItemField } from '../../types';
import { FieldTypeSelector } from './FieldTypeSelector';
import { ArrayItemFieldEditor } from './ArrayItemFieldEditor';

interface FieldEditorProps {
  field: FieldDefinition | null;
  existingFields: FieldDefinition[];
  onSave: (field: FieldDefinition) => void;
  onClose: () => void;
}

export function FieldEditor({ field, existingFields, onSave, onClose }: FieldEditorProps) {
  const [name, setName] = useState('');
  const [apiIdentifier, setApiIdentifier] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('short_text');
  const [required, setRequired] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [rows, setRows] = useState(6);
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [pattern, setPattern] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [referenceTo, setReferenceTo] = useState('');
  const [itemFields, setItemFields] = useState<ArrayItemField[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (field) {
      setName(field.name);
      setApiIdentifier(field.api_identifier);
      setFieldType(field.field_type);
      setRequired(field.required);
      setHelpText(field.help_text || '');
      setPlaceholder(field.options?.placeholder || '');
      setRows(field.options?.rows || 6);
      setMinLength(field.validation?.min_length?.toString() || '');
      setMaxLength(field.validation?.max_length?.toString() || '');
      setMinValue(field.validation?.min_value?.toString() || '');
      setMaxValue(field.validation?.max_value?.toString() || '');
      setPattern(field.validation?.pattern || '');
      setDefaultValue(field.default_value?.toString() || '');
      setReferenceTo(field.reference_to || '');
      setItemFields(field.options?.item_fields || []);
    }
  }, [field]);

  const generateApiIdentifier = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!field && value) {
      setApiIdentifier(generateApiIdentifier(value));
    }
  };

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      setError('Field name is required');
      return;
    }

    if (!apiIdentifier.trim()) {
      setError('API identifier is required');
      return;
    }

    if (!/^[a-z][a-z0-9_]*$/.test(apiIdentifier)) {
      setError('API identifier must start with a letter and contain only lowercase letters, numbers, and underscores');
      return;
    }

    // Check for duplicate API identifier
    const isDuplicate = existingFields.some(
      (f) => f.api_identifier === apiIdentifier && f.id !== field?.id
    );
    if (isDuplicate) {
      setError('A field with this API identifier already exists');
      return;
    }

    if (fieldType === 'reference' && !referenceTo) {
      setError('Please specify which content model to reference');
      return;
    }

    if (fieldType === 'array') {
      if (itemFields.length === 0) {
        setError('Array fields must have at least one item field defined');
        return;
      }
      const hasEmptyName = itemFields.some((f) => !f.name.trim());
      const hasEmptyId = itemFields.some((f) => !f.api_identifier.trim());
      if (hasEmptyName || hasEmptyId) {
        setError('All item fields must have a name and API identifier');
        return;
      }
    }

    // Build field definition
    const fieldDef: FieldDefinition = {
      id: field?.id || `field_${Date.now()}`,
      name,
      api_identifier: apiIdentifier,
      field_type: fieldType,
      required,
      help_text: helpText || undefined,
      validation: {},
      default_value: defaultValue || undefined,
      reference_to: referenceTo || undefined,
      options: {},
    };

    // Add validation rules based on field type
    if (fieldType === 'short_text' || fieldType === 'long_text' || fieldType === 'rich_text') {
      if (minLength) fieldDef.validation!.min_length = parseInt(minLength);
      if (maxLength) fieldDef.validation!.max_length = parseInt(maxLength);
      if (pattern) fieldDef.validation!.pattern = pattern;
    }

    if (fieldType === 'number') {
      if (minValue) fieldDef.validation!.min_value = parseFloat(minValue);
      if (maxValue) fieldDef.validation!.max_value = parseFloat(maxValue);
    }

    // Add options
    if (placeholder) fieldDef.options!.placeholder = placeholder;
    if (fieldType === 'long_text' || fieldType === 'rich_text') {
      fieldDef.options!.rows = rows;
    }
    if (fieldType === 'array' && itemFields.length > 0) {
      fieldDef.options!.item_fields = itemFields;
    }

    // Clean up empty objects
    if (Object.keys(fieldDef.validation!).length === 0) {
      delete fieldDef.validation;
    }
    if (Object.keys(fieldDef.options!).length === 0) {
      delete fieldDef.options;
    }

    onSave(fieldDef);
  };

  const renderTypeDocumentation = () => {
    switch (fieldType) {
      case 'media':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-tiny text-blue-800">
            Accepts an image upload from your media library or an external URL. The stored value is an object with{' '}
            <code className="bg-blue-100 px-1 rounded">{'{ url, photographer, route }'}</code> — photographer and route are optional text fields for attribution. Frontend receives the full object.
          </div>
        );
      case 'button':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-tiny text-blue-800">
            Stores a link with three parts: display text, destination URL, and target (<code className="bg-blue-100 px-1 rounded">_self</code> for same tab, <code className="bg-blue-100 px-1 rounded">_blank</code> for new tab). Frontend receives <code className="bg-blue-100 px-1 rounded">{'{ text, url, target }'}</code>.
          </div>
        );
      case 'array':
        return null; // Documentation is shown inside ArrayItemFieldEditor
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-bg-slate flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-heading font-semibold text-text-primary">
              {field ? 'Edit Field' : 'Add Field'}
            </h2>
            <p className="text-tiny text-text-muted mt-1">
              Configure the field properties and validation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-light-gray rounded-md transition"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-small">
              {error}
            </div>
          )}

          {/* Field Type Selection */}
          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Field Type <span className="text-red-600">*</span>
            </label>
            <FieldTypeSelector
              value={fieldType}
              onChange={setFieldType}
              disabled={!!field}
            />
            {field && (
              <p className="text-tiny text-text-muted mt-1">
                Field type cannot be changed after creation
              </p>
            )}
          </div>

          {/* Type-specific documentation */}
          {renderTypeDocumentation()}

          {/* Basic Info */}
          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Field Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 text-small"
              placeholder="Author Name, Published Date, etc."
              required
            />
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
              placeholder="author_name, published_date"
              required
            />
            <p className="text-tiny text-text-muted mt-1">
              How this field will be accessed in the API
            </p>
          </div>

          <div>
            <label className="block text-small font-medium text-text-primary mb-2">
              Help Text
            </label>
            <input
              type="text"
              value={helpText}
              onChange={(e) => setHelpText(e.target.value)}
              className="w-full px-4 py-2 text-small"
              placeholder="Optional guidance for content editors"
            />
          </div>

          {/* Required Checkbox */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-small text-text-primary">
                This field is required
              </span>
            </label>
          </div>

          {/* Field-type specific options */}
          {(fieldType === 'short_text' || fieldType === 'long_text' || fieldType === 'rich_text') && (
            <>
              <div>
                <label className="block text-small font-medium text-text-primary mb-2">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  className="w-full px-4 py-2 text-small"
                  placeholder="Enter placeholder..."
                />
              </div>

              {(fieldType === 'long_text' || fieldType === 'rich_text') && (
                <div>
                  <label className="block text-small font-medium text-text-primary mb-2">
                    Rows
                  </label>
                  <input
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 6)}
                    className="w-full px-4 py-2 text-small"
                    min="2"
                    max="20"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-medium text-text-primary mb-2">
                    Min Length
                  </label>
                  <input
                    type="number"
                    value={minLength}
                    onChange={(e) => setMinLength(e.target.value)}
                    className="w-full px-4 py-2 text-small"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-small font-medium text-text-primary mb-2">
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={maxLength}
                    onChange={(e) => setMaxLength(e.target.value)}
                    className="w-full px-4 py-2 text-small"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
              </div>
            </>
          )}

          {fieldType === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-small font-medium text-text-primary mb-2">
                  Min Value
                </label>
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  className="w-full px-4 py-2 text-small"
                  placeholder="No minimum"
                />
              </div>
              <div>
                <label className="block text-small font-medium text-text-primary mb-2">
                  Max Value
                </label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  className="w-full px-4 py-2 text-small"
                  placeholder="No maximum"
                />
              </div>
            </div>
          )}

          {fieldType === 'reference' && (
            <div>
              <label className="block text-small font-medium text-text-primary mb-2">
                Reference To Model <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={referenceTo}
                onChange={(e) => setReferenceTo(e.target.value)}
                className="w-full px-4 py-2 text-small font-mono"
                placeholder="author, category, etc."
                required
              />
              <p className="text-tiny text-text-muted mt-1">
                API identifier of the model to reference
              </p>
            </div>
          )}

          {fieldType === 'array' && (
            <ArrayItemFieldEditor
              itemFields={itemFields}
              onChange={setItemFields}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-bg-slate flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="btn-secondary py-2 text-small"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary py-2 text-small flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
            {field ? 'Update Field' : 'Add Field'}
          </button>
        </div>
      </div>
    </div>
  );
}
