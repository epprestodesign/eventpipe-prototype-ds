/** APP CHROME / Save Bar → DsSaveBar.vue (sticky Discard/Save footer). */
import DsSaveBar from '../../components/DsSaveBar.vue'

export default {
  title: 'App Chrome/Save Bar',
  component: DsSaveBar,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A contextual **Save Bar** — the sticky "unsaved changes" footer on editing
screens (Edit Event / Edit Refund Policy). Pins to the bottom with a message on
the left and **Discard** / **Save** on the right. Emits \`save\` and \`discard\`.
` } } },
  argTypes: { message: { control: 'text' }, saving: { control: 'boolean' }, disabled: { control: 'boolean' } },
  args: { message: 'Unsaved changes', saveLabel: 'Update Event', discardLabel: 'Discard Changes' },
}

export const Default = { render: (args) => ({ components: { DsSaveBar }, setup: () => ({ args }), template: `<ds-save-bar v-bind="args" />` }) }

export const InContext = {
  render: () => ({
    components: { DsSaveBar },
    template: `
      <div style="border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-lg); overflow:hidden; max-width:640px;">
        <div style="padding:28px; height:220px; color:var(--ds-color-text-subtle);">Form content being edited…</div>
        <ds-save-bar message="Unsaved changes" save-label="Update Event" discard-label="Discard Changes" />
      </div>`,
  }),
}
