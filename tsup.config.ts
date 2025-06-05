import { defineConfig } from 'tsup';
import svgr from 'esbuild-plugin-svgr';
import { sassPlugin } from 'esbuild-sass-plugin';

// https://github.com/kazijawad/esbuild-plugin-svgr/issues/1

const isDebug = process.env.debug === 'true';

function reactRC(asName = 'ReactComponent') {
  return (code, config, info) =>
    `${code.replace(
      /import(.*?)from "react";/,
    )} import React from "react"; export const ${asName} = ${
      info.componentName
    }`;
}

export default defineConfig({
  esbuildPlugins: [
    // @ts-ignore
    svgr({
      prettier: false,
      svgo: false,
      svgoConfig: {
        plugins: [{ removeViewBox: false }],
      },
      titleProp: true,
      plugins: ['@svgr/plugin-jsx', reactRC()],
    }),
    // @ts-ignore
    sassPlugin({
      filter: /\.scss$/,
      type: 'local-css',
      includePaths: [''],
    }),
  ],
  entry: [
    'src/@vymo/ui/atoms/index.ts',
    'src/@vymo/ui/blocks/index.ts',
    'src/@vymo/ui/molecules/index.ts',
    'src/@vymo/ui/components/index.ts',
  ],
  format: ['esm'], // Build for ESmodules
  dts: true, // types definitions
  splitting: !isDebug,
  sourcemap: true,
  minify: false,
  clean: true,
  target: isDebug ? 'es2020' : 'es5',
  loader: {
    '.scss': 'local-css',
    '.svg': 'tsx',
  },
  treeshake: true,
});
