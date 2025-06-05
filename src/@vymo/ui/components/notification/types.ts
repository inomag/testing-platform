import { ButtonProps } from 'src/@vymo/ui/atoms/button/types';

export type NotificationProp = {
  id: string;
  title?: string;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info' | 'default';
};

export type Props = {
  notifications: Array<NotificationProp>;
  buttonVariant: ButtonProps['variant'];
  onClearAll?: () => void;
};
