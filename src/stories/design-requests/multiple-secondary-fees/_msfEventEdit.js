/** Edit Contracted Event — the page the Fees section lives in.
 *
 *  DES-451 only changes Fees, but the section has to be judged in place: it is
 *  one accordion among nine, and how far three fee blocks push the page matters.
 *  So the whole screen is here, recreated from the 08/11 captures, with every
 *  control bound to `form` so the page behaves rather than poses.
 *
 *  The Fees body is injected by the consuming story — that's the one part that
 *  differs between the current-state reference and the proposal.
 */
import { reactive, ref, computed } from 'vue'
import { EVENT, RES_FEE_NOTE } from './_msf'

/** Every field on the page, seeded to the values in the reference captures. */
export function makeEventForm() {
  return reactive({
    // Event Details
    name: EVENT.name,
    producer: EVENT.producer,
    type: EVENT.type,
    accountManager: EVENT.accountManager,
    dates: EVENT.dates,
    housingGroups: EVENT.housingOpensGroups,
    housingAttendees: EVENT.housingOpensAttendees,
    location: EVENT.location,
    stayToPlay: false,
    // Fees
    advancedRebate: true,
    eventpipeResFee: false,
    additionalResFee: false,
    // Policies
    cancellationDetails: '',
    cancellationWindow: 'Effective Date',
    // Pickup and Accounting
    generatePickup: true,
    pickupType: 'Night by Night',
    accountingContact: 'Bec Marshall',
    uploadWash: true,
    uploadWashPct: 20,
    peakNightGoal: 0,
    roomNightGoal: 0,
    netIncomeGoal: '0.00',
    producerRebate: '0.00',
    producerCommission: 0,
    producerNotes: '',
    // Live Inventory
    liveInventory: false,
    // Hotel Information
    defaultDates: true,
    checkInOut: '05/31/2027 - 06/04/2027',
    peakNights: '06/01/2027 - 06/02/2027',
    groupReleaseType: 'Duration',
    groupReleaseDays: 0,
    compRatio: 0,
    compRatioPer: 0,
    hotelRebate: '0.00',
    hotelCommission: 0,
    currency: 'USD',
    compCard: true,
    trackComp: true,
    groupMax: 0,
    waitlist: false,
    roomingAccess: 'Manually Per User',
    // Email Settings
    preArrival: 0, preArrivalOn: false,
    resReminder: 45, resReminderOn: true,
    depositReminder: 5, depositReminderOn: true,
    hotelVerification: 45, hotelVerificationOn: true,
    // Data Collection
    teamName: false, teamCode: false, orgName: false,
    athleteNames: 'No', coachNames: 'No',
    // Booking Protection
    bookingProtection: 'Dynamic Pricing',
  })
}

/** Which accordions are open. Fees starts open — it's what the ticket is about. */
export function makeSectionState() {
  const open = reactive({
    details: false, fees: true, policies: false, pickup: false, live: false,
    hotel: false, email: false, data: false, protection: false,
  })
  const allOpen = computed(() => Object.values(open).every(Boolean))
  const toggleAll = () => {
    const next = !allOpen.value
    Object.keys(open).forEach((k) => { open[k] = next })
  }
  return { open, allOpen, toggleAll, dirty: ref(false) }
}

/** One accordion card. */
const section = (key, title, body) => `
  <q-card flat bordered>
    <q-expansion-item v-model="open.${key}" label="${title}" header-class="msf-acc__hdr"
      expand-icon="expand_more">
      <q-separator />
      <div style="padding:22px 28px 26px;">${body}</div>
    </q-expansion-item>
  </q-card>`

/* A number field with a trailing unit chip, e.g. "20 %" / "0 Days". */
const unitField = (label, model, unit, width = '230px') => `
  <ds-input label="${label}" v-model="${model}" type="number" suffix="${unit}" style="max-width:${width};" />`

const DETAILS = `
  <div class="column q-gutter-y-md" style="max-width:560px;">
    <ds-input label="Event Name" required v-model="form.name" />
    <ds-select label="Event Producer" required v-model="form.producer" clearable
      :options="['3STEP Sports - 3STEP Field Hockey','Afrim\\'s Sports','365 Sports Travel']" />
    <ds-select label="Event Type" required v-model="form.type" clearable
      :options="['Boxing (Sporting Event)','Cheer (Sporting Event)','Field Hockey (Sporting Event)','Conference (Non-Sporting)']" />
    <ds-select label="Account Manager" required v-model="form.accountManager" clearable
      :options="['Alexis Rubin','Bec Marshall','Erica Lessard']" />
    <ds-input label="Event Start/End Dates" required v-model="form.dates" clearable type="date" />
    <ds-input label="Housing Opens (Group Blocks)" required v-model="form.housingGroups" clearable type="date" />
    <ds-input label="Housing Opens (Attendees)" required v-model="form.housingAttendees" clearable type="date" />
    <ds-input label="Location" required v-model="form.location" clearable />
    <q-toggle v-model="form.stayToPlay" color="primary" dense label="Stay to Play" class="q-mt-sm" />
  </div>`

