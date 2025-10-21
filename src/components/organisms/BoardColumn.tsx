import { useIssuesStore } from '../../store/useIssuesStore';
import '../../styles/boardColumn.css';
import { matchesIssue } from '../../utils/search';
import IssueCard from '../moleculs/IssueCard';

export default function BoardColumn({
  status,
  statuses,
  query,
}: {
  status: string;
  statuses: string[];
  query: string;
}) {
  const { issues, moveIssue } = useIssuesStore();

  const issuesForThisColumn = issues
    .filter((i) => i.status === status)
    .filter((i) => matchesIssue(i, query));
  // If you already sort by score/recency, keep that too:
  // .slice().sort(compareIssuesByScoreThenRecency)
  return (
    <div data-status={status} className="board-column-container">
      {issuesForThisColumn.map((i) => (
        <IssueCard
          key={i.id}
          id={i.id}
          title={i.title}
          description={i.description}
          status={i.status}
          priority={i.priority}
          statuses={statuses}
          onMove={(id, s) => moveIssue(id, s as any)}
          score={i.score}
        />
      ))}
    </div>
  );
}
