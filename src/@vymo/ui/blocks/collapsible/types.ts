export interface CollapsibleProps {
  title: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  border?: boolean;
  className?: string;
  iconPosition?: 'right' | 'left';
  'data-test-id'?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  status?: {
    variant: 'default' | 'success' | 'error' | 'warning' | null;
    text: string;
  } | null;
  message?: {
    variant: 'default' | 'success' | 'error' | 'warning' | 'info' | undefined;
    text: string;
  } | null;
}
