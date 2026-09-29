// Vite config for the standalone EP PAY prototype (prototype-eppay/).
//
// Mirrors vite.prototype.config.js: dev serves at '/', production builds under
// the GitHub Pages sub-path and outputs INTO the Storybook artifact so it
// deploys alongside it. Kept as a second config rather than folded into the
// first because the two prototypes are different products with different
// entry points, and one bundle serving both would couple their release cycles.
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const quasarVariables = fileURLToPath(
  new URL('./src/css/quasar.variables.scss', import.meta.url)
)

export default defineConfig(({ command }) => ({
  root: 'prototype-eppay',
  resolve: {
    alias: {
      // The screens are Storybook stories, and a story is a runtime-compiled
      // `template` string. Vite resolves `vue` to the RUNTIME-ONLY build, which
      // cannot compile those — it renders nothing and only warns, so the app
      // comes up with its chrome and no screen inside it. Point at the bundler
      // build, which ships the compiler.
      vue: 'vue/dist/vue.esm-bundler.js',
      // Keep the evaluation-licensed `shaders` package out of the hosted build.
      'shaders/vue': fileURLToPath(new URL('./prototype-eppay/shaders-stub.js', import.meta.url)),
    },
  },
  envDir: fileURLToPath(new URL('.', import.meta.url)),
  // Storybook is served at /eventpipe-prototype-ds/; EP Pay is injected at
  // /eventpipe-prototype-ds/ep-pay/.
  base: command === 'build' ? '/eventpipe-prototype-ds/ep-pay/' : '/',
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: quasarVariables }),
  ],
  build: {
    outDir: fileURLToPath(new URL('./storybook-static/ep-pay', import.meta.url)),
    emptyOutDir: true,
  },
}))
