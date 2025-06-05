import React from 'react';
import ProgressBar from '..';
import { Type } from '../types';

describe('ProgressBar Component', () => {
  it('renders Line by default', () => {
    cy.renderComponent(<ProgressBar value={20} />);
    cy.get('[data-test-id="progress-bar-line"]').should('exist');
  });

  it('renders Circle when type is circle', () => {
    cy.renderComponent(<ProgressBar value={20} type={Type.Circle} />);
    cy.get('[data-test-id="progress-bar-circle"]').should('exist');
  });

  it('renders status icon correctly', () => {
    cy.renderComponent(
      <>
        <ProgressBar value={20} variant="error" />
        <ProgressBar value={20} variant="success" />
        <ProgressBar value={20} variant="warning" />
      </>,
    );
    cy.get('[data-test-id="status-icon-danger"]').should('exist');
    cy.get('[data-test-id="status-icon-success"]').should('exist');
    cy.get('[data-test-id="status-icon-warning"]').should('exist');
  });

  it('does not render status icon when status is undefined', () => {
    cy.renderComponent(<ProgressBar value={20} />);
    cy.get('[data-test-id="status-icon"]').should('not.exist');
  });

  it('displays correct info text', () => {
    cy.renderComponent(<ProgressBar value={75} />);
    cy.get('[data-test-id="progress-bar-info"]').should('have.text', '75%');
  });

  it('handles custom class names', () => {
    cy.renderComponent(<ProgressBar value={20} classNames="custom-class" />);
    cy.get('[data-test-id="progress-bar-line"]').should(
      'have.class',
      'custom-class',
    );
  });
});

describe('Circle Component steps test cases', () => {
  it('renders without crashing', () => {
    cy.renderComponent(<ProgressBar value={20} type={Type.Circle} />);
    cy.get('[data-test-id="progress-bar-circle"]').should('exist');
  });

  it('renders with small size', () => {
    cy.renderComponent(
      <ProgressBar value={40} type={Type.Circle} size="small" />,
    );
    cy.window()
      .then((win) =>
        getComputedStyle(win.document.documentElement)
          .getPropertyValue('--s-font-size')
          .trim(),
      )
      .then((value) => {
        cy.get('[data-test-id="progress-bar-circle"]')
          .should('exist')
          .and(($element) => {
            const actualWidth = parseFloat($element.css('width'));
            const fontSizeValue = parseFloat(value.replace('px', ''));
            const expectedWidth = fontSizeValue * 5;
            expect(actualWidth).to.be.equal(expectedWidth);
          });
      });
  });

  it('renders with large size', () => {
    cy.renderComponent(
      <ProgressBar value={40} type={Type.Circle} size="large" />,
    );
    cy.window()
      .then((win) =>
        getComputedStyle(win.document.documentElement)
          .getPropertyValue('--s-font-size')
          .trim(),
      )
      .then((value) => {
        cy.get('[data-test-id="progress-bar-circle"]')
          .should('exist')
          .and(($element) => {
            const actualWidth = parseFloat($element.css('width'));
            const fontSizeValue = parseFloat(value.replace('px', ''));
            const expectedWidth = fontSizeValue * 20;
            expect(actualWidth).to.be.equal(expectedWidth);
          });
      });
  });

  it('renders stroke with correct angle when steps are not defined', () => {
    cy.renderComponent(<ProgressBar value={50} type={Type.Circle} />);
    cy.get('[data-test-id="progress-bar-stroke"]').should(
      'have.attr',
      'style',
      'background-image: conic-gradient(var(--brand-primary) 180deg, transparent 0);',
    );
  });

  it('renders stroke with correct angle when steps are defined', () => {
    cy.renderComponent(<ProgressBar value={25} type={Type.Circle} steps={4} />);
    cy.get('[data-test-id="progress-bar-stroke"]').should(
      'have.attr',
      'style',
      'background-image: conic-gradient(var(--brand-primary) 88deg, transparent 90deg, rgb(from var(--brand-primary) r g b / 0.2) 92deg, rgb(from var(--brand-primary) r g b / 0.2) 178deg, transparent 180deg, rgb(from var(--brand-primary) r g b / 0.2) 182deg, rgb(from var(--brand-primary) r g b / 0.2) 268deg, transparent 270deg, rgb(from var(--brand-primary) r g b / 0.2) 272deg, rgb(from var(--brand-primary) r g b / 0.2) 358deg, transparent 360deg, rgb(from var(--brand-primary) r g b / 0.2) 362deg;',
    );
  });

  it('displays correct info text', () => {
    cy.renderComponent(<ProgressBar value={75} type={Type.Circle} />);
    cy.get('[data-test-id="progress-bar-info"]').should('have.text', '75%');
  });
});

describe('Line Component steps test cases', () => {
  it('renders without crashing', () => {
    cy.renderComponent(<ProgressBar value={100} />);
    cy.get('[data-test-id="progress-bar-line"]').should('exist');
  });

  it('renders with small size', () => {
    cy.renderComponent(<ProgressBar value={90} size="small" />);
    cy.window()
      .then((win) =>
        getComputedStyle(win.document.documentElement)
          .getPropertyValue('--spacing-xs')
          .trim(),
      )
      .then((value) => {
        cy.get('[data-test-id="progress-bar-stroke"]')
          .should('exist')
          .and(($element) => {
            const actualHeight = parseFloat($element.css('height'));
            const fontSizeValue = parseFloat(value.replace('px', ''));
            const expectedHeight = fontSizeValue;
            expect(actualHeight).to.be.equal(expectedHeight);
          });
      });
  });

  it('renders with large size', () => {
    cy.renderComponent(<ProgressBar value={90} size="large" />);
    cy.window()
      .then((win) =>
        getComputedStyle(win.document.documentElement)
          .getPropertyValue('--spacing-m')
          .trim(),
      )
      .then((value) => {
        cy.get('[data-test-id="progress-bar-stroke"]')
          .should('exist')
          .and(($element) => {
            const actualHeight = parseFloat($element.css('height'));
            const fontSizeValue = parseFloat(value.replace('px', ''));
            const expectedHeight = fontSizeValue;
            expect(actualHeight).to.be.equal(expectedHeight);
          });
      });
  });

  it('renders stroke with correct width when steps are not defined', () => {
    cy.renderComponent(<ProgressBar value={75} />);
    cy.getById('progress-bar-stroke')
      .parent()
      .then(($parent) => {
        const parentWidth = $parent.width();
        if (parentWidth !== undefined) {
          const expectedWidth = parentWidth * 0.75;
          cy.getById('progress-bar-stroke').should(($element) => {
            const actualWidth = parseFloat($element.css('width'));
            expect(actualWidth).to.be.closeTo(expectedWidth, 1);
          });
        }
      });
  });

  it('displays correct info text', () => {
    cy.renderComponent(<ProgressBar value={75} />);
    cy.get('[data-test-id="progress-bar-info"]').should('have.text', '75%');
  });
});
