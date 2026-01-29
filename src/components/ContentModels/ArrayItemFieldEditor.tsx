import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { ArrayItemField, ArrayItemFieldType } from '../../types';

interface ArrayItemFieldEditorProps {
  itemFields: ArrayItemField[];
  onChange: (fields: ArrayItemField[]) => void;
}

const ITEM_FIELD_TYPES: Array<{ value: ArrayItemFieldType; label: string }> = [
  { value: 'short_text', label: 'Short Text' },
  { value: 'long_text', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'media', label: 'Media' },
  { value: 'button', label: 'Button' },
];

function generateApiIdentifier(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '');
}

export function ArrayItemFieldEditor({ itemFields, onChange }: ArrayItemFieldEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addField = () => {
    onChange([
      ...itemFields,
      { name: '', api_identifier: '', field_type: 'short_text', required: false },
    ]);
  };

  const updateField = (index: number, updates: Partial<ArrayItemField>) => {
    const newFields = [...itemFields];
    newFields[index] = { ...newFields[index], ...updates };

    // Auto-generate api_identifier from name if api_identifier hasn't been manually set
    if (updates.name !== undefined && !itemFields[index].api_identifier) {
      newFields[index].api_identifier = generateApiIdentifier(updates.name);
    }

    onChange(newFields);
  };

  const removeField = (index: number) => {
    onChange(itemFields.filter((_, i) => i !== index));
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

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newFields = [...itemFields];
    const dragged = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(dropIndex, 0, dragged);
    onChange(newFields);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-small font-medium text-text-primary">
          Item Fields <span className="text-red-600">*</span>
        </label>
        <span className="text-tiny text-text-muted">
          {itemFields.length} {itemFields.length === 1 ? 'field' : 'fields'}
        </span>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-tiny text-blue-800">
        Define the fields for each item in the array. Each entry will be a repeatable row with these fields. Frontend receives a JSON array of objects.
      </div>

      {itemFields.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-small text-text-muted mb-3">No item fields defined yet</p>
          <button
            type="button"
            onClick={addField}
            className="btn-primary py-1.5 px-4 text-tiny inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
            Add First Field
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {itemFields.map((field, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-start gap-2 p-3 bg-white border rounded-lg ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${dragOverIndex === index && draggedIndex !== index ? 'border-primary border-2' : 'border-gray-200'}`}
            >
              <FontAwesomeIcon
                icon={faGripVertical}
                className="w-3 h-3 text-text-muted cursor-move mt-2.5"
              />

              <div className="flex-1 grid grid-cols-[1fr_auto_auto_auto] gap-2 items-start">
                <div>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(index, { name: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-tiny border border-gray-300 rounded-md"
                    placeholder="Field name"
                  />
                  {field.name && (
                    <input
                      type="text"
                      value={field.api_identifier}
                      onChange={(e) => updateField(index, { api_identifier: e.target.value })}
                      className="w-full px-2.5 py-1 text-tiny text-text-muted font-mono border-0 bg-transparent mt-0.5"
                      placeholder="api_identifier"
                    />
                  )}
                </div>

                <select
                  value={field.field_type}
                  onChange={(e) => updateField(index, { field_type: e.target.value as ArrayItemFieldType })}
                  className="px-2.5 py-1.5 text-tiny border border-gray-300 rounded-md"
                >
                  {ITEM_FIELD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-1.5 cursor-pointer pt-1.5">
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) => updateField(index, { required: e.target.checked })}
                    className="w-3.5 h-3.5"
                  />
                  <span className="text-tiny text-text-muted">Req</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="p-1.5 hover:bg-red-50 rounded-md transition"
                  title="Remove field"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-red-500" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addField}
            className="w-full py-2 text-tiny text-primary border border-dashed border-primary/40 rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
            Add Field
          </button>
        </div>
      )}
    </div>
  );
}
