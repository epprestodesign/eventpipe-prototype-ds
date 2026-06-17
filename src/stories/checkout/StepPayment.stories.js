// CHECKOUT EXPERIENCE / Steps / Payment — step 3, both variants.
import { ref } from 'vue'
import StepPayment from '../../components/checkout/steps/StepPayment.vue'
import { methods } from './_fixtures'

export default {
  title: 'Checkout Experience/Steps/Payment',
  component: StepPayment,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Step 3 — the same Instacart-style PayWith selector for both variants (payment is identical across the group and reservation flows).' } } },
}

const wrap = (inner, data) => ({ components: { StepPayment }, setup: () => data, template: `<div style="max-width:640px;margin:0 auto;padding:32px">${inner}</div>` })

export const GroupHold = { render: () => wrap(`<step-payment v-model="sel" :methods="methods" />`, { sel: ref('amex'), methods }) }
export const Reservation = { render: () => wrap(`<step-payment v-model="sel" :methods="methods" />`, { sel: ref('amex'), methods }) }
