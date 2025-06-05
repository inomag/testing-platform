import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReactComponent as CheckIcon } from 'src/assets/icons/check.svg';
import Chip from '.';

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const ChipComponent: Story = (args) => <Chip {...args} />;

ChipComponent.args = {
  type: 'success',
  label: 'Validated',
  iconProps: { icon: <CheckIcon />, iconPosition: 'left' },
};
