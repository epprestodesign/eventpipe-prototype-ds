/** Components / Registration Settings / Communications Card.
 *
 *  EXISTING (Phase 2, DES-425) with ONE addition for PP-44: the line naming the
 *  Compliance Reminder recipients.
 */
import { reactive } from 'vue'
import GbrCommunicationsCard from './components/GbrCommunicationsCard.vue'
import { TM_TEMPLATES } from './_gbr'

export default {
  title: 'Design Requests/Sept 4/Components/Registration Settings/Communications Card',
  component: GbrCommunicationsCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Existing card** (Phase 2, [DES-425 · P0-1](https://linear.app/eventpipe/issue/DES-425)) —
one toggle per company-level Teams Management template, controlling only whether
it sends for this event.

### What this request adds

A line under **Compliance Reminder** naming its recipients.

Of the three conditions that raise the conflict modal, two are visible to the
user: this toggle, and group block reminders over on Email Settings. The third —
whether the company's recipient configuration includes group block contacts —
is invisible from this page. Without stating it, the modal arrives from nowhere
and the user has no way to work out why, since the setting that caused it lives
on a screen they were not on.

With the line, the modal confirms something already on screen rather than
introducing it.

It is deliberately **a plain line, not a warning**. On its own, "recipients
include group block contacts" is a fact about how the company is configured, not
a problem — it only becomes one when group block reminders are also on, and that
is what the modal is for. Colouring it amber here would cry wolf on every event
that has no conflict at all.

Compare **Recipients include group block contacts** with **Recipients exclude
them**: same card, and in the second case saving never raises the modal.
` } } },
}

const card = (props) => ({
  components: { GbrCommunicationsCard },
  setup: () => ({ templates: reactive(TM_TEMPLATES.map((t) => ({ ...t }))), props }),
  template: '<div style="max-width:860px;"><gbr-communications-card :templates="templates" v-bind="props" /></div>',
})

/** As it ships: Compliance Reminder off, no recipient line. */
export const Seeded = { render: () => card({ recipientsIncludeGroupBlockContacts: false }) }

/** The conflict primed — two tiers include group block contacts. Switch
 *  Compliance Reminder on and, on the real screen, Save raises the modal. */
export const WithGroupBlockContacts = { render: () => card({ recipientsIncludeGroupBlockContacts: true, tiers: 2 }) }
WithGroupBlockContacts.storyName = 'Recipients include group block contacts'

/** Four tiers — the line counts them, since four tiers of overlap is a
 *  different proposition from one. */
export const FourTiers = { render: () => card({ recipientsIncludeGroupBlockContacts: true, tiers: 4 }) }
FourTiers.storyName = 'Four tiers'

/** Third condition false. Nothing to warn about, so nothing is said and Save
 *  never raises the modal. */
export const NoGroupBlockContacts = { render: () => card({ recipientsIncludeGroupBlockContacts: false }) }
NoGroupBlockContacts.storyName = 'Recipients exclude them'
