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
export type Status = 'Backlog' | 'In Progress' | 'Done';
export type Priority = 'low' | 'medium' | 'high';

export type Issue = {
  id: number;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  severity: number;
  userDefinedRank: number;
  assignee: string;
  createdAt: string;
  updatedAt?: string;
   tags: string[];
  score: number; // computed at runtime
};

export type RawIssue = Omit<Issue, 'score'>;

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
  children?: React.ReactNode;
};
export type IssueCardProps = {
  id: number;
  title: string;
  description?: string;
  status: 'Backlog' | 'In Progress' | 'Done';
  priority: 'low' | 'medium' | 'high';
  score: number;
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
export type HistoryItem = Pick<Issue, 'id' | 'title' | 'status'> & {
  clickedAt: string; // ISO timestamp
};

export type IssueHistoryState = {
  items: HistoryItem[];
  add: (issue: Pick<Issue, 'id' | 'title' | 'status'>) => void;
  clear: () => void;
};
export type HistoryItemTypes = {
  id: number;
  title: string;
  status: string;
  priority?: string;
  reason: 'visited' | 'updated';
  at: string; // ISO timestamp
};

export type StateType = {
  items: HistoryItemTypes[];
  addClicked: (item: Omit<HistoryItemTypes, 'reason' | 'at'>) => void;
  addUpdated: (item: Omit<HistoryItemTypes, 'reason' | 'at'>) => void;
  clear: () => void;
};
