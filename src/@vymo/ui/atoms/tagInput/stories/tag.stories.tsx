import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Tag from '../tag';

const meta: Meta<typeof Tag> = {
  title: 'Atoms/TagInput/Tag',
  component: Tag,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Tag>;

export const Primary: Story = (args) => <Tag {...args} />;

Primary.args = {
  closable: true,
  children: ' TestTag',
};
