import React from 'react';
import { MimeTypes } from '../constants';
import DocumentUploader from '../index';

describe('Form Component', () => {
  it('should render the document uploader', () => {
    cy.renderComponent(
      <DocumentUploader
        acceptedMimeTypes={Object.values(MimeTypes)}
        maxSize={10}
        onFileUpload={() => {}}
        onFileRemove={() => {}}
        title="Upload File"
        multiple
        fieldCode="file"
      />,
    );
    cy.getById('document-uploader-test-label').should('be.visible');
    cy.screenshot('should render the document uploader');
  });

  it('should upload file', () => {
    let value: any = [];
    const onFileUpload = (val) => {
      value = val;
    };
    cy.renderComponent(
      <DocumentUploader
        acceptedMimeTypes={Object.values(MimeTypes)}
        maxSize={40}
        onFileUpload={onFileUpload}
        onFileRemove={() => {}}
        title="Upload File"
        multiple
        fieldCode="testFile"
      />,
    );
    cy.fixture('testFile.pdf').then((fileContent) => {
      cy.getById('document-uploader-test').then((input) => {
        const blob = Cypress.Blob.binaryStringToBlob(
          fileContent,
          'application/pdf',
        );
        const testFile = new File([blob], 'testFile.pdf', {
          type: 'application/pdf',
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        (input[0] as HTMLInputElement).files = dataTransfer.files;
        cy.wrap(input).trigger('change', { force: true });
        cy.wait(1000).then(() => {
          expect(value[0].file.name).to.equal('testFile.pdf');
        });
        cy.getById('pdf').should('be.visible');
        cy.screenshot('document upload success');
      });
    });
  });

  it('should remove the uploaded file on remove click', () => {
    let value: any = [];
    const onFileUpload = (val) => {
      value = val;
    };

    const onFileRemove = (removedFileName, files) => {
      expect(removedFileName).to.equal('testFile.pdf');
      expect(files.length).to.equal(0);
    };
    cy.renderComponent(
      <DocumentUploader
        acceptedMimeTypes={Object.values(MimeTypes)}
        maxSize={40}
        onFileUpload={onFileUpload}
        onFileRemove={onFileRemove}
        title="Upload File"
        multiple
        fieldCode="testFile"
      />,
    );
    cy.fixture('testFile.pdf').then((fileContent) => {
      cy.getById('document-uploader-test').then((input) => {
        const blob = Cypress.Blob.binaryStringToBlob(
          fileContent,
          'application/pdf',
        );
        const testFile = new File([blob], 'testFile.pdf', {
          type: 'application/pdf',
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        (input[0] as HTMLInputElement).files = dataTransfer.files;
        cy.wrap(input).trigger('change', { force: true });
        cy.wait(1000).then(() => {
          expect(value[0].file.name).to.equal('testFile.pdf');
        });
        cy.getById('pdf').should('be.visible');

        cy.getById('document-uploader-remove-0').should('be.visible').click();
      });
    });
  });

  it('should preview the file on click', () => {
    let value: any = [];
    const onFileUpload = (val) => {
      value = val;
    };
    cy.renderComponent(
      <DocumentUploader
        acceptedMimeTypes={Object.values(MimeTypes)}
        maxSize={40}
        onFileUpload={onFileUpload}
        onFileRemove={() => {}}
        title="Upload File"
        multiple
        fieldCode="testFile"
      />,
    );
    cy.fixture('testFile.pdf').then((fileContent) => {
      cy.getById('document-uploader-test').then((input) => {
        const blob = Cypress.Blob.binaryStringToBlob(
          fileContent,
          'application/pdf',
        );
        const testFile = new File([blob], 'testFile.pdf', {
          type: 'application/pdf',
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        (input[0] as HTMLInputElement).files = dataTransfer.files;
        cy.wrap(input).trigger('change', { force: true });
        cy.wait(1000).then(() => {
          expect(value[0].file.name).to.equal('testFile.pdf');
        });
        cy.getById('document-uploader-thumbnail-0')
          .should('be.visible')
          .click()
          .then(() => {
            cy.getById('document-preview-modal-wrapper').should('be.visible');
            cy.screenshot('document preview success');
          });
      });
    });
  });
});
