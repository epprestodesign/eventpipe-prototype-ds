/** COMPONENTS / Typography & Content / Text → DsText.vue (inline text primitive). */
import DsText from '../../components/DsText.vue'

export default {
  title: 'Components/Typography & Content/Text',
  component: DsText,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
The text primitive. Pick a \`variant\` (type scale), \`tone\` (color), and \`as\` (tag).
One component backs **Text**, **Heading**, and **Paragraph**.
` } } },
  argTypes: {
    variant: { control: 'select', options: ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'caption', 'overline'] },
    tone: { control: 'select', options: ['default', 'subtle', 'subtlest', 'brand', 'danger', 'success'] },
  },
  args: { variant: 'body', tone: 'default' },
}

export const Playground = { render: (args) => ({ components: { DsText }, setup: () => ({ args }), template: `<ds-text v-bind="args">The quick brown fox jumps over the lazy dog.</ds-text>` }) }

export const Tones = {
  render: () => ({
    components: { DsText },
    template: `
      <div class="column q-gutter-xs">
        <ds-text tone="default">Default text</ds-text>
        <ds-text tone="subtle">Subtle text</ds-text>
        <ds-text tone="subtlest">Subtlest text</ds-text>
        <ds-text tone="brand">Brand text</ds-text>
        <ds-text tone="success">Success text</ds-text>
        <ds-text tone="danger">Danger text</ds-text>
      </div>`,
  }),
}
