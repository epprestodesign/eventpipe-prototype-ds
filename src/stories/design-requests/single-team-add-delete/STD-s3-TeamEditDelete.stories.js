import StdPrototype from './components/StdPrototype.vue'
import { screen, docText } from './_screens'

export default {
  // ASCII id: the title's "·" would otherwise end up in the URL.
  id: 'design-requests-single-team-add-and-delete-screens-03-team-edit-delete',
  title: 'Design Requests/Single-Team Add and Delete/Screens/03 · Team Edit · Delete',
  component: StdPrototype,
  tags: ['autodocs', 'STD-1', 'ENG2-110', 'STD-2', 'ENG2-112', 'STA-5', 'ENG2-119'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docText('Team Edit for a registered team, in production’s single-column layout, with **Delete Team** in one of four placements under review: A, a trash-can button in the header; B, a trash button beside Cancel / Save Changes; C, a ••• menu in the header (recommended); D, a section at the bottom of the page. Each opens the confirmation modal; nothing is deleted until the user confirms. A team added through Add single team shows its auto-generated note here.', 'STD-1', 'STD-2', 'STA-5') } } },
}

/** C (recommended): Delete Team inside the header's ••• menu. */
export const TeamEdit = screen({ start: 'team' })
TeamEdit.storyName = 'C · ••• menu (recommended)'
/** A: a trash-can Delete Team button in the header. */
export const OptionA = screen({ start: 'team', deletePlacement: 'button' })
OptionA.storyName = 'A · Trash-can button'
/** B: an icon-only trash button beside Cancel / Save Changes. */
export const OptionB = screen({ start: 'team', deletePlacement: 'save' })
OptionB.storyName = 'B · Beside Save Changes'
/** D: a Delete Team section at the bottom of the page — scroll down. */
export const OptionD = screen({ start: 'team', deletePlacement: 'bottom' })
OptionD.storyName = 'D · Bottom of the page'
/** The modal, Cancel focused by default. */
export const ConfirmModal = screen({ start: 'delete' })
ConfirmModal.storyName = 'Confirmation modal'
/** An event that registers Organizations: the button and modal read “Organization”. */
export const OrganizationModal = screen({ start: 'delete', entity: 'Organization' })
OrganizationModal.storyName = 'Confirmation modal · Organizations'
