import React from 'react';
import History from 'src/@vymo/ui/components/history';
import styles from './index.module.scss';

function AuditHistory({ data = [] }: { data: any }) {
  return (
    <div className={styles.history}>
      {data?.audits?.map((audit, idx) => (
        <History data={audit} open={idx === 0} />
      ))}
    </div>
  );
}

export default AuditHistory;
