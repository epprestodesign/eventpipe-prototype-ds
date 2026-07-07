/** DES-207 / V2 · Configured Template (Phase 2) — full App Shell, drill-in editor. */
import { ref, computed } from 'vue'
import { page } from '../pages/_shell'
import { travelocHeader, goBackLink } from './_des207'
import DsField from '../../components/DsField.vue'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import DsRichTextEditor from '../../components/DsRichTextEditor.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/V2 · Configured Template',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Phase 2 in the App Shell (drill-in from V1 via "Go Back to Preferences"). A **+ Compliance Reminder Settings** button expands the Phase-2 config (begin/end reminder days, a Google-Calendar-style **Recurrence Picker**, compliance statuses, recipients). Below it: Send Email Preview, the **Content** editor (Teams Management variables + inline `{{`), and BCC.' } } },
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const TEAM_TOKENS = [
  { group: 'Event Details', items: [
    { name: 'Event Name', desc: 'The name of the event.' },
    { name: 'Event Start Date', desc: 'The date the event begins.' },
    { name: 'Event End Date', desc: 'The date the event ends.' },
    { name: '# of Days until Event Start Date', desc: 'Countdown to the event start.' },
    { name: 'Event Logo', desc: "The event's logo image." },
    { name: 'Entity Name', desc: 'Organization Name or Team Name, per the compliance entity.' },
  ] },
  { group: 'Compliance', items: [
    { name: 'Compliance Policy', desc: 'The event-level compliance policy (link or synopsis).' },
    { name: 'Compliance Criteria', desc: 'The room-night criteria the team must meet.' },
    { name: 'Rooms / Room Nights Booked', desc: 'Booked to date, compared to the compliance criteria.' },
  ] },
  { group: 'Hotels & Group Blocks', items: [
    { name: 'Last Hotel Cutoff Date', desc: 'The latest hotel cutoff date.' },
    { name: 'Days until Last Hotel Cutoff Date', desc: 'Countdown to the last cutoff.' },
    { name: '# of Open Group Blocks for the Team', desc: 'Open group blocks for this team.' },
    { name: 'Group Block Release Date', desc: 'When the group block releases.' },
    { name: 'Booking Site Link', desc: "Link to the event's booking site." },
  ] },
  { group: 'Contact', items: [
    { name: 'Customer Contact Info', desc: 'General or event-manager contact information.' },
  ] },
]

const DEFAULT_CONTENT = `
<p>Hi {{ Entity Name }},</p>
<p>This is a friendly reminder about the Stay-to-Play requirement for <strong>{{ Event Name }}</strong> ({{ Event Start Date }} – {{ Event End Date }}).</p>
<p>Your team has booked <strong>{{ Rooms / Room Nights Booked }}</strong> against a requirement of <strong>{{ Compliance Criteria }}</strong>. The last hotel cutoff is <strong>{{ Last Hotel Cutoff Date }}</strong> ({{ Days until Last Hotel Cutoff Date }} away).</p>
<p>Book your rooms here: <a href="#">{{ Booking Site Link }}</a></p>
<p>Questions? {{ Customer Contact Info }}</p>`

// The Phase-2 config, expanded by the "+ Compliance Reminder Settings" button.
// The Recurrence field is the Google-Calendar-style Recurrence Picker.
const reminderSettings = `
  <div class="q-mb-lg">
    <q-btn outline no-caps color="primary" :icon="showSettings ? 'expand_less' : 'add'"
      label="Compliance Reminder Settings" @click="showSettings = !showSettings" />
    <q-slide-transition>
      <div v-show="showSettings" class="q-mt-md">
        <q-card flat bordered style="background:var(--ds-color-surface-sunken);">
          <q-card-section style="padding:24px 28px;">
            <div class="text-primary text-weight-bold q-mb-md">Compliance Reminder Settings</div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6"><ds-input v-model="begin" type="number" unit="days" label="Days until Event Start to Begin Reminders" :min="0" /></div>
              <div class="col-12 col-sm-6"><ds-input v-model="end" type="number" unit="days" label="Days until Event Start to End Reminders" :min="0" /></div>
            </div>

            <div class="row q-col-gutter-md q-mt-xs">
              <div class="col-12 col-sm-6"><ds-select :model-value="rec" @update:model-value="onSelect" :options="options" label="Recurrence" /></div>
              <div class="col-12 col-sm-6"><ds-select v-model="statuses" label="Compliance Statuses to Include" multiple :options="['Non-Compliant','At Risk','Compliant','Pending Review']" /></div>
            </div>

            <ds-field label="Recipients" required class="q-mt-md">
              <q-option-group v-model="recipients" type="checkbox" color="primary" inline :options="[
                { label: 'Team Manager', value: 'team-manager' },
                { label: 'Group Block Contacts', value: 'group-block-contacts' },
              ]" />
            </ds-field>
          </q-card-section>
        </q-card>

        <!-- Custom recurrence dialog (Google-Calendar-style) -->
        <q-dialog v-model="showCustom">
          <q-card style="min-width:440px; border-radius:var(--ds-radius-lg);">
            <q-card-section style="padding:28px 28px 8px;">
              <div class="text-h6" style="font-weight:700;">Custom recurrence</div>
            </q-card-section>
            <q-card-section style="padding:12px 28px;">
              <div class="row items-center q-gutter-md">
                <span class="text-grey-8">Repeat every</span>
                <q-input v-model.number="every" type="number" outlined dense min="1" style="width:80px" hide-bottom-space />
                <q-select v-model="unit" :options="['day','week','month','year']" outlined dense style="width:140px" hide-bottom-space />
              </div>
            </q-card-section>
            <q-card-section v-if="unit === 'week'" style="padding:12px 28px;">
              <div class="text-grey-8 q-mb-sm">Repeat on</div>
              <div class="row q-gutter-sm">
                <q-btn v-for="(lbl, d) in DAY_LABELS" :key="d" round unelevated
                  :color="days.includes(d) ? 'primary' : 'grey-3'" :text-color="days.includes(d) ? 'white' : 'dark'"
                  :label="lbl" size="sm" @click="toggleDay(d)" />
              </div>
            </q-card-section>
            <q-card-section style="padding:12px 28px 20px;">
              <div class="text-grey-8 q-mb-sm">Ends</div>
              <q-radio v-model="ends" val="never" label="Never" color="primary" class="block q-mb-sm" />
              <div class="row items-center q-gutter-md q-mb-sm">
                <q-radio v-model="ends" val="on" label="On" color="primary" />
                <q-input v-model="endsOn" outlined dense :disable="ends !== 'on'" style="width:170px" hide-bottom-space>
                  <template #append><q-icon name="event" /></template>
                </q-input>
              </div>
              <div class="row items-center q-gutter-md">
                <q-radio v-model="ends" val="after" label="After" color="primary" />
                <q-input v-model.number="endsAfter" type="number" outlined dense :disable="ends !== 'after'" suffix="occurrences" style="width:200px" hide-bottom-space />
              </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pa-md">
              <q-btn flat no-caps color="primary" label="Cancel" v-close-popup />
              <q-btn unelevated no-caps color="primary" label="Done" @click="done" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-slide-transition>
  </div>`

