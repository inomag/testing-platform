import React from 'react';
import Table from 'src/@vymo/ui/blocks/table';
import { TableGroup } from '../tableGroup';
import { columns, data } from './data';

describe('Table component', () => {
  it('should render', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: false,
          pagination: { visible: true },
          isRowSelectionEnabled: true,
        }}
        columnConfigs={columns}
        sortOn={{ column: 'First Name', defaultSort: 'asc' }}
        data-test-id="container"
      />,
    );
    cy.getById('table-container').should('be.visible');
    cy.getById('pagination').should('be.visible');
    cy.getById('table-index-1').should('be.visible');
    cy.screenshot('Should render table component');
  });
  it('should render search when search and pagination when enabled', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: true,
          pagination: { visible: true },
          isRowSelectionEnabled: true,
        }}
        columnConfigs={columns}
        sortOn={{ column: 'First Name', defaultSort: 'asc' }}
        data-test-id="container"
      />,
    );
    cy.getById('search').should('be.visible');
    cy.getById('pagination').should('be.visible');
  });
  it('should not render search when search and pagination when disable', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: false,
          pagination: { visible: false },
          isRowSelectionEnabled: true,
        }}
        columnConfigs={columns}
        sortOn={{ column: 'First Name', defaultSort: 'asc' }}
        data-test-id="container"
      />,
    );
    cy.getById('search').should('not.exist');
    cy.getById('pagination').should('not.exist');
  });
  it('should render proper page on clicking pagination actions', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: false,
          pagination: { visible: true },
        }}
        columnConfigs={columns}
        sortOn={{ column: 'First Name', defaultSort: 'asc' }}
        data-test-id="container"
      />,
    );
    cy.getById('pagination-button-2').click();
    cy.getById('table-index-2').should('be.visible');
    cy.getById('pagination-button-right').click();
    cy.getById('table-index-3').should('be.visible');
    cy.getById('pagination-button-left').click();
    cy.getById('table-index-2').should('be.visible');
    cy.getById('pagination-button-left').click();
    cy.getById('pagination-button-left').should('be.disabled');
  });
  it('row count change based on selection', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: false,
          pagination: { visible: true },
        }}
        columnConfigs={columns}
        sortOn={{ column: 'First Name', defaultSort: 'asc' }}
        data-test-id="container"
      />,
    );
    cy.getById('pagination-select-page-size').click();
    cy.getById('pagination-select-page-size-optionList-20').click();
    cy.getById('table-index-1')
      .find('tr')
      .then((row) => {
        expect(row.length).to.equal(21);
      });
  });
  it('should filter rows based on search criteria', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: true,
          pagination: { visible: true },
        }}
        columnConfigs={columns}
        data-test-id="container"
      />,
    );
    cy.getById('search').type('Linsley');
    cy.getById('table-index-1')
      .find('tr')
      .then((rows) => {
        const results: any = [];
        rows.toArray().forEach((element) => {
          const itemLower = element.innerHTML.toLowerCase();
          if (itemLower.includes('linsley')) {
            results.push(element);
          }
        });
        expect(results.length).to.not.eq(0);
      });
  });

  it('should sort rows based on sort criteria', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: true,
          pagination: { visible: true },
        }}
        columnConfigs={columns}
        data-test-id="container"
      />,
    );
    cy.getById('Last Name-header').click();
    cy.getById('table-index-1')
      .find('tr')
      .then((rows) => {
        expect(rows[1].innerHTML.toLowerCase()).to.includes('brown');
      });
    cy.getById('Last Name-header').click();
    cy.getById('table-index-1')
      .find('tr')
      .then((rows) => {
        expect(rows[1].innerHTML.toLowerCase()).to.includes('williams');
      });
  });

  it('should render group of tables', () => {
    cy.renderComponent(
      <TableGroup
        data={{
          tableName: 'Test Table',
          rows: data,
          metaData: {
            columnConfig: columns,
            showSearch: true,
            selectionAttribute: 'id',
            pageSize: 5,
            groupByAttribute: 'Status',
            filters: [],
          },
        }}
        dataTestId="testTable"
      />,
    );
    cy.getById('testTable').should('be.visible');
  });

  it('should render group of tables with Selection', () => {
    cy.renderComponent(
      <TableGroup
        data={{
          tableName: 'Test Table',
          rows: data,
          metaData: {
            columnConfig: columns,
            showSearch: true,
            selectionAttribute: 'Status',
            enableSelection: true,
            pageSize: 5,
            groupByAttribute: 'Status',
            filters: [],
          },
        }}
        dataTestId="testTable"
      />,
    );
    cy.getById('testTable').should('be.visible');
    cy.getById('table-row-select-Married-checkmark').should('be.visible');
  });

  it('should render group of tables with no data', () => {
    cy.renderComponent(
      <TableGroup
        data={{
          tableName: 'Test Table',
          rows: [],
          metaData: {
            columnConfig: columns,
            showSearch: true,
            selectionAttribute: 'Status',
            pageSize: 5,
            groupByAttribute: 'Status',
            filters: [],
          },
        }}
        dataTestId="testTable"
      />,
    );
    cy.getById('testTable-Married').should('not.exist');
  });

  it('should filter values based on text filter passed', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: false,
          pagination: { visible: true },
          isRowSelectionEnabled: true,
          filters: [
            {
              column: 'First Name',
              type: 'text',
            },
          ],
        }}
        columnConfigs={columns}
        sortOn={{ column: 'First Name', defaultSort: 'asc' }}
        data-test-id="container"
        groupFilterValues={{ 'First Name': 'text' }}
      />,
    );
    cy.getById('table-container').should('be.visible');
    cy.getById('pagination').should('be.visible');
    cy.getById('table-index-1').should('be.visible');
    cy.getById('filter-First Name').should('be.visible').type('Kevin');
    cy.get('[data-test-id="table-index-1"] tbody tr').should('have.length', 5);
    cy.getById('filter-First Name').should('be.visible').clear();
    cy.get('[data-test-id="table-index-1"] tbody tr').should('have.length', 10);
  });

  it('should filter values based on select filter passed', () => {
    cy.renderComponent(
      <Table
        tableData={data}
        tableConfig={{
          name: 'Test Table',
          showSearch: false,
          pagination: { visible: true },
          isRowSelectionEnabled: true,
          filters: [
            {
              column: 'First Name',
              type: 'select',
            },
          ],
        }}
        columnConfigs={columns}
        sortOn={{ column: 'First Name', defaultSort: 'asc' }}
        data-test-id="container"
        groupFilterValues={{ 'First Name': 'select' }}
      />,
    );
    cy.getById('table-container').should('be.visible');
    cy.getById('pagination').should('be.visible');
    cy.getById('table-index-1').should('be.visible');
    cy.getById('filter-First Name').should('be.visible').click();
    cy.getById('filter-First Name-optionList-Alice')
      .should('be.visible')
      .click();
    cy.get('[data-test-id="table-index-1"] tbody tr').should('have.length', 4);
  });
});
