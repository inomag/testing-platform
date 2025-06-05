import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Loader } from 'src/@vymo/ui/atoms';
import classNames from 'classnames';
import { Dashboard } from 'vymo-superset-dashboard-sdk';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getClientConfigData } from 'src/workspace/utils';
import { getFiltersByVersion, getUrlParamsByVersion } from './queries';
import { getError, getGuestToken, getIsLoading } from './selector';
import { getGuestTokenApi } from './thunk';
// eslint-disable-next-line import/order
import { NativeFilter } from 'vymo-superset-dashboard-sdk/build/Dashboard/Embedded/NativeFilter';
import styles from './index.module.scss';

function SuperSetDashboard() {
  const [dashboardData, setDashboardData] = useState(() =>
    !window.isWebPlatform
      ? window.moduleProps?.getSuperSetDashboardConfig()
      : {},
  );

  const dispatch = useAppDispatch();

  const guestToken = useAppSelector(getGuestToken);
  const isLoading = useAppSelector(getIsLoading);
  const error = useAppSelector(getError);

  const configData = getClientConfigData();

  useEffect(() => {
    if (dashboardData?.uuid) {
      dispatch(
        getGuestTokenApi({
          dashboard_id: dashboardData.id,
          dashboard_uuid: dashboardData.uuid,
        }),
      );
    }
  }, [dashboardData, dispatch]);

  const filterFields = useMemo(
    () => dashboardData?.vymo_filter_values_data || [],
    [dashboardData],
  );

  useEffect(() => {
    let userIdArray: string | string[] = [];

    if (filterFields?.user_id) {
      userIdArray = Array.isArray(filterFields.user_id)
        ? filterFields.user_id
        : [filterFields.user_id];
    }

    setDashboardData((prevDashboardData) => {
      const updatedFilters = [...(prevDashboardData.dashboard_filters || [])];

      if (
        updatedFilters[0] &&
        userIdArray?.length > 0 &&
        JSON.stringify(updatedFilters[0].value) !==
          JSON.stringify([userIdArray[userIdArray.length - 1]])
      ) {
        updatedFilters[0] = {
          ...updatedFilters[0],
          value: [userIdArray[userIdArray.length - 1]],
        };

        return {
          ...prevDashboardData,
          dashboard_filters: updatedFilters,
        };
      }
      return prevDashboardData;
    });
  }, [filterFields?.user_id]);

  if (_.isEmpty(dashboardData)) {
    return <p>{locale(Keys.SUPERSET_DATA_NOT_FOUND)}</p>;
  }

  // const dataProvider = new DefaultDataProvider(dashboardData.url, {
  //   username: process.env.SUPERSET_USERNAME || '',
  //   password: process.env.SUPERSET_PWD || '',
  // });

  if (error) {
    return <p>{locale(Keys.ERROR_FETCH_GUEST_TOKEN_FAILED, { error })}</p>;
  }

  if (isLoading || !guestToken) {
    return <Loader visible size="small" />;
  }
  return (
    <div
      className={classNames(
        styles.super_set_div_container,
        'super_set_div_container',
      )}
    >
      <Dashboard
        key={dashboardData.uuid}
        guestToken={guestToken}
        vymoAuthToken={configData?.auth_token}
        domain={dashboardData.url}
        uuid={dashboardData.uuid}
        uiConfig={{
          urlParams: getUrlParamsByVersion(dashboardData, filterFields) || {},
          filters: {
            expanded: false,
          },
        }}
        nativeFilters={getFiltersByVersion(dashboardData) as NativeFilter[]}
      />
    </div>
  );
}
export default SuperSetDashboard;
