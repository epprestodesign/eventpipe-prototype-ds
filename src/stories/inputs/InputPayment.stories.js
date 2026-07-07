/** BASE COMPONENTS / Inputs / Input Payment → currency amount + card details. */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'

export default {
  title: 'Components/Forms/Input Payment',
  component: DsInput,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
Payment inputs come in two forms:
- **Currency amount** — a money field with a \`$\` prefix (the "$ 20.00" fields
  throughout Edit Event). \`DsInput type="currency"\`.
- **Card details** — card number / expiry / CVC, using input masks.
` } } },
}

export const Currency = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ a: ref(''), b: ref('') }),
    template: `
      <div class="column q-gutter-lg" style="max-width:340px">
        <ds-input v-model="a" type="currency" label="Event Net Income Goal" placeholder="0.00" />
        <ds-input v-model="b" type="currency" label="Additional Reservation Fee" placeholder="0.00" hint="Charged per reservation." />
      </div>`,
  }),
}

export const CardDetails = {
  render: () => ({
    setup: () => ({ card: ref(''), exp: ref(''), cvc: ref('') }),
    template: `
      <div style="max-width:360px">
        <div style="font-size:0.8125rem; font-weight:700; color:var(--ds-color-text-subtle); margin-bottom:6px;">Card details</div>
        <q-input v-model="card" outlined dense placeholder="1234 5678 9012 3456" mask="#### #### #### ####" hide-bottom-space>
          <template #prepend><q-icon name="credit_card" /></template>
        </q-input>
        <div class="row q-gutter-sm q-mt-sm">
          <q-input v-model="exp" outlined dense placeholder="MM/YY" mask="##/##" style="flex:1" hide-bottom-space />
          <q-input v-model="cvc" outlined dense placeholder="CVC" mask="####" style="width:96px" hide-bottom-space />
        </div>
      </div>`,
  }),
}
