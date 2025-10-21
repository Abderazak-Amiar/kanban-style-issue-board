import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIssueHistoryStore } from '../../store/useIssueHistoryStore';
import '../../styles/issueHistory.css';

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function IssueHistorySidebar() {
  const items = useIssueHistoryStore((s) => s.items);
  const clear = useIssueHistoryStore((s) => s.clear);
  const navigate = useNavigate();
  const location = useLocation();

  // FIFO in storage; newest on top in UI
  const itemsLatestFirst = useMemo(() => [...items].reverse(), [items]);

  const openInModal = (id: number) => {
    navigate(`/issue/${id}`, { state: { backgroundLocation: location } });
  };

  return (
    <aside className="ih-sidebar">
      <div className="ih-header">
        <h3>History</h3>
        <button
          onClick={clear}
          disabled={itemsLatestFirst.length === 0}
          className="ih-clear"
        >
          Clear
        </button>
      </div>

      <ul className="ih-list">
        {itemsLatestFirst.length === 0 && (
          <li className="ih-empty">No recent items</li>
        )}
        {itemsLatestFirst.map((i) => (
          <li key={i.id} className="ih-item" onClick={() => openInModal(i.id)}>
            <div className="ih-title">{i.title}</div>
            <div className="ih-meta">
              <span className={`ih-reason ih-reason--${i.reason}`}>
                {i.reason}
              </span>
              <span className="ih-dot">•</span>
              <span className="ih-status">{i.status}</span>
              {i.priority && (
                <span
                  className={`ih-priority ih-priority--${i.priority.toLowerCase()}`}
                >
                  {i.priority}
                </span>
              )}
              <span className="ih-spacer" />
              <span className="ih-time">{timeAgo(i.at)}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
