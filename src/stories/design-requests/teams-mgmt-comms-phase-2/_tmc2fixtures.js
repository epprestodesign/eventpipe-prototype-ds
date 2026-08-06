/** Single source of truth for the demo data across every Teams Mgmt Comms
 *  Phase 2 screen.
 *
 *  Before this existed the folder showed three different companies, three
 *  different events and two different signed-in users, so clicking between
 *  screens read as unrelated products. Everything now hangs off one tenant:
 *
 *    Company : Traveloc            (already the company in V1/V2)
 *    User    : Mike Addesa
 *    Event   : 2027 - San Antonio Soccer Classic
 *    Team    : Southern United 05B (org: Southern Teams) — competing in it
 *
 *  Import from here rather than hardcoding names, so the whole folder moves
 *  together when the demo tenant changes.
 */
import traveloc from '../../../assets/logo/traveloc.png'

export const COMPANY = {
  name: 'Traveloc',
  logo: traveloc,
  lastUpdated: 'Fri, 08/16/2024 09:38 AM EST',
  website: 'https://traveloc.com/',
  supportEmail: 'support@traveloc.com',
  phone: '(305) 555-0142',
  tollFree: '(800) 555-0142',
  brandedUrl: 'https://reservations.traveloc.com',
  fromEmail: 'Traveloc<mailer@eventpipe.com>',
}

export const USER = 'Mike Addesa'

/** The one event every event-scoped screen in this folder is showing. */
export const EVENT = {
  name: '2027 - San Antonio Soccer Classic',
  status: 'Active',
  producer: 'Soccer Association and Federation of America',
  cityState: 'San Antonio, TX',
  dates: 'Fri, 09/03/2027 - Sun, 09/05/2027',
  accountManager: 'Johnny HoCo',
  roomNightGoal: '1000',
  peakNightGoal: '1000',
  stayToPlay: 'True',
  tabs: ['Hotels', 'RFPs', 'Venues', 'Notes', 'Groups', 'Reservations', 'Waitlist', 'Pickup', 'Registration', 'Customize', 'Activity Logs'],
}

/** Meta grid under the event title — row-major across 3 columns. */
EVENT.meta = [
  { label: 'City/State:', value: EVENT.cityState },
  { label: 'Room Night Goal:', value: EVENT.roomNightGoal },
  { label: 'Account Manager:', value: EVENT.accountManager },
  { label: 'Event Producer:', value: EVENT.producer },
  { label: 'Peak Night Goal:', value: EVENT.peakNightGoal },
  { label: 'Stay to Play:', value: EVENT.stayToPlay },
  { label: 'Start/End Dates:', value: EVENT.dates },
  { label: '', value: '' },
  { label: '', value: '' },
]

/** The one team every team-scoped screen is showing — competing in EVENT. */
export const TEAM = {
  name: 'Southern United 05B',
  org: 'Southern Teams',
  id: '1234',
  contactName: 'Warne Riker',
  contactEmail: 'southernunited@eventpipe.com',
  contactPhone: '6155338813',
  address: '',
  city: 'Spring Hill',
  state: 'TN',
  zip: '37174',
  participants: '15',
  teams: '2',
  venue: 'Toyota Field ★',
  complianceStatus: 'Compliant',
  complianceGoal: '24 Room Nights',
  roomBlockRestrictions: '0',
}

/** Company Settings read-view content, branded to COMPANY. */
export const COMPANY_SECTIONS_TOP = [
  { title: 'Company Details', items: [
    { label: 'Country', value: 'United States' }, { label: 'Address', value: '4400 Biscayne Blvd' }, { label: 'City', value: 'Miami' },
    { label: 'State/Province', value: 'FL' }, { label: 'Postal Code', value: '33137' }, { label: 'Phone', value: COMPANY.phone },
    { label: 'Website', value: COMPANY.website }, { label: 'Travel Agent IATAN', value: '55-901234' }, { label: 'Privacy Policy URL', value: 'https://traveloc.com/privacy' },
  ] },
  { title: 'Customer Service Details', items: [
    { label: 'Service Email', value: COMPANY.supportEmail }, { label: 'Phone Number', value: COMPANY.phone }, { label: 'Phone Number (Toll Free)', value: COMPANY.tollFree },
    { label: 'Service Hours', value: '9-6, ET' },
  ] },
  { title: 'Hotel Services Info', items: [
    { label: 'Hotel Service Contact Name', value: 'Dana Ruiz' }, { label: 'Hotel Service Email', value: 'hotels@traveloc.com' },
    { label: 'Hotel Service Phone Number', value: '(305) 555-0177' }, { label: 'Hotel Service Phone Number (Toll Free)', value: '— —' },
    { label: 'Hotel Service Hours', value: '9-6, ET' },
  ] },
]

