export type ModalProps = {
  open?: boolean;
  onClose?: () => void;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  'data-test-id'?: string;
  classNames?: string | string[];
  style?: React.CSSProperties;
  onBackdropClick?: () => void;
};
