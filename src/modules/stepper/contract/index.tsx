import { useEffect } from 'react';
import Logger from 'src/logger';
import { useAppDispatch } from 'src/store/hooks';
import { setApiStatus, setCurrentCta } from '../slice';
import { useStepperContext } from '../stepperProvider';
import { saveAction } from '../thunk';

function Contract({ verifyCta, esignUrl, referenceId }) {
  const dispatch = useAppDispatch();
  const { isDialog, debugMode } = useStepperContext();

  function handleCompletion(eventStatus = '') {
    dispatch(setApiStatus({ apiStatus: 'completed', isDialog }));
    dispatch(
      setCurrentCta({
        isDialog,
        currentCta: verifyCta,
      }),
    );

    dispatch(
      saveAction({
        payload: {
          referenceId,
          ...(eventStatus && { eventStatus }),
        },
        isDialog,
        debugMode,
      }),
    );
  }

  useEffect(() => {
    if (esignUrl && referenceId) {
      const log = new Logger('contract');
      const newTab = window.open(esignUrl, '_blank');
      dispatch(setApiStatus({ apiStatus: 'in_progress', isDialog }));
      if (newTab) {
        const checkRedirect = setInterval(() => {
          try {
            if (newTab.closed) {
              clearInterval(checkRedirect);
              handleCompletion();
            } else {
              const searchParams = new URLSearchParams(newTab.location.search);
              let eventStatus = searchParams.get('event');
              eventStatus = eventStatus?.replace(/\/$/, '') || '';
              if (eventStatus) {
                newTab.close();
                clearInterval(checkRedirect);
                handleCompletion(eventStatus);
              }
            }
          } catch (error) {
            // Permission issue
            log.error('Error while checking tab URL:', error);
          }
        }, 1000); // check every 1 sec if the app redirects
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esignUrl, dispatch, isDialog, debugMode, referenceId, verifyCta]);

  return null;
}

export default Contract;
