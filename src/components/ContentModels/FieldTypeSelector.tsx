import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faAlignLeft,
  faParagraph,
  faHashtag,
  faToggleOn,
  faCalendar,
  faImage,
  faLink,
  faHandPointer,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { FieldType } from '../../types';

interface FieldTypeSelectorProps {
  value: FieldType;
  onChange: (type: FieldType) => void;
  disabled?: boolean;
}

const FIELD_TYPES: Array<{
  type: FieldType;
  label: string;
  description: string;
  icon: any;
}> = [
  {
    type: 'short_text',
    label: 'Short Text',
    description: 'Single line text for titles, names, and short values',
    icon: faFont,
  },
  {
    type: 'long_text',
    label: 'Long Text',
    description: 'Multi-line text for descriptions and prose',
    icon: faAlignLeft,
  },
  {
    type: 'rich_text',
    label: 'Rich Text',
    description: 'Formatted text with bold, italic, links, and headings',
    icon: faParagraph,
  },
  {
    type: 'number',
    label: 'Number',
    description: 'Numeric values for quantities, prices, and counts',
    icon: faHashtag,
  },
  {
    type: 'boolean',
    label: 'Boolean',
    description: 'On/off toggle for flags and feature switches',
    icon: faToggleOn,
  },
  {
    type: 'date',
    label: 'Date',
    description: 'Calendar date picker for schedules and timestamps',
    icon: faCalendar,
  },
  {
    type: 'media',
    label: 'Media',
    description: 'Image or file — upload or paste a URL. Outputs a URL string.',
    icon: faImage,
  },
  {
    type: 'reference',
    label: 'Reference',
    description: 'Link to an entry in another content model',
    icon: faLink,
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action with label, URL, and open behavior',
    icon: faHandPointer,
  },
  {
    type: 'array',
    label: 'Array',
    description: 'Repeatable list of structured items with configurable fields',
    icon: faList,
  },
];

export function FieldTypeSelector({ value, onChange, disabled }: FieldTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {FIELD_TYPES.map((fieldType) => (
        <button
          key={fieldType.type}
          type="button"
          onClick={() => !disabled && onChange(fieldType.type)}
          disabled={disabled}
          className={`card p-4 text-left transition ${
            value === fieldType.type
              ? 'ring-2 ring-primary bg-blue-50'
              : 'hover:shadow-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              value === fieldType.type ? 'bg-primary' : 'bg-bg-light-gray'
            }`}
          >
            <FontAwesomeIcon
              icon={fieldType.icon}
              className={`w-5 h-5 ${
                value === fieldType.type ? 'text-white' : 'text-primary'
              }`}
            />
          </div>
          <div className="text-small font-medium text-text-primary mb-1">
            {fieldType.label}
          </div>
          <div className="text-tiny text-text-muted">
            {fieldType.description}
          </div>
        </button>
      ))}
    </div>
  );
}
