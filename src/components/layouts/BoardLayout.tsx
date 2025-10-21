import '../../styles/boardLayout.css';
import BoardColumn from '../organisms/BoardColumn';
export default function BoardLayout({ query = '' }: { query?: string }) {
  const STATUSES = ['Backlog', 'In Progress', 'Done'] as const;
  return (
    <div className="board-layout-container">
      {STATUSES.map((status) => (
        <BoardColumn
          key={status}
          status={status}
          statuses={STATUSES as any}
          query={query}
        />
      ))}
    </div>
  );
}
