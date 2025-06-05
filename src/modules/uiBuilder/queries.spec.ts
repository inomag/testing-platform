import {
  getDraftProjectTemplates,
  getFlattenProjects,
  getGitProjectTemplates,
  getProjectTemplateByName,
  getProjectTemplatesByType,
} from './queries';
import { Templates } from './types';

// Update with the correct path

describe('src/modules/uiBuilder/queries.ts', () => {
  describe('getFlattenProjects', () => {
    it('should return an array of local projects when available', () => {
      const templates: Templates = {
        template1: {
          local: {
            code: '1',
            name: 'Local Project 1',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
          git: {
            code: '1-git',
            name: 'Git Project 1',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
        },
      };

      expect(getFlattenProjects(templates)).toEqual([
        templates.template1.local,
      ]);
    });

    it('should return an array of git projects when local is unavailable', () => {
      const templates: Templates = {
        template1: {
          local: null as any,
          git: {
            code: '1-git',
            name: 'Git Project 1',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
        },
      };

      expect(getFlattenProjects(templates)).toEqual([templates.template1.git]);
    });

    it('should return an empty array when no templates are provided', () => {
      const templates: Templates = {};
      expect(getFlattenProjects(templates)).toEqual([]);
    });
  });

  describe('getProjectTemplateByName', () => {
    it('should return the correct project template by name', () => {
      const templates: Templates = {
        template1: {
          local: {
            code: '1',
            name: 'Project A',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
          git: {
            code: '1-git',
            name: 'Project B',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
        },
      };

      expect(getProjectTemplateByName(templates, 'Project A')).toEqual(
        templates.template1.local,
      );
    });

    it('should return undefined if the project name is not found', () => {
      const templates: Templates = {
        template1: {
          local: {
            code: '1',
            name: 'Project A',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
          git: {
            code: '',
            name: '',
            tile: {
              icon: '',
              name: '',
              description: '',
            },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: undefined,
              api: {
                url: '',
                payload: undefined,
                configPath: [],
              },
            },
            lastSaved: '',
            isDraft: undefined,
            draftVersion: undefined,
            jira: {
              id: '',
              validated: 'not_started',
              error: undefined,
            },
            publish: {
              branch: undefined,
              pr: undefined,
              prId: undefined,
              status: undefined,
              commitsSync: 0,
            },
          },
        },
      };

      expect(getProjectTemplateByName(templates, 'Project X')).toBeUndefined();
    });
  });

  describe('getDraftProjectTemplates', () => {
    it('should return only local project templates', () => {
      const templates: Templates = {
        template1: {
          local: {
            code: '1',
            name: 'Local Project 1',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
          git: null as any,
        },
      };

      expect(getDraftProjectTemplates(templates)).toEqual([
        templates.template1.local,
      ]);
    });
  });

  describe('getGitProjectTemplates', () => {
    it('should return only git project templates', () => {
      const templates: Templates = {
        template1: {
          local: null as any,
          git: {
            code: '1-git',
            name: 'Git Project 1',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
        },
      };

      expect(getGitProjectTemplates(templates)).toEqual([
        templates.template1.git,
      ]);
    });
  });

  describe('getProjectTemplatesByType', () => {
    it('should return local templates when isLocal is true', () => {
      const templates: Templates = {
        template1: {
          local: {
            code: '1',
            name: 'Local Project 1',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
          git: null as any,
        },
      };

      expect(getProjectTemplatesByType(templates, true)).toEqual([
        templates.template1.local,
      ]);
    });

    it('should return git templates when isLocal is false', () => {
      const templates: Templates = {
        template1: {
          local: null as any,
          git: {
            code: '1-git',
            name: 'Git Project 1',
            tile: { icon: '', name: '', description: '' },
            project: 'selfserve',
            config: {},
            templateConfig: {
              ui: {},
              api: { url: '', payload: {}, configPath: [] },
            },
            lastSaved: '',
            jira: { id: '', validated: 'not_started' },
            publish: { commitsSync: 0 },
          },
        },
      };

      expect(getProjectTemplatesByType(templates, false)).toEqual([
        templates.template1.git,
      ]);
    });
  });
});
