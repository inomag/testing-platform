import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CurrencyAndDecimalInput from './index';

const meta: Meta<typeof CurrencyAndDecimalInput> = {
  title: 'Components/CurrencyAndDecimalInput',
  component: CurrencyAndDecimalInput,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};
export default meta;
type Story = StoryObj<typeof CurrencyAndDecimalInput>;

export const Default: Story = (args) => {
  const [value, setValue] = useState(undefined);
  const handleOnChange = (
    updatedValue,
    event,
    additionalData,
    validValue,
    errors,
  ) => {
    setValue(updatedValue);
    console.log(
      'Changed:',
      updatedValue,
      event,
      additionalData,
      validValue,
      errors,
    );
  };
  return (
    <CurrencyAndDecimalInput
      {...args}
      value={value}
      onChange={handleOnChange}
    />
  );
};
Default.args = {
  value: undefined,
  onChange: (updatedValue, event, additionalData, validValue, errors) => {
    console.log(
      'Changed:',
      updatedValue,
      event,
      additionalData,
      validValue,
      errors,
    );
  },
  disabled: false,
  placeholder: 'Enter amount',
  minLength: 0,
  maxLength: 100,
  isCurrency: true,
  validations: [],
  hideValidation: false,
  'data-test-id': 'currency-decimal-input',
};

export const Disabled: Story = (args) => {
  const [value, setValue] = useState(undefined);
  const handleOnChange = (
    updatedValue,
    event,
    additionalData,
    validValue,
    errors,
  ) => {
    setValue(updatedValue);
    console.log(
      'Changed:',
      updatedValue,
      event,
      additionalData,
      validValue,
      errors,
    );
  };
  return (
    <CurrencyAndDecimalInput
      {...args}
      value={value}
      onChange={handleOnChange}
    />
  );
};
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const WithMinMaxValidation: Story = (args) => {
  const [value, setValue] = useState(undefined);
  const handleOnChange = (
    updatedValue,
    event,
    additionalData,
    validValue,
    errors,
  ) => {
    setValue(updatedValue);
    console.log(
      'Changed:',
      updatedValue,
      event,
      additionalData,
      validValue,
      errors,
    );
  };
  return (
    <CurrencyAndDecimalInput
      {...args}
      value={value}
      onChange={handleOnChange}
    />
  );
};
WithMinMaxValidation.args = {
  ...Default.args,
  minLength: 5,
  maxLength: 10,
};

export const DecimalInputWithValidations: Story = (args) => {
  const [value, setValue] = useState(undefined);
  const handleOnChange = (
    updatedValue,
    event,
    additionalData,
    validValue,
    errors,
  ) => {
    setValue(updatedValue);
    console.log(
      'Changed:',
      updatedValue,
      event,
      additionalData,
      validValue,
      errors,
    );
  };
  return (
    <CurrencyAndDecimalInput
      {...args}
      value={value}
      onChange={handleOnChange}
    />
  );
};
DecimalInputWithValidations.args = {
  ...Default.args,
  isCurrency: false,
  validations: [
    {
      regex: /^\d+(\.\d{1,2})?$/,
      errorMessage: 'Only up to 2 decimal places allowed',
    },
  ],
};
