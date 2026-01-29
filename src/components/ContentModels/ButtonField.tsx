interface ButtonValue {
  text: string;
  url: string;
  target: '_self' | '_blank';
}

interface ButtonFieldProps {
  value: ButtonValue;
  onChange: (value: ButtonValue) => void;
}

export function ButtonField({ value, onChange }: ButtonFieldProps) {
  const current: ButtonValue = value && typeof value === 'object'
    ? { text: value.text || '', url: value.url || '', target: value.target || '_self' }
    : { text: '', url: '', target: '_self' };

  const update = (partial: Partial<ButtonValue>) => {
    onChange({ ...current, ...partial });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-bg-light-gray/30">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-tiny font-medium text-text-muted mb-1">
            Label
          </label>
          <input
            type="text"
            value={current.text}
            onChange={(e) => update({ text: e.target.value })}
            className="w-full px-3 py-2 text-small border border-gray-300 rounded-md"
            placeholder="Get Started"
          />
        </div>
        <div>
          <label className="block text-tiny font-medium text-text-muted mb-1">
            URL
          </label>
          <input
            type="text"
            value={current.url}
            onChange={(e) => update({ url: e.target.value })}
            className="w-full px-3 py-2 text-small border border-gray-300 rounded-md"
            placeholder="/contact or https://..."
          />
        </div>
      </div>
      <div>
        <label className="block text-tiny font-medium text-text-muted mb-1">
          Target
        </label>
        <select
          value={current.target}
          onChange={(e) => update({ target: e.target.value as '_self' | '_blank' })}
          className="w-full px-3 py-2 text-small border border-gray-300 rounded-md"
        >
          <option value="_self">Same tab (_self)</option>
          <option value="_blank">New tab (_blank)</option>
        </select>
      </div>
    </div>
  );
}
