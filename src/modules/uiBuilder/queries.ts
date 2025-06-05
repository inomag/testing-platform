import { Templates, UIBuilderState } from './types';

export const getFlattenProjects = (templates: Templates) =>
  Object.values(templates).reduce((acc, template) => {
    if (template.local) {
      acc.push(template.local);
    } else {
      acc.push(template.git);
    }
    return acc;
  }, [] as Array<UIBuilderState['project']['selfserve']>);

export const getProjectTemplateByName = (
  templates: Templates,
  name: string = '',
) =>
  getFlattenProjects(templates).find(
    (template) => template.name.toLowerCase() === name.toLowerCase(),
  );

export const getDraftProjectTemplates = (templates: Templates) =>
  Object.values(templates)
    .filter((template) => template.local)
    .map((template) => template.local);

export const getGitProjectTemplates = (templates: Templates) =>
  Object.values(templates)
    .filter((template) => template.git)
    .map((template) => template.git);

export const getProjectTemplatesByType = (
  templates: Templates,
  isLocal: boolean = false,
) =>
  isLocal
    ? getDraftProjectTemplates(templates)
    : getGitProjectTemplates(templates);
