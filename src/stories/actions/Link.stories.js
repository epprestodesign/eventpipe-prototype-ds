/** COMPONENTS / Actions / Link → DsLink.vue (inline text link). */
import DsLink from '../../components/DsLink.vue'

export default {
  title: 'Components/Actions/Link',
  component: DsLink,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
An inline text **Link** for navigation or actions. Brand-colored, weight 700,
underline-on-hover by default. Use \`external\` for an open-in-new affordance.
` } } },
  argTypes: {
    tone: { control: 'select', options: ['brand', 'subtle'] },
    underline: { control: 'select', options: ['hover', 'always', 'none'] },
    external: { control: 'boolean' },
  },
}

export const Default = { render: (args) => ({ components: { DsLink }, setup: () => ({ args }), template: `<ds-link v-bind="args">Inventory Requests</ds-link>` }) }

export const Variations = {
  render: () => ({
    components: { DsLink },
    template: `
      <div class="column q-gutter-md">
        <div>In a sentence, see the <ds-link>request details</ds-link> for more.</div>
        <div><ds-link underline="always">Always underlined</ds-link></div>
        <div><ds-link tone="subtle">Subtle link</ds-link></div>
        <div><ds-link external href="https://shopify.dev">External link</ds-link></div>
      </div>`,
  }),
}
