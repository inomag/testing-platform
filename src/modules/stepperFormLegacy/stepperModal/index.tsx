import React, { useCallback } from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import Modal, { Body, Header } from 'src/@vymo/ui/blocks/modal';
import classnames from 'classnames';
import { ReactComponent as CrossIcon } from 'src/assets/ageas/cross2.svg';
import { ReactComponent as RadioButtonComplete } from 'src/assets/ageas/radio_button_completed.svg';
import { ReactComponent as RadioButtonCurrentTypeOne } from 'src/assets/ageas/radio_button_current1.svg';
import { ReactComponent as RadioButtonCurrentTypeTwo } from 'src/assets/ageas/radio_button_current2.svg';
import { ReactComponent as RadioButtonPending } from 'src/assets/ageas/radio_button_pending.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { Journey } from 'src/models/stepperFormLegacy/types';
import styles from './index.module.scss';

interface IProps {
  journey: Journey;
  currentStep: number;
  show: boolean;
  onClose: () => void;
  setIsModalOpen: (flag: boolean) => void;
}
function StepperModalContent({
  journey,
  currentStep,
  show,
  onClose,
  setIsModalOpen,
}: IProps) {
  const getRadioIcon = useCallback(
    (index) => {
      if (currentStep > index) {
        return <RadioButtonComplete />;
      }
      if (currentStep < index) {
        return <RadioButtonPending />;
      }
      return (
        <div className={styles['radio-container']}>
          <RadioButtonCurrentTypeOne className={styles['radio-background']} />
          <RadioButtonCurrentTypeTwo className={styles['radio-overlay']} />
        </div>
      );
    },
    [currentStep],
  );

  const lineClass = useCallback(
    (index) =>
      classnames(styles.line, {
        [styles.line_completed]: currentStep > index,
        [styles.line_pending]: currentStep < index,
      }),
    [currentStep],
  );

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);
  return (
    <Modal
      open={show}
      onClose={onClose}
      data-test-id="stepper-modal"
      classNames={styles['stepper-modal']}
      showCloseButton={false}
    >
      <Header>
        <div className={styles['stepper-modal-header']}>
          <Text type="h5">{locale(Keys.STEPS)}</Text>
          <div
            onClick={handleClose}
            aria-hidden="true"
            data-test-id="close-modal"
          >
            <CrossIcon />
          </div>
        </div>
      </Header>
      <Body>
        <div className={styles.content}>
          {journey.map((journeyItem, index, arr) => (
            <div className={styles['stepper-item']} key={journeyItem.code}>
              <div className={styles['stepper-item-row']}>
                <div className={styles['stepper-item-col']}>
                  {getRadioIcon(index)}
                  {index !== arr.length - 1 && (
                    <div className={lineClass(index)} />
                  )}
                </div>
                <div className={styles['stepper-item-text']}>
                  {currentStep >= index ? (
                    <Text bold>{`${journeyItem.order + 1}. ${
                      journeyItem.name
                    }`}</Text>
                  ) : (
                    <Text>{`${journeyItem.order + 1}. ${
                      journeyItem.name
                    }`}</Text>
                  )}
                  <Text>{journeyItem.description}</Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Body>
    </Modal>
  );
}

export default StepperModalContent;
