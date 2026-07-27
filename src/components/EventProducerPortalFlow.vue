<script setup>
// EventProducerPortalFlow — the Event Producer Portal prototype as ONE self-
// contained component (no page reloads). This is the CLIENT-FACING portal (a
// light top-bar chrome, NOT the internal admin sidebar), recreating the event-
// detail template: EventPipe top bar → breadcrumb → event header (logo, meta,
// Booking Site, Room Nights Booked / Pickup) → 3 tabs (Hotels / Group Blocks /
// Reservations). The Reservations tab kicks off the 3-step Bulk Edit wizard
// (Select → Edit → Results).
//
// V1 scope changes vs. the internal Bulk Reservation Edit flow:
//   • No "Reserved On" column (removes horizontal scroll).
//   • Only guest NAME + EMAIL are editable (initial release).
//   • Standardized placeholder data: Staff Member 1–50, all one shared email.
//
// Powers the Storybook "Event Producer Portal" stories AND the standalone GitHub
// Pages prototype. All data is fake.
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import DsStat from './DsStat.vue'
import DsThumbnail from './DsThumbnail.vue'
import DsModal from './DsModal.vue'
import appbarLogo from '../assets/tts/TTS-Logo-e1749152469615.png'
import eventLogo from '../assets/tts/ec8a6d7b-f1ec-4b8c-80d5-188c1e8720a7.png'
import { loadImagery } from '../lib/imagery.js'

// deepLink: sync the current wizard stage to the URL hash (standalone prototype
// only; off in Storybook so it doesn't fight the Storybook iframe URL).
const props = defineProps({
  deepLink: { type: Boolean, default: false },
  startTab: { type: String, default: 'hotels' }, // hotels | group-blocks | reservations
  startScreen: { type: String, default: 'portal' }, // portal | wizard
  startStep: { type: Number, default: 1 },
})

// ---- Event + portal reference data ---------------------------------------
const EVENT = '2027 - CHEERSPORT Nationals - Atlanta'
const USER = 'Mike Addesa'
const SHARED_EMAIL = 'staff@teamtravelsource.com'
const VENUE = 'Georgia World Congress Center'

const HOTELS = [
  { name: 'Omni Atlanta Hotel at CNN Center', addr: '100 CNN Center, Atlanta, GA', dist: '0.2 miles from Georgia World Congress Center', cutoff: 'Fri, 01/22/2027', comp: 0, contracted: 90, booked: 0, held: 0 },
  { name: 'Embassy Suites by Hilton Atlanta at Centennial Olympic Park', addr: '267 Marietta St NW, Atlanta, GA', dist: '0.3 miles from Georgia World Congress Center', cutoff: 'Fri, 01/22/2027', comp: 0, contracted: 70, booked: 0, held: 0 },
  { name: 'Hilton Garden Inn Atlanta Downtown', addr: '275 Baker St NW, Atlanta, GA', dist: '0.4 miles from Georgia World Congress Center', cutoff: 'Fri, 01/15/2027', comp: 0, contracted: 55, booked: 0, held: 0 },
  { name: 'Courtyard Atlanta Downtown', addr: '133 Carnegie Way NW, Atlanta, GA', dist: '0.6 miles from Georgia World Congress Center', cutoff: 'Fri, 01/15/2027', comp: 0, contracted: 45, booked: 0, held: 0 },
  { name: 'Hyatt Regency Atlanta', addr: '265 Peachtree St NE, Atlanta, GA', dist: '0.7 miles from Georgia World Congress Center', cutoff: 'Fri, 01/22/2027', comp: 0, contracted: 35, booked: 0, held: 0 },
]
// Hotels-tab summary tiles (from the reference screenshot).
const HOTEL_STATS = [
  { value: '295', label: 'Contracted Rooms On Peak' },
  { value: '230', label: 'Available Rooms On Peak' },
  { value: '860', label: 'Room Nights Contracted' },
  { value: '860', label: 'Room Nights Available' },
]
// Group blocks for this event (dance/cheer orgs, Milwaukee hotels).
const GROUPS = [
  { name: 'Midwest Elite Dance', org: 'Midwest Elite Dance', email: 'coach@midwestelitedance.com', addlEmail: 'travel@midwestelitedance.com', hotels: ['Hilton Milwaukee City Center'], pickup: '12/40', release: 'Fri, 12/18/2026', status: 'Open', groupId: 'G-00690142', contact: 'Bauer, Kristin - (414) 555-0148', cutoff: 'Fri, 12/18/2026', created: 'Tue, 09/15/2026' },
  { name: 'All-Star Spirit Athletics', org: 'All-Star Spirit Athletics', email: 'katie@allstarspirit.com', addlEmail: 'blocks@allstarspirit.com', hotels: ['Cambria Hotels Milwaukee Downtown'], pickup: '25/50', release: 'Fri, 12/25/2026', status: 'Open', groupId: 'G-00688731', contact: 'Reyes, Katie - (312) 555-0193', cutoff: 'Fri, 12/25/2026', created: 'Mon, 09/07/2026' },
  { name: 'Rhythm & Motion Dance Co.', org: 'Rhythm & Motion Dance Co.', email: 'director@rhythmandmotion.org', addlEmail: 'rhythmandmotion@gmail.com', hotels: ['Hyatt Regency Milwaukee'], pickup: '0/20', release: 'Fri, 12/18/2026', status: 'Closed', groupId: 'G-00684510', contact: 'Nguyen, Tara - (608) 555-0112', cutoff: 'Fri, 12/18/2026', created: 'Wed, 08/26/2026' },
  { name: 'Championship Cheer Elite', org: 'Championship Cheer Elite', email: 'josh@champcheerelite.com', addlEmail: 'coachrob@champcheerelite.com', hotels: ['Fairfield Inn & Suites Milwaukee Downtown', 'Drury Plaza Hotel Milwaukee Downtown'], pickup: '8/30', release: 'Fri, 12/11/2026', status: 'Open', groupId: 'G-00681299', contact: 'Whitaker, Josh - (773) 555-0176', cutoff: 'Fri, 12/11/2026', created: 'Fri, 08/14/2026' },
  { name: 'Starbound Performing Arts', org: 'Starbound Performing Arts', email: 'mmjohnson@starboundpa.com', addlEmail: 'starboundtravel@gmail.com', hotels: ['Drury Plaza Hotel Milwaukee Downtown'], pickup: '0/15', release: 'Fri, 12/11/2026', status: 'Closed', groupId: 'G-00679048', contact: 'Johnson, Michelle - (502) 555-0134', cutoff: 'Fri, 12/11/2026', created: 'Mon, 08/03/2026' },
]
const GROUP_STATS = [
  { value: '5', label: 'Group Blocks' },
  { value: '155', label: 'Room Nights Held' },
  { value: '45', label: 'Room Nights Booked' },
  { value: '29 %', label: 'Group Pickup' },
]

