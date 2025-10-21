import '../../styles/boardLayout.css';
import BoardColumn from '../organisms/BoardColumn';
export default function BoardLayout() {
  const STATUSES = ['Backlog', 'In Progress', 'Done'] as const;
  return (
    <div className="board-layout-container">
      {STATUSES.map((status) => (
        <BoardColumn key={status} status={status} statuses={STATUSES as any} />
      ))}
    </div>
  );
}
