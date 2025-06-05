import React from 'react';
import classnames from 'classnames';
import { TextProps } from './types';
import styles from './index.module.scss';

function Text({
  bold,
  semiBold,
  italic,
  underline,
  type = 'default',
  link,
  children,
  classNames,
  variant = 'default',
  'data-test-id': dataTestId,
}: React.PropsWithChildren<TextProps>) {
  const textClass = classnames(
    styles.text,
    styles[`text__${type}`],
    {
      [styles.text__bold]: bold,
      [styles.text__semiBold]: semiBold,
      [styles.text__italic]: italic,
      [styles.text__underline]: underline,
      [styles.text__link]: link,
      [styles.text__error]: variant === 'error',
      [styles.text__success]: variant === 'success',
      [styles.text__info]: variant === 'info',
      [styles.text__warning]: variant === 'warning',
    },
    classNames,
  );

  if (link) {
    return (
      <a
        href={link}
        className={classnames(textClass, 'text__link')}
        data-test-id={dataTestId}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <span data-test-id={dataTestId} className={textClass}>
      {children}
    </span>
  );
}

export default React.memo(Text);
