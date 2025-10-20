export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type AuthLayoutProps = {
  children: React.ReactNode;
};

export type AuthState = {
  username: string;
  role: string | null;
  isAuthenticated: boolean;
  login: (username: string, role: string) => boolean;
  logout: () => void;
};
export type Issue = {
  id: number;
  title: string;
  description: string;
  status: 'Backlog' | 'In Progress' | 'Done';
  priority: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
};

export type State = {
  issues: Issue[];
  fetchAll: () => Promise<void>;
  moveIssue: (id: number, newStatus: Issue['status']) => void;
  undoMove: () => void;
  lastMoved: { id: number; previousStatus: Issue['status']; at: number } | null;
  loading: boolean;
  error: string | null;
};
export type BoardColumnProps = {
  status: 'Backlog' | 'In Progress' | 'Done';
  statuses: ('Backlog' | 'In Progress' | 'Done')[];
};
export type IssueCardProps = {
  id: number;
  title: string;
  description: string;
  status: 'Backlog' | 'In Progress' | 'Done';
  onMove: (id: number, newStatus: 'Backlog' | 'In Progress' | 'Done') => void;
  statuses: ('Backlog' | 'In Progress' | 'Done')[];
};
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type IssueTitleProps = { children: React.ReactNode };
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

