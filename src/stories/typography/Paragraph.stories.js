/** COMPONENTS / Typography & Content / Paragraph → DsText.vue body block. */
import DsText from '../../components/DsText.vue'

export default {
  title: 'Components/Typography & Content/Paragraph',
  component: DsText,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A block of body copy via **DsText** `as="p"` — `body-lg`, `body`, and `caption` sizes.' } } },
}

export const Sizes = {
  render: () => ({
    components: { DsText },
    template: `
      <div class="column q-gutter-md" style="max-width:560px">
        <ds-text as="p" variant="body-lg">Large paragraph — for lead-ins and intros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</ds-text>
        <ds-text as="p" variant="body">Body paragraph — the default reading size. Maecenas sed diam eget risus varius blandit sit amet non magna. Cras mattis consectetur purus sit amet fermentum.</ds-text>
        <ds-text as="p" variant="caption" tone="subtle">Caption — helper and secondary text below fields or media.</ds-text>
      </div>`,
  }),
}