// Hotel photos from the hosted Imagery Library (remote if VITE_IMAGERY_URL is
// set, else the committed local fallback set). Assigned one per hotel card.
const hotelImages = ref([])
onMounted(async () => {
  try {
    const lib = await loadImagery()
    hotelImages.value = ['exterior', 'lobby', 'pool', 'dining', 'suites', 'rooms']
      .flatMap((c) => (lib[c] || []).map((i) => i.url))
  } catch (_) { /* ignore — DsThumbnail shows its placeholder */ }
})
const hotelImg = (i) => (hotelImages.value.length ? hotelImages.value[i % hotelImages.value.length] : '')

const ROOM_OPTS = ['Two Queen Beds', 'Standard King', 'Two Double Beds', 'King Suite']
const CHECKIN_OPTS = ['Wed, 02/11/2027', 'Thu, 02/12/2027', 'Fri, 02/13/2027']
const CHECKOUT_OPTS = ['Sun, 02/14/2027', 'Mon, 02/15/2027']
const STATUS_CYCLE = ['Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Pending', 'Confirmed']

// Soft, monochromatic status pills.
const PILL_THEMES = {
  gray:  { bg: '#f1f3f5', fg: '#495057', bd: '#dde1e6' },
  green: { bg: '#e7f6ed', fg: '#1a7f4b', bd: '#b8e4cb' },
  blue:  { bg: '#e8f0ff', fg: '#1c56d6', bd: '#c4d8fb' },
  amber: { bg: '#fdf5e4', fg: '#b7791f', bd: '#f2e0aa' },
  red:   { bg: '#fdeaee', fg: '#c02640', bd: '#f4c2cc' },
}
const STATUS_COLOR = { confirmed: 'green', processed: 'green', open: 'green', pending: 'amber', closed: 'amber', canceled: 'red', cancelled: 'red' }
const statusStyle = (s) => {
  const t = PILL_THEMES[STATUS_COLOR[(s || '').toLowerCase()]] || PILL_THEMES.gray
  return `display:inline-block; padding:3px 12px; border-radius:999px; font-size:0.75rem; font-weight:600; white-space:nowrap; background:${t.bg}; color:${t.fg}; border:1px solid ${t.bd};`
}
const dateRange = (r) => `${r.checkIn} - ${r.checkOut}`
const pad = (n, len) => String(n).padStart(len, '0')

// 50 standardized placeholder reservations: Staff Member 1–50, one shared email.
const buildData = (n) => {
  const out = []
  for (let i = 1; i <= n; i++) {
    const hotel = HOTELS[(i - 1) % HOTELS.length]
    const status = STATUS_CYCLE[(i - 1) % STATUS_CYCLE.length]
    out.push({
      name: `Staff Member ${i}`,
      email: SHARED_EMAIL,
      hotel: hotel.name,
      addr: hotel.addr,
      room: ROOM_OPTS[(i - 1) % ROOM_OPTS.length],
      checkIn: CHECKIN_OPTS[(i - 1) % CHECKIN_OPTS.length],
      checkOut: CHECKOUT_OPTS[(i - 1) % CHECKOUT_OPTS.length],
      groupId: 'G-000' + pad(90100 + i, 5),
      pipe: 'R-052' + pad(10400 + i, 5),
      conf: pad(50000000 + i * 13711, 8),
      status,
      pick: false, sel: false,
    })
  }
  // Stamp originals so the results summary can show what changed.
  return out.map((r) => ({ ...r, origName: r.name, origEmail: r.email }))
}

// ---- State ---------------------------------------------------------------
const screen = ref(props.startScreen === 'wizard' ? 'wizard' : 'portal') // portal | wizard
const step = ref(props.startScreen === 'wizard' ? props.startStep : 1)
const tab = ref(props.startTab)
const rows = reactive(buildData(50))
const banner = ref(null) // { text, tone } shown on the Reservations tab after a run
// Stories that open the wizard mid-flow (Edit/Results) need rows already picked.
if (props.startScreen === 'wizard' && props.startStep >= 2) {
  rows.slice(0, 6).forEach((r) => { r.pick = true; r.sel = true })
}

const picked = computed(() => rows.filter((r) => r.pick))
const pickedCount = computed(() => picked.value.length)
const targets = computed(() => rows.filter((r) => r.pick && r.sel))
const targetCount = computed(() => targets.value.length)

