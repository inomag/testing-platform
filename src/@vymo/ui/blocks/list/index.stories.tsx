import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import List from './index';

const meta: Meta<typeof List> = {
  title: 'Blocks/List',
  component: List,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;
type Story = StoryObj<typeof List>;

export const Primary: Story = (args) => (
  <List {...args}>
    <List.Item>Test data 1</List.Item>
    <List.Item>Test data 2</List.Item>
    <List.Item>Test data 3</List.Item>
  </List>
);
Primary.args = {
  onItemClick: () => {},
};
export const SelectedListItem: Story = (args) => (
  <List {...args}>
    <List.Item>Test data 1</List.Item>
    <List.Item>Test data 2</List.Item>
    <List.Item>Test data 3</List.Item>
  </List>
);
SelectedListItem.args = {
  onItemClick: () => {},
  selectedIndex: 1,
  showSelected: true,
};
