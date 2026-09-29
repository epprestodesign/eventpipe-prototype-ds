/** EP Pay / Screens / 02 · Dashboard.
 *
 *  The merchant's landing screen: six metric cards, each comparing this period
 *  against the same period last year.
 *
 *  The notice at the top is the one piece of state worth understanding. A
 *  merchant can take payments before their application is verified, but cannot
 *  be paid out — so the banner is not onboarding nagging, it is the thing
 *  standing between them and their money. It links to the wizard in
 *  Screens › 07 · Merchant Application, and disappears once submitted
 *  (see the "Application submitted" story).
 */
import { epPage, epHeader, EP_CARD, EP_PAGE, DASHBOARD_STATS } from './_eppay'
import EpPayStatCard from './components/EpPayStatCard.vue'

export default {
  title: 'EP Pay/Screens/02 · Dashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The EP Pay merchant dashboard. The 09/28 capture set the layout; the design system set the colour, type and components. Six metric cards, each with a this-period vs last-year sparkline.' } },
  },
}

/** The application callout.
 *
 *  A `q-card flat bordered` like everything else on the canvas, with the brand
 *  left edge kept — that 4px stripe is what marks it as a notice rather than
 *  another body panel, and it is the only thing about it that is not a plain
 *  card.
 *
 *  Written out rather than built with `epCard()` because this is a callout, not
 *  a section: it wants the tighter 18/22 padding of a banner, where `epCard()`
 *  supplies the 26/30 interior a titled body card needs.
 */
const NOTICE = `
  <q-card v-if="showNotice" flat bordered
    style="${EP_CARD} border-left:4px solid var(--ds-color-background-brand-bold);">
    <q-card-section class="row items-center no-wrap" style="padding:18px 22px; gap:24px;">
      <div style="flex:1; min-width:0;">
        <div style="font-weight:700; color:var(--ds-color-text);">EventPipe Pay</div>
        <div style="color:var(--ds-color-text-subtle); margin-top:3px;">
          To avoid any delays in receiving your funds complete your EventPipe Pay application.
        </div>
      </div>
      <q-btn unelevated no-caps color="primary" label="Complete Application" style="flex:none;" />
    </q-card-section>
  </q-card>`

/** Period controls, in the header's actions slot where the rest of the platform
 *  puts a page's controls. */
const ACTIONS = `
  <q-btn outline no-caps color="primary" icon="filter_alt" label="Filter" style="background:var(--ds-color-surface);" />
  <q-btn outline no-caps color="grey-8" icon="event" icon-right="expand_more" label="Today" style="background:var(--ds-color-surface);" />`

const SLOT = `
  <div style="${EP_PAGE}">
    ${NOTICE}

    ${epHeader('Dashboard', { actions: ACTIONS })}

    <!-- Plain div: a CSS grid track definition, not a panel. The cards inside
         are each a q-card (EpPayStatCard); this only places them. -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(420px, 1fr)); gap:20px;">
      <ep-pay-stat-card v-for="s in stats" :key="s.key" v-bind="s" />
    </div>
  </div>`

const story = (showNotice) => epPage({
  active: 'dashboard',
  components: { EpPayStatCard },
  setup: () => ({ stats: DASHBOARD_STATS, showNotice }),
  slot: SLOT,
})

/** Default: application not yet submitted, so the banner is up. */
export const Default = story(true)

/** After the wizard is submitted the banner clears. Nothing else changes —
 *  payouts stay blocked until verification, but that is said in the
 *  confirmation screen rather than repeated here. */
export const Submitted = story(false)
Submitted.storyName = 'Application submitted'
