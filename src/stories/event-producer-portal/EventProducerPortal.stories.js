/** EVENT PRODUCER PORTAL — the client-facing event portal prototype. One self-
 *  contained component (EventProducerPortalFlow) renders the event-detail
 *  template (Hotels / Group Blocks / Reservations tabs) for the "2027 - DanceFest
 *  - Grand Nationals & NCA - Milwaukee - Classic" event. The Reservations tab
 *  kicks off the 3-step Bulk Edit wizard (Select → Edit → Results).
 *
 *  V1 scope: only guest NAME + EMAIL are editable; the "Reserved On" column is
 *  gone (no horizontal scroll); placeholder data is Staff Member 1–50 sharing
 *  one email. All data is fake. */
import EventProducerPortalFlow from '../../components/EventProducerPortalFlow.vue'

export default {
  title: 'Event Producer Portal/Event Producer Portal',
  component: EventProducerPortalFlow,
  parameters: { layout: 'fullscreen' },
}

const make = (props) => ({
  render: () => ({
    components: { EventProducerPortalFlow },
    setup: () => ({ props }),
    template: '<event-producer-portal-flow v-bind="props" />',
  }),
})

// Full clickable flow (start on the Hotels tab). Deep linking is OFF in Storybook
// so it doesn't fight the iframe URL — use the standalone prototype for URLs.
export const Prototype = make({})
Prototype.storyName = 'Prototype — Full Flow'

// Event detail, opened on each tab.
export const Hotels = make({ startTab: 'hotels' })
Hotels.storyName = 'Event Detail — Hotels'

export const GroupBlocks = make({ startTab: 'group-blocks' })
GroupBlocks.storyName = 'Event Detail — Group Blocks'

export const Reservations = make({ startTab: 'reservations' })
Reservations.storyName = 'Event Detail — Reservations'

// The Bulk Edit wizard, opened directly at each step.
export const BulkEditSelect = make({ startScreen: 'wizard', startStep: 1 })
BulkEditSelect.storyName = 'Bulk Edit — Select'

export const BulkEditEdit = make({ startScreen: 'wizard', startStep: 2 })
BulkEditEdit.storyName = 'Bulk Edit — Edit (name + email)'
