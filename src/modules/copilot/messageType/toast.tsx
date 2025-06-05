import React, { useCallback, useEffect } from 'react';
import styles from '../index.module.scss';

type ToastProps = {
  text: string;
  onClose: () => void;
  isVisible: boolean;
};

export default function Toast({ text, onClose, isVisible }: ToastProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [handleClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.toast} data-test-id="toast" data-testid="toast">
      <div data-test-id="toast-message"> {text}</div>
    </div>
  );
}
