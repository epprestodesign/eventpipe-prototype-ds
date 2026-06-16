import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { quasar } from '@quasar/vite-plugin'

const quasarVariables = fileURLToPath(
  new URL('../src/css/quasar.variables.scss', import.meta.url)
)

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-themes', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {},
  async viteFinal(baseConfig) {
    // Note: @storybook/vue3-vite already provides the @vitejs/plugin-vue
    // ('vite:vue') plugin. We must NOT add a second one — a duplicate Vue
    // plugin breaks .vue SFC compilation. Quasar's plugin auto-detects the
    // existing Vue plugin and slots in after it.
    return mergeConfig(baseConfig, {
      plugins: [quasar({ sassVariables: quasarVariables })],
    })
  },
}

export default config
