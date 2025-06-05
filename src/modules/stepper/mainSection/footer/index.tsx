import { isEmpty } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import {
  getApiStatus,
  getAutoCallableCtas,
  getCTAs,
  getIsMainSectionCardLayout,
  getLobCode,
  getPollingCtas,
  getTemplateUi,
} from '../../selectors';
import { setApiStatus, setCurrentCta } from '../../slice';
import { useStepperContext } from '../../stepperProvider';
import { init, saveAction } from '../../thunk';
import { ApiStatus, Cta } from '../../types';
import styles from './index.module.scss';

function Footer() {
  const dispatch = useAppDispatch();
  const { isDialog, debugMode } = useStepperContext();
  const templateUi = useAppSelector((state) => getTemplateUi(state, isDialog));

  const isCard = useAppSelector(getIsMainSectionCardLayout) && !debugMode;
  const ctas = useAppSelector((state) => getCTAs(state, isDialog));
  const lobCode = useAppSelector(getLobCode);
  const autoCallableCtas = useAppSelector(
    getAutoCallableCtas(Boolean(isDialog)),
  );
  const pollingCta = useAppSelector(getPollingCtas(isDialog)) as Cta | null;

  const apiStatus: ApiStatus = useAppSelector((state) =>
    getApiStatus(state, Boolean(isDialog)),
  );

  const onContinue = useCallback(
    (cta) => {
      if (cta.type === 'navigate') {
        dispatch(init({ actionCode: cta.action, lobCode, isDialog }));
      } else {
        dispatch(setApiStatus({ isDialog, apiStatus: 'cta_clicked' }));
        dispatch(setCurrentCta({ isDialog, currentCta: cta }));
      }
    },
    [dispatch, isDialog, lobCode],
  );

  const startPolling = useCallback(
    (cta, isDialogFromArgs) => {
      if (!isEmpty(cta) && cta?.pollFrequency && cta?.maxPollWaitTime) {
        const maxPolls = Math.floor(cta.maxPollWaitTime / cta.pollFrequency);
        let pollCount = 0;

        // Dispatch immediately
        dispatch(
          setCurrentCta({
            isDialog: isDialogFromArgs,
            currentCta: cta,
          }),
        );
        dispatch(
          saveAction({
            payload: {},
            isDialog: isDialogFromArgs,
            debugMode,
          }),
        );

        pollCount += 1;

        // Start the interval
        const pollingInterval = setInterval(() => {
          if (pollCount >= maxPolls) {
            clearInterval(pollingInterval);
            return;
          }
          pollCount += 1;
          dispatch(
            setCurrentCta({
              isDialog: isDialogFromArgs,
              currentCta: cta,
            }),
          );
          dispatch(
            saveAction({
              payload: {},
              isDialog: isDialogFromArgs,
              debugMode,
            }),
          );
        }, cta.pollFrequency);

        // Cleanup interval
        return () => clearInterval(pollingInterval);
      }
      return undefined;
    },
    [dispatch, debugMode],
  );

  useEffect(() => {
    if (apiStatus === 'completed' && !isEmpty(autoCallableCtas)) {
      dispatch(
        setApiStatus({ isDialog: Boolean(isDialog), apiStatus: 'cta_clicked' }),
      );
      dispatch(
        setCurrentCta({
          isDialog: Boolean(isDialog),
          currentCta: autoCallableCtas[0],
        }),
      );
    }
  }, [apiStatus, autoCallableCtas, dispatch, isDialog]);

  useEffect(() => {
    let cleanupPolling;
    if (pollingCta) {
      cleanupPolling = startPolling(pollingCta, isDialog);
    }
    // Cleanup on unmount or dependencies change
    return () => {
      if (cleanupPolling) cleanupPolling();
    };
  }, [isDialog, pollingCta, startPolling]);

  const className = classNames(styles.mainSectionFooter, {
    [styles.mainSectionFooter__card]: isCard,
  });

  return (
    <div className={className}>
      {ctas.length > 0 && !templateUi.footer?.hide?.cta
        ? ctas.map(({ action, enabled = true, variant, title, ...cta }) => (
            <Button
              key={`cta-${
                cta.type === 'action'
                  ? action
                  : cta?.actionResponse?.template?.code
              }`}
              size="xLarge"
              data-cta={
                cta.type === 'action'
                  ? action
                  : cta?.actionResponse?.template?.code
              }
              disabled={!enabled}
              data-test-id={`cta-${
                cta.type === 'action'
                  ? action
                  : cta?.actionResponse?.template?.code
              }`}
              type={variant ?? 'primary'}
              onClick={() =>
                onContinue({ action, enabled, variant, title, ...cta })
              }
            >
              {title}
            </Button>
          ))
        : null}
    </div>
  );
}

export default Footer;
