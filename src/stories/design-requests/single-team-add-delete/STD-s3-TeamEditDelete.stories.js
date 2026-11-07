import StdPrototype from './components/StdPrototype.vue'
import { screen, docText } from './_screens'

export default {
  // ASCII id: the title's "·" would otherwise end up in the URL.
  id: 'design-requests-single-team-add-and-delete-screens-03-team-edit-delete',
  title: 'Design Requests/Single-Team Add and Delete/Screens/03 · Team Edit · Delete',
  component: StdPrototype,
  tags: ['autodocs', 'STD-1', 'ENG2-110', 'STD-2', 'ENG2-112', 'STA-5', 'ENG2-119'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docText('Team Edit for a registered team, with **Delete Team** in the header, set apart from Save. It opens the confirmation modal; nothing is deleted until the user confirms. A team added through Add single team shows its auto-generated note here.', 'STD-1', 'STD-2', 'STA-5') } } },
}

/** Delete Team in the header. */
export const TeamEdit = screen({ start: 'team' })
TeamEdit.storyName = 'Team Edit with Delete Team'
/** The modal, Cancel focused by default. */
export const ConfirmModal = screen({ start: 'delete' })
ConfirmModal.storyName = 'Confirmation modal'
/** An event that registers Organizations: the button and modal read “Organization”. */
export const OrganizationModal = screen({ start: 'delete', entity: 'Organization' })
OrganizationModal.storyName = 'Confirmation modal · Organizations'
