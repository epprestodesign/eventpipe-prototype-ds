import { useQuasar } from 'quasar'
import { computed } from 'vue'

/**
 * FOUNDATIONS / Breakpoints
 * Quasar provides the breakpoint system + $q.screen reactive helper.
 * Critical for spanning mobile booking app, desktop web, and lobby kiosks.
 */
const meta = {
  title: 'Foundations/Breakpoints',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
One breakpoint system across every Presto Stays surface. Quasar's reactive
\`$q.screen\` drives responsive logic in JS; \`*-<bp>-*\` classes handle layout.

| Name | Range (px) | Target surface |
| --- | --- | --- |
| \`xs\` | 0–599 | phones (mobile booking app) |
| \`sm\` | 600–1023 | large phones / small tablets |
| \`md\` | 1024–1439 | tablets, search results |
| \`lg\` | 1440–1919 | desktop web, host dashboards |
| \`xl\` | 1920+ | lobby check-in kiosks, large displays |

## How to use
\`\`\`js
import { useQuasar } from 'quasar'
const $q = useQuasar()
$q.screen.lt.md   // true below 1024
$q.screen.gt.sm   // true above 1023
$q.screen.name    // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
\`\`\`
Grid classes: \`col-12 col-md-6 col-lg-4\`. Visibility: \`gt-sm\`, \`lt-md\`, \`xs-only\`.
`,
      },
    },
  },
}
export default meta

/** Live readout — resize the canvas to watch it change. */
export const LiveScreen = {
  render: () => ({
    setup() {
      const $q = useQuasar()
      const rows = computed(() => [
        ['screen.name', $q.screen.name],
        ['lt.md (<1024)', String($q.screen.lt.md)],
        ['gt.sm (>1023)', String($q.screen.gt.sm)],
        ['width', $q.screen.width + 'px'],
      ])
      return { rows }
    },
    template: `
      <q-markup-table flat bordered style="max-width:360px;border-radius:12px;overflow:hidden">
        <tbody>
          <tr v-for="[k,v] in rows" :key="k"><td class="text-grey-8">{{ k }}</td><td class="text-weight-medium">{{ v }}</td></tr>
        </tbody>
      </q-markup-table>`,
  }),
}
