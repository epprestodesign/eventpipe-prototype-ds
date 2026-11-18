import { ref } from 'vue'

/**
 * FOUNDATIONS / Motion
 * Tokens: --ds-duration-* and --ds-ease-* (tokens.scss). Quasar ships
 * transition props (transition-show / transition-hide) on overlays.
 */
const meta = {
  id: 'foundations-motion', title: 'Design System/Foundations/Motion',
  // The Docs page is the hand-written MDX beside this file, not autodocs.
  tags: [],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
Motion should be quick and purposeful — especially on mobile booking and lobby
kiosks where speed matters. Use the duration + easing tokens; don't hand-pick
timings per feature.

| Duration | ms | Use |
| --- | --- | --- |
| \`--ds-duration-instant\` | 80 | hover, ripple |
| \`--ds-duration-fast\` | 150 | toggles, small reveals |
| \`--ds-duration-base\` | 240 | menus, dialogs, tabs |
| \`--ds-duration-slow\` | 400 | drawers, full-screen |

| Easing | Curve | Use |
| --- | --- | --- |
| \`--ds-ease-standard\` | (0.2,0,0,1) | most transitions |
| \`--ds-ease-emphasized\` | overshoot | playful confirmations |
| \`--ds-ease-decelerate\` | enter | elements entering |
| \`--ds-ease-accelerate\` | exit | elements leaving |

Quasar overlays accept named transitions: \`transition-show="jump-up"\`,
\`transition-hide="fade"\`, etc. Respect \`prefers-reduced-motion\`.
`,
      },
    },
  },
}
export default meta

export const Durations = {
  render: () => ({
    setup: () => ({ on: ref(true) }),
    template: `
      <div class="column q-gutter-md">
        <q-btn color="primary" :label="on ? 'Animate out' : 'Animate in'" @click="on = !on" style="width:160px" />
        <div class="row q-gutter-lg">
          <div v-for="d in ['fast','base','slow']" :key="d" class="column items-center q-gutter-xs">
            <div class="bg-primary"
              :style="{ width:'56px', height:'56px', borderRadius:'12px',
                        opacity: on ? 1 : 0.15,
                        transform: on ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'all var(--ds-duration-' + d + ') var(--ds-ease-standard)' }"></div>
            <div class="text-caption">{{ d }}</div>
          </div>
        </div>
      </div>`,
  }),
}
