import { useIssuesStore } from '../../store/useIssuesStore';
import type { BoardColumnProps, Issue } from '../../types';
import ColumnHeader from '../moleculs/ColumnHeader';
import IssueCard from '../moleculs/IssueCard';

export default function BoardColumn({ status, statuses }: BoardColumnProps) {
  const { issues, moveIssue } = useIssuesStore();

  const filtered: Issue[] = issues.filter(
    (issue: Issue) => issue.status === status
  );

  return (
    <div
      style={{
        flex: 1,
        padding: 10,
        background: '#f5f5f5',
        borderRadius: 6,
        minHeight: '70vh',
      }}
    >
      <ColumnHeader title={status} />
      {filtered.map((issue) => (
        <IssueCard
          key={issue.id}
          id={issue.id}
          title={issue.title}
          description={issue.description}
          status={issue.status}
          statuses={statuses}
          onMove={moveIssue}
        />
      ))}
    </div>
  );
}
