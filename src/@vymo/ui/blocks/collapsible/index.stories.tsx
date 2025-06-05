import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Collapsible from '.';

const meta: Meta<typeof Collapsible> = {
  title: 'Blocks/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const CollapsibleComponent: Story = (args) => (
  <Collapsible {...args}>Lorem Ipsum</Collapsible>
);

CollapsibleComponent.args = {
  title: 'Title of the component',
  description: 'Description goes here',
  open: false,
};
