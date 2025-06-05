import { isEmpty } from 'lodash';
import React from 'react';
import { getUserAuthenticated } from 'src/models/auth/selectors';
import { getPortalBranding } from 'src/models/portalConfig/selectors';
import { useAppSelector } from 'src/store/hooks';
import { getWorkspaceRouteModuleBreadcrumbs } from 'src/workspace/selectors';
import DefaultHeader from './index.default';
import FrontendBoardHeader from './index.frontend';
import RecruitmentHeader from './index.recruitment';
import NavigationSelfServeHeader from './index.selfserve';
import NavigationVymoWebHeader from './index.vymoWeb';
import { showLmsWebHeader, showSelfServeHeader } from './queries';

function Header() {
  const portalBranding = useAppSelector(getPortalBranding);
  const navigationItems: any = useAppSelector(
    getWorkspaceRouteModuleBreadcrumbs,
  );

  const isAuthenticated = useAppSelector(getUserAuthenticated);

  if (showLmsWebHeader() && !isEmpty(navigationItems) && isAuthenticated) {
    return <NavigationVymoWebHeader navigationItems={navigationItems} />;
  }

  if (showSelfServeHeader()) {
    return <NavigationSelfServeHeader />;
  }

  if (window.APP === 'frontendBoard') {
    return <FrontendBoardHeader />;
  }

  if (isEmpty(portalBranding)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  if (window.APP === 'recruitment') {
    return <RecruitmentHeader />;
  }

  return <DefaultHeader />;
}

export default Header;