const pickState = computed(() => { const n = rows.filter((r) => r.pick).length; return n === 0 ? false : (n === rows.length ? true : null) })
const togglePick = () => { const t = !rows.every((r) => r.pick); rows.forEach((r) => { r.pick = t }) }
const selState = computed(() => { const p = picked.value; const n = p.filter((r) => r.sel).length; return n === 0 ? false : (n === p.length ? true : null) })
const toggleSel = () => { const t = !picked.value.every((r) => r.sel); picked.value.forEach((r) => { r.sel = t }) }

// Pagination (reservations tab + wizard).
const perPage = ref(25)
const pageNum = ref(1)
const searchQ = ref('')
const matchRow = (r, q) => [r.name, r.email, r.hotel, r.pipe, r.conf, r.groupId, r.room, r.status, r.checkIn, r.checkOut]
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
const openWizard = () => { rows.forEach((r) => { r.pick = false; r.sel = false }); step.value = 1; screen.value = 'wizard'; banner.value = null; resetPage() }
const closeWizard = () => { screen.value = 'portal'; tab.value = 'reservations'; resetPage() }
const goEdit = () => { if (pickedCount.value) { rows.forEach((r) => { r.sel = r.pick }); step.value = 2; resetPage() } }
const backToSelect = () => { step.value = 1; resetPage() }
const backToReservations = () => { screen.value = 'portal'; tab.value = 'reservations'; resetPage() }

// ---- Column visibility (Edit Columns) — NO "Reserved On" column ----------
const COLS = [
  { key: 'name', label: 'Name', group: 'Guest details' },
  { key: 'email', label: 'Email', group: 'Guest details' },
  { key: 'checkIn', label: 'Check In', group: 'Stay details' },
  { key: 'checkOut', label: 'Check Out', group: 'Stay details' },
  { key: 'hotel', label: 'Hotel', group: 'Stay details' },
  { key: 'room', label: 'Room Type', group: 'Stay details' },
  { key: 'groupId', label: 'Group ID', group: 'Identifiers & status' },
  { key: 'pipe', label: 'Pipe ID', group: 'Identifiers & status' },
  { key: 'conf', label: 'Hotel Conf #', group: 'Identifiers & status' },
  { key: 'status', label: 'Reservation Status', group: 'Identifiers & status' },
]
// Default a lean column set so the table fits without horizontal scroll.
const DEFAULT_ON = { name: true, email: true, checkIn: true, checkOut: true, hotel: true, room: false, groupId: false, pipe: true, conf: false, status: true }
const colOn = reactive({ ...DEFAULT_ON })
const shownCols = computed(() => COLS.filter((c) => colOn[c.key]))
const selectAllCols = () => COLS.forEach((c) => { colOn[c.key] = true })
const clearAllCols = () => COLS.forEach((c) => { colOn[c.key] = false })
const EDITABLE = new Set(['name', 'email']) // V1: only name + email are editable
const COL_STORE = 'epp-cols'
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

// ---- Deep linking — reflect the wizard stage in the URL hash -------------
const stage = computed(() => {
  if (screen.value === 'wizard') {
    if (step.value === 2) return 'edit'
    if (step.value === 3) return 'results'
    return 'select'
  }
  return 'portal'
})
const STAGE_HASH = {
  portal: '#/event-producer-portal',
  select: '#/event-producer-portal/select',
  edit: '#/event-producer-portal/edit',
  results: '#/event-producer-portal/results',
}
const hashStage = (h) => {
  const m = (h || '').match(/^#\/event-producer-portal(?:\/(select|edit|results))?$/)
  return m ? (m[1] || 'portal') : null
}
const applyStage = (s) => {
  if (s === 'select') { screen.value = 'wizard'; step.value = 1 }
  else if (s === 'edit') { rows.forEach((r) => { r.sel = r.pick }); screen.value = 'wizard'; step.value = 2 }
  else if (s === 'results') { screen.value = 'wizard'; step.value = 3 }
  else { screen.value = 'portal'; tab.value = 'reservations' }
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
  if (s && s !== 'portal') applyStage(s)
  window.addEventListener('hashchange', onHashChange)
})
onUnmounted(() => { if (props.deepLink) window.removeEventListener('hashchange', onHashChange) })
watch(stage, (s) => {
  if (!props.deepLink) return
  const target = STAGE_HASH[s] || STAGE_HASH.portal
  if (window.location.hash !== target) { syncingHash = true; window.location.hash = target }
})

// ---- Bulk Edit modal (V1: names + emails only) ---------------------------
const BULK_FIELDS = [
  { key: 'names', label: 'Edit Names' },
  { key: 'emails', label: 'Edit Emails' },
]
const bulkOpen = ref(false)
const bulkKey = ref('')
const drafts = reactive({})
const bulkTitle = computed(() => (BULK_FIELDS.find((f) => f.key === bulkKey.value) || {}).label || '')
const openBulk = (key) => {
  bulkKey.value = key
  targets.value.forEach((r) => { drafts[r.pipe] = '' })
  bulkOpen.value = true
}
const applyBulk = () => {
  const sel = targets.value
  if (bulkKey.value === 'names') sel.forEach((r) => { if (drafts[r.pipe]) r.name = drafts[r.pipe] })
  else if (bulkKey.value === 'emails') sel.forEach((r) => { if (drafts[r.pipe]) r.email = drafts[r.pipe] })
  bulkOpen.value = false
}

// ---- Confirm / delete → progress → Step 3 (Results) ----------------------
const resultMode = ref('edit') // 'edit' | 'deleted'
const changedRows = ref([])
const moving = ref(false)
const delOpen = ref(false)

