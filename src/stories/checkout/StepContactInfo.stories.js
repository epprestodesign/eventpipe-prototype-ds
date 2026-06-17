// CHECKOUT EXPERIENCE / Steps / Contact Info — step 2, both variants.
import { ref } from 'vue'
import StepContactInfo from '../../components/checkout/steps/StepContactInfo.vue'

export default {
  title: 'Checkout Experience/Steps/Contact Info',
  component: StepContactInfo,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Step 2 — variant-specific. **Group Hold** is the teams block (search/add teams + primary contact); **Reservation** is contact + guests staying.' } } },
}

const wrap = (inner, data) => ({ components: { StepContactInfo }, setup: () => data, template: `<div style="max-width:640px;margin:0 auto;padding:32px">${inner}</div>` })

export const GroupHold = { render: () => wrap(`<step-contact-info mode="group" v-model="m" />`, { m: ref({}) }) }
export const Reservation = { render: () => wrap(`<step-contact-info mode="reservation" v-model="m" />`, { m: ref({}) }) }
