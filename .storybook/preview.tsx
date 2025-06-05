import React from 'react';
import type { Preview } from '@storybook/react';
import 'src/designTokens/cssVariables.scss';
import 'src/designTokens/scssVariables.scss';
// @ts-ignore
import { initialiseTheme } from 'src/designTokens/themes';
import * as DocBlock from '@storybook/blocks';
import { getTheme } from '../src/designTokens/themes/utils';
import { withRootElement } from './decorators';
import './index.scss';

initialiseTheme();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    designToken: {
      disable: true,
      showSearch: false,
    },
    status: { type: 'stable' },
    docs: {
      toc: true,
    },
    tags: ['autodocs'],
  },
  decorators: [withRootElement],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: getTheme() || 'light',
  },
};

export default preview;
