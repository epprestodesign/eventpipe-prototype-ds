/** DES-207 / Components / Send-Email Control → Checkbox states (library only). */
import { ref } from 'vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/Components/Send-Email Control',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'The "Send Email" control per row. **Editable** = a normal Checkbox. **Forced / locked** (mandatory emails) = a disabled checked checkbox, or a positive check icon. Composed from Checkbox + Icon — no new styles.' } } },
}

export const States = {
  render: () => ({
    setup: () => ({ a: ref(true), b: ref(false) }),
    template: `
      <table style="border-collapse:separate; border-spacing:24px 12px;">
        <tr><td><q-checkbox v-model="a" color="primary" /></td><td class="text-grey-8">Editable — on (Teams Management items)</td></tr>
        <tr><td><q-checkbox v-model="b" color="primary" /></td><td class="text-grey-8">Editable — off</td></tr>
        <tr><td><q-checkbox :model-value="true" disable color="primary" /></td><td class="text-grey-8">Forced / locked — mandatory email (disabled checked)</td></tr>
        <tr><td><q-icon name="check" color="positive" size="22px" /></td><td class="text-grey-8">Forced — shown as a positive check (read-only)</td></tr>
      </table>`,
  }),
}
