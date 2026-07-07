/** PAGES / 17 Company Settings → detail read-view archetype, from production. */
import { page } from './_shell'
import DsSectionHeader from '../../components/DsSectionHeader.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'
import logo365 from '../../assets/logo/365Logo_Horizontal.png'

export default { title: 'Pages/17 Company Settings', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const sectionsTop = [
  { title: 'Company Details', items: [
    { label: 'Country', value: 'United States' }, { label: 'Address', value: '8192 Rylan Dr.' }, { label: 'City', value: 'Brown Summit' },
    { label: 'State/Province', value: 'NC' }, { label: 'Postal Code', value: '27214' }, { label: 'Phone', value: '(314) 277-5454' },
    { label: 'Website', value: 'https://365sportstravel.com/' }, { label: 'Travel Agent IATAN', value: '34-732213' }, { label: 'Privacy Policy URL', value: '—' },
  ] },
  { title: 'Customer Service Details', items: [
    { label: 'Service Email', value: 'scottg@365sportstravel.com' }, { label: 'Phone Number', value: '(314) 277-5454' }, { label: 'Phone Number (Toll Free)', value: '— —' },
    { label: 'Service Hours', value: '9-5, ET' },
  ] },
  { title: 'Hotel Services Info', items: [
    { label: 'Hotel Service Contact Name', value: '— —' }, { label: 'Hotel Service Email', value: 'scottg@365sportstravel.com' },
    { label: 'Hotel Service Phone Number', value: '(314) 277-5454' }, { label: 'Hotel Service Phone Number (Toll Free)', value: '— —' },
    { label: 'Hotel Service Hours', value: '9-5, ET' },
  ] },
]

const recon = [
  { label: 'Default Pickup Reconciliation Format', value: 'Night By Night' }, { label: 'Commission Calculation', value: 'Gross Rate (Reservation by Reservation Only)' }, { label: '', value: '' },
  { label: 'Default Upload & Wash Requirement', value: 'No' }, { label: 'Automated Invoice Numbers', value: 'No' }, { label: '', value: '' },
  { label: 'Country', value: 'United States' }, { label: 'State/Province', value: 'NC' }, { label: 'Postal Code', value: '27358' },
  { label: 'Phone', value: '(336) 601-2836' }, { label: 'Email', value: 'cfo@365sportstravel.com' }, { label: 'Payment Terms', value: 'Net 30' },
]

const sectionsBottom = [
  { title: 'Branding', items: [
    { label: 'Branded URL', value: 'https://reservations.365sportstravel.com' },
    { label: 'Reservations - From Email Address', value: '365 Sports Travel<mailer@eventpipe.com>' },
    { label: 'Group Blocks - From Email Address', value: '365 Sports Travel<mailer@eventpipe.com>' },
    { label: 'Hotels - From Email Address', value: '365 Sports Travel<mailer@eventpipe.com>' },
    { label: 'Accounting Processes - From Email Address', value: '365 Sports Travel<mailer@eventpipe.com>' },
  ] },
  { title: 'Feature Settings', items: [
    { label: 'Track Earned Comp Rooms Default', value: 'Yes' }, { label: 'Upfront Markups', value: 'No' }, { label: 'Autofill Contract Signature', value: 'Yes' },
    { label: 'Copy Event', value: 'Yes' }, { label: 'Hotel Addendum Notice', value: 'Yes' },
  ] },
  { title: 'Financial Info', items: [
    { label: 'Account Number', value: 'acct_1OxUo1AC5e9uYIED' }, { label: 'Account Type', value: 'Standard' },
    { label: 'EventPipe Reservation Fee', value: '$ 0.00 USD | $ 0.00 CAD' }, { label: 'Send EventPipe Reservation Fee To', value: 'Housing Company Stripe Account' },
  ] },
  { title: 'Application Features', items: [
    { label: 'Waitlist', value: 'No' }, { label: 'Booking Protection', value: 'Yes' }, { label: 'Booking Protection After Policies', value: 'No' },
    { label: 'Track Earned Comp Rooms', value: 'Yes' }, { label: 'Expedited Contracting', value: 'No' }, { label: 'Deposits - Set Date At Group Block', value: 'No' },
    { label: 'Pickup Report', value: 'Yes' }, { label: 'Registration & Compliance Tools', value: 'No' }, { label: 'Branding', value: 'Yes' },
    { label: 'Travel Protection Provider', value: 'Vertical Travel Insurance' },
  ] },
  { title: 'Customization', items: [
    { label: 'Booking Fee Display Name', value: 'Booking Fee' },
  ] },
]

export const CompanySettings = page({
  active: 'admin',
  components: { DsSectionHeader, DsInfoGrid },
  setup: () => ({ sectionsTop, recon, sectionsBottom, logo365 }),
  slot: `
    <div style="display:flex; align-items:center; gap:16px; padding:24px 32px; background:var(--ds-color-surface);">
      <img :src="logo365" alt="365 Sports Travel" style="height:40px; width:auto;" />
      <div style="flex:1;">
        <div class="text-primary" style="font-size:1.375rem; font-weight:700;">365 Sports Travel</div>
        <div style="color:var(--ds-color-text-subtle); font-size:0.875rem;">Last updated: Thu, 04/30/2026 12:08 PM EST</div>
      </div>
      <q-btn unelevated no-caps color="primary" label="Edit Information" />
    </div>

    <div style="padding:28px 32px 48px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div v-for="s in sectionsTop" :key="s.title" class="q-mb-xl">
        <ds-section-header :title="s.title" variant="accent" />
        <q-card flat><q-card-section style="padding:28px 32px;"><ds-info-grid :items="s.items" layout="stacked" min-col-width="300px" /></q-card-section></q-card>
      </div>

      <div class="q-mb-xl">
        <ds-section-header title="Reconciliation & Invoice Settings" variant="accent" />
        <q-card flat><q-card-section style="padding:28px 32px;">
          <ds-info-grid :items="recon" layout="stacked" min-col-width="300px" />
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:24px;">
            <div>
              <div style="font-size:0.9375rem; color:var(--ds-color-text-subtle); margin-bottom:6px;">Custom Wording</div>
              <p style="margin:0 0 12px;">Thank you for choosing 365 Sports Travel Corporation! We are grateful for your business.</p>
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
        <q-card flat><q-card-section style="padding:28px 32px;"><ds-info-grid :items="s.items" layout="stacked" min-col-width="300px" /></q-card-section></q-card>
      </div>
    </div>`,
})
