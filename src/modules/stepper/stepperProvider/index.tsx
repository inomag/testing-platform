import React, { createContext, useContext, useState } from 'react';
import { StepperContextProps } from '../types';

const StepperContext = createContext<StepperContextProps>({ isDialog: false });

export const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export function StepperProvider({
  isDialog,
  debugMode,
  children,
}: React.PropsWithChildren<StepperContextProps>) {
  const [stepperState] = useState<StepperContextProps>({
    isDialog,
    debugMode,
  });
  return (
    <StepperContext.Provider value={stepperState}>
      {children}
    </StepperContext.Provider>
  );
}
