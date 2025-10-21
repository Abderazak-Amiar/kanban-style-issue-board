import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useIssueHistoryStore } from '../../store/useIssueHistoryStore';
import '../../styles/issueCard.css';
import type { IssueCardProps, Priority } from '../../types';
import IssueTitle from '../atoms/IssueTitle';
import PriorityBadge from '../atoms/PriorityBadge';
import StatusTag from '../atoms/StatusTag';

export default function IssueCard({
  id,
  title,
  description,
  status,
  onMove,
  statuses,
  priority,
}: IssueCardProps) {
  const { isAuthenticated, role } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const addClicked = useIssueHistoryStore((s) => s.addClicked);

  return (
    <div
      className="issue-card-container"
      onClick={() => {
        addClicked({ id, title, status, priority });
        navigate(`/issue/${id}`, { state: { backgroundLocation: location } });
      }}
      role="button"
      tabIndex={0}
    >
      <div className="ic-title-status-container">
        <div>
          <IssueTitle>{title}</IssueTitle>
        </div>
        <div className="ic-badges">
          <StatusTag status={status} />
          <PriorityBadge priority={priority as Priority} />
        </div>
      </div>

      {description && <p className="ic-description">{description}</p>}

      {isAuthenticated && role === 'admin' && (
        <div className="ic-buttons-container">
          {statuses
            .filter((s) => s !== status)
            .map((s) => (
              <button
                className="moveto-btn"
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(id, s as 'Backlog' | 'In Progress' | 'Done');
                }}
              >
                Move to {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
