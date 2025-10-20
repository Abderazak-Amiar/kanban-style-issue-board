import '../../styles/priorityBadge.css';
import type { Priority } from '../../types';

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const p = priority.toLowerCase() as Priority;
  return (
    <span
      className={`priority-badge priority--${p}`}
      aria-label={`Priority ${p}`}
    >
      <span className="priority-badge__dot" />
      {p.charAt(0).toUpperCase() + p.slice(1)}
    </span>
  );
}
