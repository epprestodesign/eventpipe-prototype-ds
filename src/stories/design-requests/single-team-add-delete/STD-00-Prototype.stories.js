/** Single-Team Add and Delete — the connected prototype (every UX ticket, one journey). */
import StdPrototype from './components/StdPrototype.vue'
import { ticketLine } from './_std'

const ALL = ['STA-1', 'STA-2', 'STA-3', 'STA-4', 'STA-5', 'STD-1', 'STD-2', 'STD-3', 'STD-4']

export default {
  title: 'Design Requests/Single-Team Add and Delete/Prototype',
  component: StdPrototype,
  tags: ['autodocs', 'STA-1', 'ENG2-111', 'STA-2', 'ENG2-116', 'STA-3', 'ENG2-117', 'STA-4', 'ENG2-118', 'STA-5', 'ENG2-119', 'STD-1', 'ENG2-110', 'STD-2', 'ENG2-112', 'STD-3', 'ENG2-113', 'STD-4', 'ENG2-114'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
The whole end-user journey for [P-ENG2-251](https://linear.app/eventpipe/project/single-team-add-and-delete-84eda936c544), connected:

**Compliance** → **Add/Update Teams ▾ › Add single team** → **Team Edit (create mode)** → Save → **Team Edit** with the auto-generated note → **Delete Team** → confirmation → **Compliance** with a success message → the event's **Activity Logs** entry.

The bar above the app is review-only. It names the tickets the current screen covers, switches the event's **Registered Entity** (Teams ↔ Organizations, which changes the delete wording), and **Restart** resets the data. **Autofill** fills the create form: turn on **Click to fill** and click any empty field, or pick a **Fill ▾** preset — complete & valid, generated Team ID, missing required fields, invalid email, duplicate Team ID, duplicate generated ID, or clear. Error presets run the Save check at once, so their errors show straight away.

${ticketLine(...ALL)}

No UI: STA-6 (team source is stored as *Manual*, never shown) and STD-5 (BigQuery).
` } },
  },
}

const flow = (args) => ({
  args,
  render: (a) => ({ components: { StdPrototype }, setup: () => ({ a }), template: '<std-prototype v-bind="a" />' }),
})

/** Start on the Compliance list with every event showing. Add a team, then delete one. */
export const FullFlow = { name: 'Full flow', ...flow({ start: 'compliance' }) }
/** The list is filtered to an event, so Add single team opens with that event preselected (STA-2). */
export const FilteredToEvent = { name: 'Start filtered to an event', ...flow({ start: 'compliance', filter: 'evt-east' }) }
/** The event registers Organizations: the delete button, modal and log read “Organization”. */
export const Organizations = { name: 'Organizations event', ...flow({ start: 'team', entity: 'Organization' }) }
