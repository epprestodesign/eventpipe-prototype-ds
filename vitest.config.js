import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

/** Unit tests for the pure logic behind the design requests.
 *
 *  Deliberately narrow: this repo is prototypes, and mounting Quasar screens in
 *  jsdom would test the framework more than the design. What IS worth testing
 *  is the handful of pure functions that encode a ticket's acceptance criteria —
 *  fee maths, interval validation, the conflict trigger. Those are the places a
 *  silent change would make a prototype quietly lie about the spec.
 *
 *  Whole-screen behaviour is covered by `pnpm test:stories`, which renders every
 *  story in a real browser.
 */
export default defineConfig({
  // The modules under test sit alongside .vue imports (a shell component, DS
  // components), so the Vue plugin has to be present even though no component
  // is mounted — otherwise the import graph fails to parse.
  plugins: [vue()],
  test: {
    include: ['src/**/__tests__/**/*.test.js'],
    environment: 'node',
    reporters: 'dot',
  },
})
