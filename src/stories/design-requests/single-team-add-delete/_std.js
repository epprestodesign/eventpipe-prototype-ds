/** Single-Team Add and Delete (Linear P-ENG2-251) — shared scaffold.
 *
 *  Draft designs for Scott's spec (Teams Management, draft 5 Nov 2026). Two
 *  functions built together: add one team from the Compliance page through a
 *  create mode on Team Edit, and delete one team from Team Edit.
 *
 *  Everything here is fixture data and the rules the screens share, so the
 *  components, screens and the connected prototype can't drift apart.
 */

/* ---------------------------------------------------------------------------
 * Tickets — every story is tagged with the ticket(s) it designs: both the
 * requirement (STA-1) and its Linear ID (ENG2-111), written out literally in
 * each story file because Storybook's indexer only reads literal tags.
 * ------------------------------------------------------------------------- */
const LINEAR = 'https://linear.app/eventpipe/issue/'
export const TICKETS = {
  'STA-1': { id: 'ENG2-111', title: '“Add/Update Teams” Button' },
  'STA-2': { id: 'ENG2-116', title: 'Event Selection' },
  'STA-3': { id: 'ENG2-117', title: 'Create Mode on Team Edit' },
  'STA-4': { id: 'ENG2-118', title: 'Validation' },
  'STA-5': { id: 'ENG2-119', title: 'Auto-Generated Note' },
  'STA-6': { id: 'ENG2-120', title: 'Team Source Tracking' },
  'STD-1': { id: 'ENG2-110', title: 'Delete Team Action on Team Edit' },
  'STD-2': { id: 'ENG2-112', title: 'Confirmation Modal' },
  'STD-3': { id: 'ENG2-113', title: 'Delete Behavior' },
  'STD-4': { id: 'ENG2-114', title: 'Event Activity Log Entry' },
  'STD-5': { id: 'ENG2-115', title: 'BigQuery' },
}
/** Storybook decorator: a visible strip above a component naming the ticket(s)
 *  it designs, so the tag reads in the canvas and not only in the sidebar. */
export const ticketDecorator = (...keys) => () => ({
  setup: () => ({ strip: keys.map((k) => ({ key: k, id: TICKETS[k].id, title: TICKETS[k].title, url: LINEAR + TICKETS[k].id })) }),
  template: `
    <div>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
        <a v-for="t in strip" :key="t.key" :href="t.url" target="_blank" rel="noopener noreferrer"
          style="display:inline-flex; gap:6px; align-items:center; padding:3px 10px; border:1px solid var(--ds-color-border-brand); border-radius:var(--ds-radius-sm); background:var(--ds-color-background-brand-subtlest); color:var(--ds-color-text-brand); font-size:0.75rem; font-weight:600; text-decoration:none;">
          {{ t.key }} · {{ t.id }} <span style="font-weight:400; color:var(--ds-color-text);">{{ t.title }}</span>
        </a>
      </div>
      <story />
    </div>`,
})

export const PROJECT_URL = 'https://linear.app/eventpipe/project/single-team-add-and-delete-84eda936c544'

/** One Markdown line linking each ticket, for a story's docs description. */
export const ticketLine = (...keys) => '**Tickets:** ' + keys
  .map((k) => `[${k} · ${TICKETS[k].id}](${LINEAR}${TICKETS[k].id}) ${TICKETS[k].title}`)
  .join(' · ')

/* ---------------------------------------------------------------------------
 * App chrome
 * ------------------------------------------------------------------------- */
export const STD_NAV = [
  { key: 'users', label: 'Users', icon: 'groups' },
  { key: 'events', label: 'Events', icon: 'event' },
  { key: 'compliance', label: 'Compliance', icon: 'fact_check' },
  { key: 'pickup', label: 'Pickup Reports', icon: 'receipt_long' },
  { key: 'reports', label: 'Reports', icon: 'bar_chart' },
  { key: 'hotels', label: 'Hotels', icon: 'apartment' },
  { key: 'brands', label: 'Hotel Brands', icon: 'domain' },
  { key: 'amenities', label: 'Amenities', icon: 'room_service' },
  { key: 'room-types', label: 'Room Types', icon: 'king_bed' },
  { key: 'venues', label: 'Venues', icon: 'explore' },
  { key: 'event-companies', label: 'Event Companies', icon: 'account_tree' },
  { key: 'companies', label: 'Companies', icon: 'business_center' },
  { key: 'requests', label: 'Requests', icon: 'assignment' },
  { key: 'inventory', label: 'Inventory Request', icon: 'note_add' },
  { key: 'admin', label: 'Admin Tools', icon: 'manage_accounts' },
  { key: 'pipe', label: 'Pipe Tools', icon: 'build' },
  { key: 'webhooks', label: 'Webhooks', icon: 'link' },
]
export const COMPANY = 'Team Travel Source (TTS)'
export const USER = 'Justin Girard'

