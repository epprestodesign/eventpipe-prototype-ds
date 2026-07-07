// LAYOUT / Card — the standard surface card used across the app.
import DsCard from '../../components/DsCard.vue'

export default {
  title: 'Components/Layout & Structure/Card',
  component: DsCard,
  tags: ['autodocs'],
  argTypes: {
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    radius: { control: 'inline-radio', options: ['md', 'lg'] },
    interactive: { control: 'boolean' },
  },
  args: { padding: 'md', radius: 'lg', interactive: false },
  parameters: { docs: { description: { component: `
## Overview
**Card** is the standard surface container — a bordered, rounded box on
\`--ds-color-surface\`. It's the most-reused shape in the system; reach for it
instead of hand-rolling \`background: surface; border; border-radius\`.

- **padding** — \`none\` / \`sm\` / \`md\` / \`lg\`
- **radius** — \`md\` / \`lg\`
- **interactive** — adds a hover affordance for clickable cards.

\`\`\`html
<ds-card padding="lg"><h3>Title</h3><p>Body…</p></ds-card>
\`\`\`
` } } },
}

export const Basic = {
  render: (args) => ({
    components: { DsCard },
    setup: () => ({ args }),
    template: `<ds-card v-bind="args" style="max-width:420px">
      <h3 style="margin:0 0 6px;font-weight:800;color:var(--ds-color-text)">The Grand Plaza</h3>
      <p style="margin:0;color:var(--ds-color-text-subtle)">Downtown · 8.6/10 Excellent · from $189/night</p>
    </ds-card>`,
  }),
}

export const Padding = {
  render: () => ({
    components: { DsCard },
    template: `<div style="display:flex;flex-wrap:wrap;gap:16px">
      <ds-card padding="sm" style="width:160px"><small style="color:var(--ds-color-text-subtle)">padding sm</small></ds-card>
      <ds-card padding="md" style="width:160px"><small style="color:var(--ds-color-text-subtle)">padding md</small></ds-card>
      <ds-card padding="lg" style="width:160px"><small style="color:var(--ds-color-text-subtle)">padding lg</small></ds-card>
    </div>`,
  }),
}

export const Interactive = {
  render: () => ({
    components: { DsCard },
    template: `<ds-card interactive style="max-width:420px">
      <strong style="color:var(--ds-color-text)">Clickable card</strong>
      <p style="margin:4px 0 0;color:var(--ds-color-text-subtle)">Hover to see the border + shadow affordance.</p>
    </ds-card>`,
  }),
}
