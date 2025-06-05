import _ from 'lodash';
import React, { useEffect } from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import Breadcrumb from 'src/@vymo/ui/atoms/breadcrumb';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getAppHideConfig } from 'src/models/appConfig/selectors';
import { setAppStatusConfig } from 'src/models/appConfig/slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getNavigationItems, isLmsWeb, navigate } from 'src/workspace/utils';
import styles from './index.module.scss';

type NavigationItem = {
  title: string;
  path?: string;
  route?: {
    path: string;
    query?: any;
    payload?: any;
  };
  onClick?: () => void;
};

function NavigationHeader() {
  const dispatch = useAppDispatch();
  const navigationItems: NavigationItem[] = getNavigationItems();

  const handleVymoWebMargin = () => {
    const lmsWebHeader = document.getElementById('lmsWebHeader');
    const headerPlaceholder = document.getElementById('headerPlaceholder');
    if (lmsWebHeader && headerPlaceholder) {
      const headerHeight = lmsWebHeader.offsetHeight;
      headerPlaceholder.style.height = `${headerHeight}px`;
    }
  };

  const appHideConig = useAppSelector(getAppHideConfig);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isLmsWeb()) {
      handleVymoWebMargin();
      window.addEventListener('resize', handleVymoWebMargin);
      return () => window.removeEventListener('resize', handleVymoWebMargin);
    }
  }, []);

  const onSaveSelfServe = () => {
    dispatch(setAppStatusConfig({ status: { selfserveSave: 'in_progress' } }));
  };

  const onDiscardSelfServe = () => {
    dispatch(setAppStatusConfig({ status: { selfserveSave: 'in_progress' } }));
  };

  return (
    <>
      <div className={styles.navigationHeader} id="lmsWebHeader">
        <Breadcrumb
          {...{
            items: [
              ...(navigationItems || []).map(
                ({ path, title, route, onClick = _.noop }) => ({
                  path,
                  title,
                  onClick: route
                    ? () => navigate(route.path, route.query, route.payload)
                    : onClick,
                }),
              ),
            ],
          }}
        />

        {!appHideConig.selfserveSaveDiscardButtons && (
          <div className={styles.navigationHeader__selfServeButtons}>
            <Button
              rounded={false}
              type="outlined"
              onClick={onDiscardSelfServe}
            >
              {locale(Keys.DISCARD)}
            </Button>

            <Button rounded={false} onClick={onSaveSelfServe}>
              {locale(Keys.SAVE)}
            </Button>
          </div>
        )}
      </div>
      <div id="headerPlaceholder" />
    </>
  );
}

export default NavigationHeader;