export const COMPANY_RECON = [
  { label: 'Default Pickup Reconciliation Format', value: 'Night By Night' }, { label: 'Commission Calculation', value: 'Gross Rate (Reservation by Reservation Only)' }, { label: '', value: '' },
  { label: 'Default Upload & Wash Requirement', value: 'No' }, { label: 'Automated Invoice Numbers', value: 'Yes' }, { label: '', value: '' },
  { label: 'Country', value: 'United States' }, { label: 'State/Province', value: 'FL' }, { label: 'Postal Code', value: '33137' },
  { label: 'Phone', value: COMPANY.phone }, { label: 'Email', value: 'cfo@traveloc.com' }, { label: 'Payment Terms', value: 'Net 30' },
]

export const COMPANY_SECTIONS_BOTTOM = [
  { title: 'Branding', items: [
    { label: 'Branded URL', value: COMPANY.brandedUrl },
    { label: 'Reservations - From Email Address', value: COMPANY.fromEmail },
    { label: 'Group Blocks - From Email Address', value: COMPANY.fromEmail },
    { label: 'Hotels - From Email Address', value: COMPANY.fromEmail },
    { label: 'Accounting Processes - From Email Address', value: COMPANY.fromEmail },
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
    { label: 'Travel Protection Provider', value: 'Vertical Travel Insurance' },
  ] },
  { title: 'Customization', items: [
    { label: 'Booking Fee Display Name', value: 'Booking Fee' },
  ] },
]

/* ===========================================================================
 * Phase 2 additions — fixtures for the requirements being designed.
 * =========================================================================== */

/** Company-level Teams Management templates. The event screen toggles these
 *  per event (DES-425 · P0-1); the company screen edits them (DES-428 · P0-4).
 *  `type` drives which config sections show (DES-431 · P0-7): only
 *  `compliance-reminder` gets the Scheduling block. */
export const TM_TEMPLATES = [
  {
    key: 'welcome',
    type: 'welcome',
    title: 'Welcome Email',
    desc: 'Sent once when a team is first registered, introducing the Stay-to-Play requirement and how to book.',
    companyOn: true,
    eventOn: true,
    recurring: false,
  },
  {
    key: 'reminder-standard',
    type: 'compliance-reminder',
    title: 'Compliance Reminder',
    desc: 'Recurring nudge to teams that have not yet met their Stay-to-Play requirement.',
    companyOn: true,
    eventOn: true,
    recurring: true,
  },
  {
    key: 'reminder-final',
    type: 'compliance-reminder',
    title: 'Final Notice - Cutoff Approaching',
    desc: 'A firmer reminder in the final weeks before the last hotel cutoff date.',
    companyOn: true,
    eventOn: false,
    recurring: true,
    custom: true,
  },
  {
    key: 'previously-compliant',
    type: 'previously-compliant',
    title: 'Previously Compliant Notice',
    desc: 'Alerts a team that was compliant but has fallen back below its requirement.',
    companyOn: true,
    eventOn: true,
    recurring: false,
  },
]

/** From/Reply address options — set once for ALL Teams Management emails
 *  (DES-429 · P0-5). Group-level only; no event-level override. */
export const FROM_ADDRESS_OPTIONS = [
  'Event Manager',
  'Event Customer Support Contact',
  'Other',
]

/** Resolved from-address shown read-only inside each template editor. */
export const FROM_ADDRESS_RESOLVED = {
  'Event Manager': 'Johnny HoCo <johnny.hoco@traveloc.com>',
  'Event Customer Support Contact': 'Traveloc Support <support@traveloc.com>',
}

/** Per-team communications log (DES-433 · P0-9). View-only: no resend. */
export const COMMS_LOG = [
  { sent: '08/03/2026 6:00 AM EST', type: 'Compliance Reminder', recipients: ['southernunited@eventpipe.com'], status: 'Read' },
  { sent: '07/27/2026 6:00 AM EST', type: 'Compliance Reminder', recipients: ['southernunited@eventpipe.com', 'blockcontact@eventpipe.com'], status: 'Sent' },
  { sent: '07/20/2026 6:00 AM EST', type: 'Compliance Reminder', recipients: ['southernunited@eventpipe.com', 'blockcontact@eventpipe.com'], status: 'Sent' },
  { sent: '07/13/2026 6:00 AM EST', type: 'Compliance Reminder', recipients: ['southernunited@eventpipe.com'], status: 'Bounced' },
  { sent: '07/06/2026 6:00 AM EST', type: 'Previously Compliant Notice', recipients: ['southernunited@eventpipe.com'], status: 'Read' },
  { sent: '06/29/2026 6:00 AM EST', type: 'Compliance Reminder', recipients: ['southernunited@eventpipe.com'], status: 'Sent' },
  { sent: '06/12/2026 6:00 AM EST', type: 'Welcome Email', recipients: ['southernunited@eventpipe.com'], status: 'Read' },
]

