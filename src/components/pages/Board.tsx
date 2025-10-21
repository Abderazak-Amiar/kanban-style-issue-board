import { Activity, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useIssuesStore } from '../../store/useIssuesStore';
import '../../styles/board.css';
import Button from '../atoms/Button';
import BoardLayout from '../layouts/BoardLayout';
import IssueHistorySidebar from '../organisms/IssueHistorySidebar';
const UNDO_WINDOW_MS = 5000;
const POLL_MS = 10_000;

function timeAgo(ts?: number | null) {
  if (!ts) return 'never';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function BoardPage() {
  const { isAuthenticated, role, logout, username } = useAuthStore();
  const { fetchAll, undoMove, lastMoved, loading, error, lastSync } =
    useIssuesStore();
  const [remaining, setRemaining] = useState(0);
  const [_, setNow] = useState(0); // force re-render each second for timeAgo

  // initial fetch + polling
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      await fetchAll();
      if (!mounted) return;
    };
    load();

    const pollId = window.setInterval(fetchAll, POLL_MS);
    const tickId = window.setInterval(() => setNow(Date.now()), 1000);

    return () => {
      mounted = false;
      clearInterval(pollId);
      clearInterval(tickId);
    };
  }, [fetchAll]);

  useEffect(() => {
    if (!lastMoved) {
      setRemaining(0);
      return;
    }
    const end = lastMoved.at + UNDO_WINDOW_MS;
    const tick = () =>
      setRemaining(Math.ceil(Math.max(0, end - Date.now()) / 1000));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [lastMoved]);

  const canUndo = !!lastMoved && remaining > 0;

  const lastSyncLabel = useMemo(() => timeAgo(lastSync), [lastSync, _]);

  return (
    <>
      <IssueHistorySidebar />
      <div className="with-left-sidebar">
        <div style={{ padding: '20px 20px 20px 45px' }}>
          <div className="board-header">
            <div>
              <h1>Issue Board</h1>
            </div>
            <div>{`Welcome ${username} | Role : ${role}`}</div>
            <div>
              <Button onClick={logout}>Logout</Button>
            </div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <span className="meta-chip meta-chip--muted">
              Last sync: {lastSyncLabel}
            </span>
          </div>
          {(loading || error) && (
            <div className="fixed-issue-header">
              {loading && <p>Loading issues…</p>}
              {error && (
                <div className="error">
                  <p>{error}</p>
                  <Button
                    className="retry-btn"
                    onClick={fetchAll}
                    disabled={loading}
                  >
                    Retry
                  </Button>
                </div>
              )}
            </div>
          )}
          <BoardLayout />
          <Activity
            mode={
              isAuthenticated && role === 'admin' && canUndo
                ? 'visible'
                : 'hidden'
            }
          >
            <div className="undo-last-move-container">
              <Button
                className="undo-last-move"
                onClick={undoMove}
                disabled={!canUndo}
              >
                Undo last move {lastMoved ? `(${remaining})` : ''}
              </Button>
            </div>
          </Activity>
        </div>
      </div>
    </>
  );
}