export const Template = page({
  active: 'none',
  org: 'Traveloc',
  user: 'Mike Addesa',
  components: { DsField, DsInput, DsSelect, DsRichTextEditor },
  setup: () => {
    const content = ref(DEFAULT_CONTENT)
    const preview = ref('')
    const bcc = ref('')
    const tab = ref('notifications')
    const showSettings = ref(false)

    // Reminder config
    const begin = ref(30)
    const end = ref(3)
    const statuses = ref(['Non-Compliant', 'At Risk'])
    const recipients = ref(['team-manager'])

    // Recurrence picker (Google-Calendar-style)
    const showCustom = ref(false)
    const every = ref(1)
    const unit = ref('week')
    const days = ref([1, 4, 6]) // Mon, Thu, Sat
    const ends = ref('never')
    const endsOn = ref('2026-08-06')
    const endsAfter = ref(13)
    const summary = computed(() => {
      const picked = days.value.slice().sort().map((d) => DAY_NAMES[d]).join(', ')
      let s = `${unit.value === 'week' ? 'Weekly' : 'Every ' + every.value + ' ' + unit.value}` + (picked ? ` on ${picked}` : '')
      if (ends.value === 'on') s += `, until Aug 6, 2026`
      if (ends.value === 'after') s += `, ${endsAfter.value} times`
      return s
    })
    const options = computed(() => ['Does not repeat', 'Daily', 'Every weekday (Mon–Fri)', summary.value, 'Custom…'])
    const rec = ref(summary.value)
    const onSelect = (val) => { if (val === 'Custom…') { showCustom.value = true; rec.value = summary.value } else rec.value = val }
    const toggleDay = (d) => { const i = days.value.indexOf(d); if (i === -1) days.value.push(d); else days.value.splice(i, 1) }
    const done = () => { rec.value = summary.value; showCustom.value = false }

    return {
      content, preview, bcc, tab, tokens: TEAM_TOKENS, showSettings,
      begin, end, statuses, recipients,
      showCustom, every, unit, days, ends, endsOn, endsAfter, options, rec, onSelect, toggleDay, done, DAY_LABELS,
    }
  },
  slot: `
    ${travelocHeader}
    <div style="padding:20px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="q-mb-md">${goBackLink}</div>
      <q-card flat bordered>
        <q-card-section style="padding:24px 32px;">
          <div class="row items-center justify-between">
            <h2 style="margin:0; font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">Compliance Reminder</h2>
            <div class="row q-gutter-sm">
              <q-btn outline no-caps color="primary" label="Cancel" />
              <q-btn unelevated no-caps color="primary" label="Save" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="padding:24px 32px;">
          <div class="q-mb-lg" style="max-width:520px;">
            <ds-field label="Send Email Preview to">
              <q-input v-model="preview" outlined dense placeholder="Email Address" hide-bottom-space>
                <template #append><q-btn flat dense no-caps color="primary" label="Send" /></template>
              </q-input>
            </ds-field>
          </div>

          <div class="q-mb-lg">
            <ds-rich-text-editor v-model="content" label="Content" required :tokens="tokens" :default-content="content" />
          </div>

          <div class="q-mb-lg" style="max-width:520px;">
            <ds-field label="BCC Recipient">
              <q-input v-model="bcc" outlined dense placeholder="Email Address" hide-bottom-space />
            </ds-field>
          </div>

          ${reminderSettings}
        </q-card-section>
      </q-card>
    </div>`,
})
Template.parameters = { layout: 'fullscreen' }
