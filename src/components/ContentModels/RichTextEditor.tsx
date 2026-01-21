interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // For now, using a simple textarea. Can be upgraded to a full WYSIWYG editor later
  // (like TinyMCE, Quill, or Draft.js)
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={12}
      className="w-full px-4 py-2 text-small resize-none font-mono"
      placeholder={placeholder || 'Enter rich text content (HTML supported)...'}
    />
  );
}
