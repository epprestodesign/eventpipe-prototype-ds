/** COMPONENTS / Typography & Content / Heading → DsText.vue heading variants. */
import DsText from '../../components/DsText.vue'

export default {
  title: 'Components/Typography & Content/Heading',
  component: DsText,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Hierarchical titles via **DsText** — `variant="display|h1|h2|h3|h4"`, rendered as the matching semantic tag.' } } },
}

export const Levels = {
  render: () => ({
    components: { DsText },
    template: `
      <div class="column q-gutter-md">
        <ds-text as="h1" variant="display">Display</ds-text>
        <ds-text as="h1" variant="h1">Heading 1</ds-text>
        <ds-text as="h2" variant="h2">Heading 2</ds-text>
        <ds-text as="h3" variant="h3">Heading 3</ds-text>
        <ds-text as="h4" variant="h4">Heading 4</ds-text>
        <ds-text variant="overline" tone="subtle">Overline</ds-text>
      </div>`,
  }),
}
