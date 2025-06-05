import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './index';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const ImageUrl: Story = (args) => <Avatar {...args} />;
ImageUrl.args = {
  imageUrl: 'https://www.w3schools.com/howto/img_avatar.png',
  text: 'Vymo',
  shape: 'circle',
};

export const Text: Story = (args) => <Avatar {...args} />;
Text.args = {
  text: 'V',
  shape: 'circle',
};

export const Background: Story = (args) => <Avatar {...args} />;
Background.args = {
  text: 'V',
  shape: 'circle',
  background: '#FF00FF',
};

export const Size: Story = (args) => <Avatar {...args} />;
Size.args = {
  text: 'V',
  shape: 'circle',
  size: 'large',
};

export const Square: Story = (args) => <Avatar {...args} />;
Square.args = {
  text: 'V',
  shape: 'square',
};
