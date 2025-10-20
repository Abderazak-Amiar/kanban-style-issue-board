import '../../styles/statusTag.css';
export default function StatusTag({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Backlog: '#ff9800',
    InProgress: '#2196f3',
    Done: '#4caf50',
  };

  return (
    <span
      className="status-tag"
      style={{
        backgroundColor: colors[status] || '#9e9e9e',
      }}
    >
      {status}
    </span>
  );
}
