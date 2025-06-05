import { projects } from './featureBranch/constants';

export type CoverageData = {
  coverage: string;
  date: string;
};

export type TestMetric = {
  updatedAt: string;
  pending: number;
  overall: number;
  passes: number;
  failures: number;
  skipped: number;
  flaky: number;
};

export type Cron = {
  cronCypressLastUpdate: string;
  cronFeatureUrlsLastUpdate: string;
  cronDeploymentLastUpdate: string;
  cronData: {
    [key: string]: string;
  };
};

type SpaceData = {
  type: string;
  space: number;
};

export type DashboardState = {
  branches: Record<keyof typeof projects, Array<any>>;
  release: {
    prod: string | null;
    preProd: string | null;
    branches: Array<{ name: string; lastModified: string }>;
    nextRelease: any;
  };
  metrics: Record<
    keyof typeof projects,
    {
      coverageData: Array<CoverageData>;
      integrationTest: Array<TestMetric>;
      e2eTestReport: Array<TestMetric>;
    }
  >;
  vmDetails: {
    cron?: Cron;
    diskSpace?: Array<SpaceData>;
    cacheClean?: string;
  };
  message: string;
  figmaReport: string;
};
