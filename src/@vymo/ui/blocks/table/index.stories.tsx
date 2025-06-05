import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Table from './index';
import { ColumnConfig } from './types';

const meta: Meta<typeof Table> = {
  title: 'Blocks/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Basic: Story = (args) => <Table {...args} />;

export const Search: Story = (args) => <Table {...args} />;

export const OnSelect: Story = (args) => <Table {...args} />;
const data = [
  {
    'First Name': 'Alice',
    'Last Name': 'Davis',
    Age: 22,
    Visits: 28,
    Progress: 30,
    Status: 'Single',
  },
  {
    'First Name': 'John',
    'Last Name': 'Martinez',
    Age: 26,
    Visits: 424,
    Progress: 84,
    Status: 'Widowed',
  },
  {
    'First Name': 'Kevin',
    'Last Name': 'Smith',
    Age: 54,
    Visits: 129,
    Progress: 24,
    Status: 'Married',
  },
  {
    'First Name': 'Maria',
    'Last Name': 'Johnson',
    Age: 50,
    Visits: 387,
    Progress: 25,
    Status: 'Divorced',
  },
  {
    'First Name': 'Linda',
    'Last Name': 'Brown',
    Age: 41,
    Visits: 43,
    Progress: 66,
    Status: 'Single',
  },
  {
    'First Name': 'Robert',
    'Last Name': 'Williams',
    Age: 75,
    Visits: 105,
    Progress: 61,
    Status: 'Married',
  },
  {
    'First Name': 'Barbara',
    'Last Name': 'Martinez',
    Age: 72,
    Visits: 475,
    Progress: 6,
    Status: 'Widowed',
  },
  {
    'First Name': 'James',
    'Last Name': 'Smith',
    Age: 37,
    Visits: 174,
    Progress: 12,
    Status: 'Divorced',
  },
  {
    'First Name': 'Linda',
    'Last Name': 'Johnson',
    Age: 73,
    Visits: 300,
    Progress: 87,
    Status: 'Single',
  },
  {
    'First Name': 'Patricia',
    'Last Name': 'Garcia',
    Age: 45,
    Visits: 327,
    Progress: 95,
    Status: 'Married',
  },
  {
    'First Name': 'Alice',
    'Last Name': 'Williams',
    Age: 49,
    Visits: 236,
    Progress: 13,
    Status: 'Widowed',
  },
];

const columnConfigs: ColumnConfig[] = [
  {
    name: 'First Name',
    title: 'First Name',
    field: 'First Name',
    type: 'string',
    canSort: true,
    defaultSort: 'desc',
  },
  {
    name: 'Last Name',
    title: 'Last Name',
    field: 'Last Name',
    type: 'string',
    canSort: true,
    defaultSort: '',
  },
  {
    name: 'Age',
    title: 'Age',
    field: 'Age',
    type: 'string',
    canSort: false,
    defaultSort: '',
  },
  {
    name: 'Visits',
    title: 'Visits',
    field: 'Visits',
    type: 'string',
    canSort: false,
    defaultSort: '',
  },
  {
    name: 'Status',
    title: 'Status',
    field: 'Status',
    type: 'string',
    canSort: true,
    defaultSort: '',
  },
  {
    name: 'Progress',
    field: 'Progress',
    title: 'Progress',
    type: 'string',
    canSort: false,
    defaultSort: '',
  },
];
Basic.args = {
  tableData: data,
  columnConfigs,
  tableConfig: {
    name: 'Basic Table',
    showSearch: false,
    isRowSelectionEnabled: false,
    pagination: { visible: true, pageSize: 10, currentPage: 1 },
  },
  onRowSelect: fn(),
};

Search.args = {
  tableData: data,
  columnConfigs,
  tableConfig: {
    name: 'Search Table',
    isRowSelectionEnabled: false,
    pagination: { visible: true, currentPage: 1, pageSize: 10 },
    showSearch: true,
  },
  onRowSelect: fn(),
};
OnSelect.args = {
  tableData: data,
  columnConfigs,
  tableConfig: {
    name: 'Select Table',
    isRowSelectionEnabled: true,
    pagination: { visible: true, currentPage: 1, pageSize: 10 },
    showSearch: true,
  },
  onRowSelect: fn(),
};