/* ---------------------------------------------------------------------------
 * Fixtures — modelled on the TTS production captures (references/110626).
 * ------------------------------------------------------------------------- */
/** `unlinkedBlocks` / `unlinkedRes` feed the Reconciliation tab (STD-3 adds to them). */
export const EVENTS = [
  { id: 'evt-east', name: '2026 - East Regional Showcase', start: 'Thu, 11/05/2026', isoStart: '2026-11-05', isoEnd: '2026-11-08', entity: 'Team', dates: 'Thu, 11/05/2026 - Sun, 11/08/2026', city: 'Atlanta, GA', producer: 'GA Soccer Events', type: 'Soccer', manager: 'Devanny Boisvert', status: 'Active', roomGoal: '600', peakGoal: '440', stayToPlay: 'True', defaultGoal: 24, unlinkedBlocks: 0, unlinkedRes: 45 },
  { id: 'evt-aspire', name: '2026 - Aspire West Showcase', start: 'Wed, 11/11/2026', isoStart: '2026-11-11', isoEnd: '2026-11-15', entity: 'Team', dates: 'Wed, 11/11/2026 - Sun, 11/15/2026', city: 'Mesa, AZ', producer: 'Aspire Events', type: 'Soccer', manager: 'Abby Brooks', status: 'Active', roomGoal: '800', peakGoal: '500', stayToPlay: 'True', defaultGoal: 24, unlinkedBlocks: 8, unlinkedRes: 64 },
  { id: 'evt-nations', name: '2026 - Nations Choice - Dance Grand Championship & Cheer Showdown', start: 'Thu, 11/12/2026', isoStart: '2026-11-12', isoEnd: '2026-11-15', entity: 'Organization', dates: 'Thu, 11/12/2026 - Sun, 11/15/2026', city: 'Orlando, FL', producer: 'Nations Choice', type: 'Dance', manager: 'Johnny HoCo', status: 'Active', roomGoal: '1000', peakGoal: '700', stayToPlay: 'False', defaultGoal: 10, unlinkedBlocks: 1, unlinkedRes: 30 },
]
export const eventById = (id) => EVENTS.find((e) => e.id === id)

export const VENUES = ['Atlanta Silverbacks Park', 'Kennesaw Soccer Complex', 'Mesa Riverview Fields']

/** Teams as the Compliance tab shows them. `need` > 0 means the team still
 *  needs that many room nights (Compliance Need reads "24 Room Nights").
 *  `resBlocks` / `nightsBlocks` are the grey (n) beside Reservations / Nights
 *  Booked. `source` is stored, never shown (STA-6). */
/** More of Aspire West's registered teams, so Reconciliation's Registered Team
 *  Selection has organizations with several teams to pick from. */
