import React from 'react';
import Tag from 'src/@vymo/ui/atoms/tagInput/tag';
import { ReactComponent as LinkIcon } from 'src/assets/icons/link.svg';
import styles from './index.module.scss';

function Link({
  showLinkIcon = false,
  title,
  button = '',
  url,
  dataTestId = 'link',
}) {
  return (
    <>
      <Tag closable={false}>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={styles.simple_url}
          data-test-id={dataTestId}
        >
          {showLinkIcon && <LinkIcon />}
          {title}
        </a>{' '}
      </Tag>
      {button && <span>{button}</span>}
    </>
  );
}

export default Link;
