import StdTeamEditHeader from './components/StdTeamEditHeader.vue'
import { ticketDecorator, docText } from './_components'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Team Edit Header',
  component: StdTeamEditHeader,
  tags: ['autodocs', 'STD-1', 'ENG2-110', 'STA-3', 'ENG2-117'],
  decorators: [ticketDecorator('STD-1', 'STA-3')],
  parameters: { layout: 'padded', docs: { description: { component: docText('The Team Edit header. **Delete Team** sits here for every registered team — outline, danger colour, apart from Save (which lives in the form card). It never appears on Compliance list rows. In create mode the header names the task and the tabs are hidden until the first save.', 'STD-1', 'STA-3') } } },
}

const header = (args) => ({ args, render: (a) => ({ components: { StdTeamEditHeader }, setup: () => ({ a }), template: '<std-team-edit-header v-bind="a" />' }) })
export const WithDelete = { name: 'Registered team · Delete Team', ...header({ mode: 'edit', title: 'Augusta Lions GA 13/14', eventName: '2026 - East Regional Showcase' }) }
export const Organization = { name: 'Organizations event', ...header({ mode: 'edit', title: 'Alamo Dance Academy', eventName: '2026 - Nations Choice - Dance Grand Championship & Cheer Showdown', word: 'Organization' }) }
export const CreateMode = { name: 'Create mode', ...header({ mode: 'create' }) }
