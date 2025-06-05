import React from 'react';
import styles from './index.module.scss';

export interface BranchItemData {
  branch: string;
  lastModified: string;
  children?: Array<{ branch: string; lastModified: string }>;
}

export function BranchItem({
  branch,
  lastModified,
  children = [],
}: BranchItemData) {
  return (
    <div className={styles.releaseBranchHistory__item}>
      <div className={styles.releaseBranchHistory__item__content}>
        <div className={styles.releaseBranchHistory__item__content__branch}>
          {branch}
        </div>
        <div>{lastModified}</div>
      </div>
      {children.length > 0 && (
        <div className={styles.releaseBranchHistory__item__children}>
          {children.map(
            ({ branch: childBranch, lastModified: childLastModified }) => (
              <BranchItem
                key={childBranch}
                branch={childBranch}
                lastModified={childLastModified}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
