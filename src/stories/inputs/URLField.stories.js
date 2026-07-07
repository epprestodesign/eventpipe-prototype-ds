/** COMPONENTS / Forms / URL Field → DsInput (type=url) with a leading link icon. */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'
import DsField from '../../components/DsField.vue'

export default {
  title: 'Components/Forms/URL Field',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'A **URL field** — text input typed for URLs (`type="url"`), with an optional leading link icon.' } } },
}

export const Default = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ url: ref('') }),
    template: `<div style="max-width:360px"><ds-input v-model="url" type="url" label="Website" placeholder="https://example.com" /></div>`,
  }),
}

export const WithIcon = {
  render: () => ({
    components: { DsField },
    setup: () => ({ url: ref('') }),
    template: `
      <div style="max-width:360px">
        <ds-field label="Booking page URL" hint="Shown to attendees.">
          <q-input v-model="url" outlined dense type="url" placeholder="https://book.eventpipe.com/…" hide-bottom-space>
            <template #prepend><q-icon name="link" /></template>
          </q-input>
        </ds-field>
      </div>`,
  }),
}
