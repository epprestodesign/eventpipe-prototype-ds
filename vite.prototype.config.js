// Vite config for the STANDALONE prototype app (prototype/). Separate from the
// root vite.config.js (which is load-bearing for Storybook). Dev serves at '/';
// production builds under the GitHub Pages sub-path and outputs INTO the Storybook
// artifact at storybook-static/prototype so it deploys alongside Storybook.
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const quasarVariables = fileURLToPath(
  new URL('./src/css/quasar.variables.scss', import.meta.url)
)

export default defineConfig(({ command }) => ({
  root: 'prototype',
  // GitHub Pages serves the repo Storybook at /eventpipe-prototype-ds/; the
  // prototype is injected at /eventpipe-prototype-ds/prototype/.
  base: command === 'build' ? '/eventpipe-prototype-ds/prototype/' : '/',
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: quasarVariables }),
  ],
  build: {
    outDir: fileURLToPath(new URL('./storybook-static/prototype', import.meta.url)),
    emptyOutDir: true,
  },
}))
