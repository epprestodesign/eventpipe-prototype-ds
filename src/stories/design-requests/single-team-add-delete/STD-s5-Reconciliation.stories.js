import StdPrototype from './components/StdPrototype.vue'
import { screen, docText } from './_screens'

export default {
  // ASCII id: the title's "·" would otherwise end up in the URL.
  id: 'design-requests-single-team-add-and-delete-screens-05-event-reconciliation',
  title: 'Design Requests/Single-Team Add and Delete/Screens/05 · Event Reconciliation',
  component: StdPrototype,
  tags: ['autodocs', 'STD-3', 'ENG2-113'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docText('An event’s Reconciliation page, opened by clicking an event on the Compliance page’s Reconciliation tab, or from “View in Reconciliation” after a delete. Rebuilt from the TTS production captures: Group Blocks and Individual Reservations tabs, one card per unlinked item. Registered Team Selection opens a Search… field and the event’s teams grouped by organization; picking one fills Location / Phone / Email. Link (an error if no team is picked) or Ignore. After a delete, the team’s open blocks and reservations are listed first, with its name under Unlinked Team Name.', 'STD-3') } } },
}

export const GroupBlocks = screen({ start: 'recon' })
GroupBlocks.storyName = 'Group Blocks'
/** Aspire West's 8 group blocks, each labelled with the edge case it covers — plus the review bar, so Autofill works. */
export const EdgeCases = screen({ start: 'recon', review: true })
EdgeCases.storyName = 'Group Blocks · edge cases'
export const Reservations = screen({ start: 'recon-res' })
Reservations.storyName = 'Individual Reservations'
/** After deleting Augusta Lions GA 13/14: its 2 open blocks and 2 reservations land here. */
export const AfterDelete = screen({ start: 'recon-deleted' })
AfterDelete.storyName = 'After a delete'
