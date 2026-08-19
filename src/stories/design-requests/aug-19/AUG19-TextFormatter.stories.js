/** DESIGN REQUESTS / Teams Mgmt Comms Phase 2 / Text Formatter → DsRichTextEditor (QEditor). */
import { ref } from 'vue'
import DsRichTextEditor from './components/DsRichTextEditor.vue'

export default {
  title: 'Design Requests/Aug 19/Components/Notification Preferences/Text Formatter',
  component: DsRichTextEditor,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
The email template **Content** editor. Built on **Quasar QEditor** with a DS
toolbar (bold/italic/underline · lists · align · link · undo/redo · Formatting),
plus **Restore to Default** and a searchable, grouped **Personalization** menu.

Selecting a field inserts its merge token as plain \`{{token_key}}\` text at the
caret — the same result whether you use the toolbar button or type \`{{\` inline.

The menu carries the **Teams Management** merge fields defined in
[DES-430 (P0-6)](https://linear.app/eventpipe/issue/DES-430/p0-6-email-template-variables-merge-fields):
23 fields across *Event Information*, *Team Information*, *Compliance
Information*, *Key Dates* and *Hoco Contact Information*.

> \`{{noncompliance_policy}}\` is listed but depends on **P1-3** (event-level
> non-compliance policy) shipping; it returns nothing until that field exists.
` } } },
}

// Sample body — a Compliance Reminder, using only DES-430 (P0-6) merge fields.
const DEFAULT = `
<p>Hi {{team_contact_name}},</p>
<p>This is a reminder about the Stay-to-Play requirement for <strong>{{event_name}}</strong> ({{event_start_date}} – {{event_end_date}}).</p>
<p><strong>{{entity_name}}</strong> has booked <strong>{{compliance_progress_booked}}</strong> of the <strong>{{compliance_goal}}</strong> {{compliance_criteria}} required for compliance — <strong>{{compliance_progress_remaining}}</strong> to go.</p>
<p>The last hotel cutoff is <strong>{{last_cutoff_date}}</strong>, which is {{days_until_cutoff}} away. The event itself starts in {{days_until_event}}.</p>
<p>{{team_group_block_info}}</p>
<p>Book your rooms here: <a href="#">{{booking_link}}</a></p>
<p>{{noncompliance_policy}}</p>
<p>Questions? Reach out to {{event_manager_name}} at {{event_manager_email}}, or contact customer service at {{event_cs_email}} / {{event_cs_phone}}.</p>`

export const TextFormatter = {
  render: () => ({
    components: { DsRichTextEditor },
    setup: () => ({ content: ref(DEFAULT), def: DEFAULT }),
    template: `<div style="padding:32px; max-width:1120px;"><ds-rich-text-editor v-model="content" label="Content" required :default-content="def" /></div>`,
  }),
}