/** Send-status → chip color, using the DS status-chip pattern. */
export const LOG_STATUS_COLOR = { Sent: 'primary', Read: 'positive', Bounced: 'negative', Failed: 'negative' }

/** Compliance statuses a template can target (DES-431 · P0-7). */
export const COMPLIANCE_STATUSES = [
  'Not Started', 'In Progress', 'Previously Compliant', 'Exempt', 'Local', 'Not Coming', 'Compliant',
]

/* ---------------------------------------------------------------------------
 * DES-427 · P0-3 — the three templates every customer is seeded with.
 *
 * `settings` are the defaults verbatim from the spec. `body` is DRAFT copy —
 * the spec says "Pending Default Template Body" and DES-447 assigns the real
 * wording to Scott. It exists here so the templates are reviewable, and uses
 * ONLY merge fields defined in DES-430 (P0-6).
 *
 * Mustache braces are assembled with mf() so no literal {{ ever reaches Vue's
 * template compiler, which would close the interpolation early.
 */
const mf = (name) => '{' + '{' + name + '}' + '}'

export const DEFAULT_EMAILS = [
  {
    key: 'welcome',
    type: 'welcome',
    title: 'Welcome Email',
    purpose: 'Sent once, the first time a team appears on the event. Establishes that the event is Stay-to-Play and points the team at the booking link.',
    subject: `Book your rooms for ${mf('event_name')}`,
    settings: [
      { label: 'Compliance statuses', value: 'Not Started, In Progress, Previously Compliant' },
      { label: 'Recipients', value: 'Team Housing Contact' },
      { label: 'Scheduling', value: 'One-time — sent once per team' },
    ],
    body: [
      `Hi ${mf('team_contact_name')},`,
      `${mf('entity_name')} is registered for ${mf('event_name')} in ${mf('event_start_date')} – ${mf('event_end_date')}. This event is Stay-to-Play, which means teams are asked to book their rooms through the official event housing block.`,
      `Your requirement is ${mf('compliance_goal')} ${mf('compliance_criteria')}. Nothing has been booked yet.`,
      `You can book here: ${mf('booking_link')}`,
      `${mf('team_group_block_info')}`,
      `The last date to book at event rates is ${mf('last_cutoff_date')} — ${mf('days_until_cutoff')} from today.`,
      `${mf('noncompliance_policy')}`,
      `Questions? Contact ${mf('event_manager_name')} at ${mf('event_manager_email')}.`,
    ],
  },
  {
    key: 'compliance-reminder',
    type: 'compliance-reminder',
    title: 'Compliance Reminder',
    purpose: 'The recurring nudge. Runs weekly from 200 days out until the event starts, to any team not yet meeting its requirement.',
    subject: `${mf('entity_name')}: ${mf('compliance_progress_remaining')} ${mf('compliance_criteria')} still to book`,
    settings: [
      { label: 'Days before event start to begin', value: '200' },
      { label: 'Days before event start to end', value: '0' },
      { label: 'Cadence', value: 'Days of week — Monday, every 1 week' },
      { label: 'Compliance statuses', value: 'Not Started, In Progress, Previously Compliant' },
      { label: 'Recipients', value: 'Team Housing Contact, Group Block Creators' },
    ],
    body: [
      `Hi ${mf('team_contact_name')},`,
      `A reminder about the Stay-to-Play requirement for ${mf('event_name')}, which starts in ${mf('days_until_event')}.`,
      `${mf('entity_name')} has booked ${mf('compliance_progress_booked')} of ${mf('compliance_goal')} ${mf('compliance_criteria')} — ${mf('compliance_progress_remaining')} to go.`,
      `${mf('team_group_block_info')}`,
      `Book here: ${mf('booking_link')}`,
      `Rooms at event rates are released after ${mf('last_cutoff_date')}, ${mf('days_until_cutoff')} from today.`,
      `${mf('noncompliance_policy')}`,
      `Questions? Contact ${mf('event_manager_name')} at ${mf('event_manager_email')}.`,
    ],
  },
  {
    key: 'previously-compliant',
    type: 'previously-compliant',
    title: 'Previously Compliant Notice',
    purpose: 'Sent when a team that had met its requirement drops back below it — usually after a cancellation. Sends once, and resets when the team becomes compliant again.',
    subject: `${mf('entity_name')} is no longer meeting its ${mf('event_name')} requirement`,
    settings: [
      { label: 'Compliance statuses', value: 'Previously Compliant' },
      { label: 'Recipients', value: 'Team Housing Contact, Group Block Creators' },
      { label: 'Scheduling', value: 'One-time — resets if the team becomes compliant again' },
    ],
    body: [
      `Hi ${mf('team_contact_name')},`,
      `${mf('entity_name')} was previously meeting the Stay-to-Play requirement for ${mf('event_name')}, but recent changes have brought the booking count below it.`,
      `The requirement is ${mf('compliance_goal')} ${mf('compliance_criteria')}. Currently booked: ${mf('compliance_progress_booked')}. Short by ${mf('compliance_progress_remaining')}.`,
      `${mf('team_group_block_info')}`,
      `You can rebook here: ${mf('booking_link')}`,
      `The last date to book at event rates is ${mf('last_cutoff_date')}, ${mf('days_until_cutoff')} from today.`,
      `${mf('noncompliance_policy')}`,
      `Questions? Contact ${mf('event_manager_name')} at ${mf('event_manager_email')}.`,
    ],
  },
]

