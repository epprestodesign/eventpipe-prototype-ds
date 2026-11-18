/**
 * FOUNDATIONS / Elevation
 * Tokens: --ds-shadow-1..4 (tokens.scss). Quasar also ships .shadow-1..24.
 * Prefer the 4-step DS token scale for consistency; Quasar's 24 steps are
 * available for edge cases.
 */
const meta = {
  id: 'foundations-elevation', title: 'Design System/Foundations/Elevation',
  // The Docs page is the hand-written MDX beside this file, not autodocs.
  tags: [],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
Elevation conveys layering and focus. A short, intentional scale reads better
than 24 arbitrary steps. Map surfaces to a level and stick to it.

| Token | Use |
| --- | --- |
| \`--ds-shadow-1\` | resting cards, list rows |
| \`--ds-shadow-2\` | raised cards, menus, popovers |
| \`--ds-shadow-3\` | dialogs, drawers |
| \`--ds-shadow-4\` | modals over content, kiosk focus |

Quasar fallback classes: \`.shadow-1\` … \`.shadow-24\`, \`.shadow-up-*\`, \`.no-shadow\`.
`,
      },
    },
  },
}
export default meta

export const Scale = {
  render: () => ({
    setup: () => ({ levels: [1, 2, 3, 4] }),
    template: `
      <div class="row q-gutter-xl q-pa-md">
        <div v-for="l in levels" :key="l" class="column items-center q-gutter-sm">
          <div class="bg-white flex flex-center"
               :style="{ width: '120px', height: '88px', borderRadius: '12px', boxShadow: 'var(--ds-shadow-' + l + ')' }">
            Level {{ l }}
          </div>
          <div class="text-caption">--ds-shadow-{{ l }}</div>
        </div>
      </div>`,
  }),
}