const confirmChanges = () => {
  resultMode.value = 'edit'
  changedRows.value = picked.value.map((r) => ({ ...r }))
  moving.value = true
  setTimeout(() => { moving.value = false; step.value = 3; resetPage() }, 1400)
}
const confirmDelete = () => {
  resultMode.value = 'deleted'
  changedRows.value = targets.value.map((r) => ({ ...r }))
  const kill = new Set(changedRows.value.map((r) => r.pipe))
  for (let i = rows.length - 1; i >= 0; i--) if (kill.has(rows[i].pipe)) rows.splice(i, 1)
  delOpen.value = false
  moving.value = true
  setTimeout(() => { moving.value = false; step.value = 3; resetPage() }, 1400)
}
const isDelete = computed(() => resultMode.value === 'deleted')
const resultCount = computed(() => changedRows.value.length)
const progressTitle = computed(() => (isDelete.value ? 'Deleting Reservations…' : 'Applying Changes…'))
const progressBody = computed(() => (isDelete.value
  ? `Removing ${resultCount.value} reservation${resultCount.value !== 1 ? 's' : ''}…`
  : `Updating ${picked.value.length} reservation${picked.value.length !== 1 ? 's' : ''}…`))
const resultTitle = computed(() => (isDelete.value ? 'Reservations removed' : 'Changes applied successfully'))
const resultLead = computed(() => (isDelete.value
  ? `${resultCount.value} reservation${resultCount.value !== 1 ? 's were' : ' was'} removed from the event.`
  : `${resultCount.value} reservation${resultCount.value !== 1 ? 's were' : ' was'} updated successfully.`))

// "Back to Reservations" from Step 3 → portal Reservations tab with a banner.
const finishFromResults = () => {
  banner.value = isDelete.value
    ? { text: `${resultCount.value} reservation${resultCount.value !== 1 ? 's were' : ' was'} successfully removed from the event.`, tone: 'danger' }
    : { text: `Your changes to ${resultCount.value} reservation${resultCount.value !== 1 ? 's were' : ' was'} saved successfully.`, tone: 'success' }
  backToReservations()
}
</script>

