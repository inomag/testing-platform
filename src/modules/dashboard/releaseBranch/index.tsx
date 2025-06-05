import React from 'react';
import { TabLayout } from 'src/@vymo/ui/blocks';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { projects } from '../featureBranch/constants';
import ReleaseBranchHistory from './releaseBranchHistory';
import styles from './index.module.scss';

export default function ReleaseBranch() {
  return (
    <div className={styles.releaseBranch}>
      <TabLayout
        defaultKey={projects.webPlatform}
        data-test-id="releaseBranch"
        items={[
          {
            key: projects.webPlatform,
            label: locale(Keys.WEB_PLATFORM),
            children: <ReleaseBranchHistory project={projects.webPlatform} />,
          },
          {
            key: projects.vymoWeb,
            label: locale(Keys.VYMO_WEB),
            children: <ReleaseBranchHistory project={projects.vymoWeb} />,
          },
          {
            key: projects.selfserve,
            label: locale(Keys.SELFSERVE),
            children: <ReleaseBranchHistory project={projects.selfserve} />,
          },
        ]}
      />
    </div>
  );
}
