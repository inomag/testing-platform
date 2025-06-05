import React, { useCallback } from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import chevronRight from 'src/assets/icons/chevron_right.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import styles from './index.module.scss';

function StepInfo({ currentStep, totalSteps, setIsModalOpen }) {
  const handleClick = useCallback(() => {
    setIsModalOpen((curState) => !curState);
  }, [setIsModalOpen]);
  return (
    <div
      className={styles['steps-info']}
      onClick={handleClick}
      aria-hidden="true"
      data-test-id="step-info"
    >
      <Text bold>{locale(Keys.STEP_CAPITAL)}</Text>
      <Text>{` ${currentStep} / ${totalSteps}`}</Text>
      <img src={chevronRight} alt="chevron-right" />
    </div>
  );
}

export default StepInfo;
