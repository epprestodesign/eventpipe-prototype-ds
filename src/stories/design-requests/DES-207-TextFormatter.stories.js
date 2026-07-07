/** DESIGN REQUESTS / 🟢 DES-207 / Text Formatter → DsRichTextEditor (QEditor). */
import { ref } from 'vue'
import DsRichTextEditor from '../../components/DsRichTextEditor.vue'

export default {
  title: 'Design Requests/🟢 DES-207 Communications | Email Template Editor/Components/Text Formatter',
  component: DsRichTextEditor,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
The email template **Content** editor. Built on **Quasar QEditor** with a DS
toolbar (bold/italic/underline · lists · align · link · undo/redo · Formatting),
plus **Restore to Default** and a searchable, grouped **Personalization** menu
that inserts merge tokens as plain \`{{ Token }}\` text at the caret.
` } } },
}

const DEFAULT = `
<p>Dear {{ Guest First Name }} {{ Guest Last Name }},</p>
<p>Below is a summary of your hotel reservation including your assigned hotel confirmation number. <strong>(Please DO NOT REPLY to this email as this email address is not monitored.)</strong></p>
<p><strong>Need to change or cancel your reservation?</strong> Please reach out to us directly at {{ Housing Company Email }} or via phone at {{ Housing Company Customer Service Phone Number }}.</p>
<p>Reservation Overview:<br>
{{ Hotel Name }}<br>
{{ Reservation Hotel Address }}, {{ Reservation Hotel City }}, {{ Reservation Hotel State }}, {{ Reservation Hotel Zip }}<br>
<strong>Hotel Confirmation Number:</strong> \${reservation.confirmationNumber}<br>
<strong>Check In:</strong> {{ Check In Date }}<br>
<strong>Check Out:</strong> {{ Check Out Date }}<br>
<strong>Room Type:</strong> {{ Reservation RoomType }}<br>
<strong>Reservation Pipe ID:</strong> {{ Reservation pipeId }}</p>
<p>View Full Reservation Details: <a href="#">Click Here</a><br>
✉️ {{ Housing Company Email }}<br>
📞 {{ Housing Company Customer Service Phone Number }}.<br>
🕐 {{ Housing Company Service Hours }}</p>`

export const TextFormatter = {
  render: () => ({
    components: { DsRichTextEditor },
    setup: () => ({ content: ref(DEFAULT), def: DEFAULT }),
    template: `<div style="padding:32px; max-width:1120px;"><ds-rich-text-editor v-model="content" label="Content" required :default-content="def" /></div>`,
  }),
}
