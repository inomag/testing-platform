import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import reportWebVitals from 'src/reportWebVitals';
import { store } from 'src/store';
import Workspace from 'src/workspace';
import getLayout from './layout';
import { afterAppInit, beforeAppInit } from './lifecycle';
import { moduleList } from './modulesReducerConfig';
import './index.scss';

const urlParams = new URLSearchParams(window.location.search);
window.isDebug = urlParams.get('debug') === 'true';

// this will be used by app to initialize the store and modules needed.
const VymoApp = {
  root: null as ReactDOM.Root | null,
  render: (portalId, rootId, homePath = '') => {
    VymoApp.root = ReactDOM.createRoot(
      document.getElementById(rootId || 'root') as HTMLElement,
    );
    window.portalId = portalId;
    window.rootId = rootId;

    const App = (
      <Provider store={store as any}>
        <Workspace
          moduleList={moduleList}
          layout={getLayout()}
          homePath={homePath}
          beforeAppInitFunction={beforeAppInit}
          afterAppInitFunction={afterAppInit}
        />
      </Provider>
    );
    VymoApp.root.render(
      window.isDebug ? <React.StrictMode>{App}</React.StrictMode> : App,
    );
  },

  unmount: () => {
    if (VymoApp.root) {
      VymoApp.root.unmount();
      VymoApp.root = null;
    }
  },
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default VymoApp;
