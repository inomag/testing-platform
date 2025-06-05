import React, { useEffect, useMemo } from 'react';
import { Loader } from 'src/@vymo/ui/atoms';
import { Banner } from 'src/@vymo/ui/blocks';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getAppStatusConfig } from 'src/models/appConfig/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import ChildComponent from 'src/workspace/childComponent';
import { getRunnerApiStatus } from '../runner/selectors';
import { onSaveApplyConfig } from './thunk';

function SelfServeRunner({ appProjectName }) {
  const dispatch = useAppDispatch();
  const { selfserveSave } = useAppSelector(getAppStatusConfig);

  const apiStatus = useAppSelector(getRunnerApiStatus);

  useEffect(() => {
    if (selfserveSave === 'in_progress') {
      dispatch(onSaveApplyConfig());
    }
  }, [dispatch, selfserveSave]);

  const [bannerMessage, variant] = useMemo(() => {
    if (apiStatus === 'completed') {
      return [locale(Keys.CONFIG_APPLIED_SUCCESSFULLY), 'success'];
    }
    if (apiStatus === 'error') {
      return [locale(Keys.GENERIC_ERROR_TRY_AGAIN), 'error'];
    }

    return '';
  }, [apiStatus]);

  return (
    <Loader visible={apiStatus === 'in_progress'}>
      <Banner
        position="topRight"
        closeable
        message={bannerMessage}
        variant={variant as any}
      >
        <ChildComponent
          id="UI_RUNNER"
          props={{ appProjectName, showPayloadAccordion: false }}
        />
      </Banner>
    </Loader>
  );
}

export default SelfServeRunner;
