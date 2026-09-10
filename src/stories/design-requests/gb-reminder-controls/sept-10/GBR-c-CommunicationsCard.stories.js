/** Components / Registration Settings / Communications Card.
 *
 *  EXISTING (Phase 2, DES-425) with ONE addition for PP-44: the line naming the
 *  Compliance Reminder recipients.
 */
import { reactive } from 'vue'
import GbrCommunicationsCard from './components/GbrCommunicationsCard.vue'
import { TM_TEMPLATES } from './_gbr'

export default {
  title: 'Design Requests/GB Reminder Controls/Sept 10/Components/Registration Settings/Communications Card',
  component: GbrCommunicationsCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Existing card** (Phase 2, [DES-425 · P0-1](https://linear.app/eventpipe/issue/DES-425)) —
one toggle per company-level Teams Management template, controlling only whether
it sends for this event.

### Unchanged by this request — reverted 2026-09-09

The first pass added a line under **Compliance Reminder** naming its recipients.
The reasoning: of the three conditions that raise the conflict modal, two are
visible on screen — this toggle, and group block reminders over on Email
Settings — while the third, whether the company's recipient configuration
includes group block contacts, is invisible from this page.

Scott asked for it to come out: *"Please drop the part that you added regarding
[the] small line under Compliance Reminder."* So the card is back to the Phase 2
original.

The condition still drives the modal. It just is not shown here, which means the
modal can arrive without the user having seen the reason for it. Not a problem
today; worth remembering if it ever gets raised as confusing.

**Compliance Reminder on** is the state that primes the conflict — with group
block reminders also on, saving this screen raises the modal.
` } } },
}

const card = (tweak = (t) => t) => ({
  components: { GbrCommunicationsCard },
  setup: () => ({ templates: reactive(TM_TEMPLATES.map((t) => tweak({ ...t }))) }),
  template: '<div style="max-width:860px;"><gbr-communications-card :templates="templates" /></div>',
})

/** As it ships: every template off except the Welcome Email. */
export const Seeded = { render: () => card() }

/** Compliance Reminder switched on. This is the state that primes the conflict:
 *  with group block reminders also on for the event, saving raises the modal.
 *  Nothing on the card says so, which is the trade Scott accepted when the
 *  recipients line came off. */
export const ComplianceReminderOn = {
  render: () => card((t) => (t.key === 'compliance-reminder' ? { ...t, on: true } : t)),
}
ComplianceReminderOn.storyName = 'Compliance Reminder on'
