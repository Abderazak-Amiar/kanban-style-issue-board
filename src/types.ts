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
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  createdAt: string;
  updatedAt: string;
  severity: number;
  userDefinedRank: number;
  score: number;
};

export type State = {
  issues: Issue[];
  fetchAll: () => Promise<void>;
  moveIssue: (id: number, newStatus: Issue['status']) => void;
  undoMove: () => void;
  lastMoved: { id: number; previousStatus: Issue['status']; at: number } | null;
  loading: boolean;
  error: string | null;
  updatePriority: (id: number, priority: string) => void;
};
export type BoardColumnProps = {
  status: 'Backlog' | 'In Progress' | 'Done';
  statuses: ('Backlog' | 'In Progress' | 'Done')[];
};
export type IssueCardProps = {
  id: number;
  title: string;
  description?: string;
  status: 'Backlog' | 'In Progress' | 'Done';
  priority: 'low' | 'medium' | 'high'; // <— added
  statuses: readonly string[];
  onMove: (id: number, status: 'Backlog' | 'In Progress' | 'Done') => void;
};
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type IssueTitleProps = { children: React.ReactNode };
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};
export type Priority = 'low' | 'medium' | 'high';
export type HistoryItem = Pick<Issue, 'id' | 'title' | 'status'> & {
  clickedAt: string; // ISO timestamp
};

export type IssueHistoryState = {
  items: HistoryItem[];
  add: (issue: Pick<Issue, 'id' | 'title' | 'status'>) => void;
  clear: () => void;
};
