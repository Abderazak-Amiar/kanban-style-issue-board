import { useAuthStore } from '../../store/useAuthStore';
import '../../styles/issueCard.css';
import type { IssueCardProps } from '../../types';
import Button from '../atoms/Button';
import IssueTitle from '../atoms/IssueTitle';
import StatusTag from '../atoms/StatusTag';
export default function IssueCard({
  id,
  title,
  description,
  status,
  onMove,
  statuses,
}: IssueCardProps) {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <div className="issue-card-container">
      <div className="ic-title-status-container">
        <div>
          <IssueTitle>{title}</IssueTitle>
        </div>
        <div>
          <StatusTag status={status} />
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
                onClick={() => onMove(id, s)}
              >
                Move to {s}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
