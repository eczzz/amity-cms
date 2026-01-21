import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCopy } from '@fortawesome/free-solid-svg-icons';

interface JsonViewerProps {
  title: string;
  data: any;
  onClose: () => void;
}

export function JsonViewer({ title, data, onClose }: JsonViewerProps) {
  const [formatted, setFormatted] = useState(true);
  const [copied, setCopied] = useState(false);

  const getJsonString = () => {
    return formatted ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getJsonString());
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
              JSON Output: {title}
            </h2>
            <p className="text-tiny text-text-muted mt-1">
              Use this JSON structure in your frontend application
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
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-bg-dark-gray">
          <pre className="text-white text-tiny font-mono whitespace-pre-wrap break-all">
            {getJsonString()}
          </pre>
        </div>
      </div>
    </div>
  );
}
