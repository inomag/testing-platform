import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import PhoneLegacy from './index';

const meta: Meta<typeof PhoneLegacy> = {
  title: 'Components/Phone',
  component: PhoneLegacy,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PhoneLegacy>;

export const PhoneComponent: Story = (args) => {
  const [value, setValue] = useState('9234344333');
  return (
    <PhoneLegacy
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
      {...args}
    />
  );
};

PhoneComponent.args = {
  label: 'Primary Phone Number',
  placeholder: 'Enter 10 digit phone number',
  defaultCountryCode: 'IN',
  readOnly: false,
  countries: ['US', 'IN'],
  showCountrySelect: true,
  locale: 'en',
};
