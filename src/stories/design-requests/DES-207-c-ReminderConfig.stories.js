/** DES-207 / Components / Reminder Config → Phase-2 config panel (library only). */
import { ref } from 'vue'
import DsField from '../../components/DsField.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'

export default {
  title: 'Design Requests/DES-207 Communications | Email Template Editor/Components/Reminder Config',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Phase-2 compliance-reminder configuration, composed entirely from Form Field / Input Number / Select / Multi-Select / Checkbox group. Test email + BCC sit below the config, per the feedback.' } } },
}

const DAYS = [
  { label: 'Mon', value: 'mon' }, { label: 'Tue', value: 'tue' }, { label: 'Wed', value: 'wed' },
  { label: 'Thu', value: 'thu' }, { label: 'Fri', value: 'fri' }, { label: 'Sat', value: 'sat' }, { label: 'Sun', value: 'sun' },
]

export const Config = {
  render: () => ({
    components: { DsField, DsInput, DsSelect },
    setup: () => ({
      begin: ref(30), end: ref(3), rec: ref('Weekly'), days: ref(['mon']),
      statuses: ref(['Non-Compliant', 'At Risk']), recipients: ref(['team-manager']),
      test: ref(''), bcc: ref(''), DAYS,
    }),
    template: `
      <q-card flat bordered style="max-width:760px;">
        <q-card-section style="padding:28px 32px;">
          <div class="text-primary text-weight-bold q-mb-md">Compliance Reminder Settings</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6"><ds-input v-model="begin" type="number" unit="days" label="Days until Event Start to Begin Reminders" :min="0" /></div>
            <div class="col-12 col-sm-6"><ds-input v-model="end" type="number" unit="days" label="Days until Event Start to End Reminders" :min="0" /></div>
          </div>

          <div class="row q-col-gutter-md q-mt-xs">
            <div class="col-12 col-sm-6"><ds-select v-model="rec" label="Recurrence" :options="['Daily','Weekly','Bi-Weekly','Specific Days of the Week']" /></div>
            <div class="col-12 col-sm-6"><ds-select v-model="statuses" label="Compliance Statuses to Include" multiple :options="['Non-Compliant','At Risk','Compliant','Pending Review']" /></div>
          </div>

          <ds-field v-if="rec === 'Specific Days of the Week'" label="On these days" class="q-mt-md">
            <q-btn-toggle v-model="days" multiple no-caps unelevated toggle-color="primary" color="grey-3" text-color="dark" :options="DAYS" />
          </ds-field>

          <ds-field label="Recipients" required class="q-mt-md">
            <q-option-group v-model="recipients" type="checkbox" color="primary" inline :options="[
              { label: 'Team Manager', value: 'team-manager' },
              { label: 'Group Block Contacts', value: 'group-block-contacts' },
            ]" />
          </ds-field>
        </q-card-section>

        <q-separator />

        <q-card-section style="padding:28px 32px;">
          <div class="text-weight-bold q-mb-md">Test &amp; delivery</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6"><ds-input v-model="test" type="email" label="Send test email to" placeholder="you@company.com" /></div>
            <div class="col-12 col-sm-6"><ds-input v-model="bcc" type="email" label="BCC" placeholder="bcc@company.com" /></div>
          </div>
        </q-card-section>
      </q-card>`,
  }),
}
