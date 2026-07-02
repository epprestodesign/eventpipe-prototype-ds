<script setup>
// PoliciesAgreement — the checkout "Policies" surface where a guest reviews and
// agrees to booking/hotel policies before completing.
//   • Single hotel  → one "Policies" card + one agreement checkbox + CTA.
//   • Multiple hotels → each hotel's policies in a collapsible accordion, each
//     with its OWN agreement checkbox; the CTA enables only once ALL are checked.
// `flow` ('reserve' | 'group') drives the default CTA label and agreement copy.
import { ref, computed } from 'vue'

// Default HoCoBook + hotel policy set (shared across properties).
const DEFAULT_POLICIES = [
  { title: 'HoCoBook Refund Policy', body: "All refunds are subject to HoCoBook's standard refund terms. Approved refunds will be processed within 5–10 business days to the original form of payment. Refunds will not be issued for no-shows or early departures unless otherwise stated at the time of booking." },
  { title: 'HoCoBook Cancellation Policy', body: "Reservations may be cancelled in accordance with HoCoBook's cancellation guidelines. Standard cancellations must be submitted no later than 72 hours prior to the scheduled arrival date. Cancellations submitted after this window may be subject to a penalty equal to one night's room rate plus applicable taxes." },
  { title: 'Hotel Cancellation Policy', body: "Individual hotel cancellation policies apply and may supersede HoCoBook's standard guidelines where more restrictive. Please review the property's specific cancellation terms, which are confirmed in your booking confirmation email." },
  { title: 'Deposit', body: "A deposit equal to the first night's room rate plus taxes will be charged to the credit card on file at the time of booking. The remaining balance will be charged upon check-in or as otherwise specified in your booking confirmation." },
  { title: 'Additional Policies & Amenities', body: 'Additional policies may apply based on the specific property, including but not limited to minimum night stay requirements, age restrictions, and occupancy limits. Amenity availability may vary by property and is subject to change without notice.' },
  { title: 'Amenities Notice', body: 'Amenities listed are subject to availability and may not be accessible at all times during your stay. Scheduled maintenance or seasonal closures may temporarily affect access to certain facilities. The hotel reserves the right to substitute comparable amenities when necessary.' },
  { title: 'Incidental Fees', body: "Hotels may require a credit card authorization hold for incidental charges upon check-in. The hold amount varies by property and will be released within 3–5 business days after check-out, provided no charges are incurred. HoCoBook is not responsible for incidental charges assessed directly by the hotel." },
]

const props = defineProps({
  // [{ name?, image?, policies?: [{ title, body }] }]. 1 entry → single card;
  // >1 → accordion. Omit for a generic single card.
  hotels: { type: Array, default: () => [{}] },
  flow: { type: String, default: 'reserve' }, // reserve | group
  title: { type: String, default: 'Policies' },
  ctaLabel: { type: String, default: '' },      // overrides the flow default
  agreementText: { type: String, default: '' }, // overrides the single-card default
})
const emit = defineEmits(['submit'])

const isGroup = computed(() => props.flow === 'group')
const multi = computed(() => props.hotels.length > 1)
const cta = computed(() => props.ctaLabel || (isGroup.value ? 'Hold Group Block Now' : 'Book Now'))
const singleAgreement = computed(() => props.agreementText || (isGroup.value
  ? 'By clicking this checkbox, I acknowledge that I have read and agree to the Hotel and HoCo Book Reservation Policies.'
  : 'By clicking this checkbox, I acknowledge that I have read and agree to the Reservation Policies and I authorize HoCoBook to charge the above credit card.'))
const policiesFor = (h) => (h && h.policies) || DEFAULT_POLICIES

// Agreement state — one flag per hotel (single card = one flag).
const agreed = ref(props.hotels.map(() => false))
const allAgreed = computed(() => agreed.value.every(Boolean))

// Accordion open state (multi only) — first hotel open by default.
const open = ref(props.hotels.map((_, i) => i === 0))
const toggle = (i) => { open.value[i] = !open.value[i] }

const submit = () => { if (allAgreed.value) emit('submit') }
</script>

