import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCopy } from '@fortawesome/free-solid-svg-icons';
import { ContentModel } from '../../types';

interface SchemaViewerProps {
  model: ContentModel;
  onClose: () => void;
}

export function SchemaViewer({ model, onClose }: SchemaViewerProps) {
  const [formatted, setFormatted] = useState(true);
  const [copied, setCopied] = useState(false);

  const getSchemaJson = () => {
    const schema = {
      id: model.id,
      name: model.name,
      api_identifier: model.api_identifier,
      description: model.description,
      fields: model.fields,
    };
    return formatted ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSchemaJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-bg-slate flex items-center justify-between">
          <div>
            <h2 className="font-heading font-semibold text-text-primary">
              Content Model Schema: {model.name}
            </h2>
            <p className="text-tiny text-text-muted mt-1">
              Use this schema on your frontend to understand the content model structure
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-light-gray rounded-md transition"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-3 border-b border-bg-slate flex items-center justify-between bg-bg-light-gray">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormatted(true)}
              className={`px-3 py-1 text-tiny rounded-md transition ${
                formatted
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-muted hover:text-text-primary'
              }`}
            >
              Formatted
            </button>
            <button
              onClick={() => setFormatted(false)}
              className={`px-3 py-1 text-tiny rounded-md transition ${
                !formatted
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-muted hover:text-text-primary'
              }`}
            >
              Raw
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="btn-secondary py-1 px-3 text-tiny flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCopy} className="w-3 h-3" />
            {copied ? 'Copied!' : 'Copy Schema'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <pre className="text-gray-100 text-tiny font-mono whitespace-pre-wrap break-words w-full">
            {getSchemaJson()}
          </pre>
        </div>

        {/* Field Reference */}
        <div className="px-6 py-4 border-t border-bg-slate bg-bg-light-gray text-tiny text-text-muted">
          <p className="mb-2 font-medium text-text-primary">Field Type Reference:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>• short_text - Single line</div>
            <div>• long_text - Multi-line</div>
            <div>• rich_text - HTML/WYSIWYG</div>
            <div>• number - Numeric</div>
            <div>• boolean - True/false</div>
            <div>• date - ISO date</div>
            <div>• media - Media ID</div>
            <div>• reference - Entry ID</div>
          </div>
        </div>
      </div>
    </div>
  );
}
