import React from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import Card from 'src/@vymo/ui/blocks/card';
import { ReactComponent as Error } from 'src/assets/icons/error.svg';
import { ReactComponent as Info } from 'src/assets/icons/infoCircle.svg';
import { ReactComponent as Success } from 'src/assets/icons/successCircle.svg';
import { ReactComponent as Warning } from 'src/assets/icons/warningCircle.svg';
import { useAppSelector } from 'src/store/hooks';
import { getInfoSection } from '../selectors';
import { useStepperContext } from '../stepperProvider';
import styles from './index.module.scss';

function InfoSection() {
  const { isDialog } = useStepperContext();
  const infoSection = useAppSelector((state) =>
    getInfoSection(state, isDialog),
  );

  const getIcon = (variant) => {
    switch (variant) {
      case 'info':
        return <Info />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'success':
        return <Success />;
      default:
        return null;
    }
  };

  return (
    <Card classNames={styles.infoSection}>
      <div className={styles.infoSection__icon}>
        {getIcon(infoSection.type)}
      </div>
      <Text
        classNames={styles.infoSection__header}
        semiBold
        data-test-id="infosection-title"
      >
        {infoSection.title}
      </Text>
      <Text
        classNames={styles.infoSection__description}
        type="label"
        data-test-id="infosection-description"
      >
        {infoSection.description}
      </Text>
    </Card>
  );
}

export default InfoSection;
