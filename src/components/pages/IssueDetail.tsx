import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useIssuesStore } from '../../store/useIssuesStore';
import '../../styles/issueDetail.css';
import PriorityBadge from '../atoms/PriorityBadge';
import StatusTag from '../atoms/StatusTag';

export default function IssueDetail() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const navigate = useNavigate();
  const { issues, fetchAll, loading, error, moveIssue, updatePriority } =
    useIssuesStore();
  const { role } = useAuthStore();

  const issue = issues.find((i) => i.id === id);

  useEffect(() => {
    if (!issue && !loading) fetchAll();
  }, [issue, loading, fetchAll]);

  if (loading && !issue)
    return <div className="issue-detail__loading">Loading…</div>;
  if (error && !issue)
    return <div className="issue-detail__error">Failed to load issue.</div>;
  if (!issue)
    return <div className="issue-detail__empty">Issue not found.</div>;

  const created = issue.createdAt
    ? new Date(issue.createdAt).toLocaleString()
    : undefined;
  const updated = issue.updatedAt
    ? new Date(issue.updatedAt).toLocaleString()
    : undefined;

  const isAdmin = role === 'admin';
  const canResolve = isAdmin && issue.status !== 'Done';
  const canEditPriority = isAdmin && issue.status !== 'Done';

  return (
    <div className="issue-detail">
      <div className="issue-detail__header">
        <button
          className="issue-detail__back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ← Back
        </button>
        <h2 className="issue-detail__title">{issue.title}</h2>

        <div className="issue-detail__actions">
          {canResolve && (
            <button
              className="issue-detail__resolve-btn"
              onClick={() => moveIssue(issue.id, 'Done')}
              title="Mark this issue as resolved"
            >
              Mark as Resolved
            </button>
          )}

          {canEditPriority && (
            <div
              className="select-wrapper"
              data-priority={(issue.priority || '').toLowerCase()}
            >
              <select
                className={`issue-detail__priority-select priority--${(
                  issue.priority || ''
                ).toLowerCase()}`}
                aria-label="Update priority"
                value={issue.priority}
                onChange={(e) => updatePriority(issue.id, e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="issue-detail__meta">
        <StatusTag status={issue.status} />
        <PriorityBadge priority={issue.priority as 'low' | 'medium' | 'high'} />
        <span className="meta-chip" title="Severity">
          Severity: <strong>{issue.severity}</strong>
        </span>
        <span className="meta-chip" title="Score">
          Score: <strong>{issue.score}</strong>
        </span>
        <span className="meta-chip" title="User rank">
          Rank: <strong>{issue.userDefinedRank}</strong>
        </span>
        <span className="meta-chip" title="Assignee">
          Assignee: <strong>{issue.assignee}</strong>
        </span>
        {updated && (
          <span className="meta-chip meta-chip--muted">Updated {updated}</span>
        )}
      </div>
      <dl className="issue-detail__details">
        <div className="detail-row">
          <dt>ID</dt>
          <dd>{issue.id}</dd>
        </div>
        <div className="detail-row">
          <dt>Created</dt>
          <dd>{created ?? '—'}</dd>
        </div>
        <div className="detail-row">
          <dt>Last Updated</dt>
          <dd>{updated ?? '—'}</dd>
        </div>
      </dl>

      {issue.description && (
        <p className="issue-detail__description">{issue.description}</p>
      )}
    </div>
  );
}
