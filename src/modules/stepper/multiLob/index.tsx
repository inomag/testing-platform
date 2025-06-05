import React, { useEffect, useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { setAppHideConfig } from 'src/models/appConfig/slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getApiStatus } from '../selectors';
import { setShowAppBanner, setTemplateUi } from '../slice';
import { useStepperContext } from '../stepperProvider';
import { saveAction } from '../thunk';
import ActiveLob from './activeLob';
import Lob from './lob';
import NavLob from './navLob';
import RecommendLob from './recommendLob';
import { Props } from './types';
import styles from './index.module.scss';

function MultiLob({
  first_time_login,
  ongoing_lob_cards,
  recommended_lob_cards,
  active_lob_cards,
}: Props) {
  const { isDialog, debugMode } = useStepperContext();
  const apiStatus = useAppSelector((state) => getApiStatus(state, isDialog));
  const [selectedLob, setSelectedLob] = useState<Array<string>>([]);
  const dispatch = useAppDispatch();
  const [showChooseInterest, setShowChooseInterest] = useState(
    ongoing_lob_cards.length === 0,
  );

  useEffect(() => {
    if (first_time_login && ongoing_lob_cards.length === 0) {
      setShowChooseInterest(true);
    } else {
      setShowChooseInterest(false);
    }
  }, [dispatch, first_time_login, ongoing_lob_cards.length]);

  useEffect(
    // @ts-ignore
    () => () => {
      dispatch(setTemplateUi({ isDialog, templateUi: {} }));
      dispatch(setShowAppBanner(false));
      dispatch(
        setAppHideConfig({
          hide: {
            headerHamburger: false,
          },
        }),
      );
    },
    [dispatch, isDialog],
  );

  useEffect(() => {
    if (!showChooseInterest) {
      dispatch(setShowAppBanner(true));
      dispatch(
        setTemplateUi({
          isDialog,
          templateUi: {
            header: { hide: { title: true, description: true } },
            footer: { hide: { cta: true } },
          },
        }),
      );
      dispatch(
        setAppHideConfig({
          hide: {
            headerHamburger: false,
          },
        }),
      );
    } else {
      setSelectedLob([]);
      dispatch(setShowAppBanner(false));
      dispatch(setTemplateUi({ isDialog, templateUi: {} }));
      dispatch(
        setAppHideConfig({
          hide: {
            headerHamburger: true,
          },
        }),
      );
    }
  }, [dispatch, isDialog, showChooseInterest]);

  useEffect(() => {
    if (apiStatus === 'cta_clicked') {
      dispatch(
        // @ts-ignore
        saveAction({
          payload: {
            lobs: selectedLob,
          },
          isDialog,
          debugMode,
        }),
      );
    }
  }, [apiStatus, debugMode, dispatch, isDialog, selectedLob]);

  return (
    <div className={styles.multiLob}>
      {showChooseInterest ? (
        <div
          className={styles.multiLob__ongoing}
          data-test-id="multiLob-choose"
        >
          {recommended_lob_cards.map((lob) => (
            <Lob
              {...lob}
              selectedLob={selectedLob}
              setSelectedLob={setSelectedLob}
            />
          ))}
        </div>
      ) : (
        <>
          <Text type="h4" data-test-id="multiLob-ongoing">
            {locale(Keys.ONBOARDING_IN_PROGRESS_COUNT, {
              count: ongoing_lob_cards.length,
            })}
          </Text>
          <div className={styles.multiLob__ongoing}>
            {ongoing_lob_cards.map((lob) => (
              <NavLob {...lob} />
            ))}
          </div>

          {recommended_lob_cards.length > 0 && (
            <div className={styles.multiLob__recommended__card}>
              <Text type="h4" data-test-id="multiLob-recommend">
                {locale(Keys.RECOMMENDED_FOR_YOU)}
              </Text>
              <div className={styles.multiLob__recommended}>
                {recommended_lob_cards.slice(0, 2).map((lob) => (
                  <RecommendLob
                    setShowChooseInterest={setShowChooseInterest}
                    {...lob}
                  />
                ))}
              </div>
              {recommended_lob_cards.length > 2 && (
                <Button
                  type="text"
                  size="small"
                  onClick={() => setShowChooseInterest(true)}
                >
                  {locale(Keys.VIEW_ALL)}
                </Button>
              )}
            </div>
          )}

          {active_lob_cards.length > 0 && (
            <>
              <Text type="h4">{locale(Keys.ACTIVE_BUSINESSES)}</Text>
              <div className={styles.multiLob__recommended}>
                {active_lob_cards.map((lob) => (
                  <ActiveLob {...lob} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MultiLob;
