import DsStack from '../../components/DsStack.vue'

/**
 * LAYOUT / Stack  →  Quasar: NONE (custom local wrapper: DsStack.vue)
 *
 * Quasar has no Stack component. DsStack is a thin flexbox primitive over
 * Quasar's flex utilities + a gap token, mirroring MUI's <Stack>.
 */
const meta = {
  title: 'Components/Layout & Structure/Stack',
  component: DsStack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
**Stack** lays out children in one direction (row or column) with consistent
spacing. There is no Quasar equivalent, so this is a **custom design-system
component** — \`src/components/DsStack.vue\` — built on flexbox + our spacing tokens.

## Props / usage notes
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| \`direction\` | \`'row' \\| 'column'\` | \`column\` | Main axis |
| \`gap\` | number \\| string | \`4\` | \`1–6\` map to \`--ds-space-N\`; otherwise raw CSS |
| \`align\` | string | \`stretch\` | \`align-items\` |
| \`justify\` | string | \`start\` | \`justify-content\` |
| \`wrap\` | boolean | \`false\` | Allow wrapping |
| \`inline\` | boolean | \`false\` | \`inline-flex\` instead of \`flex\` |

\`\`\`vue
<DsStack direction="row" gap="3" align="center">
  <q-btn ... /><q-btn ... />
</DsStack>
\`\`\`

## UX guidance
- Reach for Stack instead of hand-writing flex + margins — it keeps spacing tokenized.
- Use **Grid** (Quasar \`.row\`/\`.col-*\`) for 2-D responsive layouts; Stack is 1-D.
- Prefer \`gap\` 1–6 (token scale) over arbitrary pixel values.

## Do / Don't
- ✅ Use for button rows, form field columns, toolbars.
- ✅ Keep gap on the token scale for rhythm.
- ❌ Don't nest many Stacks where a Grid is clearer.
- ❌ Don't bypass the token scale with random px gaps.

## Quasar mapping
\`Stack → custom (DsStack.vue)\` over Quasar flex utilities. No native component.
`,
      },
    },
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    gap: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'space-between'] },
    wrap: { control: 'boolean' },
  },
  args: { direction: 'row', gap: 3, align: 'center', justify: 'start', wrap: false },
}
export default meta

const swatch = `
  <div class="bg-primary text-white flex flex-center" style="width:64px;height:64px;border-radius:8px">1</div>
  <div class="bg-secondary text-white flex flex-center" style="width:64px;height:64px;border-radius:8px">2</div>
  <div class="bg-accent text-white flex flex-center" style="width:64px;height:64px;border-radius:8px">3</div>
`

/** Basic example — bind the Controls to see direction/gap/alignment live. */
export const Basic = {
  render: (args) => ({
    components: { DsStack },
    setup: () => ({ args }),
    template: `<ds-stack v-bind="args">${swatch}</ds-stack>`,
  }),
}

/** Common states: row vs column. */
export const Directions = {
  render: () => ({
    components: { DsStack },
    template: `
      <div class="q-gutter-lg">
        <div><div class="text-caption q-mb-xs">direction="row"</div>
          <ds-stack direction="row" gap="3">${swatch}</ds-stack></div>
        <div><div class="text-caption q-mb-xs">direction="column"</div>
          <ds-stack direction="column" gap="2">${swatch}</ds-stack></div>
      </div>`,
  }),
}

/** Variants: gap scale 1–6. */
export const GapScale = {
  render: () => ({
    components: { DsStack },
    setup: () => ({ gaps: [1, 2, 3, 4, 5, 6] }),
    template: `
      <div class="column q-gutter-md">
        <div v-for="g in gaps" :key="g">
          <div class="text-caption q-mb-xs">gap="{{ g }}"</div>
          <ds-stack direction="row" :gap="g">${swatch}</ds-stack>
        </div>
      </div>`,
  }),
}
