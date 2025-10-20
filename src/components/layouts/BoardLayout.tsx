import '../../styles/boardLayout.css';
import BoardColumn from '../organisms/BoardColumn';
const STATUSES = ['Backlog', 'In Progress', 'Done'] as const;

export default function BoardLayout() {
  return (
    <div className="board-layout-container">
      {STATUSES.map((status) => (
        <BoardColumn key={status} status={status} statuses={[...STATUSES]} />
      ))}
    </div>
  );
}
