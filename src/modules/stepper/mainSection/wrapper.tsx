import React from 'react';
import { Card } from 'src/@vymo/ui/blocks';
import classNames from 'classnames';
import { useAppSelector } from 'src/store/hooks';
import { getIsMainSectionCardLayout } from '../selectors';
import { useStepperContext } from '../stepperProvider';
import styles from '../index.module.scss';

function MainSectionWrapper({ children }) {
  const { isDialog, debugMode } = useStepperContext();
  const isCard =
    useAppSelector(getIsMainSectionCardLayout) && !isDialog && !debugMode;

  const className = classNames(styles.progressiveStepper__mainSection, {
    [styles.progressiveStepper__mainSection__card]: isCard,
  });

  return (
    <div className={className}>
      {isCard ? <Card>{children}</Card> : children}
    </div>
  );
}

export default MainSectionWrapper;
