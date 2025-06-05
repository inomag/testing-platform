import { noop } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { getAppRootElement } from 'src/workspace/utils';
import cssStyles from './index.module.scss';

function Popup({
  content,
  children,
  placement,
  onClose,
  className = '',
  popupClass = '',
  'data-test-id': dataTestId = 'popup',
  openTrigger = 'click',
  closeTrigger = 'outside',
}: React.PropsWithChildren<{
  content: React.ReactNode;
  placement?: 'bottom' | 'top' | 'left' | 'right';
  openTrigger?: 'click' | 'hover' | null;
  closeTrigger?: 'outside' | 'click' | 'hover';
  className?: string;
  popupClass?: string;
  'data-test-id'?: string;
  onClose?: () => void;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [popupStyles, setPopupStyles] = useState({});
  const [computedPlacement, setComputedPlacement] = useState(placement);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClickOutside = (event: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      if (onClose) {
        onClose();
      }
    } else if (
      closeTrigger === 'click' &&
      popupRef.current &&
      popupRef.current.contains(event.target as Node)
    ) {
      // delaying this event at end such that and onClick event from children get fired first
      // otherwise the popup will close and children will be unmounted
      setTimeout(() => {
        setIsOpen(false);
        if (onClose) {
          onClose();
        }
      }, 0);
    }
  };

  // eslint-disable-next-line complexity
  const adjustPopupPosition = useCallback(() => {
    if (isOpen && buttonRef.current && popupRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const styles: { left: number; top: number } = {
        left: 0,
        top: 0,
      };
      let selectedPlacement = computedPlacement;

      // Automatically adjust placement if not provided
      if (!placement) {
        const canPlaceBottom =
          window.innerHeight - buttonRect.bottom >= popupRect.height;
        const canPlaceTop = buttonRect.top >= popupRect.height;
        if (canPlaceTop) {
          selectedPlacement = 'top';
        } else if (canPlaceBottom) {
          selectedPlacement = 'bottom';
        }

        setComputedPlacement(selectedPlacement);
      }

      const pointerSpace = 10;
      // eslint-disable-next-line default-case
      switch (selectedPlacement) {
        case 'bottom':
          styles.top = buttonRect.top + buttonRect.height + pointerSpace;
          styles.left =
            buttonRect.left + buttonRect.width / 2 - popupRect.width / 2;
          break;
        case 'top':
          styles.top = buttonRect.top - popupRect.height - pointerSpace;
          styles.left =
            buttonRect.left + buttonRect.width / 2 - popupRect.width / 2;
          break;
        case 'left':
          styles.top =
            buttonRect.top + buttonRect.height / 2 - popupRect.height / 2;
          styles.left = buttonRect.left - popupRect.width - pointerSpace;
          break;
        case 'right':
          styles.top =
            buttonRect.top + buttonRect.height / 2 - popupRect.height / 2;
          styles.left = buttonRect.left - buttonRect.width + pointerSpace;
          break;
      }
      if (styles.left < 0) {
        styles.left = 10;
      }

      if (window.innerWidth - styles.left < popupRect.width) {
        styles.left = window.innerWidth - popupRect.width - 5;
      }

      if (window.innerHeight - styles.top < popupRect.height) {
        styles.top = window.innerHeight - popupRect.height - 5;
      }

      setPopupStyles(styles);
    }
  }, [isOpen, buttonRef, popupRef, computedPlacement, placement]);

  useLayoutEffect(() => {
    adjustPopupPosition();
    window.addEventListener('resize', adjustPopupPosition);

    return () => {
      window.removeEventListener('resize', adjustPopupPosition);
    };
  }, [isOpen, computedPlacement, adjustPopupPosition]);

  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [handleClickOutside]);

  const popupClasses = classNames(
    cssStyles.popup,
    {
      [cssStyles.popup__before]: isOpen,
      [cssStyles[`popup__${computedPlacement}`]]: isOpen,
    },
    popupClass,
  );

  const popupMenuClasses = classNames(className, cssStyles.popup__menu);

  return (
    <div
      className={popupClasses}
      data-test-id={dataTestId}
      onMouseEnter={
        openTrigger === 'hover'
          ? () => {
              setIsOpen(true);
            }
          : noop
      }
      onMouseLeave={
        closeTrigger === 'hover'
          ? () => {
              setIsOpen(false);
            }
          : noop
      }
    >
      {/* @ts-ignore */}
      {React.cloneElement(children, {
        onClick: (event) => {
          // @ts-ignore
          if (children?.props?.onClick) {
            // @ts-ignore
            children.props.onClick(event);
          }
          if (openTrigger) {
            togglePopup();
          }
        },
        ref: buttonRef,
      })}
      {isOpen &&
        createPortal(
          <div
            data-test-id={`${dataTestId}-content`}
            className={popupMenuClasses}
            ref={popupRef}
            style={popupStyles}
          >
            {content}
          </div>,
          getAppRootElement(),
        )}
    </div>
  );
}

export default Popup;
