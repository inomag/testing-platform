import React from 'react';
import { TabLayout } from 'src/@vymo/ui/blocks';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { projects } from '../featureBranch/constants';
import MetricsDetails from './metrics';
import styles from './index.module.scss';

export default function Metrics() {
  return (
    <div className={styles.releaseBranch}>
      <TabLayout
        defaultKey={projects.webPlatform}
        items={[
          {
            key: projects.webPlatform,
            label: locale(Keys.WEB_PLATFORM),
            children: <MetricsDetails project={projects.webPlatform} />,
          },
          {
            key: projects.vymoWeb,
            label: locale(Keys.VYMO_WEB),
            children: <MetricsDetails project={projects.vymoWeb} />,
          },
          {
            key: projects.selfserve,
            label: locale(Keys.SELFSERVE),
            children: <MetricsDetails project={projects.selfserve} />,
          },
        ]}
      />
    </div>
  );
}
