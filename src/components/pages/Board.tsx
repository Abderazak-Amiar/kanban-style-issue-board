import { Activity, useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useIssuesStore } from '../../store/useIssuesStore';
import '../../styles/board.css';
import Button from '../atoms/Button';
import BoardLayout from '../layouts/BoardLayout';
import IssueHistorySidebar from '../organisms/IssueHistorySidebar';
const UNDO_WINDOW_MS = 5000;

export default function BoardPage() {
  const { isAuthenticated, role, logout, username } = useAuthStore();
  const { fetchAll, undoMove, lastMoved, loading, error } = useIssuesStore();
  const [remaining, setRemaining] = useState(0);
  const [query] = useState('');

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Countdown effect
  useEffect(() => {
    if (!lastMoved) {
      setRemaining(0);
      return;
    }
    const end = lastMoved.at + UNDO_WINDOW_MS;

    // countdown 5-0
    const tick = () => {
      const ms = Math.max(0, end - Date.now());
      setRemaining(Math.ceil(ms / 1000));
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [lastMoved]);

  const canUndo = !!lastMoved && remaining > 0;

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
          <BoardLayout query={query} />
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
