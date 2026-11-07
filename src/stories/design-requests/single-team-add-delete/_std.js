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
  { id: 'evt-aspire', name: '2026 - Aspire West Showcase', start: 'Wed, 11/11/2026', isoStart: '2026-11-11', isoEnd: '2026-11-15', entity: 'Team', dates: 'Wed, 11/11/2026 - Sun, 11/15/2026', city: 'Mesa, AZ', producer: 'Aspire Events', type: 'Soccer', manager: 'Abby Brooks', status: 'Active', roomGoal: '800', peakGoal: '500', stayToPlay: 'True', defaultGoal: 24, unlinkedBlocks: 4, unlinkedRes: 64 },
  { id: 'evt-nations', name: '2026 - Nations Choice - Dance Grand Championship & Cheer Showdown', start: 'Thu, 11/12/2026', isoStart: '2026-11-12', isoEnd: '2026-11-15', entity: 'Organization', dates: 'Thu, 11/12/2026 - Sun, 11/15/2026', city: 'Orlando, FL', producer: 'Nations Choice', type: 'Dance', manager: 'Johnny HoCo', status: 'Active', roomGoal: '1000', peakGoal: '700', stayToPlay: 'False', defaultGoal: 10, unlinkedBlocks: 1, unlinkedRes: 30 },
]
export const eventById = (id) => EVENTS.find((e) => e.id === id)

export const VENUES = ['Atlanta Silverbacks Park', 'Kennesaw Soccer Complex', 'Mesa Riverview Fields']

/** Teams as the Compliance tab shows them. `need` > 0 means the team still
 *  needs that many room nights (Compliance Need reads "24 Room Nights").
 *  `resBlocks` / `nightsBlocks` are the grey (n) beside Reservations / Nights
 *  Booked. `source` is stored, never shown (STA-6). */
