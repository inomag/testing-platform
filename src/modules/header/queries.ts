import { getNavigationItems, isLmsWeb, isSelfServe } from 'src/workspace/utils';

export const showLmsWebHeader = () =>
  Boolean(isLmsWeb() && getNavigationItems().length);

export const showSelfServeHeader = () =>
  Boolean(isSelfServe() && getNavigationItems().length);
