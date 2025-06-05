import React, { useState } from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import {
  getCurrentStep,
  getInputsMap,
  getJourney,
  getPageAttributes,
  getSections,
} from 'src/models/stepperFormLegacy/selectors';
import { useAppSelector } from 'src/store/hooks';
import Section from './section';
import StepInfo from './stepInfo';
import StepperModalContent from './stepperModal';
import styles from './index.module.scss';

function StepperForm({ handleSubmit, showShowStepInfo = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, description } = useAppSelector(getPageAttributes);
  const journey = useAppSelector(getJourney);
  const sections = useAppSelector(getSections);
  const currentStep = useAppSelector(getCurrentStep);
  const inputsMap = useAppSelector(getInputsMap);

  return (
    <div
      className={styles['stepper-form-container']}
      data-test-id="stepper-form"
    >
      <div className={styles.header}>
        <div className={styles['header-text']}>
          <Text type="h5">{title}</Text>
          <Text classNames={styles.description}>{description}</Text>
        </div>
        {showShowStepInfo && (
          <StepInfo
            currentStep={currentStep + 1}
            totalSteps={journey?.length}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
      <div className={styles['stepper-sections']}>
        {sections?.map((section) => (
          <Section
            section={section}
            key={section.title}
            inputsMap={inputsMap}
            handleOnSubmit={handleSubmit}
          />
        ))}
      </div>
      <StepperModalContent
        journey={journey}
        currentStep={currentStep}
        setIsModalOpen={setIsModalOpen}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default StepperForm;
