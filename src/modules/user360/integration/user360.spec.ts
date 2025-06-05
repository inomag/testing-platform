import * as Modules from 'src/modules/constants';
import { user360Config } from './data';

describe('UserProfile Component', () => {
  it('renders user profile module with grouping', () => {
    cy.window().then((window) => {
      window.localStorage.setItem('client', 'testmay');
      window.localStorage.setItem('config', user360Config);
    });
    cy.renderModule(Modules.USER_360, { props: { userCode: '12345' } });
    cy.screenshot('renders user 360 module');
  });
});
