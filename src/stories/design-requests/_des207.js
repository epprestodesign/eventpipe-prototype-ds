/** Shared chrome for DES-207 V1/V2 — the Traveloc company header (breadcrumb +
 *  logo + name + General/Notifications tabs) and the "Go Back to Preferences"
 *  link. Both are template-string fragments; the consuming story's setup must
 *  provide a `tab` ref. */
import traveloc from '../../assets/logo/traveloc.png'

export const travelocHeader = `
  <div style="padding:20px 32px 0; background:var(--ds-color-surface);">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-md">
      <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
      <q-breadcrumbs-el label="Companies" />
      <q-breadcrumbs-el label="Traveloc" class="text-grey-6" />
    </q-breadcrumbs>
    <div class="row items-center q-gutter-md">
      <img src="${traveloc}" alt="Traveloc" style="height:34px; width:auto;" />
      <div style="flex:1;">
        <div class="text-primary" style="font-size:1.25rem; font-weight:700;">Traveloc</div>
        <div class="text-grey-6" style="font-size:0.8125rem;">Last updated: Fri, 08/16/2024 09:38 AM EST</div>
      </div>
    </div>
    <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7 q-mt-sm">
      <q-tab name="general" label="General" />
      <q-tab name="notifications" label="Notifications" />
    </q-tabs>
  </div>`

export const goBackLink = `
  <a href="#" @click.prevent
    style="display:inline-flex; align-items:center; gap:2px; color:var(--ds-color-text-brand); text-decoration:none; font-weight:600; font-size:0.9375rem;">
    <q-icon name="chevron_left" size="18px" /> Go Back to Preferences
  </a>`

/** Full Company Settings content shown under the General tab (Traveloc). */
export const companySettingsSections = [
  { title: 'Company Details', items: [
    { label: 'Country', value: 'United States' }, { label: 'Address', value: '4400 Biscayne Blvd' }, { label: 'City', value: 'Miami' },
    { label: 'State/Province', value: 'FL' }, { label: 'Postal Code', value: '33137' }, { label: 'Phone', value: '(305) 555-0142' },
    { label: 'Website', value: 'https://traveloc.com/' }, { label: 'Travel Agent IATAN', value: '55-901234' }, { label: 'Privacy Policy URL', value: 'https://traveloc.com/privacy' },
  ] },
  { title: 'Customer Service Details', items: [
    { label: 'Service Email', value: 'support@traveloc.com' }, { label: 'Phone Number', value: '(305) 555-0142' }, { label: 'Phone Number (Toll Free)', value: '(800) 555-0142' },
    { label: 'Service Hours', value: '9-6, ET' },
  ] },
  { title: 'Hotel Services Info', items: [
    { label: 'Hotel Service Contact Name', value: 'Dana Ruiz' }, { label: 'Hotel Service Email', value: 'hotels@traveloc.com' },
    { label: 'Hotel Service Phone Number', value: '(305) 555-0177' }, { label: 'Hotel Service Phone Number (Toll Free)', value: '— —' }, { label: 'Hotel Service Hours', value: '9-6, ET' },
  ] },
  { title: 'Reconciliation & Invoice Settings', items: [
    { label: 'Default Pickup Reconciliation Format', value: 'Night By Night' }, { label: 'Commission Calculation', value: 'Gross Rate (Reservation by Reservation Only)' }, { label: '', value: '' },
    { label: 'Default Upload & Wash Requirement', value: 'No' }, { label: 'Automated Invoice Numbers', value: 'Yes' }, { label: 'Payment Terms', value: 'Net 30' },
  ] },
  { title: 'Branding', items: [
    { label: 'Branded URL', value: 'https://reservations.traveloc.com' },
    { label: 'Reservations - From Email Address', value: 'Traveloc<mailer@eventpipe.com>' },
    { label: 'Group Blocks - From Email Address', value: 'Traveloc<mailer@eventpipe.com>' },
    { label: 'Hotels - From Email Address', value: 'Traveloc<mailer@eventpipe.com>' },
  ] },
  { title: 'Feature Settings', items: [
    { label: 'Track Earned Comp Rooms Default', value: 'Yes' }, { label: 'Upfront Markups', value: 'No' }, { label: 'Autofill Contract Signature', value: 'Yes' },
    { label: 'Copy Event', value: 'Yes' }, { label: 'Hotel Addendum Notice', value: 'Yes' },
  ] },
  { title: 'Financial Info', items: [
    { label: 'Account Number', value: 'acct_1PxUo1AC5e9uTRV' }, { label: 'Account Type', value: 'Standard' },
    { label: 'EventPipe Reservation Fee', value: '$ 0.00 USD | $ 0.00 CAD' }, { label: 'Send EventPipe Reservation Fee To', value: 'Housing Company Stripe Account' },
  ] },
  { title: 'Application Features', items: [
    { label: 'Waitlist', value: 'Yes' }, { label: 'Booking Protection', value: 'Yes' }, { label: 'Booking Protection After Policies', value: 'No' },
    { label: 'Track Earned Comp Rooms', value: 'Yes' }, { label: 'Expedited Contracting', value: 'Yes' }, { label: 'Deposits - Set Date At Group Block', value: 'No' },
    { label: 'Pickup Report', value: 'Yes' }, { label: 'Registration & Compliance Tools', value: 'Yes' }, { label: 'Branding', value: 'Yes' },
  ] },
  { title: 'Customization', items: [
    { label: 'Booking Fee Display Name', value: 'Booking Fee' },
  ] },
]
