import { create } from 'zustand';

type State = {
  query: string;
  assignee: string; // '' = any
  severity: number | null; // null = any
  setQuery: (q: string) => void;
  setAssignee: (a: string) => void;
  setSeverity: (s: number | null) => void;
  clear: () => void;
  clearFilters: () => void;
};

export const useSearchStore = create<State>((set) => ({
  query: '',
  assignee: '',
  severity: null,
  setQuery: (q) => set({ query: q }),
  setAssignee: (a) => set({ assignee: a }),
  setSeverity: (s) => set({ severity: s }),
  clear: () => set({ query: '', assignee: '', severity: null }),
  clearFilters: () => set({ assignee: '', severity: null }),
}));
