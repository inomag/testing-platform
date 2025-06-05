import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Card from '.';

const meta: Meta<typeof Card> = {
  title: 'Blocks/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const DefaultCard: Story = (args) => (
  <Card {...args}>
    <div>Card content</div>
  </Card>
);
DefaultCard.args = {
  hasError: false,
  classNames: 'custom-class-name',
};

export const ErrorCard: Story = (args) => (
  <Card {...args}>
    <div>Card content</div>
  </Card>
);

ErrorCard.args = {
  hasError: true,
  classNames: 'custom-class-name',
};
