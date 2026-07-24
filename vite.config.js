import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const quasarVariables = fileURLToPath(
  new URL('./src/css/quasar.variables.scss', import.meta.url)
)

// Root Vite config — LOAD-BEARING for Storybook. @storybook/vue3-vite
// auto-detects and merges this as the base config for its build (the
// `baseConfig` passed to viteFinal in .storybook/main.js). It supplies the
// @vitejs/plugin-vue instance that Quasar's plugin must slot in AFTER —
// without it, `build-storybook` fails ("add the Quasar plugin after the Vue
// one"). Do not delete. (There is no standalone app entry / index.html.)
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: quasarVariables }),
  ],
})