<template>
  <!-- ==================== Portal (event-detail, 3 tabs) ==================== -->
  <div v-if="screen !== 'wizard'" class="epp">
    <!-- Top bar (client-facing portal chrome) -->
    <header class="epp-topbar">
      <div class="epp-brand">
        <img :src="appbarLogo" alt="Team Travel Source" class="epp-brand__logo" />
      </div>
      <div class="epp-topbar__right">
        <a href="#" class="text-primary" style="text-decoration:none; font-weight:600;" @click.prevent>Contact Us</a>
        <button type="button" class="epp-user">
          {{ USER }}<q-icon name="expand_more" size="20px" />
          <q-menu anchor="bottom right" self="top right" :offset="[0, 6]">
            <q-list padding style="min-width:180px">
              <q-item v-for="a in ['Profile', 'Account settings', 'Sign out']" :key="a" clickable v-close-popup>
                <q-item-section>{{ a }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </button>
      </div>
    </header>

    <!-- Success / removed banner (after a bulk run) -->
    <div v-if="banner" :style="banner.tone === 'danger'
      ? 'background:var(--ds-color-background-danger); border-bottom:1px solid var(--ds-color-background-danger-bold);'
      : 'background:var(--ds-color-background-success); border-bottom:1px solid var(--ds-color-background-success-bold);'">
      <div class="epp-mw" style="padding:12px 0; display:flex; align-items:center; gap:10px;"
        :style="{ color: banner.tone === 'danger' ? 'var(--ds-color-text-danger)' : 'var(--ds-color-text-success)' }">
        <q-icon :name="banner.tone === 'danger' ? 'delete_outline' : 'check_circle'" size="20px" />
        <span style="font-weight:600;">{{ banner.text }}</span>
        <q-space />
        <q-btn flat round dense icon="close" size="sm" @click="banner = null" />
      </div>
    </div>

    <!-- Event header -->
    <div style="background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      <div class="epp-mw" style="padding:20px 0 0;">
        <!-- Breadcrumb (full width) -->
        <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-md">
          <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
          <q-breadcrumbs-el label="Events" />
          <q-breadcrumbs-el :label="EVENT" class="text-grey-6" />
        </q-breadcrumbs>

        <!-- Event logo + header details -->
        <div style="display:flex; align-items:flex-start; gap:20px;">
          <img :src="eventLogo" alt="CHEERSPORT Nationals" class="epp-eventlogo" />
          <div style="flex:1 1 0; min-width:0; display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap;">
            <!-- Title + meta (tightly stacked) -->
            <div style="min-width:0;">
              <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
                <h1 class="epp-title">{{ EVENT }}</h1>
                <q-badge color="orange-8" rounded class="q-px-sm q-py-xs" style="font-weight:700;">Upcoming</q-badge>
              </div>
              <div class="epp-meta" style="margin-top:12px;">
                <div><span class="epp-meta__label">City/State:</span> <span class="epp-meta__val">Atlanta, GA</span></div>
                <div><span class="epp-meta__label">Start/End Date:</span> <span class="epp-meta__val">02/12/2027 - 02/14/2027</span></div>
                <div>
                  <span class="epp-meta__label">Contact:</span>
                  <span class="epp-meta__val">Tara Quigley, (502) 804-1802 - </span><a href="#" class="text-primary" style="text-decoration:none;" @click.prevent>tara@teamtravelsource.com</a>
                </div>
              </div>
            </div>
            <!-- Booking Site + stats -->
            <div class="column items-end" style="gap:10px;">
              <q-btn no-caps color="white" text-color="grey-9" label="Booking Site" class="epp-white-btn" style="min-width:200px;" />
              <div class="row items-stretch no-wrap" style="gap:0;">
                <ds-stat value="0" label="Room Nights Booked" align="center" style="padding:0 20px;" />
                <div style="width:1px; background:var(--ds-color-border-container);"></div>
                <ds-stat value="- %" label="Pickup" align="center" style="padding:0 20px;" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs (full width) -->
        <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7 q-mt-md">
          <q-tab name="hotels" label="Hotels" />
          <q-tab name="group-blocks" label="Group Blocks" />
          <q-tab name="reservations" label="Reservations" />
        </q-tabs>
      </div>
    </div>

    <!-- Body -->
    <div style="background:var(--ds-color-surface-sunken);">
      <div class="epp-mw" style="padding:24px 0 56px;">

        <!-- ============================ HOTELS ============================ -->
        <template v-if="tab === 'hotels'">
          <div class="epp-statcard">
            <template v-for="(s, i) in HOTEL_STATS" :key="s.label">
              <ds-stat :value="s.value" :label="s.label" align="center" class="col" />
              <div v-if="i < HOTEL_STATS.length - 1" class="epp-statcard__div"></div>
            </template>
          </div>

          <div class="row items-center no-wrap q-mt-lg q-mb-md" style="gap:20px;">
            <div style="font-size:1.375rem; font-weight:700; white-space:nowrap;">Hotels List</div>
            <q-input model-value="" outlined dense bg-color="white" placeholder="Search by hotel name" style="width:320px;" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
          </div>

          <div class="column q-gutter-md">
            <div v-for="(h, idx) in HOTELS" :key="h.name" class="epp-hotel">
              <ds-thumbnail :src="hotelImg(idx)" size="88px" fit="cover" />
              <div style="flex:1.4 1 0; min-width:0;">
                <a href="#" class="text-primary" style="text-decoration:none; font-weight:700; font-size:1.0625rem;" @click.prevent>{{ h.name }}</a>
                <div class="text-grey-8" style="font-size:0.875rem; margin-top:4px;">{{ h.addr }}</div>
                <div class="text-grey-6" style="font-size:0.8125rem;">{{ h.dist }}</div>
                <div style="font-size:0.8125rem; margin-top:6px;"><span style="font-weight:700;">Hotel Cutoff Date:</span> <span class="text-grey-8">{{ h.cutoff }}</span></div>
              </div>
              <div class="epp-hotel__stats">
                <ds-stat :value="h.comp" label="Comp Rooms Available Nights" align="center" />
                <ds-stat :value="h.contracted" label="Room Nights Contracted" align="center" />
                <ds-stat :value="h.booked" label="Room Nights Booked" align="center" />
                <ds-stat :value="h.held" label="Room Nights Held" align="center" />
                <ds-stat value="- %" label="Pickup" align="center" />
              </div>
            </div>
          </div>
        </template>

        <!-- ========================= GROUP BLOCKS ========================= -->
        <template v-else-if="tab === 'group-blocks'">
          <div class="epp-statcard">
            <template v-for="(s, i) in GROUP_STATS" :key="s.label">
              <ds-stat :value="s.value" :label="s.label" align="center" class="col" />
              <div v-if="i < GROUP_STATS.length - 1" class="epp-statcard__div"></div>
            </template>
          </div>

          <div class="row items-center no-wrap q-mt-lg q-mb-md" style="gap:16px; flex-wrap:wrap;">
            <div style="font-size:1.375rem; font-weight:700; white-space:nowrap;">Groups</div>
            <q-input model-value="" outlined dense bg-color="white" placeholder="Search" style="width:280px;" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div class="row items-center no-wrap" style="gap:8px;">
              <span class="text-grey-7">Sort by:</span>
              <q-select model-value="Organization Name" :options="['Organization Name', 'Room Nights Held']" outlined dense bg-color="white" style="width:190px;" hide-bottom-space />
              <q-select model-value="0-9 / A-Z" :options="['0-9 / A-Z', '9-0 / Z-A']" outlined dense bg-color="white" style="width:130px;" hide-bottom-space />
            </div>
            <q-space />
            <q-btn no-caps color="white" text-color="grey-9" label="Export" class="epp-white-btn" />
            <q-btn-dropdown no-caps color="white" text-color="grey-9" label="Filters" class="epp-white-btn">
              <q-list style="min-width:160px">
                <q-item clickable v-close-popup><q-item-section>Status</q-item-section></q-item>
                <q-item clickable v-close-popup><q-item-section>Hotel</q-item-section></q-item>
              </q-list>
            </q-btn-dropdown>
          </div>

          <div class="column q-gutter-md">
            <div v-for="g in GROUPS" :key="g.groupId" class="epp-group">
              <div class="epp-group__top">
                <div style="flex:1.2 1 0; min-width:0;">
                  <a href="#" class="text-primary" style="text-decoration:none; font-weight:700; font-size:1.0625rem;" @click.prevent>{{ g.name }}</a>
                  <div style="font-size:0.875rem; margin-top:6px;"><span style="font-weight:700;">Organization:</span> <span class="text-grey-8">{{ g.org }}</span></div>
                  <div style="font-size:0.875rem;"><span style="font-weight:700;">Email:</span> <span class="text-grey-8">{{ g.email }}</span></div>
                  <div style="font-size:0.875rem;"><span style="font-weight:700;">Additional Emails:</span> <span class="text-grey-8">{{ g.addlEmail }}</span></div>
                </div>
                <div class="epp-group__div"></div>
                <div style="flex:1.3 1 0; min-width:0;">
                  <div v-for="h in g.hotels" :key="h" style="font-weight:500; color:var(--ds-color-text); line-height:1.5;">{{ h }}</div>
                </div>
                <div class="epp-group__div"></div>
                <ds-stat :value="g.pickup" label="Group Pickup" align="center" style="flex:none; min-width:110px;" />
                <div class="epp-group__div"></div>
                <ds-stat :value="g.release" label="Group Release" align="center" style="flex:none; min-width:150px;" />
                <div style="flex:none;">
                  <span :style="statusStyle(g.status)">{{ g.status }}</span>
                </div>
              </div>
              <q-separator style="margin:14px 0;" />
              <div class="epp-group__meta">
                <div><span style="font-weight:700;">Group ID:</span> <span class="text-grey-8">{{ g.groupId }}</span></div>
                <div><span style="font-weight:700;">Contact:</span> <span class="text-grey-8">{{ g.contact }}</span></div>
                <div><span style="font-weight:700;">Hotel Cutoff:</span> <span class="text-grey-8">{{ g.cutoff }}</span></div>
                <q-space />
                <div class="text-grey-7"><q-icon name="schedule" size="15px" style="vertical-align:-2px;" /> <span style="font-weight:700;">Created:</span> {{ g.created }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- ========================= RESERVATIONS ========================= -->
        <template v-else>
          <div class="row items-center no-wrap q-mb-md" style="gap:16px; flex-wrap:wrap;">
            <div style="font-size:1.375rem; font-weight:700; white-space:nowrap; color:var(--ds-color-text-brand);">Reservations</div>
            <q-input v-model="searchQ" outlined dense bg-color="white" placeholder="Search" style="width:280px;" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div class="row items-center no-wrap" style="gap:8px;">
              <span class="text-grey-7">Sort by:</span>
              <q-select model-value="Primary Guest" :options="['Primary Guest', 'Hotel', 'Check-in Date']" outlined dense bg-color="white" style="width:170px;" hide-bottom-space />
              <q-select model-value="0-9 / A-Z" :options="['0-9 / A-Z', '9-0 / Z-A']" outlined dense bg-color="white" style="width:130px;" hide-bottom-space />
            </div>
            <q-space />
            <q-btn no-caps color="white" text-color="grey-9" label="Export" class="epp-white-btn" />
            <q-btn unelevated no-caps color="primary" icon="edit_note" label="Bulk Edit Reservations" @click="openWizard" />
          </div>

          <div class="column q-gutter-md">
            <div v-for="r in pagedRows" :key="r.pipe" class="epp-rescard">
              <div style="flex:1.2 1 0; min-width:0;">
                <a href="#" class="text-primary" style="text-decoration:none; font-weight:700; font-size:1.0625rem;" @click.prevent>{{ r.name }}</a>
                <div style="font-size:0.875rem; margin-top:8px;"><span style="font-weight:700;">Email:</span> <span class="text-grey-8">{{ r.email }}</span></div>
                <div style="font-size:0.875rem;"><span style="font-weight:700;">Origin:</span> <span class="text-grey-8">Contracted</span></div>
              </div>
              <div class="epp-rescard__div"></div>
              <div style="flex:1.5 1 0; min-width:0;">
                <div style="font-weight:700;">{{ r.hotel }}</div>
                <div class="text-grey-6" style="font-size:0.8125rem;">{{ r.addr }}</div>
                <div style="font-size:0.875rem; margin-top:8px;"><span style="font-weight:700;">Room Type:</span> <span class="text-grey-8">{{ r.room }}</span></div>
                <div style="font-size:0.875rem;"><span style="font-weight:700;">Check In/Out Date:</span> <span class="text-grey-8">{{ dateRange(r) }}</span></div>
              </div>
              <div class="epp-rescard__div"></div>
              <div style="flex:1 1 0; min-width:0;">
                <div style="font-weight:700;">{{ r.conf || '- -' }}</div>
                <div class="text-grey-6" style="font-size:0.8125rem;">Hotel Confirmation</div>
              </div>
              <div class="epp-rescard__div"></div>
              <div style="flex:1 1 0; min-width:0;">
                <div style="font-weight:700;">{{ r.pipe }}</div>
                <div class="text-grey-6" style="font-size:0.8125rem;">Pipe ID</div>
              </div>
              <div style="flex:none;">
                <span :style="statusStyle(r.status)">{{ r.status }}</span>
              </div>
            </div>
          </div>

          <div class="row items-center justify-between q-mt-md" style="flex-wrap:wrap; gap:12px;">
            <div class="text-grey-7" style="font-size:0.875rem;">Showing {{ total ? startIdx + 1 : 0 }}–{{ endIdx }} of {{ total }}</div>
            <div class="row items-center" style="gap:20px;">
              <div class="row items-center" style="gap:8px;">
                <span class="text-grey-7" style="font-size:0.875rem;">Show</span>
                <q-select v-model="perPage" :options="[10, 25, 50]" outlined dense bg-color="white" style="width:80px" hide-bottom-space @update:model-value="pageNum = 1" />
                <span class="text-grey-7" style="font-size:0.875rem;">per page</span>
              </div>
              <q-pagination v-model="pageNum" :max="pageCount" :max-pages="6" direction-links boundary-numbers />
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>

  <!-- ============================ Wizard overlay ============================ -->
  <div v-else style="height:100vh; display:flex; flex-direction:column; background:var(--ds-color-surface);">
    <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-bottom:1px solid var(--ds-color-border-container); flex:none;">
      <div style="display:flex; align-items:center; gap:14px;">
        <q-btn flat round dense icon="close" color="grey-8" @click="closeWizard"><q-tooltip>Close</q-tooltip></q-btn>
        <span style="font-size:1.125rem; font-weight:700;">{{ EVENT }}</span>
      </div>
      <div class="row items-center" style="gap:6px; color:var(--ds-color-text-subtle);">{{ USER }} <q-icon name="arrow_drop_down" /></div>
    </div>

    <div style="flex:1 1 auto; display:flex; min-height:0;">
      <!-- Stepper -->
      <div style="flex:none; width:230px; border-right:1px solid var(--ds-color-border-container); padding:28px 20px;">
        <div v-for="(s, i) in ['Select Reservations', 'Edit Reservations', 'Results']" :key="s" class="row items-start no-wrap" style="gap:12px;">
          <div style="flex:none; display:flex; flex-direction:column; align-items:center; align-self:stretch;">
            <div :style="{ width:'26px', height:'26px', flex:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8125rem', fontWeight:700, color: (i+1) <= step ? '#fff' : 'var(--ds-color-text-subtle)', background: (i+1) <= step ? 'var(--ds-color-background-brand-bold)' : 'var(--ds-color-surface-sunken)', border: (i+1) > step ? '1px solid var(--ds-color-border)' : 'none' }">
              <q-icon v-if="(i+1) < step" name="check" size="16px" /><span v-else>{{ i+1 }}</span>
            </div>
            <div v-if="i < 2" :style="{ width:'2px', flex:'1 1 auto', minHeight:'22px', background: (i+1) < step ? 'var(--ds-color-background-brand-bold)' : 'var(--ds-color-border-container)' }"></div>
          </div>
          <span :style="{ paddingTop:'2px', paddingBottom: i < 2 ? '22px' : '0', fontWeight: (i+1) === step ? 700 : 500, color: (i+1) === step ? 'var(--ds-color-text-brand)' : 'var(--ds-color-text-subtle)' }">{{ s }}</span>
        </div>
      </div>

      <!-- Content -->
      <div style="flex:1 1 auto; display:flex; flex-direction:column; min-width:0; min-height:0;">
        <div style="flex:1 1 auto; overflow-y:auto; overflow-x:hidden; padding:24px 32px 20px; min-width:0;">

          <!-- STEP 1 — Select -->
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
                  <q-select v-model="perPage" :options="[10, 25, 50]" outlined dense bg-color="white" style="width:80px" hide-bottom-space @update:model-value="pageNum = 1" />
                  <span class="text-grey-7" style="font-size:0.875rem;">per page</span>
                </div>
                <q-pagination v-model="pageNum" :max="pageCount" :max-pages="6" direction-links boundary-numbers />
              </div>
            </div>
          </template>

          <!-- STEP 2 — Edit (name + email only) -->
          <template v-else-if="step === 2">
            <div class="row items-center justify-between no-wrap" style="margin-bottom:8px; gap:12px;">
              <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand);">Edit Reservations</div>
              <q-btn-dropdown outline no-caps color="primary" label="Bulk Edit" :disable="!targetCount">
                <q-list style="min-width:230px">
                  <q-item v-for="f in BULK_FIELDS" :key="f.key" clickable v-close-popup @click="openBulk(f.key)"><q-item-section>{{ f.label }}</q-item-section></q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="delOpen = true"><q-item-section class="text-negative">Delete Reservations</q-item-section></q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div class="text-grey-7" style="font-size:0.875rem; margin-bottom:16px;">For this release, only guest <strong>name</strong> and <strong>email</strong> can be edited. Other fields are shown for reference.</div>
            <div class="row items-center justify-end no-wrap" style="margin-bottom:16px; gap:12px;">
              <q-input v-model="searchQ" outlined dense bg-color="white" placeholder="Search" style="width:340px; margin-right:auto;" hide-bottom-space>
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
                  <td v-if="colOn.name" style="padding:6px 10px;"><q-input v-model="r.name" dense outlined bg-color="white" hide-bottom-space style="min-width:190px" /></td>
                  <td v-if="colOn.email" style="padding:6px 10px;"><q-input v-model="r.email" type="email" dense outlined bg-color="white" hide-bottom-space style="min-width:250px" /></td>
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
                  <q-select v-model="perPage" :options="[10, 25, 50]" outlined dense bg-color="white" style="width:80px" hide-bottom-space @update:model-value="pageNum = 1" />
                  <span class="text-grey-7" style="font-size:0.875rem;">per page</span>
                </div>
                <q-pagination v-model="pageNum" :max="pageCount" :max-pages="6" direction-links boundary-numbers />
              </div>
            </div>
          </template>

          <!-- STEP 3 — Results -->
          <template v-else>
            <div class="column flex-center text-center" style="max-width:720px; margin:24px auto 0; gap:6px;">
              <q-icon :name="isDelete ? 'delete' : 'check_circle'" size="64px" :color="isDelete ? 'negative' : 'positive'" />
              <div style="font-size:1.5rem; font-weight:700; margin-top:8px;">{{ resultTitle }}</div>
              <div class="text-grey-7" style="font-size:1rem;">{{ resultLead }}</div>
            </div>
            <div style="max-width:720px; margin:24px auto 0; overflow-x:auto;">
              <q-markup-table flat bordered separator="horizontal" style="box-shadow:none;">
                <thead>
                  <tr>
                    <th class="text-left" style="font-weight:700;">Name</th>
                    <th class="text-left" style="font-weight:700;">Email</th>
                    <th class="text-left" style="font-weight:700;">Pipe ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in changedRows" :key="r.pipe">
                    <td class="text-left" style="white-space:nowrap;">{{ r.name }}</td>
                    <td class="text-left" style="white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
                    <td class="text-left" style="white-space:nowrap;">{{ r.pipe }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </template>
        </div>

        <!-- Fixed action footer -->
        <div style="flex:none; border-top:1px solid var(--ds-color-border-container); padding:14px 32px; background:var(--ds-color-surface); display:flex; justify-content:flex-end; gap:12px;">
          <template v-if="step === 1">
            <q-btn flat no-caps color="grey-8" label="Discard" @click="closeWizard" />
            <q-btn unelevated no-caps color="primary" :disable="!pickedCount" :label="'Select Reservations ( ' + pickedCount + ' )'" @click="goEdit" />
          </template>
          <template v-else-if="step === 2">
            <q-btn outline no-caps color="primary" label="Cancel" @click="backToSelect" />
            <q-btn unelevated no-caps color="primary" label="Confirm Changes" @click="confirmChanges" />
          </template>
          <template v-else>
            <q-btn unelevated no-caps color="primary" label="Back to Reservations" @click="finishFromResults" />
          </template>
        </div>
      </div>
    </div>

    <!-- Bulk Edit field modal (names / emails) -->
    <ds-modal v-model="bulkOpen" :title="bulkTitle" size="sm">
      <div class="column q-gutter-md">
        <div v-for="r in targets" :key="r.pipe" class="row items-center no-wrap q-gutter-md">
          <div style="flex:none; width:130px; color:var(--ds-color-text-subtle); font-size:0.875rem;">{{ r.name }}</div>
          <q-input v-model="drafts[r.pipe]" :type="bulkKey === 'emails' ? 'email' : 'text'" outlined dense bg-color="white" hide-bottom-space class="col" :placeholder="bulkKey === 'emails' ? 'New Email' : 'New Name'" />
        </div>
      </div>
      <template #footer>
        <q-btn flat no-caps color="grey-8" label="Cancel" @click="bulkOpen = false" />
        <q-btn unelevated no-caps color="primary" label="Done" @click="applyBulk" />
      </template>
    </ds-modal>

    <!-- Delete confirmation -->
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in targets" :key="r.pipe">
                <td class="text-left" style="white-space:nowrap;">{{ r.name }}</td>
                <td class="text-left" style="white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
                <td class="text-left" style="white-space:nowrap;">{{ r.pipe }}</td>
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

    <!-- Progress -->
    <ds-modal v-model="moving" :title="progressTitle" size="sm" persistent hide-close>
      <div class="column q-gutter-sm">
        <q-linear-progress indeterminate color="primary" rounded size="6px" />
        <div class="text-grey-8" style="font-size:0.875rem;">{{ progressBody }}</div>
        <div class="text-grey-6" style="font-size:0.8125rem;">Estimated time remaining: ~10 seconds</div>
      </div>
    </ds-modal>
  </div>
</template>

<style scoped>
/* Center the portal content on a max width; chrome backgrounds/borders still
   span full width via the wrappers above. */
.epp-mw { max-width: 1320px; margin: 0 auto; padding-left: 32px; padding-right: 32px; }

/* Top bar */
.epp-topbar {
  display: flex; align-items: center; justify-content: space-between;
  height: 68px; padding: 0 32px; background: var(--ds-color-surface);
  border-bottom: 1px solid var(--ds-color-border-container);
}
.epp-brand { display: flex; align-items: center; }
.epp-brand__logo { height: 40px; width: auto; display: block; }

/* Event logo beside the title (square emblem). */
.epp-eventlogo { width: 92px; height: 92px; flex: none; object-fit: contain; display: block; }
.epp-title { margin: 0; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.01em; line-height: 1.2; color: var(--ds-color-text); }

/* White buttons (Booking Site / Export / Filters) — white fill + grey outlined
   border matching the DS outlined fields. */
.epp-white-btn { border: 1px solid rgba(0, 0, 0, 0.24); border-radius: var(--ds-radius-sm); overflow: hidden; }

/* Event meta list — inline grey label + dark value, tightly stacked. */
.epp-meta { display: flex; flex-direction: column; gap: 4px; font-size: 0.9375rem; }
.epp-meta__label { color: var(--ds-color-text-subtle); }
.epp-meta__val { color: var(--ds-color-text); font-weight: 700; }
.epp-topbar__right { display: flex; align-items: center; gap: 24px; }
.epp-user {
  display: inline-flex; align-items: center; gap: 4px; height: 40px; padding: 0 6px;
  border: 0; background: transparent; color: var(--ds-color-text); font: inherit;
  font-size: 0.9375rem; font-weight: 600; cursor: pointer; border-radius: var(--ds-radius-md);
}
.epp-user:hover { background: var(--ds-color-surface-sunken); }

/* Stat summary card (Hotels / Group Blocks tabs) */
.epp-statcard {
  display: flex; align-items: center;
  background: var(--ds-color-surface); border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-lg); padding: 28px 8px;
}
.epp-statcard__div { width: 1px; align-self: stretch; background: var(--ds-color-border-container); }

/* Hotel card */
.epp-hotel {
  display: flex; align-items: center; gap: 20px; padding: 20px 24px;
  background: var(--ds-color-surface); border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-lg);
}
.epp-hotel__stats {
  flex: none; display: grid; grid-template-columns: repeat(5, minmax(90px, auto)); gap: 24px; align-items: center;
}

