/** DES-451 (companion) · Hotel Sync Settings.
 *
 *  Saving the event opens this screen: pick which setting groups push down to
 *  the hotels already in the event. Today it lists one "Secondary Custom Fee"
 *  group. With three fees it has to list three — and they have to be selectable
 *  **independently**, because the whole point of this screen is choosing what
 *  overwrites hotel-level values. One lumped "Secondary Custom Fees" checkbox
 *  would force a housing manager to overwrite fee 2 and 3 to push fee 1.
 *
 *  A slot the event has turned OFF still appears, greyed, with what syncing it
 *  would do spelled out — because syncing an empty slot deletes that fee from
 *  every hotel, and that is not something to discover afterwards.
 */
import { reactive, computed } from 'vue'
import { msfPage, makeFees, EVENT_FEE_SEEDS, HOTEL_FEE_SEEDS, money, MAX_SECONDARY_FEES } from './_msf'

export default {
  title: 'Design Requests/Multiple Secondary Fees/Screens/02 · Hotel Sync Settings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**DES-451 companion.** The post-save sync screen, with one selectable group per secondary custom fee slot instead of one lumped group.' } },
  },
}

/* The non-fee groups, exactly as they read today. */
const STATIC_GROUPS = [
  { key: 'pickup', label: 'Event Pickup Report', rows: [
    { label: 'Generate', value: 'Yes' },
    { label: 'Upload and Wash Requirements', value: '20%' },
    { label: 'Pickup Report Type', value: 'Night by Night' },
  ] },
  { key: 'addl', label: 'Additional Reservation Fee', rows: [
    { label: 'Type', value: 'Amount' },
    { label: 'Amount', value: '$0.00' },
  ] },
  { key: 'epfee', label: 'EventPipe Reservation Fee', rows: [
    { label: 'Type', value: 'Amount' },
    { label: 'Amount', value: '$0.00' },
  ] },
]

const TAIL_GROUPS = [
  { key: 'wlmax', label: 'Waitlist Maximum', tooltip: 'Maximum reservations per night on the waitlist.', rows: [
    { label: 'Amount', value: '0' },
  ] },
  { key: 'wlexp', label: 'Waitlist Expiration', rows: [
    { label: 'Number of days prior to hotel cut-off date', value: '0' },
  ] },
  { key: 'cancel', label: 'Cancellation Policies', rows: [
    { label: 'Cancellation Policy Details', value: '' },
    { label: 'Number of Tiers', value: '0' },
  ] },
  { key: 'release', label: 'Group Release', rows: [
    { label: 'Group Release Type', value: 'Duration' },
    { label: 'Duration', value: '0' },
  ] },
]

/** One sync group per fee slot. An enabled slot lists the four values that
 *  would be written; a disabled slot says what selecting it would remove. */
function feeGroups(fees) {
  return fees.map((fee, i) => {
    const n = i + 1
    if (!fee.enabled) {
      return {
        key: `fee${n}`, label: `Secondary Custom Fee ${n}`, empty: true,
        rows: [{ label: 'Not configured on this event', value: 'Syncing removes this fee from existing hotels' }],
      }
    }
    return {
      key: `fee${n}`, label: `Secondary Custom Fee ${n}`,
      rows: [
        { label: 'Label', value: fee.label },
        { label: 'Charge Type', value: fee.chargeType },
        { label: 'Amount', value: money(fee.amount) },
        { label: 'Description', value: fee.description },
      ],
    }
  })
}

const SLOT = `
  <div style="padding:0 32px 64px; background:var(--ds-color-surface-sunken); min-height:100%;">

    <!-- Save confirmation carried over from the event page. -->
    <div class="row justify-center" style="padding:14px 0 2px;">
      <div style="background:var(--ds-color-background-success-bold, #21ba45); color:#fff; font-weight:600;
                  padding:10px 22px; border-radius:var(--ds-radius-md); box-shadow:var(--ds-shadow-card);">
        Event successfully updated
      </div>
    </div>

    <div class="row items-center justify-between no-wrap" style="padding:14px 0 18px;">
      <div style="font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">Hotel Sync Settings</div>
      <div class="row items-center q-gutter-sm no-wrap" style="flex:none;">
        <q-btn outline no-caps color="primary" label="Don't Sync Settings" />
        <!-- Nothing selected syncs nothing, so the primary action stays disabled
             until at least one group is picked. -->
        <q-btn unelevated no-caps color="primary" label="Sync Settings" :disable="!selectedCount" />
      </div>
    </div>

    <q-card flat bordered>
      <div style="padding:22px 26px 28px;">
        <div class="text-grey-8" style="font-size:0.9375rem; line-height:1.5; margin-bottom:20px;">
          Please select the setting groups that you want to be updated for existing hotels within this event.
          To keep existing hotels within this event with their current settings, select Don't Sync Settings.
        </div>

        <div class="column q-gutter-y-lg">
          <div v-for="g in groups" :key="g.key">
            <q-checkbox v-model="selected[g.key]" color="primary" dense :disable="false">
              <span style="font-size:0.9375rem; color:var(--ds-color-text);">{{ g.label }}</span>
            </q-checkbox>
            <q-icon v-if="g.tooltip" name="info" size="15px" class="q-ml-xs" style="color:var(--ds-color-icon-subtle);">
              <q-tooltip>{{ g.tooltip }}</q-tooltip>
            </q-icon>

            <div style="margin:8px 0 0 34px; display:grid; grid-template-columns:minmax(0,340px) minmax(0,1fr);
                        gap:6px 40px; max-width:900px; font-size:0.875rem;">
              <template v-for="(r, ri) in g.rows" :key="ri">
                <div :style="{ color: g.empty ? 'var(--ds-color-text-danger)' : 'var(--ds-color-text-subtle)' }">{{ r.label }}</div>
                <div :style="{ color: g.empty ? 'var(--ds-color-text-danger)' : 'var(--ds-color-text)' }">{{ r.value }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>`

const syncStory = (seeds, preselect = ['fee1']) => msfPage({
  active: 'events',
  setup: () => {
    const fees = reactive(makeFees(seeds))
    const groups = computed(() => [...STATIC_GROUPS, ...feeGroups(fees), ...TAIL_GROUPS])
    const selected = reactive(Object.fromEntries(
      [...STATIC_GROUPS, ...TAIL_GROUPS].map((g) => [g.key, false])
        .concat(Array.from({ length: MAX_SECONDARY_FEES }, (_, i) => [`fee${i + 1}`, preselect.includes(`fee${i + 1}`)]))
    ))
    const selectedCount = computed(() => Object.values(selected).filter(Boolean).length)
    return { groups, selected, selectedCount }
  },
  slot: SLOT,
})

/** The event has two fees configured; slot 3 is off and shows what syncing it costs. */
export const TwoFees = syncStory(EVENT_FEE_SEEDS)
TwoFees.storyName = 'Two fees configured'

/** All three configured — three independently selectable sync groups. */
export const ThreeFees = syncStory(HOTEL_FEE_SEEDS, ['fee1', 'fee2', 'fee3'])
ThreeFees.storyName = 'All three configured'
