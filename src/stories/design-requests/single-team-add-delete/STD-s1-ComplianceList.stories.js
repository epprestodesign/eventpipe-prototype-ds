import StdPrototype from './components/StdPrototype.vue'
import { screen, docText } from './_screens'

export default {
  // ASCII id: the title's "·" would otherwise end up in the URL.
  id: 'design-requests-single-team-add-and-delete-screens-01-compliance-list',
  title: 'Design Requests/Single-Team Add and Delete/Screens/01 · Compliance List',
  component: StdPrototype,
  tags: ['autodocs', 'STA-1', 'ENG2-111', 'STA-2', 'ENG2-116', 'STD-3', 'ENG2-113'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docText('The Compliance page. **Add/Update Teams ▾** replaces the Registration Data Uploader button, beside **Export ▾**. Rows open Team Edit; there is no delete on rows. After a delete the user lands here with a success message.', 'STA-1', 'STA-2', 'STD-3') } } },
}

/** All events. Open **Add/Update Teams ▾**. */
export const Default = screen({ start: 'compliance' })
/** Filtered to one event — Add single team will preselect it. */
export const FilteredToEvent = screen({ start: 'compliance', filter: 'evt-east' })
FilteredToEvent.storyName = 'Filtered to an event'
/** Back from a delete: success message, the team gone from the list. */
export const AfterDelete = screen({ start: 'deleted', filter: 'evt-east' })
AfterDelete.storyName = 'After a delete'
