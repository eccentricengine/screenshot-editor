import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'screenshot-editor',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
  globalStyle: 'src/global/app.css',
  extras: {
    enableImportInjection: true,
  },
  buildEs5: 'prod',
};

