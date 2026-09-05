import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { quasar } from '@quasar/vite-plugin'
import remarkGfm from 'remark-gfm'

const quasarVariables = fileURLToPath(
  new URL('../src/css/quasar.variables.scss', import.meta.url)
)

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-themes',
    {
      // MDX ships without GFM, so every markdown TABLE in a .mdx file rendered
      // as raw `| --- |` pipes — the Getting Started pages and every design
      // request's coverage doc included. remark-gfm restores tables (plus
      // strikethrough, task lists and autolinks). Docblock markdown inside
      // .stories.js was never affected; Storybook renders that separately.
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
  ],
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
