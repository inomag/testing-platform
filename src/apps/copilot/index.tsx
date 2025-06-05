import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import reportWebVitals from 'src/reportWebVitals';
import { store } from 'src/store';
import Workspace from 'src/workspace';
import getLayout from './layout';
import { moduleList } from './modulesReducerConfig';
import './index.scss';

const urlParams = new URLSearchParams(window.location.search);
window.isDebug = urlParams.get('debug') === 'true';

const CopilotApp = {
  render: (portalId, rootId, homePath) => {
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement,
    );
    window.portalId = portalId;
    window.rootId = rootId;

    const App = (
      <Provider store={store as any}>
        <Workspace
          moduleList={moduleList}
          layout={getLayout()}
          homePath={homePath}
        />
      </Provider>
    );

    root.render(
      window.isDebug ? <React.StrictMode>{App}</React.StrictMode> : App,
    );
  },
};

reportWebVitals();

export default CopilotApp;
