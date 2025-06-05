/* eslint-disable */
import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import defaultConfig from 'src/mock/data/inputFields/default.json';
import fieldsWithFormula from 'src/mock/data/inputFields/fieldsWithFormula.json';
import grouping from 'src/mock/data/inputFields/grouping.json';
import vymoSpecificConfig from 'src/mock/data/inputFields/vymoSpecificFields.json';
import Form from '../..';
import { FormVersion } from '../../types';

const meta: Meta<typeof Form> = {
  title: 'Components/Form/VymoFieldsConfig',
  component: Form,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
Default.args = {
  // @ts-ignore
  config: {
    version: FormVersion.web,
    data: defaultConfig,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};

export const BaseLevelFields: Story = (args) => {
  const [formData, setFormData] = useState({});

  return <Form {...args} onChange={setFormData} />;
};
BaseLevelFields.args = {
  config: { version: FormVersion.web, data: defaultConfig, grouping },
  id: 'testForm',
  name: 'testForm',
  key: 'defaultForm',
};

export const VymoSpecificTypes: Story = (args) => {
  const [formData, setFormData] = useState({});
  return <Form {...args} onChange={setFormData} />;
};
VymoSpecificTypes.args = {
  config: {
    version: FormVersion.web,
    data: vymoSpecificConfig,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'vymoSpecificForm',
};

export const FormulaFrameworkTypes: Story = (args) => {
  const [formData, setFormData] = useState({});
  return <Form {...args} onChange={setFormData} />;
};
FormulaFrameworkTypes.args = {
  config: {
    version: FormVersion.web,
    data: fieldsWithFormula,
    grouping: [],
    fieldItemConfig: { showDisabledIcon: true },
  },
  formulaContext: {
    data: {
      session: {
        name: 'Vymo Superuser',
        attributes: {
          name: 'Session Context for FF',
          address__0rtm11oao: 'test test',
        },
        region_hierarchy: ['all'],
        language: '',
      },
    },
  },
  id: 'testForm',
  name: 'testForm',
  key: 'vymoSpecificForm',
};
