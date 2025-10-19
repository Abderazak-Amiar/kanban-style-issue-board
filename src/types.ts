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
