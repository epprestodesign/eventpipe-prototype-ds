/**
 * FOUNDATIONS / Spacing
 * Tokens: --ds-space-1..6 (tokens.scss). Quasar spacing classes map to
 * xs=4 sm=8 md=16 lg=24 xl=48. Use tokens in CSS, classes in templates.
 */
const meta = {
  id: 'foundations-spacing', title: 'Design System/Foundations/Spacing',
  // The Docs page is the hand-written MDX beside this file, not autodocs.
  tags: [],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
A single spacing scale keeps rhythm consistent across the mobile booking app,
desktop web, kiosk, and host admin surfaces. Use the **token scale**
(\`--ds-space-1..6\`) in custom CSS and
**Quasar spacing classes** (\`q-pa-*\`, \`q-ma-*\`, \`q-gutter-*\`) in templates.

| Token | px | Quasar class size | Typical use |
| --- | --- | --- | --- |
| \`--ds-space-1\` | 4 | \`xs\` | icon gaps, dense chips |
| \`--ds-space-2\` | 8 | \`sm\` | inline element gaps |
| \`--ds-space-3\` | 12 | — | compact stacks |
| \`--ds-space-4\` | 16 | \`md\` | default padding |
| \`--ds-space-5\` | 24 | \`lg\` | section padding |
| \`--ds-space-6\` | 32 | — | large section gaps |

> Quasar's \`xl\` = 48px. Add \`--ds-space-7: 48px\` if you need it as a token.

## How it's implemented
Defined as CSS custom properties in \`src/css/tokens.scss\`; consumed by
\`DsStack\`, component overrides, and directly in styles.
`,
      },
    },
  },
}
export default meta

export const Scale = {
  render: () => ({
    setup: () => ({ steps: [1, 2, 3, 4, 5, 6] }),
    template: `
      <div class="column q-gutter-sm">
        <div v-for="s in steps" :key="s" class="row items-center q-gutter-md">
          <div class="text-caption" style="width:120px">--ds-space-{{ s }}</div>
          <div class="bg-primary" :style="{ height: '16px', width: 'var(--ds-space-' + s + ')', borderRadius: '4px' }"></div>
        </div>
      </div>`,
  }),
}
