import { projects } from './constants';

export const getProjectOptions = () =>
  Object.keys(projects).map((key) => ({
    label: projects[key as keyof typeof projects],
    value: key,
  }));

export const getAppOptions = () => {
  const appsConfig = JSON.parse(process.env.APPS_CONFIG ?? '') ?? [];

  return appsConfig.map((app) => ({ label: app.name, value: app.name }));
};

export const getPortalOptionsByApp = (appName: string): Array<string> => {
  const appsConfig = JSON.parse(process.env.APPS_CONFIG ?? '[]') ?? [];

  return (
    appsConfig.find((app) => app.name === appName)?.output?.clients ?? []
  ).map((name) => ({ label: name, value: name }));
};

export const getFeatureBranch = (featureBranchState, portalOptions) => {
  const {
    app: { value: webPlatformApp },
    branch: { value: featureBranch },
    webPlatformBranch: { value: webPlatformBranch },
    project: { value: projectValue },
    // @ts-ignore
    portalId: { value: portalId } = {},
  } = featureBranchState;

  if (!featureBranch) return 'notValid';

  const webPlatformPortalId = portalOptions.length > 0 ? portalId : 'NA';
  const webPlatformBranchParam = webPlatformBranch
    ? `?webPlatformBranch=${webPlatformBranch}`
    : '';

  switch (projectValue) {
    case projects.vymoWeb:
      return `branch/${featureBranch}${webPlatformBranchParam}`;
    case projects.selfserve:
      return `v2/selfserve/${featureBranch}`;
    case projects.webPlatform:
      if (webPlatformApp && webPlatformPortalId) {
        return `web-platform/branch/${featureBranch}${webPlatformApp}/?portalId=${webPlatformPortalId}`;
      }
      return 'notValid';
    default:
      return 'notValid';
  }
};
