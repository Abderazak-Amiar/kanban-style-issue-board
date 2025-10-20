import type { IssueTitleProps } from '../../types';

export default function IssueTitle({ children }: IssueTitleProps) {
  return <strong>{children}</strong>;
}
