import { entries } from 'idb-keyval';
import { Templates } from './types';

export const getTemplates = async (local = true, master = true) => {
  const templatesJson = {};

  if (master) {
    // Load templates from require.context
    // @ts-ignore
    const context = require.context('./templates', true, /^.*\.json$/);
    const files = context.keys().filter((file) => file.startsWith('./'));

    files.forEach((fileName) => {
      const templatePath = fileName.replace('./', '').replace('.json', '');
      const [projectName, templateCode] = templatePath.split('/');

      if (projectName && templateCode) {
        templatesJson[templateCode] = { git: context(fileName) };
      }
    });
  }

  if (local) {
    // Load stored templates from entries()
    const templateEntries = await entries();

    templateEntries
      .filter(([key]: Array<string>) => key.startsWith('appBuilder__'))
      .forEach(([key, templateData]) => {
        const templateCode = (key as string).split('appBuilder__')[1];
        templateData.isDraft = true;
        if (templateCode) {
          if (!(templateCode in templatesJson)) {
            templatesJson[templateCode] = { local: templateData };
          } else {
            templatesJson[templateCode] = {
              git: {
                ...templatesJson[templateCode].git,
                draftVersion: templateData.name,
              },
              local: templateData,
            };
          }
        }
      });
  }

  return templatesJson as Templates;
};
