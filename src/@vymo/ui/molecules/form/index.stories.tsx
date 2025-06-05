import React, { useState } from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import { Meta, StoryObj } from '@storybook/react';
import FormItem from './formItem/index';
import Form from './index';

const meta: Meta<typeof Form> = {
  title: 'Molecules/Form',
  component: Form,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = (args) => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
  });
  const onFormChange = (data) => {
    let updatedFormData = { ...formData };
    Object.keys(data).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(data[key], 'value')) {
        updatedFormData = {
          ...updatedFormData,
          [key]: data[key].value,
        };
      }
    });
    setFormData(updatedFormData);
  };

  return (
    <Form {...args} onChange={onFormChange}>
      <FormItem label="First Name" code="firstName">
        <Input key="firstName" id="form-input" value={formData.firstName} />
      </FormItem>
      <FormItem label="Last Name" code="lastName">
        <Input key="lastName" id="form-input" value={formData.lastName} />
      </FormItem>
    </Form>
  );
};
Default.args = {
  id: 'testForm',
  name: 'testForm',
};

export const Validations: Story = (args) => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
  });
  const onFormChange = (data) => {
    let updatedFormData = { ...formData };
    Object.keys(data).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(data[key], 'value')) {
        updatedFormData = {
          ...updatedFormData,
          [key]: data[key].value,
        };
      }
    });
    setFormData(updatedFormData);
  };

  return (
    <Form {...args} onChange={onFormChange}>
      <FormItem
        label="First Name"
        code="firstName"
        validations={[
          { regex: /^[a-zA-Z]+$/, errorMessage: 'Only letters are allowed' },
        ]}
      >
        <Input key="firstName" id="form-input" value={formData.firstName} />
      </FormItem>
      <FormItem
        label="Last Name"
        code="lastName"
        validations={[
          { regex: /^[a-zA-Z]+$/, errorMessage: 'Only letters are allowed' },
        ]}
      >
        <Input key="lastName" id="form-input" value={formData.lastName} />
      </FormItem>
    </Form>
  );
};
Validations.args = {
  id: 'testForm',
  name: 'testForm',
};
