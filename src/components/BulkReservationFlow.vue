<script setup>
// BulkReservationFlow — the full Bulk Reservation Edit prototype as ONE self-
// contained component (no page reloads). Screen state machine:
//   list → wizard (Select → Edit → Results) → results (success banner) → activity.
// The app-chrome screens (list / results / activity) recreate the "2026 - All
// America Lacrosse Classic" event-detail Reservations page (header + meta + tabs +
// reservation CARDS). The wizard is the full-screen bulk-edit table takeover.
// Used by the Storybook "Prototype — Full Flow" story AND the standalone GitHub
// Pages prototype app. All data is fake.
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import AppShell from './AppShell.vue'
import DsPageHeader from './DsPageHeader.vue'
import DsInfoGrid from './DsInfoGrid.vue'
import DsPageToolbar from './DsPageToolbar.vue'
import DsModal from './DsModal.vue'

// deepLink: sync the current stage to the URL hash (standalone prototype only;
// off in Storybook so it doesn't fight the Storybook iframe URL).
const props = defineProps({ deepLink: { type: Boolean, default: false } })

const ORG = 'Team Travel Source (TTS)'
const EVENT = '2026 - All America Lacrosse Classic'

const NAV = [
  { key: 'users', label: 'Users', icon: 'groups' },
  { key: 'events', label: 'Events', icon: 'event' },
  { key: 'reports', label: 'Reports', icon: 'bar_chart' },
  { key: 'hotels', label: 'Hotels', icon: 'apartment' },
  { key: 'brands', label: 'Hotel Brands', icon: 'domain' },
  { key: 'amenities', label: 'Amenities', icon: 'room_service' },
  { key: 'room-types', label: 'Room Types', icon: 'king_bed' },
  { key: 'venues', label: 'Venues', icon: 'explore' },
  { key: 'event-companies', label: 'Event Companies', icon: 'account_tree' },
  { key: 'companies', label: 'Companies', icon: 'business_center' },
  { key: 'requests', label: 'Requests', icon: 'assignment' },
  { key: 'inventory', label: 'Inventory Requests', icon: 'library_add' },
  { key: 'admin', label: 'Admin Tools', icon: 'manage_accounts' },
  { key: 'pipe', label: 'Pipe Tools', icon: 'build' },
]
const eventMeta = [
  { label: 'City/State:', value: 'Columbia, MD' },
  { label: 'Room Night Goal:', value: '1,200' },
  { label: 'Account Manager:', value: 'Brittany Durant' },
  { label: 'Event Producer:', value: 'Corrigan Sports Enterprises, Inc' },
  { label: 'Peak Night Goal:', value: '600' },
  { label: 'Stay to Play:', value: 'True' },
  { label: 'Start/End Dates:', value: 'Fri, 07/24/2026 - Sun, 07/26/2026' },
]
const eventTabs = ['Hotels', 'RFPs', 'Venues', 'Notes', 'Groups', 'Reservations', 'Waitlist', 'Pickup', 'Registration', 'Customize', 'Activity Logs']
const moreMenu = [
  'Admin Booking Site', 'Admin Private Booking Site', 'Admin Comp Booking Site',
  'Guest Booking Site', 'Event Producer Info', 'Delete Event',
  'Enable Customer Changes', 'Send Pre Arrival Emails', 'Create Inventory Request',
]

const HOTELS_MD = [
  { name: 'Holiday Inn Express and Suites Columbia East - Elkridge', addr: '6064 Marshalee Drive' },
  { name: 'Courtyard Fort Meade BWI Business District', addr: '2700 Hercules Road' },
  { name: 'Hilton Garden Inn Columbia', addr: '8241 Snowden River Parkway' },
  { name: 'The Westin Baltimore Washington Airport-BWI', addr: '1110 Old Elkridge Landing Road' },
  { name: 'Residence Inn Columbia', addr: '8844 Columbia 100 Parkway' },
  { name: 'Sheraton Columbia Town Center', addr: '10207 Wincopin Circle' },
]
const HOTEL_OPTS = HOTELS_MD.map((h) => h.name).concat(['Homewood Suites Columbia'])
const ROOM_OPTS = ['Two Queen Beds', 'Two Double Beds', 'King Suite', 'Standard King', 'Double Double', 'Accessible Queen']
const STATUS_OPTS = ['Processed', 'Confirmed', 'Pending', 'Canceled', 'Pending Cxl']
const CHECKIN_OPTS = ['Wed, 07/22/2026', 'Thu, 07/23/2026', 'Fri, 07/24/2026', 'Sat, 07/25/2026']
const CHECKOUT_OPTS = ['Sun, 07/26/2026', 'Mon, 07/27/2026', 'Tue, 07/28/2026']

// Soft, monochromatic status pills — a light tint background + a matching darker
// text/border. Easy to extend: add a color to THEMES and map a status to it.
const PILL_THEMES = {
  gray:   { bg: '#f1f3f5', fg: '#495057', bd: '#dde1e6' },
  green:  { bg: '#e7f6ed', fg: '#1a7f4b', bd: '#b8e4cb' },
  blue:   { bg: '#e8f0ff', fg: '#1c56d6', bd: '#c4d8fb' },
  sky:    { bg: '#e4f4fd', fg: '#0b6bcb', bd: '#b6e0f5' },
  teal:   { bg: '#e3f6f3', fg: '#0f766e', bd: '#b1e5de' },
  amber:  { bg: '#fdf5e4', fg: '#b7791f', bd: '#f2e0aa' },
  orange: { bg: '#fdeede', fg: '#c05621', bd: '#f4caa4' },
  red:    { bg: '#fdeaee', fg: '#c02640', bd: '#f4c2cc' },
  pink:   { bg: '#fdebf3', fg: '#b83280', bd: '#f4c2dd' },
  purple: { bg: '#f2ecfd', fg: '#6b46c1', bd: '#d9c7f5' },
  indigo: { bg: '#ebedfd', fg: '#4338ca', bd: '#c9cdf6' },
}
const STATUS_COLOR = {
  processed: 'green', completed: 'green', active: 'green',
  confirmed: 'blue',
  pending: 'amber', waitlisted: 'purple',
  'pending cxl': 'orange',
  canceled: 'red', cancelled: 'red', declined: 'red',
}
const statusStyle = (s) => {
  const t = PILL_THEMES[STATUS_COLOR[(s || '').toLowerCase()]] || PILL_THEMES.gray
  return `display:inline-block; padding:3px 12px; border-radius:999px; font-size:0.75rem; font-weight:600; white-space:nowrap; background:${t.bg}; color:${t.fg}; border:1px solid ${t.bd};`
}
// Kept for any code that still references a semantic tone.
const toneOf = (s) => ({ processed: 'success', confirmed: 'info', pending: 'warning', 'pending cxl': 'warning', canceled: 'danger', cancelled: 'danger' }[s.toLowerCase()] || 'neutral')
const dateRange = (r) => `${r.checkIn} - ${r.checkOut}`

