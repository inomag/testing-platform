/* eslint-disable no-extra-boolean-cast */
import _, { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'src/@vymo/ui/atoms';
import { Alert } from 'src/@vymo/ui/blocks';
import VymoAppBanner from 'src/@vymo/ui/components/vymoAppBanner';
import { getApiStatus as getAuthApiStatus } from 'src/models/appConfig/selectors';
import { PROGRESSIVE_STEPPER_DIALOG } from 'src/modules/constants';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { renderDialog } from 'src/workspace/slice';
import {
  isDevDebugMode,
  isMobile,
  isNativeMobileApp,
  isSolnDebugMode,
} from 'src/workspace/utils';
import { getMilestones } from './checklist/selectors';
import CheckListWrapper from './checklist/wrapper';
import MainSection from './mainSection';
import { StepperDebug } from './mainSection/debug';
import {
  getApiStatus,
  getCurrentStepComponent,
  getDialogData,
  getErrorMessage,
  getLobCode,
  getShowAppBanner,
} from './selectors';
import { setIsModalVisible } from './slice';
import { StepperProvider } from './stepperProvider';
import { init, logout } from './thunk';
import { ApiStatus, StepperProps } from './types';
import styles from './index.module.scss';

const isDebugFromParams =
  isDevDebugMode() || isSolnDebugMode() ? 'playground' : undefined;

// eslint-disable-next-line complexity
function Stepper({ isDialog, debugMode }: StepperProps) {
  const dispatch = useAppDispatch();
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  const authApiStatus = useAppSelector(getAuthApiStatus);

  const currentStep = useAppSelector((state) =>
    getCurrentStepComponent(state, Boolean(isDialog)),
  );

  const showAppBanner = useAppSelector(getShowAppBanner);

  const lobCode = useAppSelector(getLobCode);
  const dialogStepperData = useAppSelector(getDialogData);

  const apiStatus: ApiStatus = useAppSelector((state) =>
    getApiStatus(state, Boolean(isDialog)),
  );

  const milestones = useAppSelector((state) =>
    getMilestones(state, Boolean(isDialog)),
  );

  const errorMessage = useAppSelector((state) =>
    getErrorMessage(state, Boolean(isDialog)),
  );

  useEffect(() => {
    if (currentStep?.banner) setIsBannerVisible(true);
    else setIsBannerVisible(false);
  }, [currentStep?.banner]);

  useEffect(() => {
    if ((isBannerVisible || errorMessage) && bannerRef.current) {
      setTimeout(() => {
        const bannerElement = bannerRef.current;
        if (!bannerElement) return;
        bannerElement.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 100);
    }
  }, [isBannerVisible, currentStep?.banner, errorMessage]);

  useEffect(() => {
    if (authApiStatus === 'go_to_home') {
      dispatch(init({ isDialog: Boolean(isDialog) }));
    }
  }, [authApiStatus, dispatch, isDialog]);

  useEffect(() => {
    if (authApiStatus === 'logout_clicked') {
      dispatch(logout());
    }
  }, [authApiStatus, dispatch]);

  useEffect(() => {
    if (!Boolean(isDialog) && !_.isEmpty(dialogStepperData)) {
      dispatch(setIsModalVisible(true));
      dispatch(
        renderDialog({
          id: PROGRESSIVE_STEPPER_DIALOG,
          props: {
            isDialog: true,
            lobCode: lobCode || 'lob',
            actionCode: dialogStepperData.code,
          },
        }),
      );
    } else if (!Boolean(isDialog)) {
      dispatch(setIsModalVisible(false));
    }
  }, [dispatch, dialogStepperData, isDialog, lobCode]);

  const stepperDebugMode = debugMode || isDebugFromParams;
  return (
    <StepperProvider isDialog={Boolean(isDialog)} debugMode={stepperDebugMode}>
      {isMobile() && !isNativeMobileApp() && showAppBanner && <VymoAppBanner />}
      <Loader
        visible={apiStatus === 'in_progress' && isEmpty(currentStep?.loader)}
        className={styles.progressiveStepper}
      >
        {!_.isEmpty(milestones) && <CheckListWrapper />}
        <div className={styles.progressiveStepper__mainSection__container}>
          {errorMessage && (
            <div ref={bannerRef}>
              <Alert
                variant="error"
                closeable
                data-test-id="stepper-alert-error"
                banner
              >
                {errorMessage}
              </Alert>
            </div>
          )}
          {isBannerVisible && (
            <div ref={bannerRef}>
              <Alert
                key={currentStep?.code}
                closeable
                onClose={() => setIsBannerVisible(false)}
                variant={currentStep?.banner?.type}
                data-test-id="stepper-alert"
                duration={currentStep?.banner?.duration}
                banner
              >
                {currentStep?.banner?.message}
              </Alert>
            </div>
          )}

          {!_.isEmpty(currentStep) && <MainSection />}
        </div>
      </Loader>
      {stepperDebugMode && !Boolean(isDialog) && <StepperDebug />}
    </StepperProvider>
  );
}

export default React.memo(Stepper);