<template>
  <div class="pol">
    <!-- SINGLE HOTEL — one policies card -->
    <template v-if="!multi">
      <div class="pol__card">
        <div class="pol__cardhead">
          <template v-if="hotels[0] && hotels[0].name">
            <img v-if="hotels[0].image" :src="hotels[0].image" :alt="hotels[0].name" class="pol__thumb" />
            <div class="pol__headtext"><span class="pol__eyebrow">Policies</span><span class="pol__hotelname">{{ hotels[0].name }}</span></div>
          </template>
          <h3 v-else class="pol__title">{{ title }}</h3>
        </div>
        <div v-for="p in policiesFor(hotels[0])" :key="p.title" class="pol__sec">
          <h4 class="pol__sectitle">{{ p.title }}</h4>
          <p class="pol__secbody">{{ p.body }}</p>
        </div>
      </div>

      <label class="pol__agree">
        <input type="checkbox" v-model="agreed[0]" class="pol__check" />
        <span>{{ singleAgreement }}</span>
      </label>
    </template>

    <!-- MULTIPLE HOTELS — accordion, one agreement checkbox each -->
    <template v-else>
      <div v-for="(h, i) in hotels" :key="i" class="pol__ac">
        <button type="button" class="pol__achead" :aria-expanded="open[i]" @click="toggle(i)">
          <img v-if="h.image" :src="h.image" :alt="h.name" class="pol__thumb" />
          <div class="pol__headtext"><span class="pol__eyebrow">Policies</span><span class="pol__hotelname">{{ h.name }}</span></div>
          <q-icon :name="open[i] ? 'expand_less' : 'expand_more'" size="24px" class="pol__chev" />
        </button>
        <div v-show="open[i]" class="pol__acbody">
          <div v-for="p in policiesFor(h)" :key="p.title" class="pol__sec">
            <h4 class="pol__sectitle">{{ p.title }}</h4>
            <p class="pol__secbody">{{ p.body }}</p>
          </div>
          <label class="pol__agree pol__agree--inac">
            <input type="checkbox" v-model="agreed[i]" class="pol__check" />
            <span>I have read and agree to <strong>{{ h.name }}</strong>'s Hotel and HoCo Book Reservation Policies.</span>
          </label>
        </div>
      </div>
    </template>

    <button type="button" class="pol__cta" :class="{ 'pol__cta--ready': allAgreed }" :disabled="!allAgreed" @click="submit">{{ cta }}</button>
  </div>
</template>

<style scoped>
.pol { max-width: 640px; margin: 0 auto; }

/* Policy card / accordion body share the section styling */
.pol__card { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); overflow: hidden; }
.pol__cardhead { padding: 18px 24px; border-bottom: 1px solid var(--ds-color-border); display: flex; align-items: center; gap: 12px; }
.pol__title { margin: 0; font-size: 1.375rem; font-weight: 700; color: var(--ds-color-text-brand); }
.pol__thumb { width: 44px; height: 44px; border-radius: var(--ds-radius-sm); object-fit: cover; flex: none; }
.pol__headtext { display: flex; flex-direction: column; }
.pol__eyebrow { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-color-text-subtle); }
.pol__hotelname { font-size: 1.125rem; font-weight: 700; color: var(--ds-color-text-brand); }

.pol__sec { padding: 16px 24px; border-bottom: 1px solid var(--ds-color-border); }
.pol__sec:last-child { border-bottom: 0; }
.pol__sectitle { margin: 0 0 6px; font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text-brand); }
.pol__secbody { margin: 0; font-size: 0.9375rem; line-height: 1.6; color: var(--ds-color-text-subtle); }

/* Accordion */
.pol__ac { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); overflow: hidden; margin-bottom: 12px; }
.pol__achead { display: flex; align-items: center; gap: 12px; width: 100%; padding: 16px 20px; background: none; border: 0; cursor: pointer; text-align: left; }
.pol__chev { margin-left: auto; color: var(--ds-color-text-subtle); flex: none; }
.pol__acbody { border-top: 1px solid var(--ds-color-border); }
.pol__acbody .pol__sec:last-of-type { border-bottom: 1px solid var(--ds-color-border); }

/* Agreement checkbox */
.pol__agree { display: flex; align-items: flex-start; gap: 12px; padding: 16px 8px; font-size: 0.9375rem; line-height: 1.5; color: var(--ds-color-text); cursor: pointer; }
.pol__agree--inac { padding: 16px 24px 20px; }
.pol__check { width: 22px; height: 22px; flex: none; margin: 0; accent-color: var(--ds-color-background-brand-bold); cursor: pointer; }

/* CTA — muted until all agreements are checked, then navy */
.pol__cta { width: 100%; height: 56px; margin-top: 8px; border: 0; border-radius: var(--ds-radius-button); background: var(--ds-palette-slate-300); color: #fff; font-family: inherit; font-size: 1.0625rem; font-weight: 700; cursor: default; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.pol__cta--ready { background: var(--ds-color-background-brand-bold); cursor: pointer; }
.pol__cta--ready:hover { background: var(--ds-palette-navy-800); }
</style>
