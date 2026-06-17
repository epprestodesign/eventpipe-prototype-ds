// CHECKOUT EXPERIENCE / Steps / Review Order — step 1, both variants.
import StepReviewOrder from '../../components/checkout/steps/StepReviewOrder.vue'
import { holdCart, reserveCart } from './_fixtures'

export default {
  title: 'Checkout Experience/Steps/Review Order',
  component: StepReviewOrder,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Step 1 — recycles the cart body. **Group Hold** shows the collapsible hotels → rooms → day steppers; **Reservation** shows the single-stay summary.' } } },
}

const wrap = (inner, data) => ({ components: { StepReviewOrder }, setup: () => data, template: `<div style="max-width:640px;margin:0 auto;padding:32px">${inner}</div>` })

export const GroupHold = { render: () => wrap(`<step-review-order mode="hold" :cart="cart" />`, { cart: holdCart }) }
export const Reservation = { render: () => wrap(`<step-review-order mode="reserve" :cart="cart" />`, { cart: reserveCart }) }
