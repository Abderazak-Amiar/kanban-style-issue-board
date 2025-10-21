import { create } from 'zustand';
import type { HistoryItemTypes, StateType } from '../types';

const STORAGE_KEY = 'issueHistory';

function load(): HistoryItemTypes[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItemTypes[]) : [];
  } catch {
    return [];
  }
}
function persist(items: HistoryItemTypes[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function enqueue(
  items: HistoryItemTypes[],
  next: HistoryItemTypes
): HistoryItemTypes[] {
  // Dedupe (preserve existing order), append new at end, keep last 5
  const deduped = items.filter((i) => i.id !== next.id);
  const queued = [...deduped, next];
  return queued.length > 5 ? queued.slice(queued.length - 5) : queued;
}

export const useIssueHistoryStore = create<StateType>((set, get) => ({
  items: load(),
  addClicked: (item) => {
    const entry: HistoryItemTypes = {
      ...item,
      reason: 'visited',
      at: new Date().toISOString(),
    };
    const next = enqueue(get().items, entry);
    persist(next);
    set({ items: next });
  },
  addUpdated: (item) => {
    const entry: HistoryItemTypes = {
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
