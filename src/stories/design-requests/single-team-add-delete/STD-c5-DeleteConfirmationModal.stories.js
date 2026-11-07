import { ref } from 'vue'
import StdDeleteTeamDialog from './components/StdDeleteTeamDialog.vue'
import { ticketDecorator, docText } from './_components'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Delete Confirmation Modal',
  component: StdDeleteTeamDialog,
  tags: ['autodocs', 'STD-2', 'ENG2-112'],
  decorators: [ticketDecorator('STD-2')],
  parameters: { layout: 'padded', docs: { description: { component: docText('One warning with static copy, the same for every team — it does not change with the number of linked group blocks or reservations. **Cancel** is the default and takes focus; dismissing changes nothing. “Team” reads “Organization” when the event registers Organizations.', 'STD-2') } } },
}

const modal = (word, deleting = false) => ({
  render: () => ({
    components: { StdDeleteTeamDialog },
    setup: () => ({ open: ref(true), word, deleting }),
    template: `<div><q-btn outline no-caps color="negative" :label="'Delete ' + word" @click="open = true" />
      <std-delete-team-dialog v-model="open" :word="word" :deleting="deleting" @confirm="open = false" /></div>`,
  }),
})
export const Team = modal('Team')
export const Organization = modal('Organization')
/** Confirmed: the delete is running, so the modal stays and both buttons are held. */
export const Deleting = modal('Team', true)
