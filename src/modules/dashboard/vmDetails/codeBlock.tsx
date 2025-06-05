import React from 'react';
import styles from './index.module.scss';

function CodeBlock({ data }: { data: string }): JSX.Element {
  return (
    <pre className={styles.vmDetails__codeBlock}>
      <code>{data}</code>
    </pre>
  );
}

export default CodeBlock;
