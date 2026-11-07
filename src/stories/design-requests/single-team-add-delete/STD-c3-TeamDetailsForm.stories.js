import { reactive } from 'vue'
import StdTeamDetailsForm from './components/StdTeamDetailsForm.vue'
import { ticketDecorator, docText } from './_components'
import { emptyTeamForm, seedTeams, validateNewTeam } from './_std'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Team Details Form',
  component: StdTeamDetailsForm,
  tags: ['autodocs', 'STA-3', 'ENG2-117', 'STA-4', 'ENG2-118'],
  decorators: [ticketDecorator('STA-3', 'STA-4')],
  parameters: { layout: 'padded', docs: { description: { component: docText('The Details fields (Team / Org Information). In **create** mode every field is editable and the uploader’s rules apply: Team Name **or** Organization Name, plus Contact Email. Team ID is optional — left blank it is generated from the names, and the hint says what it will be. A duplicate Team ID within the event blocks the save. In **edit** mode it is production’s form, Team Name and Contact Name locked.', 'STA-3', 'STA-4') } } },
}

const form = (over = {}, { mode = 'create', validate = false } = {}) => ({
  render: () => ({
    components: { StdTeamDetailsForm },
    setup: () => {
      const f = reactive({ ...emptyTeamForm('evt-east'), ...over })
      return { f, errors: validate ? validateNewTeam(f, seedTeams()) : {}, mode }
    },
    template: '<std-team-details-form v-model:form="f" :errors="errors" :mode="mode" />',
  }),
})
export const CreateEmpty = { name: 'Create · empty', ...form() }
/** Team ID left blank: the hint shows the ID that will be generated. */
export const GeneratedId = { name: 'Create · generated Team ID', ...form({ name: 'Augusta Lions', org: 'Peach State', contactEmail: 'coach@peachstate.org' }) }
/** Nothing entered, Save pressed. */
export const RequiredErrors = { name: 'Create · required errors', ...form({}, { validate: true }) }
/** The generated ID matches a team already in the event. */
export const DuplicateId = { name: 'Create · duplicate Team ID', ...form({ name: 'Bayside FC GA 12/13', contactEmail: 'new@baysidefc.com' }, { validate: true }) }
/** Production’s normal Team Edit fields. */
export const Edit = { name: 'Edit · existing team', ...form(seedTeams()[0], { mode: 'edit' }) }
