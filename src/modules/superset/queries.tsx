import _ from 'lodash';
import moment from 'moment';

const dateFields = ['createdStart', 'createdEnd', 'updatedStart', 'updatedEnd'];

export const getUpdatedUrlParams = (dashboardData, filterFields) => ({
  ...dashboardData?.urlParams,
  ..._.omitBy(
    _.mapValues(_.pick(filterFields, dateFields), (date) =>
      date ? moment(date).format('YYYY-MM-DD') : null,
    ),
    _.isNil,
  ),
});

export const getUrlParamsByVersion = (dashboardData, filterFields) => {
  switch (dashboardData?.version) {
    case 'v2':
      return getUpdatedUrlParams(dashboardData, filterFields);
    default:
      return dashboardData?.urlParams;
  }
};

export const getFiltersByVersion = (dashboardData) => {
  switch (dashboardData?.version) {
    case 'v2':
      return dashboardData?.dashboard_filters;
    default:
      return dashboardData?.filters;
  }
};
