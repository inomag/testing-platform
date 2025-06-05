import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TabLayout from './index';

const meta: Meta<typeof TabLayout> = {
  title: 'Atoms/Tab Layout',
  component: TabLayout,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TabLayout>;

export const Primary: Story = (args) => <TabLayout {...args} />;
Primary.args = {
  items: [
    {
      key: '1',
      label: 'Tab 1',
      children: <div data-test-id="tab-1-content">Tab 1 Content</div>,
    },
    {
      key: '2',
      label: 'Tab 2',
      children: <div data-test-id="tab-2-content">Tab 2 Content</div>,
    },
  ],
  defaultKey: '1',
};
