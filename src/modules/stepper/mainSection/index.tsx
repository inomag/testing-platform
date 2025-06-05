import React from 'react';
import { useAppSelector } from 'src/store/hooks';
import { getCurrentStepComponent } from '../selectors';
import { useStepperContext } from '../stepperProvider';
import { StepperResult } from '../types';
import Content from './content';
import Footer from './footer';
import Header from './header';
import MainSectionWrapper from './wrapper';

function MainSection() {
  const { isDialog } = useStepperContext();
  const currentStep: StepperResult['template'] = useAppSelector((state) =>
    getCurrentStepComponent(state, isDialog),
  );
  return (
    <MainSectionWrapper>
      <Header currentStep={currentStep} />
      <Content currentStep={currentStep} />
      <Footer />
    </MainSectionWrapper>
  );
}

export default MainSection;
