// FOUNDATIONS / Colors — Tier-2 semantic color tokens (--ds-color-*)
import { semanticGroups } from './_tokens-data.js'

export default {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
The **semantic color tokens** (Tailwind-based, light theme) — the roles
components actually use. Each token references a primitive from
**Foundations / Palette** (shown as the grey chip) and carries usage guidance.

Use via CSS custom properties (\`var(--ds-color-background-brand-bold)\`) or the
generated helpers (\`.bg-ds-brand-bold\`, \`.text-ds-subtle\`, \`.border-ds-bold\`).
Quasar components are bridged through brand vars (\`$primary\` = Navy 900 / #01113E, etc.).
The **brand is Navy** (neutrals are Slate); status uses Red / Yellow / Green; links are Navy.
` } } },
}

const TABLE = `
  <div class="column" style="gap:28px">
    <div v-for="(tokens, group) in groups" :key="group">
      <div class="text-subtitle1 q-mb-sm">{{ group }}</div>
      <div class="column" style="gap:8px">
        <div v-for="t in tokens" :key="t.name" class="row items-center no-wrap" style="gap:14px">
          <div :style="{ background: t.hex, width: '40px', height: '40px', borderRadius: '8px', border: '1px solid rgba(0,0,0,.15)', flex: '0 0 auto' }"></div>
          <div style="min-width:280px">
            <div style="font-family:monospace;font-size:12px">{{ t.name }}</div>
            <div class="text-caption" style="color:#6B6E76;max-width:380px">{{ t.desc }}</div>
          </div>
          <div style="font-family:monospace;font-size:12px;min-width:90px">{{ t.hex }}</div>
          <q-badge v-if="t.primitive" outline color="grey-7" :label="t.primitive" />
        </div>
      </div>
    </div>
  </div>`

/** Semantic roles grouped by purpose, with hex + the primitive each maps to. */
export const Roles = {
  render: () => ({ setup: () => ({ groups: semanticGroups }), template: TABLE }),
}
