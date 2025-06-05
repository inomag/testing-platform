import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
    'storybook-design-token',
    '@storybook/addon-a11y',
    '@etchteam/storybook-addon-status',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        src: path.join(__dirname, '../src'),
      };
    }

    config.optimization = {
      ...config.optimization,
      sideEffects: true,
    };

    return config;
  },

  docs: {},

  env: (config) => ({
    ...config,
  }),

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
export default config;
