import { useMemo } from 'react';
import { useIssuesStore } from '../../store/useIssuesStore';
import { useSearchStore } from '../../store/useSearchStore';
import '../../styles/boardColumn.css';
import { compareIssuesByScoreThenRecency } from '../../utils/score';
import { matchesAssigneeOrSeverity, matchesIssue } from '../../utils/search';
import IssueCard from '../moleculs/IssueCard';

export default function BoardColumn({
  status,
  statuses,
}: {
  status: 'Backlog' | 'In Progress' | 'Done';
  statuses: readonly string[];
}) {
  const { issues, moveIssue } = useIssuesStore();
  const query = useSearchStore((s) => s.query);
  const assignee = useSearchStore((s) => s.assignee);
  const severity = useSearchStore((s) => s.severity);

  const visibleIssues = useMemo(() => {
    return issues
      .filter((i) => i.status === status)
      .filter((i) => matchesIssue(i, query))
      .filter((i) => matchesAssigneeOrSeverity(i, assignee, severity));
  }, [issues, status, query, assignee, severity]);

  return (
    <div className="board-column-container" data-status={status}>
      {visibleIssues
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
            statuses={statuses as string[]}
            onMove={(id, s) => moveIssue(id, s as any)}
            score={i.score}
            tags={i.tags}
          />
        ))}
    </div>
  );
}
