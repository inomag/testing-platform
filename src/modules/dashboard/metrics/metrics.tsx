import React, { useEffect } from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getMetricsByProject } from '../selectors';
import { fetchMetrics } from '../thunk';
import ChartBox from './chartBox';
import styles from './index.module.scss';

export default function Metrics({ project }: { project: string }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMetrics({ project }));
  }, [dispatch, project]);

  const metricsData = useAppSelector((state) =>
    getMetricsByProject(state, project),
  );

  const masterCoverageData =
    metricsData?.coverageData?.[Number(metricsData?.coverageData?.length) - 1]
      ?.coverage;

  return (
    <div className={styles.metrics}>
      <Text type="h5">Master Coverage: {masterCoverageData}</Text>

      <div className={styles.metrics__chartContainer}>
        <ChartBox
          title={locale(Keys.CODE_COVERAGE)}
          data={metricsData.coverageData}
          type="area"
          dataKey="coverage"
          brushKey="date"
          yDomain={[0, 100]}
          referenceLine={{ value: 90, label: locale(Keys.TARGET_COVERAGE) }}
        />
        <ChartBox
          title={locale(Keys.MODULE_INTEGRATION)}
          data={metricsData.integrationTestReport}
          type="bar"
          dataKey="passes"
          brushKey="updatedAt"
        />
        <ChartBox
          title={locale(Keys.E2E_INTEGRATION)}
          data={metricsData.e2eTestReport}
          type="bar"
          dataKey="passes"
          brushKey="updatedAt"
        />
      </div>
    </div>
  );
}
