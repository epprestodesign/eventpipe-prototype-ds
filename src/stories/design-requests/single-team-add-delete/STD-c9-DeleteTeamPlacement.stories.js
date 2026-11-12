import StdTeamEditHeader from './components/StdTeamEditHeader.vue'
import StdDeleteTeamAction from './components/StdDeleteTeamAction.vue'
import { ticketDecorator, docText } from './_components'

export default {
  title: 'Design Requests/Single-Team Add and Delete/Components/Delete Team Placement',
  component: StdDeleteTeamAction,
  tags: ['autodocs', 'STD-1', 'ENG2-110'],
  decorators: [ticketDecorator('STD-1')],
  parameters: {
    layout: 'padded',
    docs: { description: { component: docText(`
Four places for **Delete Team** on Team Edit. The goal: deleting is possible, but never tempting or easy to hit by accident. Every option opens the same confirmation modal (STD-2).

| | Placement | Trade-off |
|---|---|---|
| **A** | Trash-can **Delete Team** button in the header, top-right | Always visible, one click to the modal. The most prominent, so the most tempting. |
| **B** | Icon-only trash button beside **Cancel / Save Changes** | Compact, but it sits right next to Save — the easiest one to hit by mistake. |
| **C** | **•••** overflow button in the header; its menu holds only **Delete Team** | One extra, deliberate click. Out of the main row of actions, and room for more actions later. |
| **D** | A **Delete Team** section at the very bottom of the page, with a description and a delete button | Far from Save and explains itself, but a long scroll — and it sits under Compliance Credits and Notes, which have their own delete icons, so it can get lost. |

**The design uses C, the ••• menu.** It keeps delete one deliberate step away and off the header's main line, it isn't next to Save Changes, and it's a pattern users already know: the event page puts **•••** beside **Edit Event**. It also leaves room for other advanced team actions later.

A, B and D are kept for comparison. Switch between them in the prototype with the review bar's **Delete Team A / B / C / D** toggle.`, 'STD-1') } },
  },
}

const HEADER = '<std-team-edit-header mode="edit" title="Augusta Lions GA 13/14" event-name="2026 - East Regional Showcase" :word="word" :delete-placement="placement" />'
const SAVE_ROW = `<div style="display:flex;align-items:center;gap:8px;padding:22px 30px;border:1px solid var(--ds-color-border-container);border-radius:var(--ds-radius-lg);background:var(--ds-color-surface);">
  <strong style="font-size:1.0625rem;">Goals &amp; Restrictions</strong><span style="flex:1"></span>
  <std-delete-team-action variant="save" :word="word" />
  <q-btn outline no-caps color="grey-8" label="Cancel" /><q-btn unelevated no-caps color="primary" label="Save Changes" />
</div>`
const REST = '<div style="padding:28px 30px;margin-bottom:20px;border:1px dashed var(--ds-color-border-bold);border-radius:var(--ds-radius-md);color:var(--ds-color-text-subtle);text-align:center;">Goals &amp; Restrictions · Team / Org Information · Communications · Compliance Credits · Notes</div>'

const view = (placement, body, word = 'Team') => ({
  render: () => ({
    components: { StdTeamEditHeader, StdDeleteTeamAction },
    setup: () => ({ placement, word }),
    template: `<div style="max-width:1100px;">${HEADER}${body}</div>`,
  }),
})

/** A · a trash-can button, always visible in the header. */
export const OptionA = { name: 'A · Header button', ...view('button', '') }
/** B · an icon-only trash button beside Cancel / Save Changes. */
export const OptionB = { name: 'B · Beside Save Changes', ...view('save', SAVE_ROW) }
/** C · the design: a ••• overflow button; click it to see Delete Team. */
export const OptionC = { name: 'C · ••• menu', ...view('menu', '') }
/** D · a Delete Team section, with a description, at the very bottom of the page. */
export const OptionD = { name: 'D · Bottom section', ...view('bottom', `${REST}<std-delete-team-action variant="bottom" :word="word" />`) }
/** C for an Organizations event: the menu item reads “Delete Organization”. */
export const OptionCOrganization = { name: 'C · Organizations event', ...view('menu', '', 'Organization') }