// Known reservations from the reference design.
const KNOWN = [
  { name: 'Kehl, Craig', phone: '(484) 925-8042', email: 'dragolhek@yahoo.com', reservedOn: 'Sun, 01/04/2026 07:53 PM', h: 0, room: 'Two Queen Beds', checkIn: 'Thu, 07/23/2026', checkOut: 'Sun, 07/26/2026', groupId: 'G-00081615', pipe: 'R-05146302', conf: '40944890', confEdit: false, status: 'Canceled' },
  { name: 'Raiszadeh, Shirin', phone: '(858) 337-6910', email: 'shirin@raiszadehmd.com', reservedOn: 'Mon, 01/05/2026 08:16 PM', h: 1, room: 'Two Queen Beds', checkIn: 'Wed, 07/22/2026', checkOut: 'Sun, 07/26/2026', groupId: 'G-00081623', pipe: 'R-05150380', conf: '88383943', confEdit: true, status: 'Processed' },
  { name: 'McNamara, John', phone: '(516) 316-2575', email: 'jpmac526@aol.com', reservedOn: 'Mon, 01/05/2026 09:56 PM', h: 2, room: 'Two Double Beds', checkIn: 'Thu, 07/23/2026', checkOut: 'Sun, 07/26/2026', groupId: 'G-00081634', pipe: 'R-05150889', conf: '3509745616', confEdit: true, status: 'Processed' },
  { name: 'eckert, Lee', phone: '(804) 349-9897', email: 'lee_eckert@yahoo.com', reservedOn: 'Mon, 01/05/2026 11:10 PM', h: 2, room: 'Two Double Beds', checkIn: 'Wed, 07/22/2026', checkOut: 'Sun, 07/26/2026', groupId: 'G-00081645', pipe: 'R-05151271', conf: '3499195314', confEdit: true, status: 'Processed' },
  { name: 'Mattaliano, Andra', phone: '(617) 304-3435', email: 'andram@mac.com', reservedOn: 'Wed, 01/07/2026 03:33 AM', h: 3, room: 'Two Queen Beds', checkIn: 'Wed, 07/22/2026', checkOut: 'Mon, 07/27/2026', groupId: 'G-00081652', pipe: 'R-05158005', conf: '71427560', confEdit: true, status: 'Processed' },
  { name: 'Shaw, Scott', phone: '(646) 245-0916', email: 'shaws@mcvts.org', reservedOn: 'Wed, 01/07/2026 10:50 AM', h: 2, room: 'Two Double Beds', checkIn: 'Thu, 07/23/2026', checkOut: 'Sun, 07/26/2026', groupId: 'G-00081667', pipe: 'R-05158604', conf: '', confEdit: false, status: 'Pending Cxl' },
]
const FIRST = ['James', 'Jessica', 'Robert', 'Amanda', 'William', 'Jennifer', 'Daniel', 'Lisa', 'Matthew', 'Nancy', 'Christopher', 'Karen', 'Joshua', 'Betty', 'Andrew', 'Sandra', 'Kevin', 'Donna', 'Brian', 'Carol', 'George', 'Ruth', 'Edward', 'Sharon', 'Ronald', 'Michelle', 'Anthony', 'Laura', 'Mark', 'Kimberly']
const LAST = ['Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards']
const STATUS_CYCLE = ['Processed', 'Processed', 'Processed', 'Processed', 'Canceled', 'Pending Cxl']
const pad = (n, len) => String(n).padStart(len, '0')

const buildData = (n) => {
  const out = KNOWN.map((k) => ({ ...k, hotel: HOTELS_MD[k.h].name, addr: HOTELS_MD[k.h].addr, tone: toneOf(k.status), pick: false, sel: false }))
  for (let i = KNOWN.length; i < n; i++) {
    const first = FIRST[i % FIRST.length]
    const last = LAST[(i * 7) % LAST.length]
    const hotel = HOTELS_MD[i % HOTELS_MD.length]
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length]
    out.push({
      name: `${last}, ${first}`,
      phone: '(410) 555-' + pad(1000 + i, 4),
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      reservedOn: 'Mon, 01/05/2026 08:16 PM',
      hotel: hotel.name, addr: hotel.addr,
      room: ROOM_OPTS[i % ROOM_OPTS.length],
      checkIn: CHECKIN_OPTS[i % CHECKIN_OPTS.length],
      checkOut: CHECKOUT_OPTS[i % CHECKOUT_OPTS.length],
      groupId: 'G-000' + pad(81615 + i, 5),
      pipe: 'R-051' + pad(46302 + i, 5),
      conf: pad(40000000 + i * 13717, 8),
      confEdit: i % 2 === 0,
      status, tone: toneOf(status),
      pick: false, sel: false,
    })
  }
  // Stamp the original hotel so the results screen can tell if rows were "moved".
  return out.map((r) => ({ ...r, origHotel: r.hotel }))
}

const BULK_FIELDS = [
  { key: 'names', label: 'Edit Names' },
  { key: 'emails', label: 'Edit Emails' },
  { key: 'checkIn', label: 'Edit Check-in Dates' },
  { key: 'hotels', label: 'Edit Hotels' },
  { key: 'group', label: 'Edit Group IDs' },
  { key: 'status', label: 'Edit Reservation Statuses' },
]
const PER_ROW = ['names', 'emails', 'checkIn']

// ---- State ---------------------------------------------------------------
const screen = ref('list') // list | wizard | results | activity
const step = ref(1)
const tab = ref('reservations')
const rows = reactive(buildData(120))

const picked = computed(() => rows.filter((r) => r.pick))
const pickedCount = computed(() => picked.value.length)
const targets = computed(() => rows.filter((r) => r.pick && r.sel))
const targetCount = computed(() => targets.value.length)

const pickState = computed(() => { const n = rows.filter((r) => r.pick).length; return n === 0 ? false : (n === rows.length ? true : null) })
const togglePick = () => { const t = !rows.every((r) => r.pick); rows.forEach((r) => { r.pick = t }) }
const selState = computed(() => { const p = picked.value; const n = p.filter((r) => r.sel).length; return n === 0 ? false : (n === p.length ? true : null) })
const toggleSel = () => { const t = !picked.value.every((r) => r.sel); picked.value.forEach((r) => { r.sel = t }) }

// Pagination (list / wizard / results).
const perPage = ref(25)
const pageNum = ref(1)
const movedRows = ref([])
const searchQ = ref('')
const matchRow = (r, q) => [r.name, r.email, r.hotel, r.pipe, r.conf, r.groupId, r.room, r.status, r.checkIn, r.checkOut, r.reservedOn]
  .some((v) => (v || '').toLowerCase().includes(q))
const pageSource = computed(() => {
  const base = (screen.value === 'wizard' && step.value === 2) ? picked.value : rows
  const q = searchQ.value.trim().toLowerCase()
  return q ? base.filter((r) => matchRow(r, q)) : base
})
const total = computed(() => pageSource.value.length)
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
const startIdx = computed(() => (pageNum.value - 1) * perPage.value)
const endIdx = computed(() => Math.min(startIdx.value + perPage.value, total.value))
const pagedRows = computed(() => pageSource.value.slice(startIdx.value, startIdx.value + perPage.value))
const resetPage = () => { pageNum.value = 1; searchQ.value = '' }
watch(pageCount, () => { if (pageNum.value > pageCount.value) pageNum.value = pageCount.value })
watch(searchQ, () => { pageNum.value = 1 })

// ---- Navigation ----------------------------------------------------------
const openWizard = () => { rows.forEach((r) => { r.pick = false; r.sel = false }); step.value = 1; screen.value = 'wizard'; resetPage() }
const closeWizard = () => { screen.value = 'list'; tab.value = 'reservations'; resetPage() }
const goEdit = () => { if (pickedCount.value) { rows.forEach((r) => { r.sel = r.pick }); step.value = 2; resetPage() } }
const backToSelect = () => { step.value = 1; resetPage() }
const finishToResults = () => { screen.value = 'results'; tab.value = 'reservations'; resetPage() }
const viewChanges = () => { screen.value = 'activity'; tab.value = 'activity-logs'; resetPage() }
// Clicking the event tabs switches the body: Activity Logs → activity, Reservations
// → the list. Other (unimplemented) tabs snap back to the current screen's tab.
const onTabChange = (t) => {
  if (t === 'activity-logs') { screen.value = 'activity'; resetPage() }
  else if (t === 'reservations') { screen.value = 'list'; resetPage() }
  else tab.value = (screen.value === 'activity' ? 'activity-logs' : 'reservations')
}

