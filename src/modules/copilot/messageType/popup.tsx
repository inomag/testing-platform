import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as DeleteSvg } from '../../../assets/copilot/delete.svg';
import { ReactComponent as LineSvg } from '../../../assets/copilot/line.svg';
import styles from '../index.module.scss';

type PopupProps = {
  show: boolean;
  onClose: () => void;
  onDlete: () => void;
};

export default function Popup({ show, onClose, onDlete }: PopupProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      if (show && !isScrollingDown && !isAtBottom) {
        onClose();
      }
      setIsScrollingDown(window.scrollY > (window.scrollY || 0));
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        show &&
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose, isScrollingDown]);

  if (!show) {
    return null;
  }

  return (
    <>
      <div className={styles.overlay} data-testid="popup" />
      <div className={styles.bottomDialog} ref={dialogRef}>
        <LineSvg />
        <span className={styles.rightText}>Action</span>
        <button
          className={styles.menuItem}
          type="button"
          onClick={onDlete}
          data-test-id="clear-history-button"
          data-testid="clear-history-button"
        >
          <DeleteSvg />
          <span className={styles.rightText}>Clear History</span>
        </button>
      </div>
    </>
  );
}