/* Group block card */
.epp-group {
  padding: 20px 28px; background: var(--ds-color-surface);
  border: 1px solid var(--ds-color-border-container); border-radius: var(--ds-radius-lg);
}
.epp-group__top { display: flex; align-items: center; gap: 24px; }
.epp-group__div { align-self: stretch; width: 1px; flex: none; background: var(--ds-color-border-container); }
.epp-group__meta { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; font-size: 0.875rem; }

/* Reservation card */
.epp-rescard {
  display: flex; gap: 24px; align-items: center; padding: 22px 28px;
  background: var(--ds-color-surface); border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-lg);
}
.epp-rescard__div { align-self: stretch; width: 1px; flex: none; background: var(--ds-color-border-container); }

/* Wide bulk-edit tables scroll horizontally instead of clipping. */
:deep(.ds-table.q-table__container) { overflow-x: auto; }

/* Responsive: collapse the hotel-card stat grid under the details on narrow widths. */
@media (max-width: 900px) {
  .epp-hotel { flex-wrap: wrap; }
  .epp-hotel__stats { grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; }
  .epp-rescard { flex-wrap: wrap; }
  .epp-rescard__div { display: none; }
  .epp-group__top { flex-wrap: wrap; }
  .epp-group__div { display: none; }
}
</style>