// ---- Column visibility (Edit Columns) ------------------------------------
const COLS = [
  { key: 'name', label: 'Name', group: 'Guest details' },
  { key: 'email', label: 'Email', group: 'Guest details' },
  { key: 'reserved', label: 'Reserved On', group: 'Guest details' },
  { key: 'checkIn', label: 'Check In', group: 'Guest details' },
  { key: 'checkOut', label: 'Check Out', group: 'Guest details' },
  { key: 'hotel', label: 'Hotel', group: 'Stay details' },
  { key: 'room', label: 'Room Type', group: 'Stay details' },
  { key: 'groupId', label: 'Group ID', group: 'Stay details' },
  { key: 'pipe', label: 'Pipe ID', group: 'Stay details' },
  { key: 'conf', label: 'Hotel Conf #', group: 'Identifiers & status' },
  { key: 'status', label: 'Reservation Status', group: 'Identifiers & status' },
]
const colOn = reactive(Object.fromEntries(COLS.map((c) => [c.key, true])))
const shownCols = computed(() => COLS.filter((c) => colOn[c.key]))
const selectAllCols = () => COLS.forEach((c) => { colOn[c.key] = true })
const clearAllCols = () => COLS.forEach((c) => { colOn[c.key] = false })
// Persist column visibility so it carries across the deep-linked stages (Select →
// Edit) even on a direct URL load/reload, not just in-app navigation.
const COL_STORE = 'brf-cols'
try {
  const saved = JSON.parse(sessionStorage.getItem(COL_STORE) || 'null')
  if (saved) COLS.forEach((c) => { if (typeof saved[c.key] === 'boolean') colOn[c.key] = saved[c.key] })
} catch (_) { /* ignore */ }
watch(colOn, (v) => { try { sessionStorage.setItem(COL_STORE, JSON.stringify(v)) } catch (_) { /* ignore */ } }, { deep: true })
const colSearch = ref('')
const colGroups = computed(() => {
  const q = colSearch.value.trim().toLowerCase()
  const out = []
  for (const c of COLS) {
    if (q && !c.label.toLowerCase().includes(q)) continue
    let g = out.find((x) => x.name === c.group)
    if (!g) { g = { name: c.group, cols: [] }; out.push(g) }
    g.cols.push(c)
  }
  return out
})

// ---- Shift-click range selection (Step 1) --------------------------------
// The checkbox is display-only (pointer-events:none) so the whole cell handles the
// click — that lets us read shiftKey and select the range between the last click
// and this one. Normal click just toggles the row.
const lastPickIndex = ref(null)
const onRowSelect = (e, r) => {
  const idx = rows.indexOf(r)
  if (e.shiftKey && lastPickIndex.value !== null && lastPickIndex.value !== idx) {
    const a = Math.min(lastPickIndex.value, idx)
    const b = Math.max(lastPickIndex.value, idx)
    for (let k = a; k <= b; k++) rows[k].pick = true
  } else {
    r.pick = !r.pick
  }
  lastPickIndex.value = idx
}

