import { NotificationProp } from 'src/@vymo/ui/components/notification/types';

type TemplateConfig = {
  ui: any;
  api: { url: string; payload: any; configPath: string[] };
};

export type StatusLifeCycle =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'error';

export type UIBuilderState = {
  project: {
    selfserve: {
      code: string;
      name: string;
      tile: { icon: string; name: string; description: string };
      project: 'selfserve';
      config: {};
      templateConfig: TemplateConfig;
      lastSaved: string;
      isDraft?: boolean;
      draftVersion?: string;
      jira: {
        id: string;
        validated: 'not_started' | 'in_progress' | 'completed' | 'error';
        error?: string;
      };
      publish: {
        branch?: string;
        pr?: string;
        prId?: string;
        status?: 'not_started' | 'in_progress' | 'completed' | 'error';
        commitsSync: number;
      };
    };
  };
  appProjectName: string;
  notifications: Array<NotificationProp>;
  error: string;
  runner: {
    payload: {};
    valid: boolean;
    error: {};
    status: 'not_started' | 'in_progress' | 'completed' | 'error';
  };
};

export type Templates = Record<
  string,
  {
    git: UIBuilderState['project']['selfserve'];
    local: UIBuilderState['project']['selfserve'];
  }
>;
