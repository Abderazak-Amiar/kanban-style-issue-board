import { useIssuesStore } from '../../store/useIssuesStore';
import '../../styles/boardColumn.css';
import type { BoardColumnProps, Issue } from '../../types';
import ColumnHeader from '../moleculs/ColumnHeader';
import IssueCard from '../moleculs/IssueCard';
export default function BoardColumn({ status, statuses }: BoardColumnProps) {
  const { issues, moveIssue } = useIssuesStore();

  const filtered: Issue[] = issues.filter(
    (issue: Issue) => issue.status === status
  );

  return (
    <div className="board-column-container">
      <ColumnHeader title={status} />
      {filtered.map((i) => (
        <IssueCard
          key={i.id}
          id={i.id}
          title={i.title}
          description={i.description}
          status={i.status}
          priority={i.priority}
          statuses={statuses}
          onMove={moveIssue}
        />
      ))}
    </div>
  );
}
