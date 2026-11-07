import StdPrototype from './components/StdPrototype.vue'
import { screen, docText } from './_screens'

export default {
  // ASCII id: the title's "·" would otherwise end up in the URL.
  id: 'design-requests-single-team-add-and-delete-screens-02-team-edit-create-mode',
  title: 'Design Requests/Single-Team Add and Delete/Screens/02 · Team Edit · Create Mode',
  component: StdPrototype,
  tags: ['autodocs', 'STA-2', 'ENG2-116', 'STA-3', 'ENG2-117', 'STA-4', 'ENG2-118'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docText('Add single team opens Team Edit in create mode: the required **Event** dropdown, then the Details fields. Tabs, Goals & Restrictions, Compliance Credits and Notes stay hidden until the first save. Save runs the uploader’s validation; a valid save becomes the normal Team Edit.', 'STA-2', 'STA-3', 'STA-4') } } },
}

/** Opened from an unfiltered list: Event reads “Please select”. */
export const NoEventSelected = screen({ start: 'create', review: true })
NoEventSelected.storyName = 'Event · Please select'
/** Opened from a list filtered to an event: Event is preselected. */
export const EventPreselected = screen({ start: 'create', filter: 'evt-east', review: true })
EventPreselected.storyName = 'Event · preselected'
/** Save pressed with nothing filled in: every inline error, nothing created. */
export const Errors = screen({ start: 'create', showErrors: true, review: true })
Errors.storyName = 'Save with errors'
/** Click to fill is on: click any empty field to fill it with sample data. */
export const ClickToFill = screen({ start: 'create', filter: 'evt-east', review: true, clickFill: true })
ClickToFill.storyName = 'Autofill · click to fill'
