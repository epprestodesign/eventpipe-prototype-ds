import { QChip } from 'quasar'
import { ref } from 'vue'

/**
 * DATA DISPLAY / Chip  →  Quasar: QChip  (direct usage)
 */
const meta = {
  title: 'Components/Typography & Content/Chip',
  component: QChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
**Chip** is a compact element representing an input, attribute, filter, or
entity (a person, tag, or selection). Maps directly to Quasar **QChip**.

## Props / usage notes
| Prop | Notes |
| --- | --- |
| \`color\` / \`text-color\` | Brand tokens |
| \`icon\` / \`icon-right\` | Leading / trailing icon |
| \`removable\` | Shows an × and emits \`@remove\` |
| \`outline\` | Low-emphasis style |
| \`clickable\` | Adds hover/ripple + \`@click\` |
| \`selected\` | Two-way \`v-model:selected\` for filter chips |
| \`size\` / \`dense\` | Sizing |

Place a \`QAvatar\` in the default slot for an avatar chip.

## UX guidance
- Use chips for **multiple, removable values** (tags, recipients, filters).
- Keep labels to 1–2 words; truncate long values.
- Make chips \`removable\` only when removal is meaningful and reversible.
- For single-choice from a small set, prefer **Toggle Button** or **Radio Group** instead.

## Do / Don't
- ✅ Use \`removable\` for user-added tags.
- ✅ Use semantic colors for status chips (positive/negative/warning).
- ❌ Don't use chips as primary navigation.
- ❌ Don't pack a sentence into a chip.

## Quasar mapping
\`Chip → QChip\` (direct). No wrapper needed.
`,
      },
    },
  },
}
export default meta

/** Basic example. */
export const Basic = {
  render: () => ({
    template: `<q-chip color="primary" text-color="white">Label</q-chip>`,
  }),
}

/** Common states / configurations. */
export const States = {
  render: () => ({
    setup: () => ({ show: ref(true), selected: ref(true) }),
    template: `
      <div class="q-gutter-sm row items-center">
        <q-chip color="primary" text-color="white">Default</q-chip>
        <q-chip outline color="primary">Outline</q-chip>
        <q-chip clickable color="secondary" text-color="white">Clickable</q-chip>
        <q-chip v-if="show" removable color="accent" text-color="white" @remove="show=false">Removable</q-chip>
        <q-chip v-model:selected="selected" color="primary" text-color="white">Selectable</q-chip>
      </div>`,
  }),
}

/** Variants: with icon, with avatar, status chips. */
export const Variants = {
  render: () => ({
    template: `
      <div class="q-gutter-sm row items-center">
        <q-chip icon="event" color="primary" text-color="white">With icon</q-chip>
        <q-chip>
          <q-avatar color="primary" text-color="white">A</q-avatar>
          Avatar chip
        </q-chip>
        <q-chip dense color="positive" text-color="white">Active</q-chip>
        <q-chip dense color="warning" text-color="white">Away</q-chip>
        <q-chip dense color="negative" text-color="white">Busy</q-chip>
      </div>`,
  }),
}
