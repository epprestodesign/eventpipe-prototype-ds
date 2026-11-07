import StdActivityLog from './components/StdActivityLog.vue'
import { ticketDecorator, docText } from './_components'
import { deletedBlurb, seedActivity } from './_std'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Activity Log Entry',
  component: StdActivityLog,
  tags: ['autodocs', 'STD-4', 'ENG2-114'],
  decorators: [ticketDecorator('STD-4')],
  parameters: { layout: 'padded', docs: { description: { component: docText('Each single-team delete writes one row to the event’s activity log, only when the delete succeeds. The existing columns record who and when; the blurb records what.', 'STD-4') } } },
}

const log = (word, name) => ({
  render: () => ({
    components: { StdActivityLog },
    setup: () => ({ rows: [{ when: 'Fri, 11/06/2026 10:48 AM', user: 'Justin Girard', text: deletedBlurb(word, name) }, ...seedActivity()] }),
    template: '<div style="max-width:980px;"><std-activity-log :rows="rows" :highlight="0" /></div>',
  }),
})
export const Team = log('Team', 'Augusta Lions')
export const Organization = log('Organization', 'Alamo Dance Academy')
