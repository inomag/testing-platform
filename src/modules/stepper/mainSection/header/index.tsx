import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import { Carousel } from 'src/@vymo/ui/blocks';
import { ReactComponent as ArrowLeft } from 'src/assets/icons/arrowLeft.svg';
import { getPortalBranding } from 'src/models/portalConfig/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import InfoSection from '../../infoSection';
import { getBackConfig, getTemplateUi } from '../../selectors';
import { useStepperContext } from '../../stepperProvider';
import { onActivate } from '../../thunk';
import { StepperResult } from '../../types';
import styles from './index.module.scss';

function Header({ currentStep }: { currentStep: StepperResult['template'] }) {
  const mainContentRef: any = useRef(null);
  const portalBranding = useAppSelector(getPortalBranding);
  const { isDialog } = useStepperContext();
  const templateUi = useAppSelector((state) => getTemplateUi(state, isDialog));

  const dispatch = useAppDispatch();
  const backButtonConfig = useAppSelector((state) => getBackConfig(state));

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [currentStep]);

  const handleBackButtonClick = useCallback(() => {
    onActivate({
      dispatch,
      props: {
        actionCode: backButtonConfig?.cta?.action,
        isDialog,
      },
    });
  }, [backButtonConfig?.cta, dispatch, isDialog]);

  const headerComponents = useMemo(
    () => (
      <>
        {currentStep?.carouselEnabled && (
          <Carousel
            showNavArrows={false}
            slides={(portalBranding?.banner ?? []).map(({ url }) => url)}
            autoSlide
            className={styles.mainSection__header__carousel}
          />
        )}

        {(!_.isEmpty(backButtonConfig) ||
          (currentStep?.title && !templateUi.header?.hide?.title)) && (
          <div className={styles.mainSection__header__title}>
            {!_.isEmpty(backButtonConfig) && (
              <ArrowLeft
                onClick={handleBackButtonClick}
                className={styles.mainSection__header__back_btn}
              />
            )}
            <Text type="h4">{currentStep?.title}</Text>
          </div>
        )}

        {currentStep?.description && !templateUi.header?.hide?.description && (
          <Text type="label">{currentStep?.description}</Text>
        )}

        {currentStep?.infoSection && (
          <div className={styles.mainSection__header__infoSection}>
            <InfoSection />
          </div>
        )}
      </>
    ),
    [
      backButtonConfig,
      currentStep?.carouselEnabled,
      currentStep?.description,
      currentStep?.infoSection,
      currentStep?.title,
      handleBackButtonClick,
      portalBranding?.banner,
      templateUi.header?.hide?.description,
      templateUi.header?.hide?.title,
    ],
  );

  return (
    <div className={styles.mainSection__header} ref={mainContentRef}>
      {headerComponents}
    </div>
  );
}

export default Header;
