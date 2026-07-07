// DATA DISPLAY / Accordion — expand/collapse rows (FAQ, collapsible sections).
import DsAccordion from '../../components/DsAccordion.vue'

const faqs = [
  { title: 'What time is check-in and check-out?', content: 'Check-in begins at 3:00pm and check-out is at 11:00am. Early check-in may be available on request.' },
  { title: 'Can I modify or cancel my booking?', content: 'Yes — free cancellation applies up until the date shown in your cancellation policy.' },
  { title: 'Is breakfast included?', content: 'A complimentary breakfast is included with this rate and served daily from 6:30–10:00am.' },
  { title: 'Is parking available?', content: 'On-site self-parking is available; see the location details for the garage entrance.' },
  { title: 'Are pets allowed?', content: 'This property is pet friendly. A small cleaning fee may apply.' },
]

export default {
  title: 'Components/Layout & Structure/Accordion',
  component: DsAccordion,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
**Accordion** standardizes the expand/collapse rows used by the confirmation FAQ,
collapsible filter sections, and the cart hold list. Pass \`items\`
(\`[{ title, content }]\`); \`multiple\` allows several open at once.

\`\`\`html
<ds-accordion :items="faqs" :default-open="[0]" />
\`\`\`
` } } },
}

export const FAQ = {
  render: () => ({ components: { DsAccordion }, setup: () => ({ faqs }), template: `<div style="max-width:560px"><ds-accordion :items="faqs" :default-open="[0]" /></div>` }),
}

/** Single-open behavior. */
export const SingleOpen = {
  name: 'Single open',
  render: () => ({ components: { DsAccordion }, setup: () => ({ faqs }), template: `<div style="max-width:560px"><ds-accordion :items="faqs" :multiple="false" /></div>` }),
}
