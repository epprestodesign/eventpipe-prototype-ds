// CHECKOUT EXPERIENCE / Steps / Review Reservation — step 4, both variants.
import StepReviewReservation from '../../components/checkout/steps/StepReviewReservation.vue'

export default {
  title: 'Checkout Experience/Steps/Review Reservation',
  component: StepReviewReservation,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Step 4 — recap + Confirm and pay. **Group Hold** recaps teams and the group total; **Reservation** recaps the lead guest and the single-stay total.' } } },
}

const wrap = (inner) => ({ components: { StepReviewReservation }, template: `<div style="max-width:640px;margin:0 auto;padding:32px">${inner}</div>` })

export const GroupHold = { render: () => wrap(`<step-review-reservation contact-summary="3 teams · Sam Girard" payment-label="Amex ····1009" :total="2578.56" />`) }
export const Reservation = { render: () => wrap(`<step-review-reservation contact-summary="Sam Girard · 2 guests" payment-label="Amex ····1009" :total="322.31" />`) }
