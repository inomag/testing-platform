import { getProjectTemplateByName } from '../queries';
import { setProjectData } from '../slice';
import { getTemplates } from '../utils';

const onActivate = async ({ dispatch, props }) => {
  const { appProjectName } = props;
  if (appProjectName) {
    const templates = await getTemplates();
    const selectedTemplateData = getProjectTemplateByName(
      templates,
      appProjectName,
    );
    dispatch(setProjectData(selectedTemplateData));
  }
};
const onDeactivate = () => {};

export default { onActivate, onDeactivate };
