import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FieldDefinition, FieldType } from '../../types';
import { FieldEditor } from './FieldEditor';
import { ConfirmationModal } from '../Common/ConfirmationModal';

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
  button: 'Button',
  array: 'Array',
};

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const [editingField, setEditingField] = useState<{ field: FieldDefinition; index: number } | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ index: number; field: FieldDefinition } | null>(null);

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
    setDeleteConfirmation({ index, field: fields[index] });
  };

  const confirmDeleteField = () => {
    if (deleteConfirmation) {
      onChange(fields.filter((_, i) => i !== deleteConfirmation.index));
      setDeleteConfirmation(null);
    }
  };

  const cancelDeleteField = () => {
    setDeleteConfirmation(null);
  };

  const handleCloseEditor = () => {
    setEditingField(null);
    setIsAddingField(false);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newFields = [...fields];
    const draggedField = newFields[draggedIndex];

    // Remove the dragged field
    newFields.splice(draggedIndex, 1);

    // Insert at the new position
    newFields.splice(dropIndex, 0, draggedField);

    onChange(newFields);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`card p-4 flex items-center gap-4 hover:shadow-md transition ${
              draggedIndex === index ? 'opacity-50' : ''
            } ${dragOverIndex === index && draggedIndex !== index ? 'border-2 border-primary' : ''}`}
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation !== null}
        title="Delete Field"
        message={`Are you sure you want to delete the field "${deleteConfirmation?.field.name}"? This action cannot be undone.`}
        confirmLabel="Delete Field"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteField}
        onCancel={cancelDeleteField}
        variant="danger"
      />
    </div>
  );
}
