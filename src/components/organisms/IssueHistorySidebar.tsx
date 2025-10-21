import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIssueHistoryStore } from '../../store/useIssueHistoryStore';
import { useIssuesStore } from '../../store/useIssuesStore';
import { useSearchStore } from '../../store/useSearchStore';
import '../../styles/issueHistory.css';
import AssigneeAutocomplete from '../moleculs/AssigneeAutocomplete';
import SearchBar from '../moleculs/SearchBar';
import Select from '../atoms/Select';

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
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const assignee = useSearchStore((s) => s.assignee);
  const setAssignee = useSearchStore((s) => s.setAssignee);
  const severity = useSearchStore((s) => s.severity);
  const setSeverity = useSearchStore((s) => s.setSeverity);
  const clearFilters = useSearchStore((s) => s.clearFilters);

  // FIFO in storage; newest on top in UI
  const itemsLatestFirst = useMemo(() => [...items].reverse(), [items]);

  const allIssues = useIssuesStore((s) => s.issues);
  const assignees = useMemo(() => {
    const set = new Set<string>();
    for (const i of allIssues) if (i.assignee) set.add(i.assignee);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allIssues]);

  const openInModal = (id: number) => {
    navigate(`/issue/${id}`, { state: { backgroundLocation: location } });
  };

  return (
    <aside className="ih-sidebar">
      <div className="ih-filters">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="ih-filters">
        <label className="ih-field">
          <span className="ih-label">Assignee</span>
          <AssigneeAutocomplete
            value={assignee}
            options={assignees}
            onSelect={setAssignee}
          />
        </label>

        <label className="ih-field">
          <span className="ih-label">Severity</span>
          <Select
            className="ih-select"
            value={severity ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setSeverity(v === '' ? null : Number(v));
            }}
          >
            <option value="">Any</option>
            <option value="1">1 (Trivial)</option>
            <option value="2">2 (Low)</option>
            <option value="3">3 (Medium)</option>
            <option value="4">4 (High)</option>
            <option value="5">5 (Critical)</option>
          </Select>
        </label>

        <button className="ih-clear-filters" onClick={clearFilters}>
          Clear filters
        </button>
      </div>
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
