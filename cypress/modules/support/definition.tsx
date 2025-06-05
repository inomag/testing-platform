import React, { useEffect, useState } from 'react';
import root from 'react-dom';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import './cypress.less';
// import wdr from '@welldone-software/why-did-you-render';
import * as moduleTypes from 'src/modules/constants';
import { initialiseFeatureFlags } from 'src/featureFlags';
import { serverDataList } from 'src/mock/serverData';
import type { ModuleTypeValue } from 'src/modules/types';
// src store and workspace should be defined above moduleReducerList
import { store } from 'src/store';
import Workspace from 'src/workspace';
import ChildComponent from 'src/workspace/childComponent';
import type * as types from './commands';
import { moduleList } from './moduleConfig';
// import defaultNotifier from './reactRerenderNotifier';
import { initializeServerData, setScenario } from './serverDataUtils';

// wdr(React, {
//   include: [/.*/],
//   collapseGroups: false,
//   trackHooks: true,
//   trackAllPureComponents: true,
//   logOnDifferentValues: true,
//   notifier: defaultNotifier,
// });

export const renderModuleDefinition = (
  module: ModuleTypeValue,
  options: types.Options = { props: {}, featureFlags: {} },
) => {
  window.isCypressModule = true;
  window.store = store;
  const { props, scenario, featureFlags = {}, route = '' } = options;

  initialiseFeatureFlags(featureFlags);

  function WrappedComponent({ moduleProps, moduleCode }) {
    // const isAppLoading = useAppSelector(getIsAppLoading);
    const isAppLoading = false;
    return isAppLoading ? (
      <>Loading</>
    ) : (
      <Workspace
        moduleList={moduleList}
        layout={<ChildComponent id={moduleCode} props={moduleProps} />}
      />
    );
  }

  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <WrappedComponent moduleProps={props} moduleCode={module} />,
      },
    ],
    {
      initialEntries: [route],
    },
  );

  function Wrapper() {
    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  }

  console.log(moduleTypes, module);
  Cypress.log({
    name: 'Render Module',
    message: `Rendering Module ${module}`,
  });
  initializeServerData(serverDataList, scenario);
  cy.wait(1000);
  cy.mount(<Wrapper />);
};

export const setScenarioDefinition = setScenario;

export const getRequest = (scenario: string) =>
  cy.wait(`@${scenario}`).its('request');

export const getStoreData = (path: string) =>
  cy.window().its('store').invoke('getState').its(path);

export const unmountReactElement = () => {
  // @ts-ignore
  root.unmount(document.getElementById('root') as HTMLElement);
};

export const dragAndDrop = ({ dragId, dropId }) => {
  Cypress.log({
    name: 'Deag Drop',
    message: `Dragging element ${dragId} to ${dropId}`,
    consoleProps: () => ({
      dragId,
      dropId,
    }),
  });
  const buttonIndex = 0;
  const moveThresold = 10;
  cy.getById(dropId)
    .first()
    .then(($target) => {
      const dropElementCords = $target[0].getBoundingClientRect();
      cy.getById(dragId)
        .first()
        .then((_subject) => {
          const dradElementCords = _subject[0].getBoundingClientRect();
          cy.wrap(_subject)
            .trigger('mousedown', {
              button: buttonIndex,
              clientX: dradElementCords.x,
              clientY: dradElementCords.y,
              force: true,
            })
            .trigger('mousemove', {
              button: buttonIndex,
              clientX: dradElementCords.x + moveThresold,
              clientY: dradElementCords.y,
              force: true,
            });
          cy.get('body')
            .trigger('mousemove', {
              button: buttonIndex,
              clientX: dropElementCords.x,
              clientY: dropElementCords.y,
              force: true,
            })
            .trigger('mouseup');
        });
    });
  return cy.getById(dragId);
};

function TestWrapperForOnChangeState({ children }) {
  const [value, setValue] = useState(children.props.value);

  useEffect(() => {
    setValue(children.props.value);
  }, [children.props.value]);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      onChange: (...args) => {
        if (children.props.onChange) {
          children.props.onChange(...args);
        }
        setValue(args[0]);
      },
      value,
    }),
  );
}
// TODO:: need to remove testWrapper
export const renderComponentDefinition = (
  component,
  { isStoreRequired = true, isTestWrapperOnChangeStateRequired = false } = {},
) => {
  window.store = store;
  if (isTestWrapperOnChangeStateRequired) {
    component = (
      <TestWrapperForOnChangeState>{component}</TestWrapperForOnChangeState>
    );
  }
  if (isStoreRequired) {
    cy.mount(<Provider store={store}>{component}</Provider>);
  } else {
    cy.mount(component);
  }
};
