<script setup>
/* MsfReservationSummary — the reservation's charge breakdown (DES-456).
 *
 * The one secondary-fee line becomes a line per configured fee. Two things make
 * three fees survivable here, where the single fee never had to prove itself:
 *
 *   • each fee shows how its total was reached — "$5.00 per room night × 4
 *     nights" — because with three fees on one reservation, "Custom Name 2
 *     $20.00" alone is not answerable by the person on the phone with a guest;
 *   • the fees are grouped under one "Secondary Fees" subtotal, so the room
 *     rate → taxes → fees → total spine of the summary keeps its shape however
 *     many fees exist.
 *
 * This component is the shared summary — the ticket notes it's reused, so the
 * fee block is a v-for over whatever fees the reservation carries, with no
 * assumption that there is exactly one.
 */
import { computed } from 'vue'
import { money, feeTotal, activeFees } from '../_msf'

/* Where these values come from, said once: reservations inherit the event
   hotel's fees, which is why the summary isn't editable here. */
const HOTEL_LABEL = 'the event hotel’s Housing Company Policies'

const props = defineProps({
  reservation: { type: Object, required: true },
  fees: { type: Array, default: () => [] },
})

const shown = computed(() => activeFees(props.fees).map((fee) => ({
  ...fee,
  total: feeTotal(fee, props.reservation.nights, props.reservation.rooms),
  basis: fee.chargeType === 'Per Room Night'
    ? `${money(fee.amount)} per room night × ${props.reservation.nights} nights`
    : `${money(fee.amount)} per reservation`,
})))

const roomSubtotal = computed(() => props.reservation.nightlyRate * props.reservation.nights * props.reservation.rooms)
const taxes = computed(() => roomSubtotal.value * props.reservation.taxRate)
const feesSubtotal = computed(() => shown.value.reduce((sum, f) => sum + f.total, 0))
const total = computed(() => roomSubtotal.value + taxes.value + props.reservation.reservationFee + feesSubtotal.value)
</script>

<template>
  <q-card flat bordered>
    <div style="padding:24px 28px 28px;">
      <div class="text-primary q-mb-md" style="font-size:1.125rem; font-weight:500;">Reservation Summary</div>

      <!-- Room -->
      <div class="msfrs__line">
        <div>
          <div class="msfrs__label">{{ reservation.roomType }}</div>
          <div class="msfrs__basis">{{ money(reservation.nightlyRate) }} per night × {{ reservation.nights }} nights</div>
        </div>
        <div class="msfrs__amount">{{ money(roomSubtotal) }}</div>
      </div>

      <div class="msfrs__line">
        <div class="msfrs__label">Taxes &amp; Fees</div>
        <div class="msfrs__amount">{{ money(taxes) }}</div>
      </div>

      <div class="msfrs__line">
        <div class="msfrs__label">EventPipe Reservation Fee</div>
        <div class="msfrs__amount">{{ money(reservation.reservationFee) }}</div>
      </div>

      <!-- Secondary fees: one line per configured fee, up to three -->
      <template v-if="shown.length">
        <q-separator class="q-my-md" />
        <div class="msfrs__group-title">Secondary Fees</div>
        <div v-for="fee in shown" :key="fee.slot" class="msfrs__line">
          <div>
            <div class="msfrs__label">{{ fee.name }}</div>
            <div class="msfrs__basis">{{ fee.basis }}</div>
            <div v-if="fee.description" class="msfrs__desc">{{ fee.description }}</div>
          </div>
          <div class="msfrs__amount">{{ money(fee.total) }}</div>
        </div>
        <div v-if="shown.length > 1" class="msfrs__line msfrs__line--sub">
          <div class="msfrs__label">Secondary fees subtotal</div>
          <div class="msfrs__amount">{{ money(feesSubtotal) }}</div>
        </div>
      </template>

      <q-separator class="q-mt-md" />
      <div class="msfrs__line msfrs__line--total">
        <div>Total</div>
        <div>{{ money(total) }}</div>
      </div>

      <div class="msfrs__foot">
        {{ shown.length }} of 3 secondary custom fees applied · rates inherited from
        {{ HOTEL_LABEL }}
      </div>
    </div>
  </q-card>
</template>

<style scoped>
.msfrs__line { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; padding: 9px 0; }
.msfrs__line--sub { border-top: 1px dashed var(--ds-color-border); margin-top: 2px; }
.msfrs__line--total { padding-top: 14px; font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text); }
.msfrs__label { font-size: 0.9375rem; color: var(--ds-color-text); }
.msfrs__amount { font-size: 0.9375rem; color: var(--ds-color-text); font-variant-numeric: tabular-nums; white-space: nowrap; }
.msfrs__basis { font-size: 0.8125rem; color: var(--ds-color-text-subtle); margin-top: 2px; }
.msfrs__desc { font-size: 0.8125rem; color: var(--ds-color-text-subtle); margin-top: 2px; font-style: italic; }
.msfrs__group-title { font-size: 0.8125rem; font-weight: 700; color: var(--ds-color-text-subtle); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; }
.msfrs__foot { margin-top: 16px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
</style>