const POLICIES = `
  <div class="column q-gutter-y-md">
    <ds-link href="https://learn.eventpipe.com/eventpipe-knowledge-base/cancellation-refund-policies" external>
      How To Configure Cancellation &amp; Refund Policies
    </ds-link>
    <ds-rich-text-editor label="Cancellation Policy Details" v-model="form.cancellationDetails" min-height="200px" layout="description" />
    <ds-field label="Cancellation Window" required>
      <q-option-group v-model="form.cancellationWindow" color="primary" type="radio"
        :options="[{ label: 'Effective Date', value: 'Effective Date' }, { label: 'Effective Days Prior to Check-in', value: 'Effective Days Prior to Check-in' }]" />
    </ds-field>
    <div>
      <ds-section-header title="Tiers" variant="section" />
      <div style="border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-md); padding:22px; text-align:center; color:var(--ds-color-text-subtle);">
        None configured
      </div>
      <q-btn outline no-caps color="primary" icon="add" label="New Tier" class="q-mt-md" />
    </div>
  </div>`

const PICKUP = `
  <div class="column q-gutter-y-md" style="max-width:560px;">
    <q-toggle v-model="form.generatePickup" color="primary" dense label="Generate Pickup Report" />
    <ds-select label="Pickup Report Type" v-model="form.pickupType" :options="['Night by Night','Cumulative']" style="max-width:450px;" />
    <ds-select label="Accounting Contact" required v-model="form.accountingContact" clearable
      :options="['Bec Marshall','Alexis Rubin','Erica Lessard']" style="max-width:450px;" />
    <ds-field label="Upload and Wash Requirements" tooltip="Percentage of the block that must be washed before upload.">
      <div class="row items-center no-wrap q-gutter-sm">
        <q-toggle v-model="form.uploadWash" color="primary" dense />
        <ds-input v-model="form.uploadWashPct" type="number" suffix="%" style="width:135px;" />
      </div>
    </ds-field>
    ${unitField('Peak Night Goal', 'form.peakNightGoal', '')}
    ${unitField('Room Night Goal', 'form.roomNightGoal', '')}
    <ds-input label="Event Net Income Goal" v-model="form.netIncomeGoal" type="currency" style="max-width:230px;" />
    <ds-input label="Event Producer Rebate" v-model="form.producerRebate" type="currency" style="max-width:230px;" />
    <ds-input label="Event Producer Commission" v-model="form.producerCommission" type="number" suffix="%" style="max-width:230px;" />
    <ds-field label="Event Producer Revenue Notes">
      <q-input v-model="form.producerNotes" type="textarea" outlined dense hide-bottom-space rows="5" :input-style="{ minHeight: '110px' }" />
    </ds-field>
  </div>`

const LIVE = `<q-toggle v-model="form.liveInventory" color="primary" dense label="Live Inventory" />`

const HOTEL_INFO = `
  <div class="column q-gutter-y-md" style="max-width:560px;">
    <q-toggle v-model="form.defaultDates" color="primary" dense label="Enable Default Dates" />
    <ds-input label="Default Check-in and Check-out Dates" required v-model="form.checkInOut" type="date" clearable />
    <ds-input label="Default Peak Nights Start and Default Peak Nights End" required v-model="form.peakNights" type="date" clearable />
    <div class="row items-start no-wrap q-gutter-md">
      <ds-select label="Group Release Type" required v-model="form.groupReleaseType" :options="['Duration','Fixed Date']" style="width:250px;" />
      <ds-input label="Default Group Release Date" required v-model="form.groupReleaseDays" type="number" suffix="Days" style="width:250px;" />
    </div>
    <ds-field label="Target Comp Ratio">
      <div class="row items-center no-wrap q-gutter-md">
        <ds-input v-model="form.compRatio" type="number" style="width:225px;" />
        <span class="text-grey-8">Per</span>
        <ds-input v-model="form.compRatioPer" type="number" style="width:225px;" />
      </div>
    </ds-field>
    <ds-input label="Target Hotel Rebate" v-model="form.hotelRebate" type="currency" style="max-width:230px;" />
    <ds-input label="Target Hotel Commission" v-model="form.hotelCommission" type="number" suffix="%" style="max-width:230px;" />
    <ds-select label="Hotel Currency" v-model="form.currency" :options="['USD','CAD','EUR']" style="max-width:230px;" />
    <q-toggle v-model="form.compCard" color="primary" dense label="Comp Rooms Credit Card Required" />
    <q-toggle v-model="form.trackComp" color="primary" dense label="Track Earned Comp Rooms" />
    <ds-input label="Group Max" v-model="form.groupMax" type="number" style="max-width:230px;" />
    <q-toggle v-model="form.waitlist" color="primary" dense label="Waitlist" />
    <ds-section-header title="Rooming List Settings" variant="subsection" class="q-mt-sm" />
    <ds-select label="Rooming List Access Type" v-model="form.roomingAccess" tooltip="Who can access the rooming list."
      :options="['Manually Per User','All Hotel Users','Disabled']" style="max-width:450px;" />
  </div>`

