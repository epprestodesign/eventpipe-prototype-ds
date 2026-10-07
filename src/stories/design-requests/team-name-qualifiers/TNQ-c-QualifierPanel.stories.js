/** Team Name Qualifiers — the qualifier panel on its own, in each state. */
import { ref } from 'vue'
import TnqQualifierPanel from './components/TnqQualifierPanel.vue'

export default {
  title: 'Design Requests/Team Name Qualifiers/Components/Qualifier Panel',
  component: TnqQualifierPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The **Team Name Qualifiers** panel inside Booking Site Behavior. The admin picks which company custom fields qualify a manually entered team name; the preview shows how such a name will read. `not-applicable` swaps in the disabled note used when team selection is required for both group blocks and reservations.' } },
  },
}

const panel = (initial = [], props = {}) => ({
  render: () => ({
    components: { TnqQualifierPanel },
    setup: () => ({ selected: ref(initial), props }),
    template: '<div style="max-width:1100px;"><tnq-qualifier-panel v-model="selected" v-bind="props" /></div>',
  }),
})

/** Collapsed, as the page loads. */
export const Collapsed = panel()
/** Open, nothing picked — no preview yet. */
export const Open = panel([], { open: true })
/** Two dropdown fields — the preview uses each field's first option. */
export const TwoSelected = panel(['age', 'gender'], { open: true })
TwoSelected.storyName = 'Two selected'
/** All four — a free-text field previews as an italic “[Coach Name]” placeholder. */
export const AllSelected = panel(['age', 'gender', 'skill', 'coach'], { open: true })
AllSelected.storyName = 'All selected'
/** Team selection required for both group blocks and reservations. */
export const NotApplicable = panel([], { notApplicable: true })
NotApplicable.storyName = 'Not applicable'
