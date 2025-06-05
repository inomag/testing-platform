import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Text from './index';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = (args) => <Text {...args} />;
Default.args = {
  children: 'Default text',
};

export const Bold: Story = (args) => <Text {...args} />;
Bold.args = {
  children: 'Bold text',
  bold: true,
};

export const Italic: Story = (args) => <Text {...args} />;
Italic.args = {
  children: 'Italic text',
  italic: true,
};

export const Underline: Story = (args) => <Text {...args} />;
Underline.args = {
  children: 'Underlined text',
  underline: true,
};

export const Header: Story = (args) => <Text {...args} />;
Header.args = {
  children: 'Header text',
  type: 'h1',
};

export const Subheader: Story = (args) => <Text {...args} />;
Subheader.args = {
  children: 'Subheader text',
  type: 'h3',
};

export const Label: Story = (args) => <Text {...args} />;
Label.args = {
  children: 'Label text',
  type: 'label',
};

export const Link: Story = (args) => <Text {...args} />;
Link.args = {
  children: 'Link text',
  link: 'https://example.com',
};

export const Error: Story = (args) => <Text {...args} />;
Error.args = {
  children: 'Error text',
  variant: 'error',
};

export const Success: Story = (args) => <Text {...args} />;
Success.args = {
  children: 'Success text',
  variant: 'success',
};
