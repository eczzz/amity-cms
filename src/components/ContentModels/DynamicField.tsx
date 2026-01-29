import { FieldDefinition } from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { MediaPicker } from './MediaPicker';
import { ReferencePicker } from './ReferencePicker';
import { ButtonField } from './ButtonField';
import { ArrayField } from './ArrayField';

interface DynamicFieldProps {
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function DynamicField({ field, value, onChange, error }: DynamicFieldProps) {
  const renderInput = () => {
    switch (field.field_type) {
      case 'short_text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 text-small"
            placeholder={field.options?.placeholder}
            required={field.required}
          />
        );

      case 'long_text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={field.options?.rows || 6}
            className="w-full px-4 py-2 text-small resize-none"
            placeholder={field.options?.placeholder}
            required={field.required}
          />
        );

      case 'rich_text':
        return (
          <RichTextEditor
            value={value || ''}
            onChange={onChange}
            placeholder={field.options?.placeholder}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-2 text-small"
            min={field.validation?.min_value}
            max={field.validation?.max_value}
            required={field.required}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-small text-text-muted">
              {field.help_text || 'Enable this option'}
            </span>
          </label>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 text-small"
            required={field.required}
          />
        );

      case 'media':
        return (
          <MediaPicker
            value={value}
            onChange={onChange}
          />
        );

      case 'reference':
        return (
          <ReferencePicker
            modelApiIdentifier={field.reference_to!}
            value={value}
            onChange={onChange}
            required={field.required}
          />
        );

      case 'button':
        return (
          <ButtonField
            value={value || { text: '', url: '', target: '_self' }}
            onChange={onChange}
          />
        );

      case 'array':
        return (
          <ArrayField
            itemFields={field.options?.item_fields || []}
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
          />
        );

      default:
        return (
          <div className="text-red-600 text-small">
            Unsupported field type: {field.field_type}
          </div>
        );
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-small font-medium text-text-primary mb-2">
        {field.name}
        {field.required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {renderInput()}
      {field.help_text && !error && field.field_type !== 'boolean' && (
        <p className="text-tiny text-text-muted mt-1">{field.help_text}</p>
      )}
      {error && (
        <p className="text-tiny text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
