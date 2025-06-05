export type ApiStatus =
  | 'cta_clicked'
  | 'logout_clicked'
  | 'go_to_home'
  | 'in_progress'
  | 'completed'
  | 'error'
  | undefined;

export type AppConfigState = {
  apiStatus: ApiStatus;
  hide: {
    headerHamburger?: boolean;
    selfserveSaveDiscardButtons?: boolean;
  };
  status: {
    selfserveSave: 'not_started' | 'in_progress' | 'completed' | 'error';
    selfserveDiscard: 'not_started' | 'in_progress' | 'completed' | 'error';
  };
  userInfo: { email?: string; clientCode?: string };
  errorMessage: string;
  pageDirty: boolean;
  languageOptions: Array<{ label: string; value: string }>;
};
