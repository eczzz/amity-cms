import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faGripVertical, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { ArrayItemField } from '../../types';
import { MediaPicker } from './MediaPicker';
import { ButtonField } from './ButtonField';

interface ArrayFieldProps {
  itemFields: ArrayItemField[];
  value: Record<string, any>[];
  onChange: (value: Record<string, any>[]) => void;
}

export function ArrayField({ itemFields, value, onChange }: ArrayFieldProps) {
  const items: Record<string, any>[] = Array.isArray(value) ? value : [];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());

  const createEmptyItem = (): Record<string, any> => {
    const item: Record<string, any> = {};
    itemFields.forEach((field) => {
      switch (field.field_type) {
        case 'boolean':
          item[field.api_identifier] = false;
          break;
        case 'number':
          item[field.api_identifier] = 0;
          break;
        case 'button':
          item[field.api_identifier] = { text: '', url: '', target: '_self' };
          break;
        default:
          item[field.api_identifier] = '';
      }
    });
    return item;
  };

  const addItem = () => {
    onChange([...items, createEmptyItem()]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setCollapsedItems((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const updateItem = (index: number, fieldId: string, fieldValue: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldId]: fieldValue };
    onChange(newItems);
  };

  const toggleCollapse = (index: number) => {
    setCollapsedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const getItemSummary = (item: Record<string, any>): string => {
    const firstTextField = itemFields.find(
      (f) => f.field_type === 'short_text' || f.field_type === 'long_text'
    );
    if (firstTextField) {
      const val = item[firstTextField.api_identifier];
      if (val && typeof val === 'string') return val.substring(0, 60) + (val.length > 60 ? '...' : '');
    }
    return `Item`;
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
    const newItems = [...items];
    const dragged = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, dragged);
    onChange(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const renderSubField = (itemField: ArrayItemField, itemIndex: number, itemData: Record<string, any>) => {
    const fieldValue = itemData[itemField.api_identifier];

    switch (itemField.field_type) {
      case 'short_text':
        return (
          <input
            type="text"
            value={fieldValue || ''}
            onChange={(e) => updateItem(itemIndex, itemField.api_identifier, e.target.value)}
            className="w-full px-3 py-1.5 text-small border border-gray-300 rounded-md"
            placeholder={itemField.name}
          />
        );

      case 'long_text':
        return (
          <textarea
            value={fieldValue || ''}
            onChange={(e) => updateItem(itemIndex, itemField.api_identifier, e.target.value)}
            rows={3}
            className="w-full px-3 py-1.5 text-small border border-gray-300 rounded-md resize-none"
            placeholder={itemField.name}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={fieldValue ?? ''}
            onChange={(e) => updateItem(itemIndex, itemField.api_identifier, e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-1.5 text-small border border-gray-300 rounded-md"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!fieldValue}
              onChange={(e) => updateItem(itemIndex, itemField.api_identifier, e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-small text-text-muted">{itemField.name}</span>
          </label>
        );

      case 'media':
        return (
          <MediaPicker
            value={fieldValue || null}
            onChange={(url) => updateItem(itemIndex, itemField.api_identifier, url || '')}
          />
        );

      case 'button':
        return (
          <ButtonField
            value={fieldValue || { text: '', url: '', target: '_self' }}
            onChange={(val) => updateItem(itemIndex, itemField.api_identifier, val)}
          />
        );

      default:
        return <span className="text-tiny text-red-600">Unsupported: {itemField.field_type}</span>;
    }
  };

  if (!itemFields || itemFields.length === 0) {
    return (
      <div className="text-small text-text-muted border border-dashed border-gray-300 rounded-lg p-4 text-center">
        No item fields configured for this array.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-small text-text-muted mb-3">No items yet</p>
          <button
            type="button"
            onClick={addItem}
            className="btn-primary py-1.5 px-4 text-small inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
            Add First Item
          </button>
        </div>
      ) : (
        <>
          {items.map((item, index) => {
            const isCollapsed = collapsedItems.has(index);

            return (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`border rounded-lg bg-white overflow-hidden ${
                  draggedIndex === index ? 'opacity-50' : ''
                } ${dragOverIndex === index && draggedIndex !== index ? 'border-primary border-2' : 'border-gray-200'}`}
              >
                {/* Item Header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-bg-light-gray/50 border-b border-gray-100">
                  <FontAwesomeIcon
                    icon={faGripVertical}
                    className="w-3 h-3 text-text-muted cursor-move"
                  />
                  <button
                    type="button"
                    onClick={() => toggleCollapse(index)}
                    className="flex-1 text-left flex items-center gap-2"
                  >
                    <FontAwesomeIcon
                      icon={isCollapsed ? faChevronDown : faChevronUp}
                      className="w-3 h-3 text-text-muted"
                    />
                    <span className="text-tiny font-medium text-text-primary">
                      #{index + 1}
                    </span>
                    <span className="text-tiny text-text-muted truncate">
                      {getItemSummary(item)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 hover:bg-red-50 rounded transition"
                    title="Remove item"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 text-red-500" />
                  </button>
                </div>

                {/* Item Fields */}
                {!isCollapsed && (
                  <div className="p-3 space-y-3">
                    {itemFields.map((itemField) => (
                      <div key={itemField.api_identifier}>
                        {itemField.field_type !== 'boolean' && (
                          <label className="block text-tiny font-medium text-text-muted mb-1">
                            {itemField.name}
                            {itemField.required && <span className="text-red-600 ml-0.5">*</span>}
                          </label>
                        )}
                        {renderSubField(itemField, index, item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addItem}
            className="w-full py-2 text-small text-primary border border-dashed border-primary/40 rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
            Add Item
          </button>
        </>
      )}

      <div className="text-tiny text-text-muted text-right">
        {items.length} {items.length === 1 ? 'item' : 'items'}
      </div>
    </div>
  );
}
