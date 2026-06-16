<script setup>
// CheckoutPage — Airbnb-style "Confirm and pay": a left stepped accordion (one
// step open at a time; Next advances, completed steps collapse with an Edit)
// beside a sticky OrderSummary rail. Four steps:
//   1 Review order  2 Contact & group info  3 Payment  4 Review reservation
// `mode` ('group' | 'reservation') toggles the group-details step + copy.
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import CartReview from '../CartReview.vue'
import ContactGroupForm from './ContactGroupForm.vue'
import PayWith from './PayWith.vue'

const props = defineProps({
  mode: { type: String, default: 'group' },
  cart: { type: Object, default: () => ({}) },
  summary: { type: Object, default: () => ({}) },
  currency: { type: String, default: '$' },
})
const $q = useQuasar()
const money = (n) => props.currency + Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const isGroup = computed(() => props.mode === 'group')
// The cart fly-out modes; reuse the same CartReview body here.
const cartMode = computed(() => (isGroup.value ? 'hold' : 'reserve'))

const steps = computed(() => [
  'Review order',
  isGroup.value ? 'Enter contact & group information' : 'Enter contact information',
  'Add a payment method',
  'Review your reservation',
])

const current = ref(1)
const furthest = ref(1)
const stepState = (n) => (n === current.value ? 'open' : n <= furthest.value ? 'done' : 'upcoming')
const goEdit = (n) => { if (n <= furthest.value) current.value = n }
const next = () => { furthest.value = Math.max(furthest.value, current.value + 1); current.value = Math.min(current.value + 1, 4) }

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
  const c = contact.value
  const name = [c.firstName, c.lastName].filter(Boolean).join(' ')
  if (isGroup.value && c.groupName) return `${c.groupName}${name ? ` · ${name}` : ''}`
  return name || 'Contact details'
})

const confirm = () => $q.notify({ message: 'Reservation confirmed — a confirmation has been emailed.', icon: 'check_circle', color: 'grey-9', position: 'bottom', timeout: 3000 })
</script>

<template>
  <div class="ck">
    <div class="ck__header">
      <button class="ck__back" aria-label="Back"><q-icon name="arrow_back" size="20px" /></button>
      <h1 class="ck__h1">Confirm and pay</h1>
    </div>

    <div class="ck__grid">
      <!-- LEFT: stepped accordion -->
      <div class="ck__steps">
        <section v-for="(label, i) in steps" :key="i" class="ck__step" :class="`is-${stepState(i + 1)}`">
          <header class="ck__stephead" @click="stepState(i + 1) === 'done' && goEdit(i + 1)">
            <span class="ck__num"><q-icon v-if="stepState(i + 1) === 'done'" name="check" size="16px" /><template v-else>{{ i + 1 }}</template></span>
            <span class="ck__steptitle">{{ label }}</span>
            <button v-if="stepState(i + 1) === 'done'" class="ck__edit" @click.stop="goEdit(i + 1)">Edit</button>
          </header>

          <!-- collapsed summary -->
          <div v-if="stepState(i + 1) === 'done'" class="ck__summary">
            <template v-if="i === 0">{{ summary.rrow1 || 'Order reviewed' }}</template>
            <template v-else-if="i === 1">{{ contactSummary }}</template>
            <template v-else-if="i === 2">{{ paymentLabel }}</template>
          </div>

          <!-- open content -->
          <div v-if="stepState(i + 1) === 'open'" class="ck__body">
            <!-- 1. Review order — recycles the cart body (hold accordion / reserve summary) -->
            <template v-if="i === 0">
              <div class="ck__review"><cart-review :mode="cartMode" :cart="cart" :show-requests="false" /></div>
              <q-btn unelevated no-caps class="ck__next" label="Next" @click="next" />
            </template>

            <!-- 2. Contact & group -->
            <template v-else-if="i === 1">
              <contact-group-form :mode="mode" v-model="contact" />
              <q-btn unelevated no-caps class="ck__next" label="Next" @click="next" />
            </template>

            <!-- 3. Payment -->
            <template v-else-if="i === 2">
              <pay-with v-model="payment" :methods="methods" />
              <q-btn unelevated no-caps class="ck__next" label="Next" @click="next" />
            </template>

            <!-- 4. Review reservation -->
            <template v-else>
              <ul class="ck__final">
                <li><span>Contact</span><strong>{{ contactSummary }}</strong></li>
                <li><span>Payment</span><strong>{{ paymentLabel }}</strong></li>
                <li><span>Total</span><strong>{{ money(summary.total) }}</strong></li>
              </ul>
              <p class="ck__terms">By selecting Confirm and pay, you agree to the booking terms and cancellation policy.</p>
              <q-btn unelevated no-caps class="ck__next ck__confirm" label="Confirm and pay" @click="confirm" />
            </template>
          </div>
        </section>
      </div>

      <!-- RIGHT: sticky order summary — recycles the cart body (Expedia-style) -->
      <aside class="ck__rail">
        <cart-review :mode="cartMode" :cart="cart" :currency="currency" readonly :show-requests="false" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.ck { max-width: 1040px; margin: 0 auto; padding: 24px; }
.ck__header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.ck__back { width: 36px; height: 36px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ck__h1 { font-size: 1.5rem; font-weight: 700; margin: 0; color: var(--ds-color-text); }
.ck__grid { display: grid; grid-template-columns: 1fr 400px; gap: 32px; align-items: start; }
.ck__rail { position: sticky; top: 20px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); overflow: hidden; box-shadow: var(--ds-shadow-1); background: var(--ds-color-surface); }

.ck__step { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); padding: 18px 20px; margin-bottom: 16px; }
.ck__step.is-upcoming { opacity: 0.5; }
.ck__stephead { display: flex; align-items: center; gap: 12px; }
.ck__step.is-done .ck__stephead { cursor: pointer; }
.ck__num { width: 26px; height: 26px; border-radius: 50%; background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; flex: none; }
.ck__step.is-upcoming .ck__num { background: var(--ds-palette-zinc-300); }
.ck__steptitle { flex: 1; font-weight: 700; color: var(--ds-color-text); }
.ck__edit { background: none; border: 0; padding: 0; color: var(--ds-color-text); font-weight: 600; text-decoration: underline; cursor: pointer; }
.ck__summary { color: var(--ds-color-text-subtle); font-size: 0.9375rem; margin: 8px 0 0 38px; }
.ck__body { margin-top: 18px; }

/* Let the recycled cart body span the step card width. */
.ck__review { margin: 0 -20px; }

.ck__final { list-style: none; margin: 0 0 16px; padding: 0; }
.ck__final li { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--ds-color-border); }
.ck__final li span { color: var(--ds-color-text-subtle); }
.ck__final li strong { color: var(--ds-color-text); }
.ck__terms { color: var(--ds-color-text-subtle); font-size: 0.8125rem; margin: 0 0 16px; }

.ck__next { margin-top: 20px; height: 48px; padding: 0 28px; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 600; }
.ck__confirm { width: 100%; height: 54px; border-radius: var(--ds-radius-pill); font-size: 1.0625rem; font-weight: 700; }

@media (max-width: 880px) { .ck__grid { grid-template-columns: 1fr; } }
</style>
