import StdPrototype from './components/StdPrototype.vue'
import { screen, docText } from './_screens'

export default {
  // ASCII id: the title's "·" would otherwise end up in the URL.
  id: 'design-requests-single-team-add-and-delete-screens-04-event-activity-logs',
  title: 'Design Requests/Single-Team Add and Delete/Screens/04 · Event Activity Logs',
  component: StdPrototype,
  tags: ['autodocs', 'STD-4', 'ENG2-114'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docText('The event’s Activity Logs tab after a delete. The existing columns record who and when; the blurb records what. The new entry is a plain row, like every other entry (not bolded).', 'STD-4') } } },
}

export const AfterDelete = screen({ start: 'log' })
AfterDelete.storyName = 'Entry after a delete'
/** Organizations event: “Organization ‘…’ was deleted.” */
export const Organization = screen({ start: 'log', entity: 'Organization' })
Organization.storyName = 'Entry · Organizations'
