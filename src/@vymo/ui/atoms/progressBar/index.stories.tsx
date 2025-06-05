import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './index';
import { Type } from './types';

const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

/**
 * 
 * 1. Line

Description: Displays a basic linear progress bar.

Usage: Ideal for straightforward progress tracking.

Props: value: 60

 */
export const Line: Story = (args) => <ProgressBar {...args} />;
Line.args = {
  value: 60,
};

/**
 * 
 * 2. Line with Steps

Description: Demonstrates a linear progress bar divided into discrete steps.

Usage: Useful for scenarios where progress is measured in stages rather than continuously.

Props: value: 60, steps: 4

 *  
 */
export const LineWithSteps: Story = (args) => <ProgressBar {...args} />;
LineWithSteps.args = {
  value: 60,
  steps: 4,
};

/**
 * 
 * 3. Circle

Description: Displays a circular progress bar.

Usage: Suitable for aesthetic preferences or spatial constraints that favor a circular indicator.

Props: value: 60, type: Type.Circle
 * 
 */
export const Circle: Story = (args) => <ProgressBar {...args} />;
Circle.args = {
  value: 60,
  type: Type.Circle,
};

/**
 * 
 * 4. Circle with Steps

Description: Shows a circular progress bar segmented into steps.

Usage: Ideal for visualizing progress in defined increments in a circular format.

Props: value: 60, steps: 4, type: Type.Circle

 * 
 */
export const CircleWithSteps: Story = (args) => <ProgressBar {...args} />;
CircleWithSteps.args = {
  value: 60,
  steps: 4,
  type: Type.Circle,
};
