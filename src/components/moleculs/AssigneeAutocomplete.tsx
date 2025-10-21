import { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/assigneeAutocomplete.css';

export default function AssigneeAutocomplete({
  value,
  options,
  onSelect,
  placeholder = 'Filter by assignee…',
  maxSuggestions = 8,
}: {
  value: string;
  options: string[];
  onSelect: (v: string) => void;
  placeholder?: string;
  maxSuggestions?: number;
}) {
  const [input, setInput] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listId = 'assignee-ac-listbox';

  useEffect(() => setInput(value), [value]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, []);

  const list = useMemo(() => {
    const q = input.trim().toLowerCase();
    let filtered = options;

    if (q) {
      const starts: string[] = [];
      const contains: string[] = [];
      for (const o of options) {
        const ol = o.toLowerCase();
        if (ol.startsWith(q)) starts.push(o);
        else if (ol.includes(q)) contains.push(o);
      }
      filtered = [...starts, ...contains];
    }

    return filtered.slice(0, maxSuggestions);
  }, [options, input, maxSuggestions]);

  const choose = (opt: string) => {
    onSelect(opt);
    setInput(opt);
    setOpen(false);
    setActive(-1);
  };

  return (
    <div className="ac" ref={rootRef}>
      <div className="ac-input-wrap">
        <input
          className="ac-input"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, list.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
              if (open && active >= 0 && list[active]) {
                e.preventDefault();
                choose(list[active]);
              }
            } else if (e.key === 'Escape') {
              setOpen(false);
              setActive(-1);
            }
          }}
        />
        {input && (
          <button
            type="button"
            className="ac-clear"
            aria-label="Clear assignee"
            onClick={() => {
              setInput('');
              onSelect('');
              setOpen(false);
              setActive(-1);
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && list.length > 0 && (
        <ul id={listId} role="listbox" className="ac-menu">
          {list.map((opt, idx) => (
            <li
              key={opt}
              role="option"
              aria-selected={idx === active}
              className={`ac-option${idx === active ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(idx)}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent input blur before click
                choose(opt);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