// ---- Deep linking — reflect the current stage in the URL hash ------------
const stage = computed(() => {
  if (screen.value === 'wizard') return step.value === 2 ? 'edit' : 'select'
  if (screen.value === 'results') return 'results'
  if (screen.value === 'activity') return 'activity'
  return 'list'
})
const STAGE_HASH = {
  list: '#/bulk-reservation-edit',
  select: '#/bulk-reservation-edit/select',
  edit: '#/bulk-reservation-edit/edit',
  results: '#/bulk-reservation-edit/results',
  activity: '#/bulk-reservation-edit/activity',
}
const hashStage = (h) => {
  const m = (h || '').match(/^#\/bulk-reservation-edit(?:\/(select|edit|results|activity))?$/)
  return m ? (m[1] || 'list') : null
}
const applyStage = (s) => {
  if (s === 'select') { screen.value = 'wizard'; step.value = 1 }
  else if (s === 'edit') { rows.forEach((r) => { r.sel = r.pick }); screen.value = 'wizard'; step.value = 2 }
  else if (s === 'results') { screen.value = 'results'; tab.value = 'reservations' }
  else if (s === 'activity') { screen.value = 'activity'; tab.value = 'activity-logs' }
  else { screen.value = 'list'; tab.value = 'reservations' }
  resetPage()
}
let syncingHash = false
const onHashChange = () => {
  if (syncingHash) { syncingHash = false; return }
  const s = hashStage(window.location.hash)
  if (s && s !== stage.value) applyStage(s)
}
onMounted(() => {
  if (!props.deepLink) return
  const s = hashStage(window.location.hash)
  if (s && s !== 'list') applyStage(s)
  window.addEventListener('hashchange', onHashChange)
})
onUnmounted(() => { if (props.deepLink) window.removeEventListener('hashchange', onHashChange) })
watch(stage, (s) => {
  if (!props.deepLink) return
  const target = STAGE_HASH[s] || STAGE_HASH.list
  if (window.location.hash !== target) { syncingHash = true; window.location.hash = target }
})

// ---- Bulk Edit modal -----------------------------------------------------
const bulkOpen = ref(false)
const bulkKey = ref('')
const drafts = reactive({})
const applyAll = ref('')
const bulkTitle = computed(() => (BULK_FIELDS.find((f) => f.key === bulkKey.value) || {}).label || '')
const isPerRow = computed(() => PER_ROW.includes(bulkKey.value))
const openBulk = (key) => {
  bulkKey.value = key
  if (PER_ROW.includes(key)) targets.value.forEach((r) => { drafts[r.pipe] = '' })
  else applyAll.value = key === 'status' ? 'Processed' : ''
  bulkOpen.value = true
}
const applyBulk = () => {
  const sel = targets.value
  if (bulkKey.value === 'names') sel.forEach((r) => { if (drafts[r.pipe]) r.name = drafts[r.pipe] })
  else if (bulkKey.value === 'emails') sel.forEach((r) => { if (drafts[r.pipe]) r.email = drafts[r.pipe] })
  else if (bulkKey.value === 'checkIn') sel.forEach((r) => { if (drafts[r.pipe]) r.checkIn = drafts[r.pipe] })
  else if (bulkKey.value === 'hotels') sel.forEach((r) => { if (applyAll.value) r.hotel = applyAll.value })
  else if (bulkKey.value === 'group') sel.forEach((r) => { if (applyAll.value) r.groupId = applyAll.value })
  else if (bulkKey.value === 'status') sel.forEach((r) => { r.status = applyAll.value; r.tone = toneOf(applyAll.value) })
  bulkOpen.value = false
}

// resultMode drives the results banner + progress copy (edit vs delete).
const resultMode = ref('edit') // 'edit' | 'deleted'
const deletedCount = ref(0)
const deletedRows = ref([])
const moving = ref(false)
const summaryOpen = ref(false)
const summaryExpanded = ref(true)

// Delete → confirm modal (lists the rows) → "Deleting Reservations…" progress →
// results list with a red "removed from the event" banner.
const delOpen = ref(false)
const confirmDelete = () => {
  deletedRows.value = targets.value.map((r) => ({ ...r }))
  deletedCount.value = deletedRows.value.length
  const kill = new Set(deletedRows.value.map((r) => r.pipe))
  for (let i = rows.length - 1; i >= 0; i--) if (kill.has(rows[i].pipe)) rows.splice(i, 1)
  delOpen.value = false
  resultMode.value = 'deleted'
  moving.value = true
  setTimeout(() => { moving.value = false; step.value = 3; screen.value = 'results'; tab.value = 'reservations'; resetPage() }, 1600)
}

// Confirm Changes → progress → results list + Transfer/Changes Summary modal.
const confirmChanges = () => {
  resultMode.value = 'edit'
  movedRows.value = picked.value.map((r) => ({ ...r }))
  moving.value = true
  setTimeout(() => { moving.value = false; step.value = 3; screen.value = 'results'; tab.value = 'reservations'; summaryOpen.value = true; resetPage() }, 1600)
}
const progressTitle = computed(() => (resultMode.value === 'deleted' ? 'Deleting Reservations…' : 'Applying Changes…'))
const progressBody = computed(() => (resultMode.value === 'deleted'
  ? `Removing ${deletedCount.value} reservation${deletedCount.value !== 1 ? 's' : ''}…`
  : `Updating ${picked.value.length} reservation${picked.value.length !== 1 ? 's' : ''}…`))
// A "move" = every changed row's hotel changed to the SAME new hotel; then the
// results adapt to transfer language, otherwise generic "changes saved".
const movedHotel = computed(() => {
  const m = movedRows.value
  if (!m.length) return null
  const news = new Set()
  for (const r of m) { if (r.hotel !== r.origHotel) news.add(r.hotel); else return null }
  return news.size === 1 ? [...news][0] : null
})
const bannerText = computed(() => movedHotel.value
  ? `Your reservations were successfully moved to ${movedHotel.value}.`
  : 'Your reservation changes were saved successfully.')
const isDeleteResult = computed(() => resultMode.value === 'deleted')
const summaryRows = computed(() => (isDeleteResult.value ? deletedRows.value : movedRows.value))
const summaryVerb = computed(() => (isDeleteResult.value ? 'deleted' : (movedHotel.value ? 'moved' : 'updated')))
const summaryTitle = computed(() => (isDeleteResult.value ? 'Reservation Deletion Summary' : (movedHotel.value ? 'Reservation Transfer Summary' : 'Reservation Changes Summary')))
const summaryLead = computed(() => `Number of reservations ${summaryVerb.value} successfully: ${summaryRows.value.length}`)
const expandLabel = computed(() => `${summaryRows.value.length} reservation${summaryRows.value.length !== 1 ? 's' : ''} that ${summaryRows.value.length === 1 ? 'was' : 'were'} ${summaryVerb.value}`)
// Re-open the summary from the Activity Logs. For edits, seed with the recent
// reservations if we deep-linked in with no session data.
const openSummaryFromActivity = () => {
  if (!isDeleteResult.value && !movedRows.value.length) movedRows.value = rows.slice(0, 6).map((r) => ({ ...r }))
  summaryExpanded.value = true
  summaryOpen.value = true
}

// Activity log — a curated showcase covering field-level changes, hotel moves,
// failures / partial success, and deletions / cancellations. Each entry carries
// structured detail so clicking a row opens a modal reflecting THAT entry.
// `level: 'error' | 'warn'` tints the row; `kind` drives the detail modal.
const activityLog = [
  { time: '05/27/2025 2:41 PM', user: 'Justin Girard', kind: 'init', activity: 'Initiated bulk reservation edit for 17 reservations' },
  { time: '05/27/2025 2:41 PM', user: 'Brittany Durant', kind: 'field', name: 'Kehl, Craig', email: 'dragolhek@yahoo.com', pipe: 'R-05146302', field: 'Name', from: 'Craig Kehl', to: 'Kehl, Craig', activity: 'Updated name for Kehl, Craig' },
  { time: '05/27/2025 2:41 PM', user: 'Alex Rivera', kind: 'field', name: 'Raiszadeh, Shirin', email: 'shirin@raiszadehmd.com', pipe: 'R-05150380', field: 'Email', from: 'shirin@raiszadehmd.com', to: 'shirin.r@example.com', activity: 'Updated email for Raiszadeh, Shirin (→ shirin.r@example.com)' },
  { time: '05/27/2025 2:41 PM', user: 'Mike Addesa', kind: 'field', name: 'McNamara, John', email: 'jpmac526@aol.com', pipe: 'R-05150889', field: 'Check-in date', from: 'Thu, 07/23/2026', to: 'Fri, 07/24/2026', activity: 'Changed check-in date for McNamara, John (Thu, 07/23/2026 → Fri, 07/24/2026)' },
  { time: '05/27/2025 2:41 PM', user: 'Justin Girard', kind: 'field', name: 'eckert, Lee', email: 'lee_eckert@yahoo.com', pipe: 'R-05151271', field: 'Check-out date', from: 'Sun, 07/26/2026', to: 'Mon, 07/27/2026', activity: 'Changed check-out date for eckert, Lee (Sun, 07/26/2026 → Mon, 07/27/2026)' },
  { time: '05/27/2025 2:42 PM', user: 'Brittany Durant', kind: 'field', name: 'Mattaliano, Andra', email: 'andram@mac.com', pipe: 'R-05158005', field: 'Room type', from: 'Two Queen Beds', to: 'King Suite', activity: 'Updated room type for Mattaliano, Andra (Two Queen Beds → King Suite)' },
  { time: '05/27/2025 2:42 PM', user: 'Alex Rivera', kind: 'field', name: 'Shaw, Scott', email: 'shaws@mcvts.org', pipe: 'R-05158604', field: 'Group ID', from: 'G-00081667', to: 'G-00082114', activity: 'Updated group ID for Shaw, Scott (G-00081667 → G-00082114)' },
  { time: '05/27/2025 2:42 PM', user: 'Mike Addesa', kind: 'field', name: 'Anderson, James', email: 'james.anderson@example.com', pipe: 'R-05159001', field: 'Reservation status', from: 'Pending', to: 'Confirmed', activity: 'Changed reservation status for Anderson, James (Pending → Confirmed)' },
  { time: '05/27/2025 2:42 PM', user: 'Justin Girard', kind: 'move', name: 'Taylor, Jessica', email: 'jessica.taylor@example.com', pipe: 'R-05159014', from: 'Hilton Garden Inn Columbia', to: 'Courtyard Fort Meade BWI Business District', activity: 'Moved Taylor, Jessica from Hilton Garden Inn Columbia → Courtyard Fort Meade BWI Business District' },
  { time: '05/27/2025 2:42 PM', user: 'Brittany Durant', kind: 'move', name: 'Thomas, Robert', email: 'robert.thomas@example.com', pipe: 'R-05159027', from: 'Residence Inn Columbia', to: 'Sheraton Columbia Town Center', activity: 'Moved Thomas, Robert from Residence Inn Columbia → Sheraton Columbia Town Center' },
  { time: '05/27/2025 2:42 PM', user: 'System', level: 'error', kind: 'fail', name: 'Moore, Amanda', email: 'amanda.moore@example.com', pipe: 'R-05159040', reason: 'Sheraton Columbia Town Center is at capacity for the requested dates.', activity: 'Failed to move Moore, Amanda — Sheraton Columbia Town Center is at capacity' },
  { time: '05/27/2025 2:43 PM', user: 'System', level: 'warn', kind: 'skip', name: 'Jackson, William', email: 'william.jackson@example.com', pipe: 'R-05159053', reason: 'No changes were selected for this reservation.', activity: 'Skipped Jackson, William — no changes were selected' },
  { time: '05/27/2025 2:43 PM', user: 'System', level: 'error', kind: 'fail', name: 'White, Jennifer', email: 'jennifer.white@example.com', pipe: 'R-05159066', reason: 'Reservation is locked by another user and could not be updated.', activity: 'Failed to update White, Jennifer — reservation is locked by another user' },
  { time: '05/27/2025 2:43 PM', user: 'Alex Rivera', kind: 'cancel', name: 'Harris, Daniel', email: 'daniel.harris@example.com', pipe: 'R-05159079', activity: 'Canceled reservation for Harris, Daniel' },
  { time: '05/27/2025 2:43 PM', user: 'Mike Addesa', level: 'warn', kind: 'pending', name: 'Clark, Lisa', email: 'lisa.clark@example.com', pipe: 'R-05159082', activity: 'Marked Clark, Lisa as Pending Cancellation' },
  { time: '05/27/2025 2:43 PM', user: 'Justin Girard', kind: 'delete', name: 'Lewis, Matthew', email: 'matthew.lewis@example.com', pipe: 'R-05158604', activity: 'Deleted reservation for Lewis, Matthew (R-05158604)' },
  { time: '05/27/2025 2:44 PM', user: 'Brittany Durant', kind: 'delete', name: 'Walker, Karen', email: 'karen.walker@example.com', pipe: 'R-05158611', activity: 'Deleted reservation for Walker, Karen (R-05158611)' },
  { time: '05/27/2025 2:44 PM', user: 'Justin Girard', kind: 'summary', activity: 'Completed: 8 updated · 2 moved · 3 deleted · 1 canceled · 2 failed' },
]
// Per-entry detail modal — init/summary open the overall summary; every other row
// opens a modal with the specifics of that log line.
const activeEntry = ref(null)
const entryOpen = ref(false)
const ENTRY_TITLES = { field: 'Field Updated', move: 'Hotel Transfer', fail: 'Update Failed', skip: 'Reservation Skipped', cancel: 'Reservation Canceled', pending: 'Pending Cancellation', delete: 'Reservation Deleted' }
const entryTitle = computed(() => (activeEntry.value ? (ENTRY_TITLES[activeEntry.value.kind] || 'Activity Detail') : ''))
const openActivity = (a) => {
  if (a.kind === 'init' || a.kind === 'summary') { openSummaryFromActivity(); return }
  activeEntry.value = a
  entryOpen.value = true
}

// Results banner — red "removed" for deletes, green "saved/moved" for edits.
const resultBanner = computed(() => (resultMode.value === 'deleted'
  ? `Your ${deletedCount.value} reservation${deletedCount.value !== 1 ? 's were' : ' was'} successfully removed from the event.`
  : bannerText.value))
const bannerBarStyle = computed(() => (resultMode.value === 'deleted'
  ? 'padding:12px 32px; background:var(--ds-color-background-danger); border-bottom:1px solid var(--ds-color-background-danger-bold);'
  : 'padding:12px 32px; background:var(--ds-color-background-success); border-bottom:1px solid var(--ds-color-background-success-bold);'))
const bannerTextColor = computed(() => (resultMode.value === 'deleted' ? 'var(--ds-color-text-danger)' : 'var(--ds-color-text-success)'))
const bannerIcon = computed(() => (resultMode.value === 'deleted' ? 'delete_outline' : 'check_circle'))
</script>

<template>
  <!-- ============ App-chrome screens: list / results / activity ============ -->
  <app-shell v-if="screen !== 'wizard'" :items="NAV" active="events" :org="ORG" user="Justin Girard" bleed>
    <!-- Success banner (results only) -->
    <div v-if="screen === 'results'" :style="bannerBarStyle">
      <div class="brf-mw" style="display:flex; align-items:center; justify-content:space-between; gap:16px;">
        <div class="row items-center" style="gap:10px;" :style="{ color: bannerTextColor }">
          <q-icon :name="bannerIcon" size="20px" />
          <span style="font-weight:600;">{{ resultBanner }}</span>
        </div>
        <a href="#" class="text-primary" style="text-decoration:none; font-weight:600;" @click.prevent="viewChanges">View Changes</a>
      </div>
    </div>

    <!-- Event header -->
    <div style="padding:22px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      <div class="brf-mw">
      <ds-page-header :title="EVENT">
        <template #breadcrumb>
          <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
            <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
            <q-breadcrumbs-el label="Events" />
            <q-breadcrumbs-el :label="EVENT" class="text-grey-6" />
          </q-breadcrumbs>
        </template>
        <template #badge>
          <q-btn dense no-caps unelevated color="positive" text-color="white" class="q-px-sm" style="border-radius:6px;">Active <q-icon name="arrow_drop_down" size="20px" /></q-btn>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Edit Event" />
          <q-btn flat round dense icon="more_horiz" color="grey-7">
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width:250px">
                <q-item v-for="m in moreMenu" :key="m" clickable v-close-popup>
                  <q-item-section :class="m === 'Delete Event' ? 'text-negative' : 'text-grey-8'">{{ m }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="openWizard">
                  <q-item-section class="text-primary" style="font-weight:600;">Bulk Reservation Edit</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template #meta>
          <ds-info-grid :items="eventMeta" min-col-width="300px" label-width="150px" />
        </template>
        <template #tabs>
          <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7" mobile-arrows outside-arrows @update:model-value="onTabChange">
            <q-tab v-for="t in eventTabs" :key="t" :name="t.toLowerCase().replace(/ /g,'-')" :label="t" />
          </q-tabs>
        </template>
      </ds-page-header>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:20px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="brf-mw">
      <!-- LIST / RESULTS: reservation cards -->
      <template v-if="screen === 'list' || screen === 'results'">
        <ds-page-toolbar title="Reservations">
          <template #search>
            <div style="display:flex; align-items:center; gap:16px; flex-wrap:nowrap;">
              <q-input v-model="searchQ" outlined dense bg-color="white" placeholder="Search" style="width:300px" hide-bottom-space>
                <template #append><q-icon name="search" /></template>
              </q-input>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:nowrap;">
                <span class="text-grey-7" style="white-space:nowrap;">Sort By</span>
                <q-select model-value="Create Date" :options="['Create Date','Guest Name','Hotel']" outlined dense bg-color="white" style="width:150px" hide-bottom-space />
                <q-select model-value="9-0 / Z-A" :options="['9-0 / Z-A','0-9 / A-Z']" outlined dense bg-color="white" style="width:130px" hide-bottom-space />
              </div>
            </div>
          </template>
          <template #actions>
            <q-btn unelevated no-caps color="primary" label="Export" />
            <q-btn-dropdown unelevated no-caps color="white" text-color="primary" label="Filters" class="brf-filters-btn">
              <q-list style="min-width:180px">
                <q-item clickable v-close-popup><q-item-section>Status</q-item-section></q-item>
                <q-item clickable v-close-popup><q-item-section>Hotel</q-item-section></q-item>
              </q-list>
            </q-btn-dropdown>
          </template>
        </ds-page-toolbar>

        <div class="column q-gutter-md" style="margin-top:16px;">
          <div v-for="r in pagedRows" :key="r.pipe"
            style="display:flex; gap:24px; align-items:center; padding:22px 28px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
            <div style="flex:1.3 1 0; min-width:0;">
              <a href="#" class="text-primary" style="text-decoration:none; font-weight:700; font-size:1.0625rem;" @click.prevent>{{ r.name }}</a>
              <div class="text-primary" style="font-size:0.8125rem;">{{ r.phone }}</div>
              <div style="font-size:0.875rem; margin-top:8px;"><span style="font-weight:700;">Email:</span> <span class="text-grey-8">{{ r.email }}</span></div>
              <div style="font-size:0.875rem;"><span style="font-weight:700;">Reserved On:</span> <span class="text-grey-8">{{ r.reservedOn }}</span></div>
              <div style="font-size:0.875rem;"><span style="font-weight:700;">Origin:</span> <span class="text-grey-8">Contracted</span></div>
            </div>
            <div style="align-self:stretch; width:1px; flex:none; background:var(--ds-color-border-container);"></div>
            <div style="flex:1.5 1 0; min-width:0;">
              <div style="font-weight:700; color:var(--ds-color-text);">{{ r.hotel }}</div>
              <div class="text-grey-6" style="font-size:0.8125rem;">{{ r.addr }}</div>
              <div style="font-size:0.875rem; margin-top:8px;"><span style="font-weight:700;">Room Type:</span> <span class="text-grey-8">{{ r.room }}</span></div>
              <div style="font-size:0.875rem;"><span style="font-weight:700;">Check In/Out Date:</span> <span class="text-grey-8">{{ dateRange(r) }}</span></div>
            </div>
            <div style="align-self:stretch; width:1px; flex:none; background:var(--ds-color-border-container);"></div>
            <div style="flex:1 1 0; min-width:0;">
              <div class="row items-center no-wrap q-gutter-xs">
                <span style="font-weight:700; color:var(--ds-color-text);">{{ r.conf || '- -' }}</span>
                <q-icon v-if="r.confEdit" name="edit" size="14px" color="primary" />
              </div>
              <div class="text-grey-6" style="font-size:0.8125rem;">Hotel Confirmation</div>
            </div>
            <div style="align-self:stretch; width:1px; flex:none; background:var(--ds-color-border-container);"></div>
            <div style="flex:1 1 0; min-width:0;">
              <div style="font-weight:700; color:var(--ds-color-text);">{{ r.pipe }}</div>
              <div class="text-grey-6" style="font-size:0.8125rem;">Pipe ID</div>
              <div class="text-grey-6" style="font-size:0.8125rem; margin-top:8px;">Individual Reservation</div>
            </div>
            <div style="flex:none;">
              <span :style="statusStyle(r.status)">{{ r.status }}</span>
            </div>
          </div>
        </div>

        <div class="row items-center justify-between" style="margin-top:16px; flex-wrap:wrap; gap:12px;">
          <div class="text-grey-7" style="font-size:0.875rem;">Showing {{ total ? startIdx + 1 : 0 }}–{{ endIdx }} of {{ total }}</div>
          <div class="row items-center" style="gap:20px;">
            <div class="row items-center" style="gap:8px;">
              <span class="text-grey-7" style="font-size:0.875rem;">Show</span>
              <q-select v-model="perPage" :options="[10, 25, 50, 100]" outlined dense bg-color="white" style="width:88px" hide-bottom-space @update:model-value="pageNum = 1" />
              <span class="text-grey-7" style="font-size:0.875rem;">per page</span>
            </div>
            <q-pagination v-model="pageNum" :max="pageCount" :max-pages="6" direction-links boundary-numbers />
          </div>
        </div>
      </template>

      <!-- ACTIVITY LOGS -->
      <template v-else-if="screen === 'activity'">
        <q-markup-table class="ds-table" flat bordered>
          <thead>
            <tr><th class="text-left" style="width:220px;">Date/Time</th><th class="text-left" style="width:200px;">User</th><th class="text-left">Activity</th></tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in activityLog" :key="i" style="cursor:pointer;" @click="openActivity(a)">
              <td style="white-space:nowrap;">{{ a.time }}</td>
              <td style="white-space:nowrap;" :class="{ 'text-grey-6': a.user === 'System' }">{{ a.user }}</td>
              <td :style="{ color: a.level === 'error' ? 'var(--ds-color-text-danger)' : (a.level === 'warn' ? 'var(--ds-color-text-warning)' : ''), fontWeight: a.level ? 600 : 400 }">
                <q-icon v-if="a.level === 'error'" name="error" size="16px" color="negative" class="q-mr-xs" style="vertical-align:-3px;" />
                <q-icon v-else-if="a.level === 'warn'" name="warning" size="16px" color="warning" class="q-mr-xs" style="vertical-align:-3px;" />
                {{ a.activity }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </template>
      </div>
    </div>
  </app-shell>

  <!-- ============================ Wizard overlay ============================ -->
  <div v-else style="height:100vh; display:flex; flex-direction:column; background:var(--ds-color-surface);">
    <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-bottom:1px solid var(--ds-color-border-container); flex:none;">
      <div style="display:flex; align-items:center; gap:14px;">
        <q-btn flat round dense icon="close" color="grey-8" @click="closeWizard"><q-tooltip>Close</q-tooltip></q-btn>
        <span style="font-size:1.125rem; font-weight:700; color:var(--ds-color-text);">{{ EVENT }}</span>
      </div>
      <div class="row items-center" style="gap:6px; color:var(--ds-color-text-subtle);">Justin Girard <q-icon name="arrow_drop_down" /></div>
    </div>

    <div style="flex:1 1 auto; display:flex; min-height:0;">
      <!-- Stepper (circles connected by a vertical line) -->
      <div style="flex:none; width:230px; border-right:1px solid var(--ds-color-border-container); padding:28px 20px;">
        <div v-for="(s, i) in ['Select Reservations','Edit Reservations','Results']" :key="s" class="row items-start no-wrap" style="gap:12px;">
          <!-- circle + connector -->
          <div style="flex:none; display:flex; flex-direction:column; align-items:center; align-self:stretch;">
            <div :style="{ width:'26px', height:'26px', flex:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8125rem', fontWeight:700, color: (i+1) <= step ? '#fff' : 'var(--ds-color-text-subtle)', background: (i+1) <= step ? 'var(--ds-color-background-brand-bold)' : 'var(--ds-color-surface-sunken)', border: (i+1) > step ? '1px solid var(--ds-color-border)' : 'none' }">
              <q-icon v-if="(i+1) < step" name="check" size="16px" /><span v-else>{{ i+1 }}</span>
            </div>
            <div v-if="i < 2" :style="{ width:'2px', flex:'1 1 auto', minHeight:'22px', background: (i+1) < step ? 'var(--ds-color-background-brand-bold)' : 'var(--ds-color-border-container)' }"></div>
          </div>
          <span :style="{ paddingTop:'2px', paddingBottom: i < 2 ? '22px' : '0', fontWeight: (i+1) === step ? 700 : 500, color: (i+1) === step ? 'var(--ds-color-text-brand)' : 'var(--ds-color-text-subtle)' }">{{ s }}</span>
        </div>
      </div>

      <!-- Content (scroll area + fixed footer) -->
      <div style="flex:1 1 auto; display:flex; flex-direction:column; min-width:0; min-height:0;">
        <div style="flex:1 1 auto; overflow-y:auto; overflow-x:hidden; padding:24px 32px 20px; min-width:0;">
        <!-- STEP 1 -->
        <template v-if="step === 1">
          <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand); margin-bottom:16px;">Select Reservations</div>
          <div class="row items-center justify-between no-wrap" style="margin-bottom:16px; gap:12px;">
            <q-input v-model="searchQ" outlined dense bg-color="white" placeholder="Search" style="width:340px;" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <q-btn-dropdown outline no-caps color="primary" icon="settings" label="Edit Columns">
              <div style="padding:14px; min-width:260px;">
                <q-input v-model="colSearch" outlined dense bg-color="white" placeholder="Search" hide-bottom-space>
                  <template #append><q-icon name="search" /></template>
                </q-input>
                <div class="row items-center justify-between" style="margin-top:12px;">
                  <q-btn flat dense no-caps color="primary" label="Select all" @click="selectAllCols" style="min-height:0; padding:2px 4px;" />
                  <q-btn flat dense no-caps color="grey-7" label="Clear all" @click="clearAllCols" style="min-height:0; padding:2px 4px;" />
                </div>
                <q-separator style="margin:12px 0;" />
                <div v-for="g in colGroups" :key="g.name" style="margin-top:18px;">
                  <div class="text-grey-7" style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.02em; margin-bottom:10px;">{{ g.name }}</div>
                  <q-checkbox v-for="c in g.cols" :key="c.key" v-model="colOn[c.key]" :label="c.label" dense color="primary" style="display:flex; margin:9px 0;" />
                </div>
              </div>
            </q-btn-dropdown>
          </div>
          <q-markup-table class="ds-table" flat bordered>
            <thead>
              <tr>
                <th style="width:44px; text-align:center;"><q-checkbox :model-value="pickState" @update:model-value="togglePick" dense /></th>
                <th v-for="c in shownCols" :key="c.key" class="text-left" style="white-space:nowrap;">{{ c.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in pagedRows" :key="r.pipe" :class="{ selected: r.pick }" style="cursor:pointer; user-select:none;" @click="onRowSelect($event, r)">
                <td style="text-align:center;"><q-checkbox :model-value="r.pick" dense color="primary" style="pointer-events:none;" /></td>
                <td v-if="colOn.name" style="white-space:nowrap; font-weight:600;">{{ r.name }}</td>
                <td v-if="colOn.email" style="white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
                <td v-if="colOn.reserved" style="white-space:nowrap;">{{ r.reservedOn }}</td>
                <td v-if="colOn.checkIn" style="white-space:nowrap;">{{ r.checkIn }}</td>
                <td v-if="colOn.checkOut" style="white-space:nowrap;">{{ r.checkOut }}</td>
                <td v-if="colOn.hotel" style="white-space:nowrap;">{{ r.hotel }}</td>
                <td v-if="colOn.room" style="white-space:nowrap;">{{ r.room }}</td>
                <td v-if="colOn.groupId" style="white-space:nowrap;">{{ r.groupId }}</td>
                <td v-if="colOn.pipe" style="white-space:nowrap;">{{ r.pipe }}</td>
                <td v-if="colOn.conf" style="white-space:nowrap;">{{ r.conf || '- -' }}</td>
                <td v-if="colOn.status"><span :style="statusStyle(r.status)">{{ r.status }}</span></td>
              </tr>
            </tbody>
          </q-markup-table>
          <div class="row items-center justify-between" style="margin-top:16px; flex-wrap:wrap; gap:12px;">
            <div class="text-grey-7" style="font-size:0.875rem;">Showing {{ total ? startIdx + 1 : 0 }}–{{ endIdx }} of {{ total }}</div>
            <div class="row items-center" style="gap:20px;">
              <div class="row items-center" style="gap:8px;">
                <span class="text-grey-7" style="font-size:0.875rem;">Show</span>
                <q-select v-model="perPage" :options="[10, 25, 50, 100]" outlined dense bg-color="white" style="width:88px" hide-bottom-space @update:model-value="pageNum = 1" />
                <span class="text-grey-7" style="font-size:0.875rem;">per page</span>
              </div>
              <q-pagination v-model="pageNum" :max="pageCount" :max-pages="6" direction-links boundary-numbers />
            </div>
          </div>
        </template>

        <!-- STEP 2 -->
        <template v-else-if="step === 2">
          <div class="row items-center justify-between no-wrap" style="margin-bottom:16px; gap:12px;">
            <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand);">Edit Reservations</div>
            <q-btn-dropdown outline no-caps color="primary" label="Bulk Edit" :disable="!targetCount">
              <q-list style="min-width:230px">
                <q-item v-for="f in BULK_FIELDS" :key="f.key" clickable v-close-popup @click="openBulk(f.key)"><q-item-section>{{ f.label }}</q-item-section></q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="delOpen = true"><q-item-section class="text-negative">Delete Reservations</q-item-section></q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <div class="row items-center justify-between no-wrap" style="margin-bottom:16px; gap:12px;">
            <q-input v-model="searchQ" outlined dense bg-color="white" placeholder="Search" style="width:340px;" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <q-btn-dropdown outline no-caps color="primary" icon="settings" label="Edit Columns">
              <div style="padding:14px; min-width:260px;">
                <q-input v-model="colSearch" outlined dense bg-color="white" placeholder="Search" hide-bottom-space>
                  <template #append><q-icon name="search" /></template>
                </q-input>
                <div class="row items-center justify-between" style="margin-top:12px;">
                  <q-btn flat dense no-caps color="primary" label="Select all" @click="selectAllCols" style="min-height:0; padding:2px 4px;" />
                  <q-btn flat dense no-caps color="grey-7" label="Clear all" @click="clearAllCols" style="min-height:0; padding:2px 4px;" />
                </div>
                <q-separator style="margin:12px 0;" />
                <div v-for="g in colGroups" :key="g.name" style="margin-top:18px;">
                  <div class="text-grey-7" style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.02em; margin-bottom:10px;">{{ g.name }}</div>
                  <q-checkbox v-for="c in g.cols" :key="c.key" v-model="colOn[c.key]" :label="c.label" dense color="primary" style="display:flex; margin:9px 0;" />
                </div>
              </div>
            </q-btn-dropdown>
          </div>
          <q-markup-table class="ds-table" flat bordered>
            <thead>
              <tr>
                <th style="width:44px; text-align:center;"><q-checkbox :model-value="selState" @update:model-value="toggleSel" dense /></th>
                <th v-for="c in shownCols" :key="c.key" class="text-left" style="white-space:nowrap;">{{ c.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in pagedRows" :key="r.pipe" :class="{ selected: r.sel }">
                <td style="text-align:center;"><q-checkbox v-model="r.sel" dense color="primary" /></td>
                <td v-if="colOn.name" style="padding:6px 10px;"><q-input v-model="r.name" dense outlined bg-color="white" hide-bottom-space style="min-width:170px" /></td>
                <td v-if="colOn.email" style="padding:6px 10px;"><q-input v-model="r.email" type="email" dense outlined bg-color="white" hide-bottom-space style="min-width:230px" /></td>
                <td v-if="colOn.reserved" style="white-space:nowrap;">{{ r.reservedOn }}</td>
                <td v-if="colOn.checkIn" style="padding:6px 10px;"><q-select v-model="r.checkIn" :options="CHECKIN_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:160px" /></td>
                <td v-if="colOn.checkOut" style="padding:6px 10px;"><q-select v-model="r.checkOut" :options="CHECKOUT_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:160px" /></td>
                <td v-if="colOn.hotel" style="padding:6px 10px;"><q-select v-model="r.hotel" :options="HOTEL_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:240px" /></td>
                <td v-if="colOn.room" style="padding:6px 10px;"><q-select v-model="r.room" :options="ROOM_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:170px" /></td>
                <td v-if="colOn.groupId" style="padding:6px 10px;"><q-input v-model="r.groupId" dense outlined bg-color="white" hide-bottom-space style="min-width:140px" /></td>
                <td v-if="colOn.pipe" style="white-space:nowrap;">{{ r.pipe }}</td>
                <td v-if="colOn.conf" style="white-space:nowrap;">{{ r.conf || '- -' }}</td>
                <td v-if="colOn.status" style="padding:6px 10px;"><q-select v-model="r.status" :options="STATUS_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:150px" /></td>
              </tr>
            </tbody>
          </q-markup-table>
          <div class="row items-center justify-between" style="margin-top:16px; flex-wrap:wrap; gap:12px;">
            <div class="text-grey-7" style="font-size:0.875rem;">Showing {{ total ? startIdx + 1 : 0 }}–{{ endIdx }} of {{ total }}</div>
            <div class="row items-center" style="gap:20px;">
              <div class="row items-center" style="gap:8px;">
                <span class="text-grey-7" style="font-size:0.875rem;">Show</span>
                <q-select v-model="perPage" :options="[10, 25, 50, 100]" outlined dense bg-color="white" style="width:88px" hide-bottom-space @update:model-value="pageNum = 1" />
                <span class="text-grey-7" style="font-size:0.875rem;">per page</span>
              </div>
              <q-pagination v-model="pageNum" :max="pageCount" :max-pages="6" direction-links boundary-numbers />
            </div>
          </div>
        </template>
        </div>

        <!-- Fixed action footer (always visible at the bottom of the viewport) -->
        <div style="flex:none; border-top:1px solid var(--ds-color-border-container); padding:14px 32px; background:var(--ds-color-surface); display:flex; justify-content:flex-end; gap:12px;">
          <template v-if="step === 1">
            <q-btn flat no-caps color="grey-8" label="Discard" @click="closeWizard" />
            <q-btn unelevated no-caps color="primary" :disable="!pickedCount" :label="'Select Reservations ( ' + pickedCount + ' )'" @click="goEdit" />
          </template>
          <template v-else-if="step === 2">
            <q-btn outline no-caps color="primary" label="Cancel" @click="backToSelect" />
            <q-btn unelevated no-caps color="primary" label="Confirm Changes" @click="confirmChanges" />
          </template>
        </div>
      </div>
    </div>

    <!-- Bulk Edit field modal -->
    <ds-modal v-model="bulkOpen" :title="bulkTitle" size="sm">
      <div v-if="isPerRow" class="column q-gutter-md">
        <div v-for="r in targets" :key="r.pipe" class="row items-center no-wrap q-gutter-md">
          <div style="flex:none; width:120px; color:var(--ds-color-text-subtle); font-size:0.875rem;">{{ r.pipe }}</div>
          <q-select v-if="bulkKey === 'checkIn'" v-model="drafts[r.pipe]" :options="CHECKIN_OPTS" outlined dense bg-color="white" hide-bottom-space class="col" :placeholder="r.checkIn" />
          <q-input v-else v-model="drafts[r.pipe]" outlined dense bg-color="white" hide-bottom-space class="col" :placeholder="bulkKey === 'emails' ? 'New Email' : 'New Name'" />
        </div>
      </div>
      <div v-else class="column q-gutter-sm">
        <div class="text-grey-8" style="font-size:0.875rem;">Apply something to all fields</div>
        <q-select v-if="bulkKey === 'hotels'" v-model="applyAll" :options="HOTEL_OPTS" outlined dense bg-color="white" hide-bottom-space />
        <q-select v-else-if="bulkKey === 'status'" v-model="applyAll" :options="STATUS_OPTS" outlined dense bg-color="white" hide-bottom-space />
        <q-input v-else v-model="applyAll" outlined dense bg-color="white" hide-bottom-space placeholder="Enter Group ID" />
      </div>
      <template #footer>
        <q-btn flat no-caps color="grey-8" label="Cancel" @click="bulkOpen = false" />
        <q-btn unelevated no-caps color="primary" label="Done" @click="applyBulk" />
      </template>
    </ds-modal>

    <!-- Delete confirmation — lists exactly what will be removed -->
    <ds-modal v-model="delOpen" :title="'Are you sure you want to delete these ' + targetCount + ' reservations?'" size="md">
      <div class="column q-gutter-md">
        <div style="background:var(--ds-color-background-danger); border:1px solid var(--ds-color-background-danger-bold); border-radius:var(--ds-radius-md); padding:10px 14px; color:var(--ds-color-text-danger); font-size:0.875rem;">
          Deleted reservations will be removed from reports and activity logs. This action is permanent.
        </div>
        <div class="text-grey-8" style="font-size:0.875rem;">This action cannot be undone. The following reservations will be permanently deleted:</div>
        <div style="overflow-x:auto;">
          <q-markup-table flat bordered separator="horizontal" style="box-shadow:none;">
            <thead>
              <tr>
                <th class="text-left" style="font-weight:700;">Name</th>
                <th class="text-left" style="font-weight:700;">Email</th>
                <th class="text-left" style="font-weight:700;">Pipe ID</th>
                <th class="text-left" style="font-weight:700;">Hotel Conf #</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in targets" :key="r.pipe">
                <td class="text-left" style="white-space:nowrap;">{{ r.name }}</td>
                <td class="text-left" style="white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
                <td class="text-left" style="white-space:nowrap;">{{ r.pipe }}</td>
                <td class="text-left" style="white-space:nowrap;">{{ r.conf || '- -' }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
      <template #footer>
        <q-btn flat no-caps color="grey-8" label="Cancel" @click="delOpen = false" />
        <q-btn unelevated no-caps color="negative" :label="'Delete Reservations ( ' + targetCount + ' )'" @click="confirmDelete" />
      </template>
    </ds-modal>

    <ds-modal v-model="moving" :title="progressTitle" size="sm" persistent hide-close>
      <div class="column q-gutter-sm">
        <q-linear-progress indeterminate color="primary" rounded size="6px" />
        <div class="text-grey-8" style="font-size:0.875rem;">{{ progressBody }}</div>
        <div class="text-grey-6" style="font-size:0.8125rem;">Estimated time remaining: ~10 seconds</div>
      </div>
    </ds-modal>
  </div>

  <!-- Reservation Transfer / Changes Summary — shown on the Results screen -->
  <ds-modal v-model="summaryOpen" :title="summaryTitle" size="lg">
    <div class="column q-gutter-md">
      <div style="font-size:1.0625rem; font-weight:700; color:var(--ds-color-text);">{{ summaryLead }}</div>
      <div class="text-grey-7" style="font-size:0.875rem;">All selected reservations were updated successfully.</div>
      <div>
        <button type="button" class="row items-center" style="background:none; border:0; padding:0; cursor:pointer; color:var(--ds-color-text); font-weight:600; font-size:0.9375rem;" @click="summaryExpanded = !summaryExpanded">
          <q-icon :name="summaryExpanded ? 'arrow_drop_down' : 'arrow_right'" size="22px" />
          <span>{{ expandLabel }}</span>
        </button>
        <div v-show="summaryExpanded" style="margin-top:8px; overflow-x:auto;">
          <q-markup-table flat bordered separator="horizontal" style="box-shadow:none;">
            <thead>
              <tr>
                <th class="text-left" style="font-weight:700;">Name</th>
                <th class="text-left" style="font-weight:700;">Email</th>
                <th class="text-left" style="font-weight:700;">Hotel</th>
                <th class="text-left" style="font-weight:700;">Pipe ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in summaryRows" :key="r.pipe">
                <td class="text-left" style="white-space:nowrap;">{{ r.name }}</td>
                <td class="text-left" style="white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
                <td class="text-left" style="white-space:nowrap;">{{ r.hotel }}</td>
                <td class="text-left" style="white-space:nowrap;">{{ r.pipe }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </div>
    <template #footer>
      <q-btn flat no-caps color="grey-8" label="Dismiss" @click="summaryOpen = false" />
    </template>
  </ds-modal>

  <!-- Per-entry activity detail — reflects the clicked log line -->
  <ds-modal v-model="entryOpen" :title="entryTitle" size="md">
    <div v-if="activeEntry" class="column q-gutter-md">
      <div v-if="activeEntry.level === 'error'" style="background:var(--ds-color-background-danger); border:1px solid var(--ds-color-background-danger-bold); border-radius:var(--ds-radius-md); padding:10px 14px; color:var(--ds-color-text-danger); font-size:0.875rem;">
        <q-icon name="error" size="16px" class="q-mr-xs" style="vertical-align:-3px;" />{{ activeEntry.reason }}
      </div>
      <div v-else-if="activeEntry.level === 'warn'" style="background:var(--ds-color-background-warning); border:1px solid var(--ds-color-background-warning-bold); border-radius:var(--ds-radius-md); padding:10px 14px; color:var(--ds-color-text-warning); font-size:0.875rem;">
        <q-icon name="warning" size="16px" class="q-mr-xs" style="vertical-align:-3px;" />{{ activeEntry.reason || activeEntry.activity }}
      </div>

      <div style="display:grid; grid-template-columns:150px 1fr; row-gap:12px; column-gap:16px; font-size:0.9375rem; align-items:baseline;">
        <div class="text-grey-7" style="font-weight:600;">Reservation</div><div style="font-weight:600;">{{ activeEntry.name }}</div>
        <div class="text-grey-7" style="font-weight:600;">Email</div><div class="text-grey-8">{{ activeEntry.email }}</div>
        <div class="text-grey-7" style="font-weight:600;">Pipe ID</div><div>{{ activeEntry.pipe }}</div>

        <template v-if="activeEntry.kind === 'field'">
          <div class="text-grey-7" style="font-weight:600;">Field</div><div>{{ activeEntry.field }}</div>
          <div class="text-grey-7" style="font-weight:600;">Previous value</div><div class="text-grey-8">{{ activeEntry.from }}</div>
          <div class="text-grey-7" style="font-weight:600;">Updated to</div><div style="font-weight:600; color:var(--ds-color-text-brand);">{{ activeEntry.to }}</div>
        </template>
        <template v-else-if="activeEntry.kind === 'move'">
          <div class="text-grey-7" style="font-weight:600;">Previous hotel</div><div class="text-grey-8">{{ activeEntry.from }}</div>
          <div class="text-grey-7" style="font-weight:600;">Moved to</div><div style="font-weight:600; color:var(--ds-color-text-brand);">{{ activeEntry.to }}</div>
        </template>
        <template v-else-if="activeEntry.kind === 'fail' || activeEntry.kind === 'skip'">
          <div class="text-grey-7" style="font-weight:600;">Reason</div><div>{{ activeEntry.reason }}</div>
        </template>
      </div>

      <div class="text-grey-6" style="font-size:0.8125rem; border-top:1px solid var(--ds-color-border-container); padding-top:12px;">{{ activeEntry.time }} · by {{ activeEntry.user }}</div>
    </div>
    <template #footer>
      <q-btn flat no-caps color="grey-8" label="Dismiss" @click="entryOpen = false" />
    </template>
  </ds-modal>
</template>

<style scoped>
/* Wide bulk-edit tables scroll horizontally on narrow viewports instead of
   clipping columns (the global .ds-table clips with overflow:hidden). */
:deep(.ds-table.q-table__container) { overflow-x: auto; }
/* Cap content width on wide viewports while keeping the layout; the page chrome
   (backgrounds, borders, banner bar) still spans full width. */
.brf-mw { max-width: 1320px; margin-left: auto; margin-right: auto; }
/* Filters dropdown: white fill (via color="white") + the SAME grey outlined border
   as the Sort By selects in the toolbar (Quasar's default outlined field border). */
.brf-filters-btn { border: 1px solid rgba(0, 0, 0, 0.24); border-radius: var(--ds-radius-sm); overflow: hidden; }
</style>
