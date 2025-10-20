import '../../styles/columnHeader.css';
export default function ColumnHeader({ title }: { title: string }) {
  return <h2 className="column-header-title">{title}</h2>;
}
