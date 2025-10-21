import { create } from 'zustand';

type HistoryItem = {
  id: number;
  title: string;
  status: string;
  priority?: string;
  reason: 'visited' | 'updated';
  at: string; // ISO timestamp
};

type State = {
  items: HistoryItem[];
  addClicked: (item: Omit<HistoryItem, 'reason' | 'at'>) => void;
  addUpdated: (item: Omit<HistoryItem, 'reason' | 'at'>) => void;
  clear: () => void;
};

const STORAGE_KEY = 'issueHistory';

function load(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}
function persist(items: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function enqueue(items: HistoryItem[], next: HistoryItem): HistoryItem[] {
  // Dedupe (preserve existing order), append new at end, keep last 5
  const deduped = items.filter((i) => i.id !== next.id);
  const queued = [...deduped, next];
  return queued.length > 5 ? queued.slice(queued.length - 5) : queued;
}

export const useIssueHistoryStore = create<State>((set, get) => ({
  items: load(),
  addClicked: (item) => {
    const entry: HistoryItem = {
      ...item,
      reason: 'visited',
      at: new Date().toISOString(),
    };
    const next = enqueue(get().items, entry);
    persist(next);
    set({ items: next });
  },
  addUpdated: (item) => {
    const entry: HistoryItem = {
      ...item,
      reason: 'updated',
      at: new Date().toISOString(),
    };
    const next = enqueue(get().items, entry);
    persist(next);
    set({ items: next });
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ items: [] });
  },
}));
