/** LAYOUT / Box → custom DsBox (no Quasar equivalent) */
import DsBox from '../../components/DsBox.vue'
export default {
  title: 'Components/Layout & Structure/Box',
  component: DsBox,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
The lowest-level layout primitive — a styled \`div\` that consumes spacing,
radius, and elevation tokens. Quasar has no Box, so this is \`DsBox.vue\`.

## When to use
- A quick token-driven container without semantic meaning.

## When not to use
- A content card with sections → \`QCard\`. Centered page width → **Container**.

## Quasar mapping
\`Box → custom (DsBox)\` over tokens.
` } } },
  argTypes: {
    padding: { control: 'select', options: [1,2,3,4,5,6] },
    radius: { control: 'select', options: ['sm','md','lg','pill'] },
    elevation: { control: 'select', options: [0,1,2,3,4] },
    bg: { control: 'select', options: ['','primary','secondary','accent'] },
    bordered: { control: 'boolean' },
  },
  args: { padding: 4, radius: 'md', elevation: 2, bg: '', bordered: false },
}
export const Basic = {
  render: (args) => ({ components: { DsBox }, setup: () => ({ args }), template: `<ds-box v-bind="args" style="max-width:280px">Token-driven box</ds-box>` }),
}
export const Elevations = {
  render: () => ({ components: { DsBox }, setup: () => ({ levels: [0,1,2,3,4] }), template: `
    <div class="row q-gutter-lg">
      <ds-box v-for="l in levels" :key="l" :elevation="l" radius="lg" bg="" style="width:90px;height:70px" class="bg-white flex flex-center">{{ l }}</ds-box>
    </div>` }),
}
