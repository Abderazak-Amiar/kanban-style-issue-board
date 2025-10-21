import { useIssuesStore } from '../../store/useIssuesStore';
import '../../styles/boardColumn.css';
import type { BoardColumnProps } from '../../types';
import { compareIssuesByScoreThenRecency } from '../../utils/score';
import ColumnHeader from '../moleculs/ColumnHeader';
import IssueCard from '../moleculs/IssueCard';

export default function BoardColumn({ status, statuses }: BoardColumnProps) {
  const { issues, moveIssue } = useIssuesStore();

  return (
    <div className="board-column-container">
      <ColumnHeader title={status} />
      {issues
        .filter((i) => i.status === status)
        .slice()
        .sort(compareIssuesByScoreThenRecency)
        .map((i) => (
          <IssueCard
            key={i.id}
            id={i.id}
            title={i.title}
            description={i.description}
            status={i.status}
            priority={i.priority}
            statuses={statuses}
            onMove={moveIssue}
            score={i.score}
          />
        ))}
    </div>
  );
}
