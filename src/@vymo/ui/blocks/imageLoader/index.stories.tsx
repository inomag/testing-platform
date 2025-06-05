import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ImageLoader from './index';

const meta: Meta<typeof ImageLoader> = {
  title: 'Blocks/Image Loader',
  component: ImageLoader,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;
type Story = StoryObj<typeof ImageLoader>;

export const Primary: Story = (args) => <ImageLoader {...args} />;
Primary.args = {
  src: 'https://picsum.photos/200/300',
  alt: 'image',
  height: 200,
  width: 400,
};