/* Email Settings pairs a number field with an on/off toggle, plus a resolved
   date under the ones that compute one. */
const emailRow = (label, model, toggle, tooltip, note = '') => `
  <div>
    <div class="row items-center no-wrap q-gutter-md">
      <ds-input label="${label}" v-model="${model}" type="number" suffix="Days" tooltip="${tooltip}" style="width:270px;" />
      <q-toggle v-model="${toggle}" color="primary" dense style="margin-top:22px;" />
    </div>
    ${note ? `<div class="text-grey-7" style="font-size:0.8125rem; margin-top:2px;">${note}</div>` : ''}
  </div>`

const EMAIL = `
  <div class="column q-gutter-y-md">
    ${emailRow('Pre Arrival', 'form.preArrival', 'form.preArrivalOn', 'Days before check-in the pre-arrival email sends.')}
    ${emailRow('Reservation Reminder', 'form.resReminder', 'form.resReminderOn', 'Days before check-in the reservation reminder sends.', 'Sat, 04/17/2027')}
    ${emailRow('Deposit Reminder', 'form.depositReminder', 'form.depositReminderOn', 'Days before the deposit is due.')}
    ${emailRow('Hotel User Verification', 'form.hotelVerification', 'form.hotelVerificationOn', 'Days before the first hotel cutoff date.', 'Prior to the first hotel cutoff date')}
  </div>`

const DATA = `
  <div class="column q-gutter-y-md" style="max-width:450px;">
    <q-toggle v-model="form.teamName" color="primary" dense label="Enable Team Name" />
    <q-toggle v-model="form.teamCode" color="primary" dense label="Enable Team Code" />
    <q-toggle v-model="form.orgName" color="primary" dense label="Enable Organization Name" />
    <ds-select label="Athlete Names" v-model="form.athleteNames" :options="['No','Optional','Required']" style="max-width:370px;" />
    <ds-select label="Coach Names" v-model="form.coachNames" :options="['No','Optional','Required']" style="max-width:370px;" />
    <ds-section-header title="Custom Fields" variant="subsection" class="q-mt-sm" />
    <div><q-btn outline no-caps color="primary" label="+ Add a Custom Field" /></div>
  </div>`

const PROTECTION = `
  <ds-select label="Booking Protection" v-model="form.bookingProtection"
    :options="['Dynamic Pricing','Flat Rate','Disabled']" style="max-width:370px;" />`

/** The full page. `feesBody` is the Fees accordion's contents — the one section
 *  that differs between the reference and the proposal. `headerActions` lets a
 *  screen add to Discard / Hotel Sync Settings / Save. */
export function eventEditPage(feesBody, { headerActions = '' } = {}) {
  const FEES = `
    <div class="column q-gutter-y-md">
      <q-toggle v-model="form.advancedRebate" color="primary" dense label="Enable Advanced Rebate" />
      <q-toggle v-model="form.eventpipeResFee" color="primary" dense label="EventPipe Reservation Fee" />
      <q-toggle v-model="form.additionalResFee" color="primary" dense label="Additional Reservation Fee" />
      <div class="text-grey-7" style="font-size:0.8125rem; line-height:1.5; max-width:640px;">${RES_FEE_NOTE}</div>
      <q-separator class="q-my-sm" style="max-width:720px;" />
      ${feesBody}
    </div>`

  return `
    <div style="padding:22px 32px 18px; background:var(--ds-color-surface-sunken);">
      <div class="row items-start justify-between q-gutter-md no-wrap">
        <div>
          <div style="font-size:1.5rem; font-weight:700; color:var(--ds-color-text);">Edit Contracted Event</div>
          <div class="text-grey-7" style="margin-top:6px;">All fields marked with <span class="text-negative">*</span> are required.</div>
        </div>
        <div class="row items-center q-gutter-sm no-wrap" style="flex:none;">
          ${headerActions}
          <q-btn outline no-caps color="primary" label="Discard" />
          <q-btn unelevated no-caps color="primary" label="Hotel Sync Settings" />
          <q-btn unelevated no-caps color="primary" label="Save" />
        </div>
      </div>
      <div class="row justify-end q-mt-sm">
        <a href="#" class="text-primary" style="text-decoration:none; font-weight:500;" @click.prevent="toggleAll">
          {{ allOpen ? 'Collapse All' : 'Expand All' }}
        </a>
      </div>
    </div>

    <div style="padding:8px 32px 64px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-y-md">
        ${section('details', 'Event Details', DETAILS)}
        ${section('fees', 'Fees', FEES)}
        ${section('policies', 'Policies', POLICIES)}
        ${section('pickup', 'Pickup and Accounting', PICKUP)}
        ${section('live', 'Live Inventory', LIVE)}
        ${section('hotel', 'Hotel Information', HOTEL_INFO)}
        ${section('email', 'Email Settings', EMAIL)}
        ${section('data', 'Data Collection', DATA)}
        ${section('protection', 'Booking Protection', PROTECTION)}
      </div>
    </div>`
}
