/** DES-456 · Reservation summary — up to three secondary fees.
 *
 *  The admin-side reservation summary (Events › Reservations › a reservation ›
 *  Summary). Josh's note is that this component is reused, so the fee block is
 *  a loop over whatever the reservation carries rather than a hard-coded row.
 *
 *  The reservation here is the four-night stay Josh demos with, so a $5 per
 *  room night fee reads as $20 — the same arithmetic the price-details pop-up
 *  shows the guest.
 *
 *  Note: the surrounding record chrome is recreated from the app's reservation
 *  pattern rather than a capture of this exact screen — the summary card is the
 *  part under review.
 */
import { ref, reactive } from 'vue'
import { msfPage, makeFees, HOTEL_FEE_SEEDS, CURRENT_HOTEL_FEE, EVENT, HOTEL, RESERVATION } from './_msf'
import MsfReservationSummary from './components/MsfReservationSummary.vue'
import DsInfoGrid from '../../../components/DsInfoGrid.vue'

export default {
  title: 'Design Requests/Multiple Secondary Fees/Screens/04 · Reservation Summary',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**DES-456.** The shared reservation summary, showing every configured secondary fee with the arithmetic behind its amount.' } },
  },
}

const RES_TABS = ['Summary', 'Guest Info', 'Payments', 'Notes', 'Activity Logs']

const STAY = [
  { label: 'Hotel', value: HOTEL.name },
  { label: 'Room Type', value: RESERVATION.roomType },
  { label: 'Check-in', value: RESERVATION.checkIn },
  { label: 'Check-out', value: RESERVATION.checkOut },
  { label: 'Nights', value: String(RESERVATION.nights) },
  { label: 'Occupancy', value: RESERVATION.occupancy },
  { label: 'Rooms', value: String(RESERVATION.rooms) },
  { label: 'Status', value: RESERVATION.status },
]

const GUEST = [
  { label: 'Guest', value: RESERVATION.guest },
  { label: 'Email', value: RESERVATION.email },
  { label: 'Phone', value: RESERVATION.phone },
  { label: 'Confirmation #', value: RESERVATION.confirmation },
  { label: 'Pipe ID', value: RESERVATION.pipeId },
  { label: 'Group ID', value: RESERVATION.groupId },
]

const SLOT = `
  <div style="padding:20px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-sm">
      <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
      <q-breadcrumbs-el label="Events" />
      <q-breadcrumbs-el label="${EVENT.name}" />
      <q-breadcrumbs-el label="Reservations" />
      <q-breadcrumbs-el label="${RESERVATION.guest}" class="text-grey-6" />
    </q-breadcrumbs>

    <div class="row items-center q-gutter-md no-wrap q-mb-md">
      <div class="text-primary" style="font-size:1.5rem; font-weight:700;">${RESERVATION.guest}</div>
      <q-chip dense color="positive" text-color="white" label="${RESERVATION.status}" />
      <q-space />
      <q-btn outline no-caps color="primary" label="Edit Reservation" />
      <q-btn flat round dense icon="more_horiz" color="grey-7" />
    </div>

    <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7">
      <q-tab v-for="t in resTabs" :key="t" :name="t.toLowerCase().replace(/ /g,'-')" :label="t" />
    </q-tabs>
  </div>

  <div style="padding:26px 32px 64px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div style="display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.1fr); gap:24px; align-items:start; max-width:1240px;">
      <div class="column q-gutter-y-md">
        <q-card flat bordered>
          <div style="padding:24px 28px;">
            <div class="text-primary q-mb-md" style="font-size:1.125rem; font-weight:500;">Guest</div>
            <ds-info-grid :items="guest" min-col-width="100%" label-width="140px" />
          </div>
        </q-card>
        <q-card flat bordered>
          <div style="padding:24px 28px;">
            <div class="text-primary q-mb-md" style="font-size:1.125rem; font-weight:500;">Stay</div>
            <ds-info-grid :items="stay" min-col-width="100%" label-width="140px" />
          </div>
        </q-card>
      </div>

      <msf-reservation-summary :reservation="reservation" :fees="fees" />
    </div>
  </div>`

const summaryStory = (seeds) => msfPage({
  active: 'events',
  components: { MsfReservationSummary, DsInfoGrid },
  setup: () => ({
    tab: ref('summary'),
    resTabs: RES_TABS,
    guest: GUEST,
    stay: STAY,
    reservation: RESERVATION,
    fees: reactive(makeFees(seeds)),
  }),
  slot: SLOT,
})

/** Today's shape: a single secondary fee on the reservation. */
export const OneFee = summaryStory([CURRENT_HOTEL_FEE])
OneFee.storyName = 'One fee (today)'

/** Two fees — a per-room-night and a per-reservation charge together. */
export const TwoFees = summaryStory(HOTEL_FEE_SEEDS.slice(0, 2))
TwoFees.storyName = 'Two fees'

/** The maximum: three fees, each with its own basis and total. */
export const ThreeFees = summaryStory(HOTEL_FEE_SEEDS)
ThreeFees.storyName = 'Three fees (max)'