export const seedTeams = () => [
  { id: 't1', eventId: 'evt-east', name: 'Albion SC Las Vegas GA 12/13', org: 'Albion SC', teamId: 'ALB-1213', contactName: 'Warne Riker', contactEmail: 'manager@albionsclv.com', status: 'Compliant', need: 0, goal: 24, reservations: 33, resBlocks: 2, nights: 109, nightsBlocks: 3, openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' },
  { id: 't2', eventId: 'evt-east', name: 'Albion SC Las Vegas GA 13/14', org: 'Albion SC', teamId: 'ALB-1314', contactName: 'Warne Riker', contactEmail: 'manager@albionsclv.com', status: 'Compliant', need: 0, goal: 24, reservations: 23, resBlocks: 1, nights: 71, nightsBlocks: 3, openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' },
  { id: 't3', eventId: 'evt-east', name: 'Alexandria SA GA 12/13', org: 'Alexandria SA', teamId: 'Alexandria SA GA 12/13Alexandria SA', contactName: 'Ana Ruiz', contactEmail: 'ana@alexandriasa.org', status: 'Exempt', need: 0, goal: 24, reservations: 13, resBlocks: 0, nights: 39, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 0, source: 'API' },
  { id: 't4', eventId: 'evt-east', name: 'Augusta Lions GA 13/14', org: 'Georgia Elite', teamId: 'AUG-1314', contactName: 'Dana Pruitt', contactEmail: 'dpruitt@gaelite.org', status: 'Need', need: 18, goal: 24, reservations: 2, resBlocks: 1, nights: 6, nightsBlocks: 4, openBlocks: 2, peakAvail: 8, notes: 2, source: 'File Upload' },
  { id: 't5', eventId: 'evt-east', name: 'Baltimore Armour GA 12/13', org: 'Baltimore Armour', teamId: 'BAL-1213', contactName: 'Chris Dean', contactEmail: 'cdean@baltarmour.com', status: 'Need', need: 24, goal: 24, reservations: 0, resBlocks: 0, nights: 0, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' },
  { id: 't6', eventId: 'evt-east', name: 'Baltimore Celtic Soccer Club GA 12/13', org: 'Baltimore Celtic SC', teamId: 'BCSC-1213', contactName: 'Pat Moran', contactEmail: 'pmoran@baltceltic.org', status: 'Not Coming', need: 0, goal: 24, reservations: 0, resBlocks: 0, nights: 0, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 1, source: 'File Upload' },
  { id: 't7', eventId: 'evt-east', name: 'Bayside FC GA 12/13', org: '', teamId: 'Bayside FC GA 12/13', contactName: 'Lee Huang', contactEmail: 'lee@baysidefc.com', status: 'Exempt', need: 0, goal: 24, reservations: 0, resBlocks: 0, nights: 0, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 0, source: 'File Upload' },
  { id: 't8', eventId: 'evt-east', name: 'Broomfield Soccer Club GA 2013', org: 'Broomfield SC', teamId: 'BSC-2013', contactName: 'Morgan Pike', contactEmail: 'mpike@broomfieldsc.org', status: 'Compliant', need: 0, goal: 0, reservations: 3, resBlocks: 0, nights: 12, nightsBlocks: 0, openBlocks: 0, peakAvail: 0, notes: 3, source: 'File Upload' },
  { id: 't9', eventId: 'evt-aspire', name: 'West Coast FC', org: 'West Coast FC', teamId: 'WCFC', contactName: 'Wendell Daniel', contactEmail: 'coachwendell@westcoastfc.com', status: 'Compliant', need: 0, goal: 24, reservations: 12, resBlocks: 1, nights: 41, nightsBlocks: 2, openBlocks: 1, peakAvail: 4, notes: 0, source: 'File Upload' },
  { id: 't10', eventId: 'evt-aspire', name: 'Albion CO Boulder Aspire U19', org: 'Albion CO', teamId: 'ACB-U19', contactName: 'Karla Scornavacco', contactEmail: 'karla@albionco.org', status: 'Need', need: 1, goal: 24, reservations: 7, resBlocks: 1, nights: 23, nightsBlocks: 1, openBlocks: 1, peakAvail: 2, notes: 0, source: 'API' },
  { id: 't11', eventId: 'evt-nations', name: '', org: 'Alamo Dance Academy', teamId: 'Alamo Dance Academy', contactName: 'Rosa Medina', contactEmail: 'rosa@alamodance.com', status: 'Need', need: 6, goal: 10, reservations: 1, resBlocks: 1, nights: 4, nightsBlocks: 2, openBlocks: 1, peakAvail: 3, notes: 1, source: 'File Upload' },
]

/** Compliance Need, as the Compliance tab shows it: the status, or for a team
 *  that hasn't met its goal, what it still needs ("24 Room Nights"). */
export const complianceNeed = (t) => (t.status === 'Need' ? `${t.need} Room Nights` : t.status)

/* ---------------------------------------------------------------------------
 * Compliance page filters — production's inline Filter panel. Text searches
 * need 4 characters, as production says. Event Start Date keeps events still
 * running on or after the date (production's 2026-11-06 filter still lists
 * events that began 11/05).
 * ------------------------------------------------------------------------- */
export const emptyFilters = (over = {}) => ({
  entityName: '', eventName: '', date: '2026-11-06', producer: '', manager: '', type: '', status: '', favorites: false, ...over,
})
const hit = (q, v) => q.trim().length < 4 || (v || '').toLowerCase().includes(q.trim().toLowerCase())
export const eventMatches = (e, f) => hit(f.eventName, e.name) && (!f.date || e.isoEnd >= f.date)
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
  f.eventName.trim().length >= 4 && { key: 'eventName', label: `Event: ${f.eventName.trim()}` },
  f.entityName.trim().length >= 4 && { key: 'entityName', label: `Entity: ${f.entityName.trim()}` },
  f.producer && { key: 'producer', label: f.producer },
  f.manager && { key: 'manager', label: f.manager },
  f.type && { key: 'type', label: f.type },
  f.status && { key: 'status', label: f.status },
  f.favorites && { key: 'favorites', label: 'Favorites' },
].filter(Boolean)
/** STA-2: the event to preselect in create mode — only when the filtered list
 *  narrows to exactly one event (production's event filter is a text search,
 *  so "filtered to an event" means the results hold a single event). */
export const singleEventId = (teams, events, f) => {
  const ids = [...new Set(filterTeams(teams, events, f).map((t) => t.eventId))]
  const evs = events.filter((e) => eventMatches(e, f))
  if (ids.length === 1) return ids[0]
  return f.eventName.trim().length >= 4 && evs.length === 1 ? evs[0].id : ''
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