const ASPIRE_ORGS = [
  ['7 Elite Academy', ['7 Elite Academy Aspire 09/10', '7 Elite Academy Aspire 10/11', '7 Elite Academy Aspire 11/12', '7 Elite Academy Aspire 12/13', '7 Elite Academy Aspire 13/14'], 'Scottsdale, AZ'],
  ['AC Grand Rapids Academy', ['AC Grand Rapids Academy Aspire 08/09', 'AC Grand Rapids Academy Aspire 09/10', 'AC Grand Rapids Academy Aspire 10/11'], 'Grand Rapids, MI'],
  ['Albion CO', ['Albion CO Boulder Aspire U17'], 'Boulder, CO'],
  ['Arizona Arsenal', ['Arizona Arsenal Aspire 12/13', 'Arizona Arsenal Aspire 13/14'], 'Mesa, AZ'],
  ['West Coast FC', ['West Coast FC U16'], 'Irvine, CA'],
]
const aspireRegistry = () => ASPIRE_ORGS.flatMap(([org, names, location], o) => names.map((name, i) => {
  const need = (o + i) % 3 === 0 ? 24 - ((o * 5 + i * 7) % 20) : 0
  const nights = 24 - need
  return { id: `a${o}${i}`, eventId: 'evt-aspire', name, org, location, teamId: name.replace(/[^A-Za-z0-9]+/g, '-').toUpperCase(),
    contactName: `${org.split(' ')[0]} Manager`, contactEmail: `team${o}${i}@${org.toLowerCase().replace(/[^a-z0-9]+/g, '')}.example.com`,
    status: need ? 'Need' : 'Compliant', need, goal: 24, reservations: Math.round(nights / 3), resBlocks: 1, nights, nightsBlocks: 1,
    openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' }
}))

export const seedTeams = () => [
  { id: 't1', eventId: 'evt-east', name: 'Albion SC Las Vegas GA 12/13', org: 'Albion SC', teamId: 'ALB-1213', contactName: 'Warne Riker', contactEmail: 'manager@albionsclv.com', status: 'Compliant', need: 0, goal: 24, reservations: 33, resBlocks: 2, nights: 109, nightsBlocks: 3, openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' },
  { id: 't2', eventId: 'evt-east', name: 'Albion SC Las Vegas GA 13/14', org: 'Albion SC', teamId: 'ALB-1314', contactName: 'Warne Riker', contactEmail: 'manager@albionsclv.com', status: 'Compliant', need: 0, goal: 24, reservations: 23, resBlocks: 1, nights: 71, nightsBlocks: 3, openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' },
  { id: 't3', eventId: 'evt-east', name: 'Alexandria SA GA 12/13', org: 'Alexandria SA', teamId: 'Alexandria SA GA 12/13Alexandria SA', contactName: 'Ana Ruiz', contactEmail: 'ana@alexandriasa.org', status: 'Exempt', need: 0, goal: 24, reservations: 13, resBlocks: 0, nights: 39, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 0, source: 'API' },
  { id: 't4', eventId: 'evt-east', name: 'Augusta Lions GA 13/14', org: 'Georgia Elite', teamId: 'AUG-1314', contactName: 'Dana Pruitt', contactEmail: 'dpruitt@gaelite.org', status: 'Need', need: 18, goal: 24, reservations: 2, resBlocks: 1, nights: 6, nightsBlocks: 4, openBlocks: 2, peakAvail: 8, notes: 2, source: 'File Upload' },
  { id: 't5', eventId: 'evt-east', name: 'Baltimore Armour GA 12/13', org: 'Baltimore Armour', teamId: 'BAL-1213', contactName: 'Chris Dean', contactEmail: 'cdean@baltarmour.com', status: 'Need', need: 24, goal: 24, reservations: 0, resBlocks: 0, nights: 0, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' },
  { id: 't6', eventId: 'evt-east', name: 'Baltimore Celtic Soccer Club GA 12/13', org: 'Baltimore Celtic SC', teamId: 'BCSC-1213', contactName: 'Pat Moran', contactEmail: 'pmoran@baltceltic.org', status: 'Not Coming', need: 0, goal: 24, reservations: 0, resBlocks: 0, nights: 0, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 1, source: 'File Upload' },
  { id: 't7', eventId: 'evt-east', name: 'Bayside FC GA 12/13', org: '', teamId: 'Bayside FC GA 12/13', contactName: 'Lee Huang', contactEmail: 'lee@baysidefc.com', status: 'Exempt', need: 0, goal: 24, reservations: 0, resBlocks: 0, nights: 0, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' },
  { id: 't8', eventId: 'evt-east', name: 'Broomfield Soccer Club GA 2013', org: 'Broomfield SC', teamId: 'BSC-2013', contactName: 'Morgan Pike', contactEmail: 'mpike@broomfieldsc.org', status: 'Compliant', need: 0, goal: 0, reservations: 3, resBlocks: 0, nights: 12, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 3, source: 'File Upload' },
  { id: 't9', eventId: 'evt-aspire', name: 'West Coast FC', org: 'West Coast FC', teamId: 'WCFC', contactName: 'Wes Danner', contactEmail: 'wes@westcoastfc.com', status: 'Compliant', need: 0, goal: 24, reservations: 12, resBlocks: 1, nights: 41, nightsBlocks: 2, openBlocks: 1, peakAvail: 4, notes: 0, source: 'File Upload' },
  { id: 't10', eventId: 'evt-aspire', name: 'Albion CO Boulder Aspire U19', org: 'Albion CO', teamId: 'ACB-U19', contactName: 'Kara Sorensen', contactEmail: 'kara@albionco.org', status: 'Need', need: 1, goal: 24, reservations: 7, resBlocks: 1, nights: 23, nightsBlocks: 1, openBlocks: 1, peakAvail: 2, notes: 0, source: 'API' },
  ...aspireRegistry(),
  { id: 't11', eventId: 'evt-nations', name: '', org: 'Alamo Dance Academy', teamId: 'Alamo Dance Academy', contactName: 'Rosa Medina', contactEmail: 'rosa@alamodance.com', status: 'Need', need: 6, goal: 10, reservations: 1, resBlocks: 1, nights: 4, nightsBlocks: 2, openBlocks: 1, peakAvail: 3, notes: 1, source: 'File Upload' },
]

/** Compliance Need, as the Compliance tab shows it: the status, or for a team
 *  that hasn't met its goal, what it still needs ("24 Room Nights"). */
export const complianceNeed = (t) => (t.status === 'Need' ? `${t.need} Room Nights` : t.status)

/* ---------------------------------------------------------------------------
 * Compliance page filters — production's inline Filter panel. Entity Name is
 * a text search (4 characters). Event Name is a type-ahead: type 4 characters,
 * pick one event (11/09 review: production's filter selects a single event). Event Start Date keeps events still
 * running on or after the date (production's 2026-11-06 filter still lists
 * events that began 11/05).
 * ------------------------------------------------------------------------- */
export const emptyFilters = (over = {}) => ({
  entityName: '', eventId: '', date: '2026-11-06', producer: '', manager: '', type: '', status: '', favorites: false, ...over,
})
const hit = (q, v) => q.trim().length < 4 || (v || '').toLowerCase().includes(q.trim().toLowerCase())
export const eventMatches = (e, f) => (!f.eventId || e.id === f.eventId) && (!f.date || e.isoEnd >= f.date)
  && (!f.producer || e.producer === f.producer) && (!f.manager || e.manager === f.manager) && (!f.type || e.type === f.type)
export const STATUS_OPTIONS = ['Compliant', 'Exempt', 'Not Coming', 'Not Compliant']
const statusMatches = (t, s) => !s || (s === 'Not Compliant' ? t.status === 'Need' : t.status === s)
export const filterTeams = (teams, events, f) => teams.filter((t) => {
  const e = events.find((x) => x.id === t.eventId)
  return e && eventMatches(e, f) && hit(f.entityName, displayName(t)) && statusMatches(t, f.status)
})
/** The "Filtered By:" chips, in production's grey chip style. */
export const filterChips = (f) => [
  f.date && { key: 'date', label: f.date },
  f.eventId && { key: 'eventId', label: eventById(f.eventId)?.name || f.eventId },
  f.entityName.trim().length >= 4 && { key: 'entityName', label: `Entity: ${f.entityName.trim()}` },
  f.producer && { key: 'producer', label: f.producer },
  f.manager && { key: 'manager', label: f.manager },
  f.type && { key: 'type', label: f.type },
  f.status && { key: 'status', label: f.status },
  f.favorites && { key: 'favorites', label: 'Favorites' },
].filter(Boolean)
/** STA-2: the event to preselect in create mode — the event picked in the
 *  Compliance list's Event Name filter, if any. */
export const singleEventId = (teams, events, f) => f.eventId || ''

/** Type-ahead events (Event Name filter, create mode): nothing until 4
 *  characters, then every event whose name contains them. */
export const TYPEAHEAD_MIN = 4
export const eventSearch = (events, q) => {
  const n = (q || '').trim().toLowerCase()
  return n.length < TYPEAHEAD_MIN ? [] : events.filter((e) => e.name.toLowerCase().includes(n))
}

/** Event activity log rows already present before the prototype runs (STD-4). */
export const seedActivity = () => [
  { when: 'Wed, 11/04/2026 02:18 PM EST', user: 'Scott Villemain', text: 'Event Updated' },
  { when: 'Mon, 10/12/2026 09:05 AM EST', user: 'Devanny Boisvert', text: 'Event Copied From 2025 - East Regional Showcase' },
]

/* ---------------------------------------------------------------------------
 * Rules from the spec
 * ------------------------------------------------------------------------- */
/** "Team" reads "Organization" when the event's Registered Entity is Organizations. */
export const entityWord = (event) => (event && event.entity === 'Organization' ? 'Organization' : 'Team')

/** A team's display name: its Team Name, else its Organization Name. */
export const displayName = (t) => t.name || t.org

/** STA-4: blank Team ID is generated with the uploader's logic — Team Name if
 *  only Team Name, Organization Name if only Organization Name, both
 *  concatenated if both. (Concatenated with no separator, as the uploader
 *  does — to confirm.) */
export const generatedTeamId = (f) => `${f.name.trim()}${f.org.trim()}`

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** STA-2 + STA-4: every inline error for a create-mode save. Empty object = valid. */
export function validateNewTeam(f, teams) {
  const e = {}
  if (!f.eventId) e.eventId = 'Select an event.'
  if (!f.name.trim() && !f.org.trim()) {
    e.name = 'Enter a Team Name or an Organization Name.'
    e.org = 'Enter a Team Name or an Organization Name.'
  }
  if (!f.contactEmail.trim()) e.contactEmail = 'Enter a contact email.'
  else if (!EMAIL.test(f.contactEmail.trim())) e.contactEmail = 'Enter a valid email address.'
  // Uniqueness runs after the Team ID is generated, within the EventPipe event.
  const id = (f.teamId.trim() || generatedTeamId(f)).toLowerCase()
  if (f.eventId && id && teams.some((t) => t.eventId === f.eventId && t.teamId.toLowerCase() === id)) {
    e.teamId = f.teamId.trim()
      ? `Team ID “${f.teamId.trim()}” is already used in this event.`
      : `The generated Team ID “${generatedTeamId(f)}” is already used in this event. Enter a different Team ID.`
  }
  return e
}

export const emptyTeamForm = (eventId = '') => ({
  eventId, name: '', org: '', teamId: '', contactName: '', contactEmail: '', contactPhone: '',
  address: '', city: '', state: '', zip: '', participants: '', teamsCount: '', venue: '',
  // Goals & Restrictions overrides and Communications (shown in both modes).
  statusOverride: 'No Override', goalOverride: '', blockOverride: '', optOut: false,
})

/** STD-2: static copy, the same for every team. */
export const deleteCopy = (word) => ({
  title: `Delete this ${word.toLowerCase()}?`,
  lead: 'This can’t be undone.',
  body: `Any group blocks or reservations linked to this ${word.toLowerCase()} will be unlinked and moved to Reconciliation. The ${word.toLowerCase()}’s notes, compliance credits, and communication history will also be deleted. If the ${word.toLowerCase()} is still in your registration file, uploading that file again will add it back.`,
  confirm: `Delete ${word}`,
})

/** STD-4: the activity log blurb. */
export const deletedBlurb = (word, name) => `${word} ‘${name}’ was deleted.`

/** STA-5: the note written on the first save. */
export const autoNote = (user) => `Team added manually by ${user}.`

/** "Fri, 11/06/2026 02:46 PM EST" — production's activity log format. */
export function nowStamp(d = new Date()) {
  const day = d.toLocaleDateString('en-US', { weekday: 'short' })
  const date = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return `${day}, ${date} ${time} EST`
}

/* ---------------------------------------------------------------------------
 * Autofill — Storybook-only review helpers for the create form.
 * "Click to fill" fills an empty field with its SAMPLE value when clicked;
 * "Fill ▾" applies one of FILL_PRESETS to the whole form. Presets marked
 * `validate` run the Save check at once, so their error states show without
 * pressing Save.
 * ------------------------------------------------------------------------- */
export const SAMPLE = {
  eventId: 'evt-east',
  name: 'Peach State FC GA 13/14',
  org: 'Peach State FC',
  teamId: 'PSFC-1314',
  contactName: 'Jordan Ellis',
  contactEmail: 'jordan.ellis@peachstatefc.com',
  contactPhone: '(404) 555-0148',
  address: '1200 Field Ave',
  city: 'Atlanta',
  state: 'GA',
  zip: '30318',
  participants: '15',
  teamsCount: '1',
  venue: 'Atlanta Silverbacks Park',
}

export const FILL_PRESETS = [
  { key: 'valid', label: 'Complete & valid', icon: 'task_alt', caption: 'Every field filled — Save succeeds', values: { ...SAMPLE }, validate: false },
  { key: 'generated', label: 'Generated Team ID', icon: 'auto_fix_high', caption: 'Team ID blank — shows the ID it will get', values: { ...SAMPLE, teamId: '' }, validate: false },
  { key: 'required', label: 'Missing required fields', icon: 'error_outline', caption: 'No event, no names, no email', values: { ...SAMPLE, eventId: '', name: '', org: '', teamId: '', contactEmail: '' }, validate: true },
  { key: 'email', label: 'Invalid email', icon: 'alternate_email', caption: 'Contact Email isn’t an address', values: { ...SAMPLE, contactEmail: 'jordan.ellis@' }, validate: true },
  { key: 'duplicate', label: 'Duplicate Team ID', icon: 'content_copy', caption: 'Matches Albion SC (ALB-1213) in this event', values: { ...SAMPLE, name: 'Albion SC GA 12/13', org: 'Albion SC', teamId: 'ALB-1213' }, validate: true },
  { key: 'duplicate-generated', label: 'Duplicate generated ID', icon: 'content_copy', caption: 'Blank ID generates one already used', values: { ...SAMPLE, name: 'Bayside FC GA 12/13', org: '', teamId: '' }, validate: true },
  { key: 'clear', label: 'Clear all', icon: 'backspace', caption: 'Back to an empty form', values: null, validate: false },
]

/* ── Reconciliation (the event drill-in from the Reconciliation tab) ──────────
   Each event's unlinked group blocks and individual reservations, as cards.
   The seeds match the events' unlinkedBlocks / unlinkedRes counts. Names,
   phones and emails are invented (555 numbers, example.com addresses). */
const FIRST = ['Maya', 'Jordan', 'Elena', 'Marcus', 'Priya', 'Owen', 'Talia', 'Gabe', 'Nina', 'Reese', 'Caleb', 'Ivy', 'Dario', 'Lena', 'Theo', 'Sofia']
const LAST = ['Hartley', 'Okafor', 'Lindqvist', 'Moreau', 'Castillo', 'Brennan', 'Nakamura', 'Whitfield', 'Asante', 'Kowalski', 'Delgado', 'Pryor', 'Vance']
const CITIES = { 'evt-east': ['Atlanta, GA', 'Marietta, GA', 'Augusta, GA', 'Savannah, GA'], 'evt-aspire': ['Mesa, AZ', 'Gilbert, AZ', 'Boulder, CO', 'Henderson, NV'], 'evt-nations': ['Orlando, FL', 'Tampa, FL', 'San Antonio, TX', 'Mobile, AL'] }
const BLOCK_SEEDS = {
  // Edge cases: `edge` is a review-only note shown in the Storybook docs.
  'evt-aspire': [
    { name: 'West Coast FC', contact: 'Wes Danner', nights: 41, edge: 'Exact name match to a registered team' },
    { name: 'Albion CO Boulder Aspire U19', contact: 'Kara Sorensen', nights: 0, edge: 'Same name twice · no nights booked yet' },
    { name: 'Albion CO Boulder Aspire U19', contact: 'Kara Sorensen', nights: 23, phone: '(000) 000-0000', location: '0, AL', edge: 'Placeholder phone and location from the booking' },
    { name: '7 Elite Aspire 12-13', unlinkedName: '7 Elite Aspire 12-13', contact: 'Jonah Reyes', nights: 18, status: 'Open', edge: 'Booked under a name that doesn’t match the registered team' },
    { name: 'AC Grand Rapids Academy', unlinkedName: 'AC Grand Rapids Academy', contact: 'Elise Varga', nights: 36, registeredTeams: 1, edge: 'Club block — one of its teams is already linked' },
    { name: 'HOLD FOR TTS STAFF', contact: 'Avery Lyle', nights: 15, edge: 'Staff hold — not a team; Ignore it' },
    { name: 'Sereno SC Aspire 11/12', unlinkedName: 'Sereno SC Aspire 11/12', contact: 'Paolo Greco', nights: 9, status: 'Open', edge: 'No registered team to link — not in the registration file' },
    { name: 'Phoenix Rising Aspire 10/11', contact: 'Tess Calloway', nights: 0, status: 'Cancelled', edge: 'Cancelled block' },
  ],
  'evt-nations': [{ name: 'Lone Star Cheer Elite', contact: 'Rosa Medina', nights: 18 }],
}
const pad = (n, w) => String(n).padStart(w, '0')
export const phoneFor = (i) => `(555) ${pad(200 + ((i * 37) % 700), 3)}-${pad(1000 + ((i * 611) % 9000), 4)}`
const emailFor = (name) => `${name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')}@example.com`

/** A group-block card. `fromTeam` names the deleted team it came from (STD-3). */
export const makeBlock = (eventId, i, over = {}) => {
  const s = (BLOCK_SEEDS[eventId] || [])[i] || { name: `Overflow Block ${i + 1}`, contact: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`, nights: 6 + (i % 5) * 4 }
  const city = CITIES[eventId][i % 4]
  return { id: `${eventId}-b${i}`, kind: 'block', name: s.name, status: s.status || 'Closed', registeredTeams: s.registeredTeams || 0, nights: s.nights,
    ref: `G-00${8112 + i * 497}${pad(i, 2)}`, contact: s.contact, phone: s.phone || phoneFor(i + 3), email: emailFor(s.contact), location: s.location || city,
    unlinkedName: s.unlinkedName || '', edge: s.edge || '', fromTeam: '', ...over }
}
/** An individual-reservation card. */
export const makeRes = (eventId, i, over = {}) => {
  const comp = i % 9 === 1
  const guest = `${FIRST[(i * 5) % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`
  return { id: `${eventId}-r${i}`, kind: 'res', name: comp ? `${guest} COMP ROOM` : guest, status: 'Processed', nights: 1 + (i % 4),
    ref: `R-0${6149912 + i * 1307}`, contact: guest, phone: phoneFor(i + 40), email: emailFor(guest), location: CITIES[eventId][(i + 1) % 4],
    unlinkedName: '', edge: '', fromTeam: '', seq: i, ...over }
}
export const seedRecon = () => Object.fromEntries(EVENTS.map((e) => [e.id, {
  blocks: Array.from({ length: e.unlinkedBlocks }, (_, i) => makeBlock(e.id, i)),
  res: Array.from({ length: e.unlinkedRes }, (_, i) => makeRes(e.id, i)),
}]))
/** What a deleted team leaves in Reconciliation: its open blocks and its reservations. */
export const orphansOf = (t, startAt) => [
  ...Array.from({ length: t.openBlocks }, (_, i) => makeBlock(t.eventId, startAt + i, {
    id: `${t.id}-b${i}`, name: displayName(t), contact: t.contactName, email: t.contactEmail, status: 'Open', nights: 0, fromTeam: displayName(t) })),
  ...Array.from({ length: t.reservations }, (_, i) => makeRes(t.eventId, startAt + 100 + i, { id: `${t.id}-r${i}`, fromTeam: displayName(t) })),
]
/** The contact details a Registered Team Selection fills in. */
export const teamContact = (t, i = 0) => ({ location: t.location || '', phone: t.phone || phoneFor(i + 90), email: t.contactEmail || '' })

/** The team Autofill picks for a card: the registered team whose name holds
 *  every word of the card's name (exact or loose match). Reservations, which
 *  carry a guest's name, get a team by position. Null when nothing fits. */
const words = (x) => x.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean)
export function suggestTeam(item, teams) {
  if (!teams.length) return null
  if (item.kind === 'res') return teams[(item.seq ?? 0) % teams.length].id
  const want = words(item.unlinkedName || item.name)
  const hit = teams.find((t) => { const have = words(displayName(t)); return want.every((w) => have.includes(w)) })
  return hit ? hit.id : null
}

/** Fill ▾ presets on the Reconciliation page. */
export const RECON_PRESETS = [
  { key: 'suggest', label: 'Pick a team for every card', icon: 'task_alt', caption: 'Matches by name — cards with no match stay empty' },
  { key: 'missing', label: 'Link with no team picked', icon: 'error_outline', caption: 'Shows the “Select a registered team” error' },
  { key: 'clear', label: 'Clear all', icon: 'backspace', caption: 'Back to empty selections' },
]