/** Merge-field → demo value, for rendering an email "as the team receives it". */
export const MERGE_VALUES = {
  event_name: EVENT.name,
  event_start_date: 'Fri, 09/03/2027',
  event_end_date: 'Sun, 09/05/2027',
  booking_link: 'https://reservations.traveloc.com/san-antonio-soccer-classic',
  entity_name: TEAM.name,
  team_contact_name: TEAM.contactName,
  team_contact_email: TEAM.contactEmail,
  team_group_block_info: 'You have 1 open group block: “Southern United 05B — Marriott Riverwalk”, 6 of 12 rooms reserved, releasing 08/03/2027.',
  compliance_criteria: 'room nights',
  compliance_goal: '24',
  compliance_progress_booked: '10',
  compliance_progress_remaining: '14',
  noncompliance_policy: 'Teams that have not met their room night requirement by the final hotel cutoff date will be invoiced the difference at the prevailing event rate.',
  last_cutoff_date: '08/03/2027',
  days_until_event: '92 days',
  days_until_cutoff: '61 days',
  event_manager_name: EVENT.accountManager,
  event_manager_email: 'johnny.hoco@traveloc.com',
}

/* ---------------------------------------------------------------------------
 * DES-432 · P0-8 — send eligibility.
 *
 * The daily 6am EST job can be blocked at three levels. These fixtures drive
 * the "why isn't this sending?" surfaces. Per the design decision on this
 * ticket, nothing here forecasts a next send date — forward-looking views stay
 * with DES-437 (PipeSights).
 */

/** Event-level gates. Both must pass or NO Teams Management email sends for the
 *  event, regardless of per-template toggles. */
export const EVENT_SEND_GATES = [
  {
    key: 'cutoff',
    label: 'Last hotel cutoff date has not passed',
    detail: 'Sending stops after the final EventHotel cutoff date.',
    passing: true,
    value: 'Cutoff is 08/03/2027 — 61 days away',
  },
  {
    key: 'links',
    label: 'A booking link is live',
    detail: 'Either the Group Block link or the Individual Reservation link must be live.',
    passing: true,
    value: 'Group Block link is live',
  },
]

/** The same gates in a blocked state, for the story that shows the failure. */
export const EVENT_SEND_GATES_BLOCKED = [
  { ...EVENT_SEND_GATES[0], passing: false, value: 'Cutoff was 08/03/2026 — passed 3 days ago' },
  { ...EVENT_SEND_GATES[1], passing: false, value: 'Neither booking link is live yet' },
]

/** Team-level state: why this team is or is not currently receiving comms, plus
 *  the one-time send flags. Read-only in the UI — the flags are engine state. */
export const TEAM_SEND_STATE = {
  eligible: true,
  reason: '',
  complianceStatus: 'In Progress',
  flags: [
    { key: 'welcome', label: 'Welcome Email sent', sent: true, when: '06/12/2026', note: 'One-time. Will not send again.' },
    { key: 'previously-compliant', label: 'Previously Compliant Notice sent', sent: false, when: '', note: 'Resets automatically if the team becomes compliant again.' },
  ],
  eligibleFor: ['Compliance Reminder'],
}

/** Daily send priority — a team receives at most ONE email per day. */
export const SEND_PRIORITY = ['Welcome Email', 'Previously Compliant Notice', 'Compliance Reminder']

export const SEND_PRIORITY_NOTE =
  'A team receives at most one Teams Management email per day. If more than one qualifies on the same run, only the highest-priority one sends; the others are skipped for that day.'
