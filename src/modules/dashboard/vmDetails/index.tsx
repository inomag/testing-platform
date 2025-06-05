import React, { useEffect, useState } from 'react';
import { Button, Input } from 'src/@vymo/ui/atoms';
import Text from 'src/@vymo/ui/atoms/text';
import { Card } from 'src/@vymo/ui/blocks';
import Tooltip from 'src/@vymo/ui/blocks/tooltip';
import { getGrowthBookFeatureFlag } from 'src/featureFlags';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getVmDetails } from '../selectors';
import { deleteCypressRuns, deleteVmCache, fetchVmDetails } from '../thunk';
import CodeBlock from './codeBlock';
import { getCronData } from './queries';
import StorageChart from './storageChart';
import styles from './index.module.scss';

function VMDetails(): JSX.Element {
  const dispatch = useAppDispatch();
  const vmDetails = useAppSelector(getVmDetails);

  useEffect(() => {
    dispatch(fetchVmDetails());
  }, [dispatch]);

  const [daysValue, setDaysValue] = useState(7);

  const isDashboardAdmin = getGrowthBookFeatureFlag('dashboard-admin');

  const handleChange = (event: any) => {
    const { value } = event.target;

    if (value < 5 || value > 30) {
      setDaysValue(5);
    } else {
      setDaysValue(Number(value));
    }
  };

  const onClickCypressRunsDelete = () => {
    dispatch(deleteCypressRuns(daysValue));
  };

  const onClickCacheDelete = () => {
    dispatch(deleteVmCache());
  };

  return (
    <div className={styles.vmDetails}>
      <Card classNames={styles.vmDetails__card}>
        <Text type="h5">{locale(Keys.VM_STORAGE_DETAILS)}</Text>
        <StorageChart data={vmDetails.diskSpace ?? []} />
      </Card>
      <Card classNames={styles.vmDetails__card}>
        <Text type="h5">{locale(Keys.CRON_DETAILS)}</Text>
        <CodeBlock data={JSON.stringify(getCronData(vmDetails), null, 2)} />
      </Card>

      {isDashboardAdmin && (
        <Card classNames={styles.vmDetails__card}>
          <Text type="h5">{locale(Keys.CYPRESS_DELETE)}</Text>
          <div className={styles.vmDetails__cypressDelete}>
            <Input
              value={daysValue}
              onChange={handleChange}
              type="number"
              max={30}
              min={5}
              label={locale(Keys.LABEL_DATA_RETENTION_DAYS)}
            />

            <Tooltip content={locale(Keys.WARNING_DELETE_CYPRESS_OLD_RECORDS)}>
              <Button onClick={onClickCypressRunsDelete}>
                {locale(Keys.DELETE_CYPRESS_RUNS)}
              </Button>
            </Tooltip>
          </div>
        </Card>
      )}

      <Card classNames={styles.vmDetails__card}>
        <Text type="h5">{locale(Keys.CACHE_CLEAN)}</Text>
        <div className={styles.vmDetails__cacheClean}>
          <Tooltip
            content={locale(Keys.WARNING_DELETE_YARN_CACHE_DOCKER_VOLUMES)}
          >
            <Button onClick={onClickCacheDelete}>
              {locale(Keys.CLEAN_CACHE)}
            </Button>
          </Tooltip>
          <CodeBlock data={vmDetails?.cacheClean ?? ''} />
        </div>
      </Card>
    </div>
  );
}

export default VMDetails;
