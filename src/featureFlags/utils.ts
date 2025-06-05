import axios from 'axios';
import { decrypt } from 'src/workspace/queries';
import { getDecryptedEnvValue } from 'src/workspace/utils';
import { growthbook } from './index';

const FEATURES_ENDPOINT = `https://cdn.growthbook.io/api/features/${getDecryptedEnvValue(
  'GROWTHBOOK_KEY',
)}`;
const EncryptKey = getDecryptedEnvValue('GROWTHBOOK_ENCRYPT_KEY');
export const initialiseFeatureFlagsFromGrowthBook = async (attributes) => {
  try {
    const response = await axios({
      url: FEATURES_ENDPOINT,
      method: 'get',
      withCredentials: false,
    });

    if (response.status === 200) {
      const featuresStr = await decrypt(
        response.data.encryptedFeatures,
        String(EncryptKey),
      );
      const features = JSON.parse(featuresStr);
      if (attributes) {
        growthbook.setAttributes(attributes);
      }
      growthbook.setFeatures(features);
    } else {
      /* eslint-disable no-console */
      console.error('Failed to fetch feature definitions from GrowthBook');
    }
  } catch (error) {
    /* eslint-disable no-console */
    console.error(error);
  }
};
