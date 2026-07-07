/** DES-207 / V2 · Configured Template (Phase 2) — full App Shell, drill-in editor. */
import { ref } from 'vue'
import { page } from '../pages/_shell'
import { travelocHeader, goBackLink } from './_des207'
import DsField from '../../components/DsField.vue'
import DsRichTextEditor from '../../components/DsRichTextEditor.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/V2 · Configured Template',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Phase 2 in the App Shell — a single template editor (drill-in from V1 via "Go Back to Preferences"): Send Email Preview, the **Content** editor (Teams Management variables in Personalization, plus the inline `{{` trigger), and BCC. Same header + tabs as V1.' } } },
}

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

export const Template = page({
  active: 'none',
  org: 'Traveloc',
  user: 'Mike Addesa',
  components: { DsField, DsRichTextEditor },
  setup: () => ({ content: ref(DEFAULT_CONTENT), preview: ref(''), bcc: ref(''), tokens: TEAM_TOKENS, tab: ref('notifications') }),
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

          <div style="max-width:520px;">
            <ds-field label="BCC Recipient">
              <q-input v-model="bcc" outlined dense placeholder="Email Address" hide-bottom-space />
            </ds-field>
          </div>
        </q-card-section>
      </q-card>
    </div>`,
})
Template.parameters = { layout: 'fullscreen' }
