/** EVENTPIPE LABS / Bulk Reservation Edit / Components — the Bulk Edit field
 *  modals, itemized. Each is the dialog that asks which value(s) to change for the
 *  selected reservations. Two shapes (per the mocks):
 *    • Per-row  (Names / Emails / Check-in Dates) — one input per reservation.
 *    • Apply-to-all (Hotel / Group ID / Reservation Status) — one value → all.
 *    • Delete Reservations — destructive confirm listing what will be removed.
 *  These are the same modals wired into the Bulk Edit wizard (Step 2 → Bulk Edit). */
import { ref, reactive } from 'vue'
import DsModal from '../../components/DsModal.vue'

export default { title: 'Eventpipe Labs/Bulk Reservation Edit/Components', tags: ['autodocs'], parameters: { layout: 'padded' } }

// Self-contained sample data for the modals.
const SAMPLE3 = [
  { name: 'John Smith', email: 'john.smith@example.com', checkIn: 'Tue, 04/01/2025', pipe: 'R-01337893', conf: 'CONF1001' },
  { name: 'Emily Johnson', email: 'emily.johnson@example.com', checkIn: 'Wed, 04/02/2025', pipe: 'R-01337912', conf: 'CONF1002' },
  { name: 'Michael Brown', email: 'michael.brown@example.com', checkIn: 'Thu, 04/03/2025', pipe: 'R-01337925', conf: 'CONF1003' },
]
const SAMPLE2 = SAMPLE3.slice(0, 2)
const HOTEL_OPTS = ['Drury Inn & Suites Denver', 'Richmond Marriott', 'Hilton Garden Inn Denver', 'Courtyard Denver Tech Center', 'Hotel Indigo Denver']
const STATUS_OPTS = ['Confirmed', 'Pending', 'Cancelled']
const CHECKIN_OPTS = ['Tue, 04/01/2025', 'Wed, 04/02/2025', 'Thu, 04/03/2025', 'Fri, 04/04/2025', 'Sat, 04/05/2025', 'Sun, 04/06/2025', 'Wed, 04/12/2025']

/* Per-row modal: label + a control per selected reservation. */
const perRowModal = (title, control) => ({
  render: () => ({
    components: { DsModal },
    setup() {
      const open = ref(true)
      const drafts = reactive({})
      SAMPLE2.forEach((r) => { drafts[r.pipe] = '' })
      return { open, rows: SAMPLE2, drafts, CHECKIN_OPTS }
    },
    template: `
      <div style="padding:40px; min-height:320px;">
        <q-btn unelevated no-caps color="primary" :label="'Open ${title}'" @click="open = true" />
        <ds-modal v-model="open" title="${title}" size="sm">
          <div class="column q-gutter-md">
            <div v-for="r in rows" :key="r.pipe" class="row items-center no-wrap q-gutter-md">
              <div style="flex:none; width:120px; color:var(--ds-color-text-subtle); font-size:0.875rem;">{{ r.pipe }}</div>
              ${control}
            </div>
          </div>
          <template #footer>
            <q-btn flat no-caps color="grey-8" label="Cancel" @click="open = false" />
            <q-btn unelevated no-caps color="primary" label="Done" @click="open = false" />
          </template>
        </ds-modal>
      </div>`,
  }),
})

/* Apply-to-all modal: "Apply something to all fields" + one control. */
const applyAllModal = (title, control) => ({
  render: () => ({
    components: { DsModal },
    setup() {
      const open = ref(true)
      const value = ref('')
      return { open, value, HOTEL_OPTS, STATUS_OPTS }
    },
    template: `
      <div style="padding:40px; min-height:280px;">
        <q-btn unelevated no-caps color="primary" :label="'Open ${title}'" @click="open = true" />
        <ds-modal v-model="open" title="${title}" size="sm">
          <div class="column q-gutter-sm">
            <div class="text-grey-8" style="font-size:0.875rem;">Apply something to all fields</div>
            ${control}
          </div>
          <template #footer>
            <q-btn flat no-caps color="grey-8" label="Cancel" @click="open = false" />
            <q-btn unelevated no-caps color="primary" label="Done" @click="open = false" />
          </template>
        </ds-modal>
      </div>`,
  }),
})

export const EditNames = perRowModal('Edit Names', `<q-input v-model="drafts[r.pipe]" outlined dense bg-color="white" hide-bottom-space class="col" placeholder="New Name" />`)
EditNames.storyName = 'Edit Names'

export const EditEmails = perRowModal('Edit Emails', `<q-input v-model="drafts[r.pipe]" type="email" outlined dense bg-color="white" hide-bottom-space class="col" placeholder="New Email" />`)
EditEmails.storyName = 'Edit Emails'

export const EditCheckInDates = perRowModal('Edit Check-in Dates', `<q-select v-model="drafts[r.pipe]" :options="CHECKIN_OPTS" outlined dense bg-color="white" hide-bottom-space class="col" :placeholder="r.checkIn" />`)
EditCheckInDates.storyName = 'Edit Check-in Dates'

export const EditHotel = applyAllModal('Edit Hotel', `<q-select v-model="value" :options="HOTEL_OPTS" outlined dense bg-color="white" hide-bottom-space />`)
EditHotel.storyName = 'Edit Hotel'

export const EditGroup = applyAllModal('Edit Group', `<q-input v-model="value" outlined dense bg-color="white" hide-bottom-space placeholder="Enter Group ID" />`)
EditGroup.storyName = 'Edit Group ID'

export const EditReservationStatus = applyAllModal('Edit Reservation Status', `<q-select v-model="value" :options="STATUS_OPTS" outlined dense bg-color="white" hide-bottom-space />`)
EditReservationStatus.storyName = 'Edit Reservation Status'

export const DeleteReservations = {
  render: () => ({
    components: { DsModal },
    setup() {
      const open = ref(true)
      return { open, rows: SAMPLE3 }
    },
    template: `
      <div style="padding:40px; min-height:420px;">
        <q-btn unelevated no-caps color="negative" label="Open Delete Reservations" @click="open = true" />
        <ds-modal v-model="open" :title="'Are you sure you want to delete these ' + rows.length + ' reservations?'" size="md">
          <div class="column q-gutter-md">
            <div style="background:var(--ds-color-background-danger); border:1px solid var(--ds-color-background-danger-bold); border-radius:var(--ds-radius-md); padding:10px 14px; color:var(--ds-color-text-danger); font-size:0.875rem;">
              Deleted reservations will be removed from reports and activity logs. This action is permanent.
            </div>
            <div class="text-grey-8" style="font-size:0.875rem;">This action cannot be undone. The following reservations will be permanently deleted:</div>
            <q-markup-table flat bordered separator="horizontal" style="box-shadow:none;">
              <thead>
                <tr>
                  <th class="text-left" style="font-weight:700;">Name</th>
                  <th class="text-left" style="font-weight:700;">Email</th>
                  <th class="text-left" style="font-weight:700;">Pipe ID</th>
                  <th class="text-left" style="font-weight:700;">Hotel Conf #</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rows" :key="r.pipe">
                  <td class="text-left">{{ r.name }}</td>
                  <td class="text-left" style="color:var(--ds-color-text-subtle);">{{ r.email }}</td>
                  <td class="text-left">{{ r.pipe }}</td>
                  <td class="text-left">{{ r.conf }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <template #footer>
            <q-btn flat no-caps color="grey-8" label="Cancel" @click="open = false" />
            <q-btn unelevated no-caps color="negative" label="Delete Reservations" @click="open = false" />
          </template>
        </ds-modal>
      </div>`,
  }),
}
DeleteReservations.storyName = 'Delete Reservations'
