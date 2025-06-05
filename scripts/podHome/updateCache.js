const axios = require('axios');

const client = axios.create({
  baseURL: 'https://frontend.getvymo.com',
  headers: {
    'Content-Type': 'application/json',
    'x-bitbucket-token': process.env.X_BITBUCKET_TOKEN,
  },
});

const ENDPOINTS = {
  deployment: '/frontend/api/bitbucket/deployment/webPlatform',
  featureUrls: '/frontend/api/featureUrls',
};

const updateCache = async (type) => {
  try {
    const response = await client.post(ENDPOINTS[type]);
    console.log(`${type} cache updated:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `${type} cache update failed:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  const type = process.argv[2];
  if (ENDPOINTS[type]) {
    updateCache(type)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    console.log('Usage: node updateCache.js [deployment|featureUrls]');
    process.exit(0);
  }
}
