/** DES-451 · Event › Fees — up to three secondary custom fees.
 *
 *  The proposal: three independent toggles — Secondary Custom Fee 1 / 2 / 3 —
 *  each revealing the same four fields the single fee has today (charge type,
 *  dollar amount, display label, description). Nothing about an individual fee
 *  changes; there are simply three of them, and each is turned on by itself.
 *
 *  Three states are published because the section's height is the real design
 *  risk: none configured (must cost nothing), the common two, and the maximum.
 *  The rest of the Edit Contracted Event page is live around it so the Fees
 *  accordion is judged in place rather than in isolation.
 */
import { reactive } from 'vue'
import { msfPage, makeFees, EVENT_FEE_SEEDS, HOTEL_FEE_SEEDS } from './_msf'
import { makeEventForm, makeSectionState, eventEditPage } from './_msfEventEdit'
import MsfSecondaryFees from './components/MsfSecondaryFees.vue'
import DsField from '../../../components/DsField.vue'
import DsInput from '../../../components/DsInput.vue'
import DsSelect from '../../../components/DsSelect.vue'
import DsLink from '../../../components/DsLink.vue'
import DsSectionHeader from '../../../components/DsSectionHeader.vue'
import DsRichTextEditor from '../../../components/DsRichTextEditor.vue'

export default {
  title: 'Design Requests/Multiple Secondary Fees/Screens/01 · Event Fees',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**DES-451.** Event › Fees with up to three secondary custom fees, as three independent toggles. Every control on the page is live — toggle a fee on and its fields appear.' } },
  },
}

const FEES_BODY = '<msf-secondary-fees :fees="fees" />'

const components = { MsfSecondaryFees, DsField, DsInput, DsSelect, DsLink, DsSectionHeader, DsRichTextEditor }

const eventFeesStory = (seeds) => msfPage({
  active: 'events',
  components,
  setup: () => ({
    form: makeEventForm(),
    fees: reactive(makeFees(seeds)),
    ...makeSectionState(),
  }),
  slot: eventEditPage(FEES_BODY),
})

/** The everyday case: two fees configured, the third slot left off. */
export const TwoFees = eventFeesStory(EVENT_FEE_SEEDS)
TwoFees.storyName = 'Two fees configured'

/** The maximum — the tallest the Fees section can get. */
export const ThreeFees = eventFeesStory(HOTEL_FEE_SEEDS)
ThreeFees.storyName = 'All three configured (max)'

/** Nothing configured: three toggle rows and no fields. The section stays
 *  compact for the many events that charge no secondary fee at all. */
export const NoneConfigured = eventFeesStory([])
NoneConfigured.storyName = 'None configured'
