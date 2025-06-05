import * as Modules from 'src/modules/constants';

describe('src/modules/stepperForm/integration/stepperForm', () => {
  it('should not render stepper when sectionData is not present', () => {
    cy.renderModule(Modules.STEPPER_FORM, {
      props: { lastPage: 'Test page' },
    });
    cy.screenshot('should not render sectionData');
  });
});
