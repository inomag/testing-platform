import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from './index';
import { BreadcrumbProps } from './types';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Atoms/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const SimpleBreadcrumb: Story = (
  args: React.JSX.IntrinsicAttributes & BreadcrumbProps,
) => <Breadcrumb {...args} />;

const simpleBreadcrumbProps = {
  separator: '/',
  items: [
    {
      path: '/home',
      title: 'Home',
    },
    {
      path: '/products',
      title: 'Products',
    },
    {
      path: '/about',
      title: 'About',
      // eslint-disable-next-line no-console
      onHover: () => console.log('Hovered on About'),
    },
  ],
  className: 'custom-breadcrumb-class',
};

SimpleBreadcrumb.args = simpleBreadcrumbProps;

export const BreadcrumbWithDropdown: Story = (
  args: React.JSX.IntrinsicAttributes & BreadcrumbProps,
) => <Breadcrumb {...args} />;

const menuDropdownProps = {
  separator: '/',
  items: [
    {
      path: '/home',
      title: 'Home',
    },
    {
      path: '/products',
      title: 'Products',
    },
    {
      path: '/about',
      title: 'Menu item 1',
      menu: [
        { value: '1', label: 'Menu item 1' },
        { value: '2', label: 'Menu item 2' },
        { value: '3', label: 'Menu item 3' },
      ],
    },
  ],
  className: 'custom-breadcrumb-class',
};

BreadcrumbWithDropdown.args = menuDropdownProps;
