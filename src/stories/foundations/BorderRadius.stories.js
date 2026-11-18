/**
 * FOUNDATIONS / Border Radius
 * Tokens: --ds-radius-sm/md/lg/pill (tokens.scss). $generic-border-radius and
 * $button-border-radius (quasar.variables.scss) drive Quasar components.
 */
const meta = {
  id: 'foundations-border-radius', title: 'Design System/Foundations/Border Radius',
  // The Docs page is the hand-written MDX beside this file, not autodocs.
  tags: [],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
Corner radius signals softness and grouping. Keep it on a small token scale.

| Token | px | Use |
| --- | --- | --- |
| \`--ds-radius-sm\` | 6 | inputs, small chips |
| \`--ds-radius-md\` | 10 | buttons, fields, menus |
| \`--ds-radius-lg\` | 16 | cards, sheets, dialogs |
| \`--ds-radius-pill\` | 999 | pills, avatars, FABs |

Quasar's global radius comes from \`$generic-border-radius\` (set in
\`quasar.variables.scss\`); override per-component in \`app.scss\`.
`,
      },
    },
  },
}
export default meta

export const Scale = {
  render: () => ({
    setup: () => ({ radii: ['sm', 'md', 'lg', 'pill'] }),
    template: `
      <div class="row q-gutter-lg">
        <div v-for="r in radii" :key="r" class="column items-center q-gutter-xs">
          <div class="bg-primary" :style="{ width: '88px', height: '88px', borderRadius: 'var(--ds-radius-' + r + ')' }"></div>
          <div class="text-caption">--ds-radius-{{ r }}</div>
        </div>
      </div>`,
  }),
}
