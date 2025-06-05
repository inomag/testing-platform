import React, { useEffect } from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import classNames from 'classnames';
import { ReactComponent as Sync } from 'src/assets/icons/sync.svg';
import { ReactComponent as DataSyncImage } from 'src/assets/images/dataSync.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch } from 'src/store/hooks';
import { setFullPage } from 'src/workspace/slice';
import { isMobile } from 'src/workspace/utils';
import { setTemplateUi } from '../slice';
import styles from './index.module.scss';

function DataSync() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isMobile()) {
      dispatch(setFullPage(true));
    }
    dispatch(setTemplateUi({ templateUi: { content: { grow: true } } }));

    return () => {
      if (isMobile()) {
        dispatch(setFullPage(false));
      }
      dispatch(setTemplateUi({ templateUi: { content: { grow: false } } }));
    };
  }, [dispatch]);

  const dataSyncHeaderClass = classNames(styles.dataSync__header, {
    [styles.dataSync__header__mobile]: isMobile(),
  });

  return (
    <div data-test-id="dataSync-wrapper" className={styles.dataSync}>
      <div data-test-id="dataSync-header" className={dataSyncHeaderClass}>
        <Sync />
        <Text
          data-test-id="dataSync-header-text"
          type={isMobile() ? 'default' : 'h5'}
          bold
        >
          {locale(Keys.DATA_SYNC_IN_PROGRESS)}
        </Text>
      </div>

      <DataSyncImage />

      <div data-test-id="dataSync-content" className={styles.dataSync__content}>
        <Text data-test-id="dataSync-init-message" bold>
          {locale(Keys.DATA_SYNC_PROCESS_INITIATED)}
        </Text>
        <Text data-test-id="dataSync-checkback-note" type="sublabel">
          {locale(Keys.DATA_SYNC_CHECK_BACK_LATER)}
        </Text>
        <Text data-test-id="dataSync-explore-suggestion" type="sublabel">
          {locale(Keys.EXPLORE_OTHER_BUSINESSES_PROMPT)}
        </Text>
      </div>
    </div>
  );
}

export default DataSync;
