/** Teams Mgmt Comms Phase 2 / Screens / Company Settings.
 *  Forked from `Pages/17 Company Settings` (the production read-view) so Phase 2
 *  changes to this screen stay inside this folder and never touch the Pages
 *  story. Uses the forked DS components in ./components/. */
import { aug19Page } from './_aug19shell'
import { COMPANY, COMPANY_SECTIONS_TOP, COMPANY_RECON, COMPANY_SECTIONS_BOTTOM } from './_aug19fixtures'
import DsSectionHeader from './components/DsSectionHeader.vue'
import DsInfoGrid from './components/DsInfoGrid.vue'

export default {
  title: 'Design Requests/Aug 19/Screens/Company Settings',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
The **Company Settings** read-view, forked from \`Pages/17 Company Settings\` as the
starting point for Phase 2 changes to this screen.

This is an unmodified copy of the production screen — the baseline. Edits for the
[Teams Mgmt Comms Phase 2](https://linear.app/eventpipe/project/teams-mgmt-comms-phase-2-stp-comms-fc32de794752/overview)
project land here, leaving the Pages story untouched.

> Related: the **Notifications** tab of this page is where the Teams Management
> comms templates live — see *V1 · Notifications Preferences* in this folder, and
> the locked-upsell treatment in DES-435 (P0-11).
` } } },
}

// Breathing room between each section header and its card. The `accent` variant
// of DsSectionHeader only carries a 4px bottom margin, which reads flush against
// the container — this brings the gap to 16px, matching the `section` variant's
// rhythm. Set here rather than on the shared component so V1/V2 are unaffected.
const CARD_GAP = 'margin-top:12px;'

export const CompanySettings = aug19Page({
  active: 'none',
  components: { DsSectionHeader, DsInfoGrid },
  setup: () => ({
    company: COMPANY,
    sectionsTop: COMPANY_SECTIONS_TOP,
    recon: COMPANY_RECON,
    sectionsBottom: COMPANY_SECTIONS_BOTTOM,
  }),
  slot: `
    <div style="display:flex; align-items:center; gap:16px; padding:24px 32px; background:var(--ds-color-surface);">
      <img :src="company.logo" :alt="company.name" style="height:40px; width:auto;" />
      <div style="flex:1;">
        <div class="text-primary" style="font-size:1.375rem; font-weight:700;">{{ company.name }}</div>
        <div style="color:var(--ds-color-text-subtle); font-size:0.875rem;">Last updated: {{ company.lastUpdated }}</div>
      </div>
      <q-btn unelevated no-caps color="primary" label="Edit Information" />
    </div>

    <div style="padding:28px 32px 48px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div v-for="s in sectionsTop" :key="s.title" class="q-mb-xl">
        <ds-section-header :title="s.title" variant="accent" />
        <q-card flat bordered style="${CARD_GAP}"><q-card-section style="padding:28px 32px;"><ds-info-grid :items="s.items" layout="stacked" min-col-width="300px" /></q-card-section></q-card>
      </div>

      <div class="q-mb-xl">
        <ds-section-header title="Reconciliation & Invoice Settings" variant="accent" />
        <q-card flat bordered style="${CARD_GAP}"><q-card-section style="padding:28px 32px;">
          <ds-info-grid :items="recon" layout="stacked" min-col-width="300px" />
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:24px;">
            <div>
              <div style="font-size:0.9375rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">Custom Wording</div>
              <p style="margin:0 0 12px;">Thank you for choosing Traveloc! We are grateful for your business.</p>
              <ul style="margin:0; padding-left:20px; line-height:1.6;">
                <li>An accumulating monthly late fee of 3% of the total amount due will be charged on overdue payments.</li>
                <li>Be sure to include your invoice number with your payment.</li>
                <li>Have a Bill.com account? So do we!<ul style="padding-left:20px;"><li>Link up with us using code 0212201109184711.</li></ul></li>
              </ul>
            </div>
            <div>
              <div style="font-size:0.9375rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">IRS form w-9</div>
              <a href="#" class="text-primary" style="text-decoration:none;" @click.prevent>ae40fc7f-f3d4-48b4-b611-34a5581eb81a.pdf</a>
            </div>
          </div>
        </q-card-section></q-card>
      </div>

      <div v-for="s in sectionsBottom" :key="s.title" class="q-mb-xl">
        <ds-section-header :title="s.title" variant="accent" />
        <q-card flat bordered style="${CARD_GAP}"><q-card-section style="padding:28px 32px;"><ds-info-grid :items="s.items" layout="stacked" min-col-width="300px" /></q-card-section></q-card>
      </div>
    </div>`,
})
