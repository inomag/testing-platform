import { isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import { ProgressBar, Text } from 'src/@vymo/ui/atoms';
import Modal, { Body, Header as ModalHeader } from 'src/@vymo/ui/blocks/modal';
import { ReactComponent as ChevronRight } from 'src/assets/icons/right.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getPortalBranding } from 'src/models/portalConfig/selectors';
import { useAppSelector } from 'src/store/hooks';
import { isMobile, isTablet } from 'src/workspace/utils';
import ProgressiveChecklist from '.';
import { useStepperContext } from '../stepperProvider';
import { getCurrentMilestone } from './selectors';
import styles from './index.module.scss';

function CheckListWrapper() {
  const [isChecklistVisible, setChecklistVisible] = useState(false);
  const portalBranding = useAppSelector(getPortalBranding);
  const { isDialog } = useStepperContext();

  const currentMilestone = useAppSelector((state) =>
    getCurrentMilestone(state, isDialog),
  );

  const toggleChecklist = useCallback(() => {
    setChecklistVisible(!isChecklistVisible);
  }, [isChecklistVisible]);

  const getChecklistModal = useCallback(
    () => (
      <Modal
        classNames={styles.checklistWrapper__modal}
        closeOnEscape
        onClose={toggleChecklist}
      >
        <ModalHeader className={styles.checklistWrapper__checklistModalHeader}>
          {locale(Keys.CHECKLIST)}
        </ModalHeader>
        <Body>
          <ProgressiveChecklist setChecklistVisible={setChecklistVisible} />
        </Body>
      </Modal>
    ),
    [toggleChecklist],
  );

  return (
    <>
      {isChecklistVisible && getChecklistModal()}
      {isMobile() || isTablet() ? (
        !isEmpty(portalBranding) && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            className={styles.mobileChecklistProgress__wrapper}
            onClick={toggleChecklist}
          >
            <div className={styles.mobileChecklistProgress__textContainer}>
              {!isEmpty(currentMilestone?.progress) && (
                <>
                  <span>
                    <Text semiBold>{currentMilestone?.name}</Text>
                    {Number(currentMilestone?.progress?.percentage) > 0 && (
                      <Text>{`: ${currentMilestone?.progress?.label}`}</Text>
                    )}
                  </span>
                  {Number(currentMilestone?.progress?.percentage) > 0 && (
                    <ProgressBar
                      variant="success"
                      value={Number(currentMilestone?.progress?.percentage)}
                      showText={false}
                      size="small"
                    />
                  )}
                </>
              )}
            </div>
            <ChevronRight className={styles.checklistWrapper__progressIcon} />
          </div>
        )
      ) : (
        <div className={styles.checklistWrapper__header}>
          <div className={styles.checklistWrapper__sidebar}>
            <ProgressiveChecklist setChecklistVisible={setChecklistVisible} />
          </div>
        </div>
      )}
    </>
  );
}

export default CheckListWrapper;
