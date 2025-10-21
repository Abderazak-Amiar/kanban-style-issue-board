import { create } from 'zustand';
import type { StateSearch } from '../types';

export const useSearchStore = create<StateSearch>((set) => ({
  query: '',
  assignee: '',
  severity: null,
  setQuery: (q) => set({ query: q }),
  setAssignee: (a) => set({ assignee: a }),
  setSeverity: (s) => set({ severity: s }),
  clear: () => set({ query: '', assignee: '', severity: null }),
  clearFilters: () => set({ assignee: '', severity: null }),
}));
