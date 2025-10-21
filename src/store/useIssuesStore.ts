import { create } from 'zustand';
import type { Issue, State } from '../types';
import { fetchIssues, saveIssuePriority, saveIssueStatus } from '../utils/api';
import { useIssueHistoryStore } from './useIssueHistoryStore';

const UNDO_WINDOW_MS = 5000;

export const useIssuesStore = create<State>((set, get) => ({
  issues: [],
  lastMoved: null,
  loading: false,
  error: null,
  lastSync: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchIssues();
      const typedData = data.map((issue) => ({
        ...issue,
        status: issue.status as Issue['status'],
        priority: issue.priority as Issue['priority'],
      }));
      set({
        issues: typedData,
        loading: false,
        error: null,
        lastSync: Date.now(),
      });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load issues',
      });
    } finally {
      set({ loading: false });
    }
  },

  // Simple simulator: bump updatedAt on a random issue
  simulateRandomUpdate: () => {
    const prev = get().issues;
    if (!prev.length) return;
    const idx = Math.floor(Math.random() * prev.length);
    const nowIso = new Date().toISOString();
    const updated = prev.map((i, n) =>
      n === idx ? { ...i, updatedAt: nowIso } : i
    );
    set({ issues: updated });
  },

  moveIssue: (id, newStatus) => {
    const prev = get().issues;
    const movedIssue = prev.find((i) => i.id === id);
    const updated = prev.map((issue) =>
      issue.id === id ? { ...issue, status: newStatus } : issue
    );

    set({
      issues: updated,
      lastMoved: movedIssue
        ? { id, previousStatus: movedIssue.status, at: Date.now() }
        : null,
    });

    // Track as "updated" in history
    if (movedIssue) {
      useIssueHistoryStore.getState().addUpdated({
        id,
        title: movedIssue.title,
        status: newStatus as any,
        priority: movedIssue.priority as any,
      });
    }

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
    const issue = prev.find((i) => i.id === id);
    const updated = prev.map((i) =>
      i.id === id ? { ...i, priority: priority as Issue['priority'] } : i
    );
    set({ issues: updated, error: null });

    if (issue) {
      useIssueHistoryStore.getState().addUpdated({
        id,
        title: issue.title,
        status: issue.status as any,
        priority,
      });
    }

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
    }
  },
}));
