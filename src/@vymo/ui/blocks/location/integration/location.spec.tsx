import React from 'react';
import Location from '../index';

describe('src/@vymo/ui/blocks/location/integration/location.spec.tsx', () => {
  let locationValue = {};
  const onChange = (value) => {
    locationValue = value;
  };
  beforeEach(() => {
    locationValue = {};
  });
  it('renders a location field', () => {
    cy.renderComponent(
      <Location
        data-test-id="location"
        value={locationValue}
        onChange={onChange}
      />,
    );
    cy.getById('location').should('be.visible');
    cy.getById('location').click();
    cy.getById('location_modal-wrapper').should('be.visible');
    cy.screenshot('renders a location field');
  });

  it('renders a location field with preset value', () => {
    locationValue = { formatted_address: 'Bangalore' };
    cy.renderComponent(
      <Location
        data-test-id="location"
        value={locationValue}
        onChange={onChange}
      />,
    );
    cy.getById('location').click();

    cy.wait(1000).then(() => {
      cy.get('.pac-target-input').should(
        'have.value',
        'Bengaluru, Karnataka, India',
      );
      cy.screenshot('renders a location field with value');
    });
  });

  it('renders a location field with lat & lng', () => {
    locationValue = { latitude: 12.940362, longitude: 77.640348 };

    cy.renderComponent(
      <Location
        data-test-id="location"
        value={locationValue}
        onChange={onChange}
      />,
    );
    cy.getById('location').click();

    cy.wait(1000).then(() => {
      cy.get('.pac-target-input').should(
        'have.value',
        'WJRR+44 Bengaluru, Karnataka, India',
      );
      cy.screenshot('renders a location field with value');
    });
  });

  it('renders a location field with type checkIn', () => {
    cy.renderComponent(
      <Location
        data-test-id="location"
        value={locationValue}
        onChange={onChange}
        type="check_in"
        disabled
      />,
      // we are sending disabled true as this base is used by location adaptor and this disabled is send as true if code is check_in
    );
    cy.getById('location').should('be.disabled');
    cy.screenshot('renders a location field with type checkin');
  });
});
