/** COMPONENTS / Media & Visuals / Thumbnail → DsThumbnail.vue. */
import DsThumbnail from '../../components/DsThumbnail.vue'

export default {
  title: 'Components/Media & Visuals/Thumbnail',
  component: DsThumbnail,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A small fixed-size preview image with an image-icon fallback — for tables, lists,
and cards. \`size\` is a token (xs–xl) or any CSS length.
` } } },
  argTypes: { size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] }, rounded: { control: 'boolean' } },
  args: { size: 'md', rounded: true },
}

export const Default = { render: (args) => ({ components: { DsThumbnail }, setup: () => ({ args }), template: `<ds-thumbnail v-bind="args" />` }) }

export const Sizes = {
  render: () => ({
    components: { DsThumbnail },
    template: `
      <div class="row items-end q-gutter-md">
        <ds-thumbnail size="xs" />
        <ds-thumbnail size="sm" />
        <ds-thumbnail size="md" />
        <ds-thumbnail size="lg" />
        <ds-thumbnail size="xl" />
      </div>`,
  }),
}
