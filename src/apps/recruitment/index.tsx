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

// this will be used by app to initialize the store and modules needed.
const RecruitmentApp = {
  render: (portalId, rootId, homePath) => {
    const root = ReactDOM.createRoot(
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
        />
      </Provider>
    );
    root.render(
      window.isDebug ? <React.StrictMode>{App}</React.StrictMode> : App,
    );
  },
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default RecruitmentApp;
