import { isEmpty } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Tag } from 'src/@vymo/ui/atoms';
import Text from 'src/@vymo/ui/atoms/text';
import classNames from 'classnames';
import { ReactComponent as ChevronDown } from 'src/assets/icons/down.svg';
import { ReactComponent as ChevronUp } from 'src/assets/icons/up.svg';
import { CollapsibleProps } from './types';
import styles from './index.module.scss';

function Collapsible({
  title,
  description,
  children,
  open,
  className,
  iconPosition = 'right',
  iconLeft,
  iconRight,
  border = true,
  'data-test-id': dataTestId = 'collapsible-component',
  status = null,
  message = null,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState<boolean>(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpen = () => {
    if (isEmpty(children)) return;
    setIsOpen(!isOpen);
  };

  const collapsibleClass = classNames(className, styles.collapsible, {
    [styles.collapsible__border]: border,
  });

  const collapsibleContentClass = classNames(styles.collapsible__content, {
    [styles.collapsible__content__show]: isOpen,
  });

  const leftCollapsibleIcon = useMemo(() => {
    if (iconLeft) {
      return iconLeft;
    }
    return isOpen ? <ChevronUp /> : <ChevronDown />;
  }, [isOpen, iconLeft]);

  const rightCollapsibleIcon = useMemo(() => {
    if (iconRight) {
      return iconRight;
    }
    return isOpen ? <ChevronUp /> : <ChevronDown />;
  }, [isOpen, iconRight]);

  return (
    <div className={collapsibleClass} data-test-id={dataTestId}>
      <div
        onClick={handleOpen}
        aria-hidden="true"
        className={styles.collapsible__header}
        aria-expanded={isOpen}
      >
        {iconPosition === 'left' && !isEmpty(children) && (
          <div
            className={styles.collapsible__header__prefixIcon}
            data-test-id="collapsible-header-prefixIcon"
          >
            {leftCollapsibleIcon}
          </div>
        )}
        <div
          className={styles.collapsible__header__text}
          data-test-id="collapsible-header"
        >
          <div className={styles.collapsible__header__title}>
            {title}
            {status && (
              <Tag bold variant={status?.variant}>
                {status?.text}
              </Tag>
            )}
          </div>
          {description && <Text type="sublabel">{description}</Text>}
        </div>
        {iconPosition === 'right' && !isEmpty(children) && (
          <div
            className={styles.collapsible__toggle}
            data-test-id="toggle-collapsible-btn"
          >
            {rightCollapsibleIcon}
          </div>
        )}
      </div>

      <div
        className={collapsibleContentClass}
        data-test-id="collapsible-content"
      >
        {message?.text && (
          <Text
            classNames={styles.collapsible__content__message}
            variant={message.variant}
          >
            {message.text}
          </Text>
        )}
        {children}
      </div>
    </div>
  );
}

export default Collapsible;
