const axios = require('axios');

/* eslint-disable max-lines-per-function */
const getSorryCypressDataByProjectIdAndBuild = async (
  projectId,
  buildNumber,
) => {
  // Sorry Cypress Url
  try {
    const url = 'http://4.240.91.27:4000/';
    const payload = {
      operationName: 'getRunsFeed',
      variables: {
        filters: [
          {
            key: 'meta.projectId',
            value: projectId,
            like: null,
          },
          {
            key: 'meta.commit.branch',
            value: 'master',
            like: null,
          },
          {
            key: 'meta.ciBuildId',
            value: buildNumber,
            like: null,
          },
        ],
        cursor: '',
      },
      query: `query getRunsFeed($cursor: String, $filters: [Filters!]!) {
        runFeed(cursor: $cursor, filters: $filters) {
          runs {
            progress {
              updatedAt
              groups {
                tests {
                  overall
                  passes
                  failures
                  pending
                  skipped
                  flaky
                }
              }
            }
          }
        }
      }
      `,
    };

    const response = await axios.post(url, payload);

    const { runs } = response.data.data.runFeed;
    return runs.map((run) => ({
      updatedAt: run.progress.updatedAt,
      ...run.progress.groups[0].tests,
    }));
  } catch (error) {
    console.error('Error while retrieving data from sorry cypress:', error);
    return [];
  }
};

module.exports = { getSorryCypressDataByProjectIdAndBuild };
