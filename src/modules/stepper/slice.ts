import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ApiStatus, Cta, StepperResult, TemplateUi } from './types';

// use this
// api status: cta_clicked, started, in_progress, completed

type StepperState = {
  page: {
    data: StepperResult['template'];
    apiStatus: ApiStatus;
    errorMessage: string;
    currentCta: Cta;
    templateUi: TemplateUi;
  };
  dialog: {
    data: StepperResult['template'];
    apiStatus: ApiStatus;
    errorMessage: string;
    currentCta: Cta;
    templateUi: TemplateUi;
  };
  lobCode: string;
  showAppBanner: boolean;
  isModalVisible: boolean;
};

const initialState: StepperState = {
  page: {
    data: {},
    apiStatus: undefined,
    errorMessage: '',
    currentCta: {},
    templateUi: {},
  },
  dialog: {
    data: {},
    apiStatus: undefined,
    errorMessage: '',
    currentCta: {},
    templateUi: {},
  },
  lobCode: 'lob',
  showAppBanner: false,
  isModalVisible: false,
};

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    setTemplateData(
      state: StepperState,
      action: PayloadAction<StepperResult['template']>,
    ) {
      if (action.payload.layout === 'dialog') {
        state.dialog.data = action.payload;
      } else {
        state.page.data = action.payload;
        state.dialog.data = {};
      }
    },
    setApiStatus(
      state: StepperState,
      action: PayloadAction<{ isDialog: boolean; apiStatus: ApiStatus }>,
    ) {
      if (action.payload.isDialog) {
        state.dialog.apiStatus = action.payload.apiStatus;
      } else {
        state.page.apiStatus = action.payload.apiStatus;
      }
    },
    setCurrentCta(
      state: StepperState,
      action: PayloadAction<{ isDialog: boolean; currentCta: Cta }>,
    ) {
      if (action.payload.isDialog) {
        state.dialog.currentCta = action.payload.currentCta;
      } else {
        state.page.currentCta = action.payload.currentCta;
      }
    },
    setErrorMessage(
      state: StepperState,
      action: PayloadAction<{ isDialog: boolean; errorMessage: string }>,
    ) {
      if (action.payload.isDialog) {
        state.dialog.errorMessage = action.payload.errorMessage;
      } else {
        state.page.errorMessage = action.payload.errorMessage;
      }
    },
    setTemplateUi(
      state: StepperState,
      action: PayloadAction<{
        isDialog?: boolean;
        templateUi: TemplateUi;
      }>,
    ) {
      if (action.payload.isDialog) {
        state.dialog.templateUi = action.payload.templateUi;
      } else {
        state.page.templateUi = action.payload.templateUi;
      }
    },
    setCtaDataByActionCode(
      state: StepperState,
      action: PayloadAction<{ code: string; cta: Cta; isDialog }>,
    ) {
      if (action.payload.isDialog) {
        const cta = (state.dialog.data.cta || []).map((ctaData) => {
          if (ctaData.action === action.payload.code) {
            return action.payload.cta;
          }
          return cta;
        });

        state.dialog.data.cta = cta;
      } else {
        const cta = (state.page.data.cta || []).map((ctaData) => {
          if (ctaData.action === action.payload.code) {
            return action.payload.cta;
          }
          return cta;
        });

        state.page.data.cta = cta;
      }
    },
    setLobCode(state: StepperState, action: PayloadAction<string>) {
      state.lobCode = action.payload;
    },
    setShowAppBanner(state: StepperState, action: PayloadAction<boolean>) {
      state.showAppBanner = action.payload;
    },
    setIsModalVisible(state: StepperState, action: PayloadAction<boolean>) {
      state.isModalVisible = action.payload;
    },
    resetStepperState(state: StepperState) {
      state = initialState;
      return state;
    },
  },
});

export const {
  setApiStatus,
  setErrorMessage,
  setCurrentCta,
  setTemplateData,
  setCtaDataByActionCode,
  setTemplateUi,
  setLobCode,
  setShowAppBanner,
  setIsModalVisible,
  resetStepperState,
} = stepperSlice.actions;

const reducer = { stepper: stepperSlice.reducer };

export default reducer;
