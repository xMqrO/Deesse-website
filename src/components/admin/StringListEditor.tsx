import { useState } from 'react';

interface StringListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  suggestions?: string[];
  emptyLabel?: string;
}

const inputClass =
  'w-full rounded-lg border border-background-800 bg-background-950 px-3 py-2 text-sm text-foreground-100 outline-none focus:border-primary-500/60 transition-colors';

export default function StringListEditor({
  items,
  onChange,
  placeholder = 'Type a value and press Enter',
  addLabel = 'Add',
  suggestions = [],
  emptyLabel = 'Nothing added yet.',
}: StringListEditorProps) {
  const [value, setValue] = useState('');

  const add = (raw: string) => {
    const clean = raw.trim();
    if (!clean || items.includes(clean)) {
      setValue('');
      return;
    }
    onChange([...items, clean]);
    setValue('');
  };

  const removeAt = (index: number) => onChange(items.filter((_, i) => i !== index));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(value);
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => add(value)}
          className="whitespace-nowrap rounded-lg border border-background-700 px-4 py-2 text-xs text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
        >
          {addLabel}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter((s) => !items.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="whitespace-nowrap rounded-full border border-background-700 px-3 py-1 text-[11px] text-foreground-400 hover:border-primary-500/60 hover:text-foreground-100 transition-colors cursor-pointer"
              >
                + {s}
              </button>
            ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-xs text-foreground-600">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex items-center gap-1.5 rounded-full border border-background-700 bg-background-900/70 py-1 pl-3 pr-1.5 text-xs text-foreground-200"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={`Move ${item} up`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-foreground-500 hover:text-foreground-100 disabled:opacity-30 cursor-pointer"
              >
                <i className="ri-arrow-up-line text-[11px]" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label={`Move ${item} down`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-foreground-500 hover:text-foreground-100 disabled:opacity-30 cursor-pointer"
              >
                <i className="ri-arrow-down-line text-[11px]" />
              </button>
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove ${item}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-foreground-500 hover:text-primary-300 cursor-pointer"
              >
                <i className="ri-close-line text-[11px]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
