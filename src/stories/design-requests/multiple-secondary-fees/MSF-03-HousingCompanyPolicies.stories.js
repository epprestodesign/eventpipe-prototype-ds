/** DES-452 · Event Hotel › Housing Company Policies — view + edit.
 *
 *  The page already has both modes; what changes is that its Fees card holds up
 *  to three secondary custom fees, and everything saved in edit mode shows on
 *  the view. Both stories are the same live screen, so Edit → change a fee →
 *  Save round-trips for real, and Cancel discards.
 *
 *  Fee slots here are per-hotel: a hotel can carry fees the event does not, and
 *  the event's Hotel Sync Settings screen is what overwrites them.
 */
import { ref, reactive } from 'vue'
import { msfPage, hotelHeader, makeFees, HOTEL_FEE_SEEDS, CURRENT_HOTEL_FEE, HOTEL } from './_msf'
import MsfHousingPolicies from './components/MsfHousingPolicies.vue'
import DsThumbnail from '../../../components/DsThumbnail.vue'
import hotelPhoto from '../../../assets/hotel/exterior.jpg'

export default {
  title: 'Design Requests/Multiple Secondary Fees/Screens/03 · Housing Company Policies',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**DES-452.** Housing Company Policies with up to three secondary custom fees. Edit and view are one live screen — Save writes what you typed onto the view.' } },
  },
}

const policiesStory = (seeds, initialMode) => msfPage({
  active: 'events',
  components: { MsfHousingPolicies, DsThumbnail },
  setup: () => ({
    hotel: HOTEL,
    hotelPhoto,
    tab: ref('housing-company-policies'),
    fees: reactive(makeFees(seeds)),
    initialMode,
  }),
  slot: `
    ${hotelHeader}
    <msf-housing-policies :fees="fees" :initial-mode="initialMode" />`,
})

/** View — three fees saved, each with its own rate, label and description. */
export const View = policiesStory(HOTEL_FEE_SEEDS, 'view')
View.storyName = 'View · three fees'

/** Edit — the three toggles. Turn one off, change an amount, hit Save. */
export const Edit = policiesStory(HOTEL_FEE_SEEDS, 'edit')
Edit.storyName = 'Edit · three fees'

/** One fee configured: the view is no busier than it is today. */
export const SingleFee = policiesStory([CURRENT_HOTEL_FEE], 'view')
SingleFee.storyName = 'View · one fee (today’s density)'

/** None configured — the empty state the Fees card needs when a hotel charges
 *  no secondary fee. Today's page simply hides the row; saying so is clearer. */
export const NoFees = policiesStory([], 'view')
NoFees.storyName = 'View · no fees'
