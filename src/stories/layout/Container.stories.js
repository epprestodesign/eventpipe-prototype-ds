/** LAYOUT / Container → custom DsContainer (no Quasar equivalent) */
import DsContainer from '../../components/DsContainer.vue'
export default {
  title: 'Components/Layout & Structure/Container',
  component: DsContainer,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Centers content with a max-width per breakpoint — the page-width wrapper.
Quasar's QPage requires QLayout, so this standalone \`DsContainer\` fills the gap.

## When to use
- Constraining page content width on dashboards and admin views.

## Quasar mapping
\`Container → custom (DsContainer)\`. Sizes: sm 640 · md 960 · lg 1280 · xl 1536 · full.
` } } },
  argTypes: { size: { control: 'select', options: ['sm','md','lg','xl','full'] } },
  args: { size: 'md' },
}
export const Basic = {
  render: (args) => ({ components: { DsContainer }, setup: () => ({ args }), template: `
    <ds-container v-bind="args">
      <div class="bg-grey-2 q-pa-md rounded-borders text-center">Centered, max-width = {{ args.size }}</div>
    </ds-container>` }),
}
