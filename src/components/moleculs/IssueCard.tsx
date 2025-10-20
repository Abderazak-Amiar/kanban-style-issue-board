import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useIssueHistoryStore } from '../../store/useIssueHistoryStore';
import '../../styles/issueCard.css';
import type { IssueCardProps } from '../../types';
import Button from '../atoms/Button';
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
  priority, // <— add this prop
}: IssueCardProps) {
  const { isAuthenticated, role } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const addHistory = useIssueHistoryStore((s) => s.add);

  return (
    <div
      className="issue-card-container"
      onClick={() => {
        addHistory({ id, title, status });
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
          <PriorityBadge priority={priority as 'low' | 'medium' | 'high'} />
        </div>
      </div>
      <p className="ic-description">{description}</p>

      {isAuthenticated && role === 'admin' && (
        <div className="ic-buttons-container">
          {statuses
            .filter((s) => s !== status)
            .map((s) => (
              <Button
                className="moveto-btn"
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(id, s as 'Backlog' | 'In Progress' | 'Done');
                }}
              >
                Move to {s}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
