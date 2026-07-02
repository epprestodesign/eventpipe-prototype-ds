// FOUNDATIONS / Palette — Tier-1 primitive hue ramps (--ds-palette-*)
import { ramps } from '../_tokens-data.js'

export default {
  title: 'Foundations/Palette',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
The **primitive color palette** (Tailwind-based) — the raw hue ramps every
semantic token is built from. Each family runs \`50 → 950\`. The **brand** is the
**Navy** ramp (anchored on #01113E); neutrals are the **Slate** ramp.

> **Don't use these directly in components.** They exist only to be referenced by
> the semantic tokens on **Foundations / Colors**. Use \`--ds-color-*\` instead.

Exposed as CSS custom properties, e.g. \`var(--ds-palette-blue-700)\`.
` } } },
}

// Darker steps need light text when the step number is shown on the swatch.
const RAMP = `
  <div class="column" style="gap:28px">
    <div v-for="fam in ramps" :key="fam.family">
      <div class="text-subtitle1 q-mb-sm">{{ fam.family }}</div>
      <div class="row" style="flex-wrap:wrap;gap:8px">
        <div v-for="s in fam.steps" :key="s.step" style="width:88px">
          <div :style="{ background: s.hex, height: '60px', borderRadius: '8px', border: '1px solid rgba(0,0,0,.12)' }"></div>
          <div class="text-caption q-mt-xs" style="font-weight:600">{{ s.step }}</div>
          <div style="font-family:monospace;font-size:10px;color:#6B6E76">{{ s.hex }}</div>
        </div>
      </div>
    </div>
  </div>`

/** Every hue family and step, with hex values. */
export const AllHues = {
  name: 'All hues',
  render: () => ({ setup: () => ({ ramps }), template: RAMP }),
}

/** A single ramp blown up — the Navy brand ramp (primary = Navy 900 / #01113E). */
export const BrandNavy = {
  name: 'Brand (Navy)',
  render: () => ({
    setup: () => ({ fam: ramps.find((r) => r.family === 'Navy') }),
    template: `
      <div class="row" style="flex-wrap:wrap;gap:10px">
        <div v-for="s in fam.steps" :key="s.step" style="width:120px">
          <div :style="{ background: s.hex, height: '88px', borderRadius: '10px', border: '1px solid rgba(0,0,0,.12)' }"></div>
          <div class="q-mt-xs" style="font-weight:600">Navy {{ s.step }}</div>
          <div style="font-family:monospace;font-size:11px;color:#71717A">{{ s.hex }}</div>
        </div>
      </div>`,
  }),
}
