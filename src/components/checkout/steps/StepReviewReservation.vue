<script setup>
// Checkout step 4 — Review your reservation. Recap + "Protect your stay"
// selection + cancellation policy, then Confirm and pay (gated on choosing a
// protection option, mirroring the Expedia flow).
import { ref, computed } from 'vue'

const props = defineProps({
  contactSummary: { type: String, default: '' },
  paymentLabel: { type: String, default: '' },
  total: { type: Number, default: 0 },
  currency: { type: String, default: '$' },
  protectionPlans: { type: Array, default: () => ([
    { id: 'plan', title: 'Trip Protection Plan', price: 10.51, recommended: true, benefits: [
      'Cancellation or early check-out, up to 100% of trip cost',
      'Coverage if your travel is interrupted or delayed',
      'Emergency medical & dental, reimbursed up to $200 / person',
    ] },
    { id: 'none', title: 'No protection', desc: 'You could be reimbursed for trip costs (minus the plan price) only if you cancel for a covered reason.' },
  ]) },
  cancellation: { type: Object, default: () => ({
    refundableBefore: 'Jun 20, 2026',
    policy: 'Cancellations or changes made after 6:00 PM (property local time) on Jun 20, 2026 will result in a charge of 100% of the total amount paid for the reservation.',
    checkIn: 'There is a front desk at this property. Guests will receive an email within 24 hours of booking with check-in instructions.',
  }) },
})
const emit = defineEmits(['confirm'])
const money = (n, c = '$') => c + Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const protection = ref(null)
const canConfirm = computed(() => protection.value !== null)
</script>

<template>
  <div class="srr">
    <!-- Protect your stay -->
    <section class="srr__sec srr__sec--first">
      <h4 class="srr__h">Protect your stay</h4>
      <p class="srr__sub">Select an option to continue.</p>
      <div class="srr__plans">
        <button v-for="p in protectionPlans" :key="p.id" class="srr__plan" :class="{ 'is-sel': protection === p.id }" @click="protection = p.id">
          <span class="srr__plan-body">
            <span class="srr__plan-title">{{ p.title }}<span v-if="p.recommended" class="srr__rec">Recommended</span></span>
            <span v-if="p.price != null" class="srr__plan-price">{{ money(p.price, currency) }}</span>
            <ul v-if="p.benefits" class="srr__bul">
              <li v-for="b in p.benefits" :key="b"><q-icon name="check" size="15px" />{{ b }}</li>
            </ul>
            <span v-else-if="p.desc" class="srr__plan-desc">{{ p.desc }}</span>
          </span>
          <span class="srr__radio"><span v-if="protection === p.id" class="srr__dot" /></span>
        </button>
      </div>
    </section>

    <!-- Cancellation policy -->
    <section class="srr__sec">
      <h4 class="srr__h">Cancellation policy</h4>
      <div class="srr__refund"><q-icon name="check_circle" size="18px" /> Fully refundable before {{ cancellation.refundableBefore }}</div>
      <p class="srr__policy">{{ cancellation.policy }}</p>
      <h5 class="srr__subh">Special check-in instructions</h5>
      <p class="srr__policy">{{ cancellation.checkIn }}</p>
    </section>

    <p class="srr__terms">By selecting Confirm and pay, you acknowledge you have reviewed the Privacy Statement and accept the Rules &amp; Restrictions and Terms of Use.</p>
    <q-btn unelevated no-caps class="srr__confirm" :class="{ 'is-disabled': !canConfirm }" :tabindex="canConfirm ? 0 : -1" label="Confirm and pay" @click="emit('confirm')" />
  </div>
</template>

<style scoped>
.srr__recap { list-style: none; margin: 0; padding: 0; }
.srr__recap li { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--ds-color-border); }
.srr__recap li span { color: var(--ds-color-text-subtle); }
.srr__recap li strong { color: var(--ds-color-text); }

.srr__sec { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--ds-color-border); }
.srr__sec--first { margin-top: 0; padding-top: 0; border-top: 0; }
.srr__h { font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text); margin: 0; }
.srr__sub { color: var(--ds-color-text-subtle); font-size: 0.875rem; margin: 4px 0 14px; }

.srr__plans { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.srr__plan { display: flex; gap: 12px; text-align: left; padding: 16px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); cursor: pointer; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.srr__plan:hover { border-color: var(--ds-color-border-bold); }
.srr__plan.is-sel { border-color: var(--ds-color-background-brand-bold); box-shadow: inset 0 0 0 1px var(--ds-color-background-brand-bold); }
.srr__radio { width: 20px; height: 20px; flex: none; border: 1.5px solid var(--ds-color-border-bold); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
.srr__plan.is-sel .srr__radio { border-color: var(--ds-color-background-brand-bold); }
.srr__dot { width: 11px; height: 11px; border-radius: 50%; background: var(--ds-color-background-brand-bold); }
.srr__plan-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.srr__plan-title { font-weight: 700; color: var(--ds-color-text); }
.srr__rec { display: inline-block; margin-left: 8px; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ds-color-text-success); }
.srr__plan-price { font-weight: 700; color: var(--ds-color-text); }
.srr__bul { list-style: none; margin: 6px 0 0; padding: 0; display: flex; flex-direction: column; gap: 7px; align-items: flex-start; }
.srr__bul li { display: flex; align-items: flex-start; gap: 7px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); line-height: 1.4; }
.srr__bul li :deep(.q-icon) { color: var(--ds-color-text-success); flex: none; margin-top: 1px; }
.srr__plan-desc { display: block; margin-top: 10px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); line-height: 1.45; }

.srr__refund { display: flex; width: 100%; align-items: center; gap: 8px; margin-top: 12px; background: var(--ds-color-background-success); color: var(--ds-palette-green-700); border: 1px solid var(--ds-palette-green-200, #BBF7D0); border-radius: var(--ds-radius-md); padding: 11px 14px; font-weight: 600; font-size: 0.875rem; }
.srr__policy { color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.5; margin: 12px 0 0; }
.srr__subh { font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); margin: 18px 0 0; }

.srr__terms { color: var(--ds-color-text-subtle); font-size: 0.8125rem; line-height: 1.5; margin: 24px 0 16px; }
.srr__confirm { width: 100%; height: 54px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 1.0625rem; }
.srr__confirm.is-disabled { background: var(--ds-palette-zinc-200); color: var(--ds-color-text-subtlest); pointer-events: none; }

@media (max-width: 560px) { .srr__plans { grid-template-columns: 1fr; } }
</style>
