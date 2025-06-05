/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Loader, Text } from 'src/@vymo/ui/atoms';
import { Banner } from 'src/@vymo/ui/blocks';
import { Navigation } from 'src/@vymo/ui/molecules/navigation';
import { NavigationItem } from 'src/@vymo/ui/molecules/navigation/types';
import classnames from 'classnames';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getIsAppApiLoading } from 'src/models/appConfig/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { syncAppRouteHash } from 'src/workspace/selectors';
import FeatureBranch from './featureBranch';
import FigmaReport from './figmaReport';
import { FormBuilder } from './formBuilder';
import { FormulaFramework } from './formulaFramework';
import Metrics from './metrics';
import { MockStepper } from './mockStepper';
import ReleaseBranch from './releaseBranch';
import { getDashboardMessage } from './selectors';
import { setMessage } from './slice';
import VMDetails from './vmDetails';
import styles from './index.module.scss';

export default function FormPlayground({ playgroundType }) {
  const dispatch = useAppDispatch();
  const [selectedMenu, setSelectedMenu] = useState(playgroundType);
  const [formConfig, setFormConfig] = useState({
    fields: [],
    formulaContext: {
      session: {},
      vo: {},
    },
  });

  const isApiLoading = useAppSelector(getIsAppApiLoading);

  useAppSelector((state) =>
    syncAppRouteHash(
      state,
      {
        playgroundType: selectedMenu,
      },
      true,
    ),
  );

  const message = useAppSelector(getDashboardMessage);

  useEffect(() => {
    setSelectedMenu(playgroundType);
  }, [playgroundType]);

  const setSelectedMenuFromNavigation = (key: string) => {
    setSelectedMenu(key);
  };

  // eslint-disable-next-line complexity
  const getDashboardComponent = () => {
    switch (selectedMenu) {
      case 'formBuilder':
        return (
          <FormBuilder formConfig={formConfig} setFormConfig={setFormConfig} />
        );
      case 'framework':
        return <FormulaFramework />;
      case 'stepper':
        return <MockStepper />;
      case 'featureBranch':
        return <FeatureBranch />;

      case 'releaseBranch':
        return <ReleaseBranch />;

      case 'metrics':
        return <Metrics />;

      case 'vmDetails':
        return <VMDetails />;

      case 'storybook':
        window.open(
          'https://staging.lms.getvymo.com/web-platform/branch/storybook/',
          'storybook',
        );

        return (
          <Text type="h5">{locale(Keys.STORYBOOK_OPENED_IN_ANOTHER_TAB)}</Text>
        );

      case 'registry':
        window.open('http://4.240.91.27:4873/', 'registry');

        return (
          <Text type="h5">
            {locale(Keys.VYMO_REGISTRY_OPENED_IN_ANOTHER_TAB)}
          </Text>
        );

      case 'cypressDashboard':
        window.open('http://4.240.91.27:8085/', 'cypressDashboard');

        return (
          <Text type="h5">
            {locale(Keys.CYPRESS_DASHBOARD_OPENED_IN_ANOTHER_TAB)}
          </Text>
        );

      case 'wiki':
        window.open(
          'https://teamvymo.atlassian.net/wiki/spaces/ENGG/pages/3207692362/Frontend+Web+Platform',
          'wiki',
        );

        return <Text type="h5">{locale(Keys.WIKI_OPENED_IN_ANOTHER_TAB)}</Text>;

      case 'kt':
        window.open('https://vymo.slack.com/lists/T02J5FE6T/F07E28P60R5', 'kt');

        return <Text type="h5">{locale(Keys.KT_OPENED_IN_ANOTHER_TAB)}</Text>;
      case 'figmaReport':
        return <FigmaReport />;
      default:
        return <div>{locale(Keys.COMING_SOON)}</div>;
    }
  };

  const navigationItems: NavigationItem[] = [
    {
      key: 'playground',
      value: locale(Keys.PLAYGROUND),
      onClick: setSelectedMenuFromNavigation,
      items: [
        {
          key: 'formBuilder',
          value: locale(Keys.FORM_BUILDER),
          onClick: setSelectedMenuFromNavigation,
        },
        {
          key: 'stepper',
          value: locale(Keys.STEPPER_PLAYGROUND),
          onClick: setSelectedMenuFromNavigation,
        },
        {
          key: 'framework',
          value: locale(Keys.FORMULA_FRAMEWORK),
          onClick: setSelectedMenuFromNavigation,
        },
      ],
    },
    {
      key: 'featureBranch',
      value: locale(Keys.FEATURE_BRANCH),
      onClick: setSelectedMenuFromNavigation,
    },
    {
      key: 'releaseBranch',
      value: locale(Keys.RELEASE_BRANCHES),
      onClick: setSelectedMenuFromNavigation,
    },

    {
      key: 'metrics',
      value: locale(Keys.METRICS),
      onClick: setSelectedMenuFromNavigation,
    },
    {
      key: 'storybook',
      value: locale(Keys.STORYBOOK),
      onClick: setSelectedMenuFromNavigation,
    },

    {
      key: 'registry',
      value: locale(Keys.NPM_REGISTRY),
      onClick: setSelectedMenuFromNavigation,
    },

    {
      key: 'wiki',
      value: locale(Keys.FRONTEND_WIKI),
      onClick: setSelectedMenuFromNavigation,
    },
    {
      key: 'figmaReport',
      value: 'Figma Report',
      onClick: setSelectedMenuFromNavigation,
    },

    {
      key: 'kt',
      value: locale(Keys.KT),
      onClick: setSelectedMenuFromNavigation,
    },

    {
      key: 'cypressDashboard',
      value: locale(Keys.CYPRESS_DASHBOARD),
      onClick: setSelectedMenuFromNavigation,
    },

    {
      key: 'vmDetails',
      value: locale(Keys.VM_DETAILS),
      onClick: setSelectedMenuFromNavigation,
    },
  ];

  const dashboardClasses = classnames(styles.playground);

  return (
    <Loader visible={isApiLoading} className={styles.playgroundWrapper}>
      <div className={dashboardClasses}>
        <Navigation items={navigationItems} defaultKey={selectedMenu} />

        <div className={styles.playground__container}>
          <Banner
            position="topRight"
            variant="success"
            closeable
            message={message}
            onClose={() => {
              dispatch(setMessage(''));
            }}
          >
            {getDashboardComponent()}
          </Banner>
        </div>
      </div>
    </Loader>
  );
}
