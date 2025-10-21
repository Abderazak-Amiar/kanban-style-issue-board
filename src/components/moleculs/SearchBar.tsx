import { useEffect, useState } from 'react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search by title or tags…',
  delay = 150,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  delay?: number;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const id = window.setTimeout(() => onChange(local), delay);
    return () => window.clearTimeout(id);
  }, [local, onChange, delay]);

  return (
    <input
      type="search"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder={placeholder}
      aria-label="Search issues"
      style={{
        width: 320,
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid #d1d5db',
      }}
    />
  );
}
