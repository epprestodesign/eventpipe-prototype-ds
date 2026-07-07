/** DES-207 / Components / Section Accordion → q-expansion-item + DsListItem (library only). */
import { ref } from 'vue'
import DsListItem from '../../components/DsListItem.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/Components/Section Accordion',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A collapsible notification **section** (the Shopify-style accordion), built from Quasar **q-expansion-item** inside a bordered **Card**, containing **Notification Rows** (List Item). Click the header to expand/collapse.' } } },
}

const teams = [
  { title: 'STP - Compliance Reminder - Early Stage', desc: 'Reminds non-compliant teams about their STP requirement in an encouraging tone.', send: true },
  { title: 'STP - Welcome Email', desc: 'Requests a pickup report, including necessary details and deadlines.', send: true },
  { title: 'STP - Previously Compliant Notice', desc: 'Confirms that a pickup report has been submitted successfully.', send: true },
]
const guests = [
  { title: 'Reservation Confirmation', desc: 'Contains reservation details, including dates, location, and confirmation number.', send: true },
  { title: 'Hotel Confirmation', desc: 'Includes the reservation confirmation number and key booking details.', send: false },
  { title: 'Pre - Arrival', desc: 'Provides important details to help guests prepare for their upcoming stay.', send: true },
]

export const Sections = {
  render: () => ({
    components: { DsListItem },
    setup: () => ({ teams: ref(teams), guests: ref(guests) }),
    template: `
      <div class="column q-gutter-md" style="max-width:900px;">
        <q-card flat bordered>
          <q-expansion-item default-opened label="Teams Management" header-class="text-primary text-weight-bold">
            <q-separator />
            <template v-for="(r, i) in teams" :key="r.title">
              <q-separator v-if="i > 0" />
              <div style="padding:8px 28px;">
                <ds-list-item :title="r.title" :subtitle="r.desc" :bordered="false">
                  <template #trailing><div class="row items-center no-wrap q-gutter-xl"><q-checkbox v-model="r.send" color="primary" /><q-btn unelevated no-caps color="primary" label="Edit" /></div></template>
                </ds-list-item>
              </div>
            </template>
          </q-expansion-item>
        </q-card>

        <q-card flat bordered>
          <q-expansion-item label="Guests" header-class="text-primary text-weight-bold">
            <q-separator />
            <template v-for="(r, i) in guests" :key="r.title">
              <q-separator v-if="i > 0" />
              <div style="padding:8px 28px;">
                <ds-list-item :title="r.title" :subtitle="r.desc" :bordered="false">
                  <template #trailing><div class="row items-center no-wrap q-gutter-xl"><q-checkbox v-model="r.send" color="primary" /><q-btn unelevated no-caps color="primary" label="Edit" /></div></template>
                </ds-list-item>
              </div>
            </template>
          </q-expansion-item>
        </q-card>
      </div>`,
  }),
}
