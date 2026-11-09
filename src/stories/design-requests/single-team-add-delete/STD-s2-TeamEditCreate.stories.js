import StdPrototype from './components/StdPrototype.vue'
import { screen, docText } from './_screens'

export default {
  // ASCII id: the title's "·" would otherwise end up in the URL.
  id: 'design-requests-single-team-add-and-delete-screens-02-team-edit-create-mode',
  title: 'Design Requests/Single-Team Add and Delete/Screens/02 · Team Edit · Create Mode',
  component: StdPrototype,
  tags: ['autodocs', 'STA-2', 'ENG2-116', 'STA-3', 'ENG2-117', 'STA-4', 'ENG2-118'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docText('Add single team opens Team Edit in create mode, in production’s single-column layout: the required **Event Name** type-ahead with Cancel / Save Team on top, then Goals & Restrictions, Team / Org Information and Communications as they are today. Compliance Credits and Notes wait until the team exists. Save runs the uploader’s validation; a valid save becomes the normal Team Edit.', 'STA-2', 'STA-3', 'STA-4') } } },
}

/** Opened from an unfiltered list: Event Name is empty — type 4 characters to search. */
export const NoEventSelected = screen({ start: 'create', review: true })
NoEventSelected.storyName = 'Event Name · empty'
/** Opened from a list filtered to an event: Event is preselected. */
export const EventPreselected = screen({ start: 'create', filter: 'evt-east', review: true })
EventPreselected.storyName = 'Event Name · preselected'
/** Save pressed with nothing filled in: every inline error, nothing created. */
export const Errors = screen({ start: 'create', showErrors: true, review: true })
Errors.storyName = 'Save with errors'
/** Click to fill is on: click any empty field to fill it with sample data. */
export const ClickToFill = screen({ start: 'create', filter: 'evt-east', review: true, clickFill: true })
ClickToFill.storyName = 'Autofill · click to fill'
