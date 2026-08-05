/** Teams Mgmt Comms Phase 2 / V2 · Configured Template (Phase 2) — full App Shell, drill-in editor. */
import { ref, computed } from 'vue'
import { page } from '../../pages/_shell'
import { travelocHeader, goBackLink } from './_tmc2'
import DsField from './components/DsField.vue'
import DsInput from './components/DsInput.vue'
import DsSelect from './components/DsSelect.vue'
import DsRichTextEditor from './components/DsRichTextEditor.vue'
// Vue + Quasar (TypeScript) reference source, shown in the "Implementation" panel.
import recurrenceSrc from './app/compliance-reminder/useRecurrence.ts?raw'
import recurrenceFieldSrc from './app/compliance-reminder/RecurrenceField.vue?raw'
import reminderSettingsSrc from './app/compliance-reminder/ReminderSettings.vue?raw'
import editorSrc from './app/compliance-reminder/ComplianceReminderEditor.vue?raw'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/V2 · Configured Template',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Phase 2 in the App Shell (drill-in from V1 via "Go Back to Preferences"). A **+ Compliance Reminder Settings** button expands the Phase-2 config (begin/end reminder days, a Google-Calendar-style **Recurrence Picker**, compliance statuses, recipients). Below it: Send Email Preview, the **Content** editor (Teams Management variables + inline `{{`), and BCC.' } } },
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Merge fields come from DsPersonalizationMenu's built-in DES-430 (P0-6) list —
// deliberately NOT redefined here, so the Personalization menu stays identical
// across the V2 editor, the Text Formatter, and the Components story.

const DEFAULT_CONTENT = `
<p>Hi {{entity_name}},</p>
<p>This is a friendly reminder about the Stay-to-Play requirement for <strong>{{event_name}}</strong> ({{event_start_date}} – {{event_end_date}}).</p>
<p>Your team has booked <strong>{{compliance_progress_booked}}</strong> of the <strong>{{compliance_goal}}</strong> {{compliance_criteria}} required — <strong>{{compliance_progress_remaining}}</strong> to go. The last hotel cutoff is <strong>{{last_cutoff_date}}</strong> ({{days_until_cutoff}} away).</p>
<p>Book your rooms here: <a href="#">{{booking_link}}</a></p>
<p>Questions? Contact {{event_manager_name}} at {{event_manager_email}}.</p>`

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
      content, preview, bcc, tab, showSettings,
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
            <ds-rich-text-editor v-model="content" label="Content" required :default-content="content" />
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
Template.parameters = {
  layout: 'fullscreen',
  implementation: {
    intro: 'Vue 3 + Quasar (TypeScript) reference — the real components behind this editor. Editor → ReminderSettings → RecurrenceField, with recurrence logic in a composable.',
    files: [
      { name: 'useRecurrence.ts', lang: 'typescript', code: recurrenceSrc },
      { name: 'RecurrenceField.vue', lang: 'html', code: recurrenceFieldSrc },
      { name: 'ReminderSettings.vue', lang: 'html', code: reminderSettingsSrc },
      { name: 'ComplianceReminderEditor.vue', lang: 'html', code: editorSrc },
    ],
  },
}
