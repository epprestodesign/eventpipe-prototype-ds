<script setup>
// CheckoutPage — Airbnb-style "Confirm and pay": a left stepped accordion (one
// step open at a time; Next advances, completed steps collapse with an Edit)
// beside a sticky OrderSummary rail. Four steps:
//   1 Review order  2 Contact & group info  3 Payment  4 Review reservation
// `mode` ('group' | 'reservation') toggles the group-details step + copy.
import { ref, computed, reactive } from 'vue'
import { useQuasar } from 'quasar'
import CartReview from '../CartReview.vue'
import StepReviewOrder from './steps/StepReviewOrder.vue'
import StepContactInfo from './steps/StepContactInfo.vue'
import StepPayment from './steps/StepPayment.vue'
import StepReviewReservation from './steps/StepReviewReservation.vue'

const props = defineProps({
  mode: { type: String, default: 'group' },
  cart: { type: Object, default: () => ({}) },
  summary: { type: Object, default: () => ({}) },
  currency: { type: String, default: '$' },
})
const $q = useQuasar()
const isGroup = computed(() => props.mode === 'group')
// The cart fly-out modes; reuse the same CartReview body here.
const cartMode = computed(() => (isGroup.value ? 'hold' : 'reserve'))
// One shared, editable copy so the Review-order step and the rail's Price
// details stay in sync as quantities change.
const liveCart = reactive(JSON.parse(JSON.stringify(props.cart || {})))

// Reservation drops the "Review order" step (the rail already shows the order).
const steps = computed(() => {
  const rest = [
    { key: 'contact', label: isGroup.value ? 'Enter contact & group information' : 'Enter contact information' },
    { key: 'payment', label: 'Add a payment method' },
    { key: 'final', label: 'Review your reservation' },
  ]
  return isGroup.value ? [{ key: 'review', label: 'Review order' }, ...rest] : rest
})

const current = ref(1)
const furthest = ref(1)
const stepState = (n) => (n === current.value ? 'open' : n <= furthest.value ? 'done' : 'upcoming')
const goEdit = (n) => { if (n <= furthest.value) current.value = n }
const next = () => { furthest.value = Math.max(furthest.value, current.value + 1); current.value = Math.min(current.value + 1, steps.value.length) }

// State captured across steps.
const contact = ref({})
const methods = [
  { id: 'amex', logo: 'Amex', last4: '1009', label: 'Amex', sub: 'Default' },
  { id: 'gpay', logo: 'GooglePay', label: 'Google Pay' },
]
const payment = ref('amex')
const paymentLabel = computed(() => {
  const m = methods.find((x) => x.id === payment.value)
  return m ? (m.last4 ? `${m.label} ····${m.last4}` : m.label) : ''
})
const contactSummary = computed(() => {
  const c = contact.value || {}
  if (isGroup.value) {
    const n = c.teams?.length || 0
    const lead = [c.contact?.firstName, c.contact?.lastName].filter(Boolean).join(' ')
    return `${n} team${n === 1 ? '' : 's'}${lead ? ` · ${lead}` : ''}`
  }
  const name = [c.firstName, c.lastName].filter(Boolean).join(' ')
  return name || 'Contact details'
})

const confirm = () => $q.notify({ message: 'Reservation confirmed — a confirmation has been emailed.', icon: 'check_circle', color: 'grey-9', position: 'bottom', timeout: 3000 })
</script>

<template>
  <div class="ck">
    <div class="ck__inner">
    <div class="ck__header">
      <button class="ck__back" aria-label="Back"><q-icon name="arrow_back" size="20px" /></button>
      <h1 class="ck__h1">Confirm and pay</h1>
    </div>

    <div class="ck__grid">
      <!-- LEFT: stepped accordion -->
      <div class="ck__steps">
        <section v-for="(s, i) in steps" :key="s.key" class="ck__step" :class="`is-${stepState(i + 1)}`">
          <header class="ck__stephead" @click="stepState(i + 1) === 'done' && goEdit(i + 1)">
            <span class="ck__num"><q-icon v-if="stepState(i + 1) === 'done'" name="check" size="16px" /><template v-else>{{ i + 1 }}</template></span>
            <span class="ck__steptitle">{{ s.label }}</span>
            <button v-if="stepState(i + 1) === 'done'" class="ck__edit" @click.stop="goEdit(i + 1)">Edit</button>
          </header>

          <!-- collapsed summary -->
          <div v-if="stepState(i + 1) === 'done'" class="ck__summary">
            <template v-if="s.key === 'review'">{{ summary.rrow1 || 'Order reviewed' }}</template>
            <template v-else-if="s.key === 'contact'">{{ contactSummary }}</template>
            <template v-else-if="s.key === 'payment'">{{ paymentLabel }}</template>
          </div>

          <!-- open content — each step is its own component -->
          <div v-if="stepState(i + 1) === 'open'" class="ck__body">
            <step-review-order v-if="s.key === 'review'" :mode="cartMode" :cart="liveCart" :currency="currency" bind @next="next" />
            <step-contact-info v-else-if="s.key === 'contact'" :mode="mode" v-model="contact" @next="next" />
            <step-payment v-else-if="s.key === 'payment'" v-model="payment" :methods="methods" @next="next" />
            <step-review-reservation v-else :contact-summary="contactSummary" :payment-label="paymentLabel" :total="summary.total" :currency="currency" @confirm="confirm" />
          </div>
        </section>
      </div>

      <!-- RIGHT: sticky order summary — recycles the cart body; price details split into its own card -->
      <aside class="ck__railwrap">
        <cart-review :mode="cartMode" :cart="liveCart" :currency="currency" readonly bind :show-requests="false" cards :order-title="isGroup ? 'Review your order' : ''" :collapsible="isGroup" />
      </aside>
    </div>
    </div>
  </div>
</template>

<style scoped>
.ck { background: var(--ds-palette-neutral-100); min-height: 100vh; padding: 24px; }
.ck__inner { max-width: 1040px; margin: 0 auto; }
.ck__header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.ck__back { width: 36px; height: 36px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ck__h1 { font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--ds-color-text); }
.ck__grid { display: grid; grid-template-columns: 1fr 400px; gap: 32px; align-items: start; }
.ck__rail { position: sticky; top: 20px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); overflow: hidden; box-shadow: var(--ds-shadow-1); background: var(--ds-color-surface); }
.ck__railwrap { position: sticky; top: 20px; }

.ck__step { background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); padding: 18px 20px; margin-bottom: 16px; }
.ck__step.is-upcoming { opacity: 0.5; }
.ck__stephead { display: flex; align-items: center; gap: 12px; }
.ck__step.is-done .ck__stephead { cursor: pointer; }
.ck__num { width: 26px; height: 26px; border-radius: 50%; background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; flex: none; }
.ck__step.is-upcoming .ck__num { background: var(--ds-palette-zinc-300); }
.ck__steptitle { flex: 1; font-weight: 700; color: var(--ds-color-text); }
.ck__edit { background: none; border: 0; padding: 0; color: var(--ds-color-text); font-weight: 600; text-decoration: underline; cursor: pointer; }
.ck__summary { color: var(--ds-color-text-subtle); font-size: 0.9375rem; margin: 8px 0 0 38px; }
.ck__body { margin-top: 18px; }

@media (max-width: 880px) { .ck__grid { grid-template-columns: 1fr; } }
</style>
