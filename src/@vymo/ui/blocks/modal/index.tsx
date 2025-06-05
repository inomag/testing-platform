import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import classnames from 'classnames';
import { ReactComponent as Cross } from 'src/assets/icons/close.svg';
import Body from './body';
import Footer from './footer';
import Header from './header';
import { ModalProps } from './types';
import styles from './index.module.scss';

function Modal({
  open = true,
  onClose = _.noop,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  'data-test-id': dataTestId,
  classNames,
  style,
  onBackdropClick,
}: React.PropsWithChildren<ModalProps>) {
  const modalRef = React.useRef<HTMLDivElement>(null);

  const closeOnEscapeKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (closeOnEscape) {
      document.body.addEventListener('keydown', closeOnEscapeKeyDown);
    }
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
    };
  }, [closeOnEscape, closeOnEscapeKeyDown]);

  const modalClasses = classnames(styles.modal, classNames);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalRef?.current &&
      !modalRef?.current?.contains(event.target as Node)
    ) {
      onBackdropClick?.();
    }
  };

  const modalContent = (
    // TODO - Swapnil fix this
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      data-test-id={`${dataTestId}-wrapper`}
      className={styles.modal__backdrop}
      onClick={handleBackdropClick}
    >
      <div className={modalClasses} style={style} ref={modalRef}>
        {showCloseButton && (
          <Button
            data-test-id={`${dataTestId}-close-button`}
            size="small"
            type="text"
            iconProps={{ icon: <Cross />, iconPosition: 'right' }}
            className={styles.modal__closeButton}
            onClick={onClose}
          />
        )}
        {React.Children.map(children, (child: ReactNode) =>
          // @ts-ignore
          [Header, Body, Footer].includes(child?.type)
            ? child
            : 'Invalid Modal Children. Modal children can be of Header , Body or Footer',
        )}
      </div>
    </div>
  );

  return open ? modalContent : null;
}

export default Modal;

export { Header, Body, Footer };
