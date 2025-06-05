import React from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import type { Meta, StoryObj } from '@storybook/react';
import Loader from './index';
import DotsLoader from './indicator/dots';

const meta: Meta<typeof Loader> = {
  title: 'Blocks/Loader',
  component: Loader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = (args) => <Loader {...args} />;
Default.args = {};

export const FullPage: Story = (args) => (
  <div>
    <Button type="outlined">Test</Button>
    <div>
      <Button>Test Primary</Button>
    </div>
    <Loader {...args} />
  </div>
);
FullPage.args = {
  fullPage: true,
};

export const ComponentLoader: Story = (args) => (
  <Loader {...args}>
    <Button>Loader will come after 2 second</Button>
  </Loader>
);
ComponentLoader.args = {
  delay: 2000,
};

// Dots Loader Stories
export const DotsIndicator: Story = (args) => (
  <Loader {...args} icon={<DotsLoader color="var(--brand-primary)" />} />
);
DotsIndicator.args = {};

export const DotsIndicatorCustomSize: Story = (args) => (
  <Loader
    {...args}
    icon={
      <DotsLoader height="40px" width="80px" color="var(--brand-primary)" />
    }
  />
);
DotsIndicatorCustomSize.args = {};

export const DotsIndicatorVariants: Story = (args) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <Loader {...args} icon={<DotsLoader color="var(--brand-primary)" />} />
    <Loader {...args} icon={<DotsLoader color="var(--text-status-error)" />} />
    <Loader
      {...args}
      icon={<DotsLoader color="var(--text-status-success)" />}
    />
  </div>
);
DotsIndicatorVariants.args = {};
