import { formatToLocalTime } from 'src/workspace/utils';
import { Cron } from '../types';

export const getCronData = (vmDetails): Cron => {
  const data = vmDetails.cron ?? ({} as any);

  const cronData = {
    cronCypressLastUpdate: formatToLocalTime(data.cronCypressLastUpdate),
    cronFeatureUrlsLastUpdate: formatToLocalTime(
      data.cronFeatureUrlsLastUpdate,
    )?.toString(),
    cronDeploymentLastUpdate: formatToLocalTime(data.cronDeploymentLastUpdate),
    cronData: data.cronData,
  };

  return cronData;
};
