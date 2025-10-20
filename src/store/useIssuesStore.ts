import { create } from 'zustand';
import type { Issue, State } from '../types';
import { fetchIssues, saveIssuePriority, saveIssueStatus } from '../utils/api';

const UNDO_WINDOW_MS = 5000;

export const useIssuesStore = create<State>((set, get) => ({
  issues: [],
  lastMoved: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchIssues();
      const typedData = data.map((issue) => ({
        ...issue,
        status: issue.status as Issue['status'],
        priority: issue.priority as Issue['priority'],
      }));
      set({ issues: typedData, loading: false, error: null });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load issues',
      });
    }
  },

  moveIssue: (id, newStatus) => {
    const prev = get().issues;
    const movedIssue = prev.find((i) => i.id === id);

    // optimistic update
    set({
      issues: prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
      lastMoved: movedIssue
        ? { id, previousStatus: movedIssue.status, at: Date.now() }
        : null,
      error: null,
    });

    // simulate save; rollback on failure
    saveIssueStatus(id, newStatus).catch((e) => {
      set({
        issues: prev,
        lastMoved: null,
        error: e instanceof Error ? e.message : 'Failed to save change',
      });
    });
  },

  updatePriority: (id: number, priority: string) => {
    const prev = get().issues;
    const updated = prev.map((i) => (i.id === id ? { ...i, priority: priority as Issue['priority'] } : i));
    set({ issues: updated, error: null });

    saveIssuePriority(id, priority).catch((e) => {
      set({
        issues: prev,
        error: e instanceof Error ? e.message : 'Failed to update priority',
      });
    });
  },

  undoMove: () => {
    const lm = get().lastMoved;
    if (!lm) return;

    const expired = Date.now() - lm.at > UNDO_WINDOW_MS;
    if (!expired) {
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue.id === lm.id ? { ...issue, status: lm.previousStatus } : issue
        ),
        lastMoved: null,
      }));
      // Optionally also persist the undo with saveIssueStatus(lm.id, lm.previousStatus).catch(() => {});
    }
  },
}));
