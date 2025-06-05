import { createSelector } from '@reduxjs/toolkit';
import { getUserAuthenticated } from 'src/models/auth/selectors';
import { RootState } from 'src/store';
import { isDesktop } from 'src/workspace/utils';

export const getStepperState = (state: RootState) => state?.stepper;

export const getCurrentTemplate = (state: RootState, isDialog: boolean) =>
  getStepperState(state)?.[isDialog ? 'dialog' : 'page'];

export const getPageData = (state: RootState) =>
  getStepperState(state)?.page?.data;

export const getDialogData = (state: RootState) =>
  getStepperState(state)?.dialog?.data;

// Selectors for template data
export const getCurrentStepComponent = (state: RootState, isDialog) =>
  isDialog ? getDialogData(state) : getPageData(state);

export const getCurrentStep = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.code;

export const getCurrentStepType = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.type;

export const getCTAs = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.cta || [];

export const getAutoCallableCtas = (isDialog) =>
  createSelector([(state) => getCTAs(state, isDialog)], (ctas) => {
    const autoCallableCtas = ctas.filter((cta) => cta.autoCallable);
    if (autoCallableCtas.length > 1) {
      throw new Error(
        'Invalid CTA config as autocallable should only have one CTA',
      );
    }
    return autoCallableCtas;
  });

export const getPollingCtas = (isDialog) =>
  createSelector(
    [(state) => getCurrentTemplate(state, isDialog)?.data?.cta],
    (Ctas) => {
      const pollingCtas = Ctas?.filter((cta) => cta.type === 'polling') ?? [];

      // Validate only one polling CTA exists across both sources
      if (pollingCtas.length > 1) {
        throw new Error(
          'Invalid CTA config as only one CTA can have type polling',
        );
      }

      if (pollingCtas.length === 1) {
        return pollingCtas[0];
      }
      return null;
    },
  );

export const getCurrentStepActionType = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.actionType;

// Selectors for apiStatus

export const getApiStatus = (state: RootState, isDialog: boolean) =>
  getCurrentTemplate(state, isDialog).apiStatus;

export const isApiLoading = (state: RootState, isDialog) =>
  getApiStatus(state, isDialog) === 'in_progress';

export const getCurrentStepCtaAction = (state: RootState, isDialog) =>
  getCurrentTemplate(state, isDialog)?.currentCta;

export const getErrorMessage = (state: RootState, isDialog) =>
  getApiStatus(state, isDialog) === 'error' &&
  getCurrentTemplate(state, isDialog)?.errorMessage;

export const getInfoSection = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.infoSection || {};

export const getIsMainSectionCardLayout = (state: RootState) =>
  // TODO backend needs to add config for same as card in layout
  (!getUserAuthenticated(state) ||
    getPageData(state).actionCategory === 'DataSyncCategory') &&
  isDesktop();

export const getCtasByAction = (state: RootState, isDialog: boolean, codes) =>
  getCTAs(state, isDialog).filter((cta) => codes.includes(cta.action));

export const getTemplateUi = (state: RootState, isDialog) =>
  getCurrentTemplate(state, isDialog)?.templateUi;

export const getLobCode = (state: RootState) => getStepperState(state)?.lobCode;

export const getShowAppBanner = (state: RootState) =>
  getStepperState(state)?.showAppBanner;

export const getIsModalVisible = (state: RootState) =>
  getStepperState(state).isModalVisible;

export const getBackConfig = (state: RootState) =>
  getCurrentStepComponent(state, getStepperState(state).isModalVisible)
    ?.backConfig;
