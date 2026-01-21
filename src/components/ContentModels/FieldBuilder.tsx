import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FieldDefinition, FieldType } from '../../types';
import { FieldEditor } from './FieldEditor';

interface FieldBuilderProps {
  fields: FieldDefinition[];
  onChange: (fields: FieldDefinition[]) => void;
}

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  short_text: 'Short Text',
  long_text: 'Long Text',
  rich_text: 'Rich Text',
  number: 'Number',
  boolean: 'Boolean',
  date: 'Date',
  media: 'Media',
  reference: 'Reference',
};

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const [editingField, setEditingField] = useState<{ field: FieldDefinition; index: number } | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);

  const handleAddField = () => {
    setIsAddingField(true);
  };

  const handleSaveField = (field: FieldDefinition, index?: number) => {
    if (index !== undefined) {
      // Update existing field
      const newFields = [...fields];
      newFields[index] = field;
      onChange(newFields);
    } else {
      // Add new field
      onChange([...fields, field]);
    }
    setEditingField(null);
    setIsAddingField(false);
  };

  const handleEditField = (index: number) => {
    setEditingField({ field: fields[index], index });
  };

  const handleDeleteField = (index: number) => {
    if (confirm('Are you sure you want to delete this field?')) {
      onChange(fields.filter((_, i) => i !== index));
    }
  };

  const handleCloseEditor = () => {
    setEditingField(null);
    setIsAddingField(false);
  };

  if (fields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted mb-4">No fields added yet. Add your first field to get started.</p>
        <button
          onClick={handleAddField}
          className="btn-primary py-2 text-small inline-flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Add First Field
        </button>

        {isAddingField && (
          <FieldEditor
            field={null}
            existingFields={fields}
            onSave={(field) => handleSaveField(field)}
            onClose={handleCloseEditor}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="card p-4 flex items-center gap-4 hover:shadow-md transition"
          >
            <FontAwesomeIcon
              icon={faGripVertical}
              className="w-4 h-4 text-text-muted cursor-move"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-text-primary text-small">
                  {field.name}
                </span>
                {field.required && (
                  <span className="text-red-600 text-tiny">*</span>
                )}
                <span className="badge bg-blue-100 text-blue-700">
                  {FIELD_TYPE_LABELS[field.field_type]}
                </span>
              </div>
              <div className="text-tiny text-text-muted">
                {field.api_identifier}
                {field.help_text && ` • ${field.help_text}`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditField(index)}
                className="p-2 hover:bg-bg-light-gray rounded-md transition"
                title="Edit field"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4 text-primary" />
              </button>
              <button
                onClick={() => handleDeleteField(index)}
                className="p-2 hover:bg-red-50 rounded-md transition"
                title="Delete field"
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddField}
        className="mt-4 w-full btn-secondary py-2 text-small flex items-center justify-center gap-2"
      >
        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
        Add Field
      </button>

      {/* Field Editor Modal */}
      {(editingField || isAddingField) && (
        <FieldEditor
          field={editingField?.field || null}
          existingFields={fields}
          onSave={(field) => handleSaveField(field, editingField?.index)}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}
