import StdNotes from './components/StdNotes.vue'
import { ticketDecorator, docText } from './_components'
import { autoNote } from './_std'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Auto-Generated Note',
  component: StdNotes,
  tags: ['autodocs', 'STA-5', 'ENG2-119'],
  decorators: [ticketDecorator('STA-5')],
  parameters: { layout: 'padded', docs: { description: { component: docText('Team Edit requires a note on every save. On the create save the user is not prompted — the note is written for them: “Team added manually by [user].” Shown in production’s Notes block.', 'STA-5') } } },
}

export const AfterCreate = {
  name: 'After the first save',
  render: () => ({
    components: { StdNotes },
    setup: () => ({ notes: [{ title: 'Team added', body: autoNote('Justin Girard'), added: 'Fri, 11/06/2026 10:42 AM', author: 'Justin Girard' }] }),
    template: '<div style="max-width:980px;"><std-notes :notes="notes" /></div>',
  }),
}
