import React, { useEffect, useState } from 'react';
import { Divider, Text } from 'src/@vymo/ui/atoms';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { Templates } from '../types';
import { getTemplates } from '../utils';
import Tile from './tile';
import styles from './index.module.scss';

function SelfServeRunnerHome() {
  const [templates, setTemplates] = useState<Templates>({});
  const [, setIsLoading] = useState(true);

  // console.log('process', process);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const templatesData = await getTemplates(false);
      setTemplates(templatesData);
      setIsLoading(false);
    })();
  }, []);
  // eslint-disable-next-line no-console
  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <Text type="h3">{locale(Keys.FEATURES)}</Text>
        <Text type="sublabel">
          {locale(Keys.FEATURE_CONFIGURATION_DESCRIPTION)}
        </Text>
      </div>
      <Divider />
      <div className={styles.container__content}>
        {Object.values(templates).map((template) => (
          <Tile {...template.git} />
        ))}
      </div>
    </div>
  );
}

export default SelfServeRunnerHome;
