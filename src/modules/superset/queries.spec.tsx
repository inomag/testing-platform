import {
  getFiltersByVersion,
  getUpdatedUrlParams,
  getUrlParamsByVersion,
} from './queries';

describe('getUrlParamsByVersion', () => {
  const filterFields = { createdStart: 1742281437000 };

  it('should return urlParams when version is not present', () => {
    const dashboardData = {
      id: 571,
      name: 'Head Of Collection Dashboard',
      source: 'superset',
      type: 'custom',
      code: 'HeadOfCollectionDashboard',
      uuid: '55e650a8-cfb2-4e1c-961d-fbecf3526711',
      url: 'https://spm-asi-uat.lms.getvymo.com',
      category_icon: 'fa-user',
      category_title: 'Others',
      category: 'Others',
      filters: [
        {
          id: 'NATIVE_FILTER-h_gbd4ZtjWfYOvGxgOc2a',
          column: 'manager_code',
          operator: 'IN',
          value: ['SU'],
        },
      ],
    };

    expect(getUrlParamsByVersion(dashboardData, filterFields)).toBeUndefined();
  });

  it('should return updated urlParams when version is v2', () => {
    const dashboardData = {
      id: 539,
      name: 'Supervisory Dashboard New',
      source: 'superset',
      type: 'custom',
      code: 'SupervisoryDashboardNew',
      uuid: 'a27e37da-f0ac-433a-a874-13fbdb98beb3',
      url: 'https://spm-asi-uat.lms.getvymo.com',
      category_icon: 'fa-user',
      category_title: 'TES',
      category: 'TES',
      filters: [
        {
          type: 'user_hierarchy',
          code: 'user_id',
          hint: 'User',
        },
      ],
      dashboard_filters: [
        {
          id: 'NATIVE_FILTER-cDyjKPoe4338Za4pjHLvP',
          column: 'user_region_accessible.region',
          operator: 'IN',
          value: ['SU'],
        },
      ],
      client_id: 'ficc',
      version: 'v2',
      urlParams: {
        OFFSET: '+5.50',
      },
      vymo_filter_values_data: {
        user_id: [],
        createdEnd: 1741243130000,
      },
    };

    expect(getUrlParamsByVersion(dashboardData, filterFields)).toEqual(
      getUpdatedUrlParams(dashboardData, filterFields),
    );
  });
});

describe('getFiltersByVersion', () => {
  it('should return filters when version is not present', () => {
    const dashboardData = {
      id: 571,
      name: 'Head Of Collection Dashboard',
      source: 'superset',
      type: 'custom',
      code: 'HeadOfCollectionDashboard',
      uuid: '55e650a8-cfb2-4e1c-961d-fbecf3526711',
      url: 'https://spm-asi-uat.lms.getvymo.com',
      category_icon: 'fa-user',
      category_title: 'Others',
      category: 'Others',
      filters: [
        {
          id: 'NATIVE_FILTER-h_gbd4ZtjWfYOvGxgOc2a',
          column: 'manager_code',
          operator: 'IN',
          value: ['SU'],
        },
      ],
    };

    expect(getFiltersByVersion(dashboardData)).toEqual(dashboardData.filters);
  });

  it('should return dashboard_filters when version is v2', () => {
    const dashboardData = {
      id: 539,
      name: 'Supervisory Dashboard New',
      source: 'superset',
      type: 'custom',
      code: 'SupervisoryDashboardNew',
      uuid: 'a27e37da-f0ac-433a-a874-13fbdb98beb3',
      url: 'https://spm-asi-uat.lms.getvymo.com',
      category_icon: 'fa-user',
      category_title: 'TES',
      category: 'TES',
      filters: [
        {
          type: 'user_hierarchy',
          code: 'user_id',
          hint: 'User',
        },
      ],
      dashboard_filters: [
        {
          id: 'NATIVE_FILTER-cDyjKPoe4338Za4pjHLvP',
          column: 'user_region_accessible.region',
          operator: 'IN',
          value: ['SU'],
        },
      ],
      client_id: 'ficc',
      version: 'v2',
      urlParams: {
        OFFSET: '+5.50',
      },
      vymo_filter_values_data: {
        user_id: [],
        createdEnd: 1741243130000,
      },
    };

    expect(getFiltersByVersion(dashboardData)).toEqual(
      dashboardData.dashboard_filters,
    );
  });
});
