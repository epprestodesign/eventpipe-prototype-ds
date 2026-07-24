/** EVENTPIPE LABS / Bulk Reservation Edit — V1 prototype (full flow).
 *
 *  Resurrects the "Move" bulk-edit concept for Team Travel Source / Varsity staff-
 *  room management. Full flow, built from DS components with fake data:
 *
 *   1. Reservations List — event-hotel Reservations tab; "…" menu → Bulk Edit.
 *   2. Bulk Edit — a 3-step wizard (Select Reservations → Edit Reservations →
 *      Results). Step 2 supports per-field Bulk Edit modals + row delete. Confirm
 *      runs a progress state, then a transfer summary.
 *   3. Results — reservations list with a success banner.
 *   4. Activity Logs — the audit trail written by the bulk edit.
 *
 *  Editing the Hotel field effectively MOVES a reservation, so a bulk hotel change
 *  reads as "moved to <hotel>". */
import { ref, reactive, computed, watch } from 'vue'
import { page } from '../pages/_shell'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsThumbnail from '../../components/DsThumbnail.vue'
import DsModal from '../../components/DsModal.vue'
import DsConfirmDialog from '../../components/DsConfirmDialog.vue'
import DsStatus from '../../components/DsStatus.vue'
import DsStat from '../../components/DsStat.vue'
import DsPageHeader from '../../components/DsPageHeader.vue'
import DsInfoGrid from '../../components/DsInfoGrid.vue'
import BulkReservationFlow from '../../components/BulkReservationFlow.vue'

// Event logos from src/assets/events (auto-imported) — for the Events list story.
const eventLogos = Object.values(import.meta.glob('../../assets/events/*.{png,jpg,jpeg}', { eager: true, import: 'default' }))

export default { title: 'Eventpipe Labs/Bulk Reservation Edit', tags: ['autodocs'], parameters: { layout: 'fullscreen' } }

const STORY_BASE = 'eventpipe-labs-bulk-reservation-edit'
const HOTEL = 'Drury Inn & Suites Denver'

const RES = [
  { name: 'John Smith', email: 'john.smith@example.com', reserved: 'Tue, 04/01/2025', checkIn: 'Tue, 04/01/2025', checkOut: 'Sat, 05/03/2025', hotel: HOTEL, room: 'Executive Suite', groupId: 'G-00081615', pipe: 'R-01337893', conf: 'CONF1001', status: 'Confirmed' },
  { name: 'Emily Johnson', email: 'emily.johnson@example.com', reserved: 'Wed, 04/02/2025', checkIn: 'Wed, 04/02/2025', checkOut: 'Sun, 05/04/2025', hotel: HOTEL, room: 'Deluxe King Room', groupId: 'G-00081623', pipe: 'R-01337912', conf: 'CONF1002', status: 'Confirmed' },
  { name: 'Michael Brown', email: 'michael.brown@example.com', reserved: 'Thu, 04/03/2025', checkIn: 'Thu, 04/03/2025', checkOut: 'Mon, 05/05/2025', hotel: HOTEL, room: 'Two Queen Beds', groupId: 'G-00081634', pipe: 'R-01337925', conf: 'CONF1003', status: 'Confirmed' },
  { name: 'Sarah Davis', email: 'sarah.davis@example.com', reserved: 'Fri, 04/04/2025', checkIn: 'Fri, 04/04/2025', checkOut: 'Tue, 05/06/2025', hotel: HOTEL, room: 'Standard Double', groupId: 'G-00081645', pipe: 'R-01337941', conf: 'CONF1004', status: 'Confirmed' },
  { name: 'David Wilson', email: 'david.wilson@example.com', reserved: 'Sat, 04/05/2025', checkIn: 'Sat, 04/05/2025', checkOut: 'Wed, 05/07/2025', hotel: HOTEL, room: 'Junior Suite', groupId: 'G-00081652', pipe: 'R-01337956', conf: 'CONF1005', status: 'Confirmed' },
  { name: 'Ashley Martinez', email: 'ashley.martinez@example.com', reserved: 'Sun, 04/06/2025', checkIn: 'Sun, 04/06/2025', checkOut: 'Thu, 05/08/2025', hotel: HOTEL, room: 'Accessible Queen Room', groupId: 'G-00081667', pipe: 'R-01337968', conf: 'CONF1006', status: 'Confirmed' },
]

const HOTEL_OPTS = ['Drury Inn & Suites Denver', 'Richmond Marriott', 'Hilton Garden Inn Denver', 'Courtyard Denver Tech Center', 'Hotel Indigo Denver']
const ROOM_OPTS = ['Executive Suite', 'Deluxe King Room', 'Two Queen Beds', 'Standard Double', 'Junior Suite', 'Accessible Queen Room']
const STATUS_OPTS = ['Confirmed', 'Pending', 'Cancelled']
const CHECKIN_OPTS = ['Tue, 04/01/2025', 'Wed, 04/02/2025', 'Thu, 04/03/2025', 'Fri, 04/04/2025', 'Sat, 04/05/2025', 'Sun, 04/06/2025', 'Wed, 04/12/2025']
const CHECKOUT_OPTS = ['Sat, 05/03/2025', 'Sun, 05/04/2025', 'Mon, 05/05/2025', 'Tue, 05/06/2025', 'Wed, 05/07/2025', 'Thu, 05/08/2025', 'Fri, 05/09/2025']

/* A larger fake dataset (120 staff-room reservations) so the wizard can show
   pagination — deterministic (index-based) so it stays stable across renders. */
const FIRST = ['John', 'Emily', 'Michael', 'Sarah', 'David', 'Ashley', 'James', 'Jessica', 'Robert', 'Amanda', 'William', 'Jennifer', 'Daniel', 'Lisa', 'Matthew', 'Nancy', 'Christopher', 'Karen', 'Joshua', 'Betty', 'Andrew', 'Sandra', 'Kevin', 'Donna', 'Brian', 'Carol', 'George', 'Ruth', 'Edward', 'Sharon']
const LAST = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts']
const STATUS_CYCLE = ['Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Pending', 'Cancelled']
const pad = (n, len) => String(n).padStart(len, '0')
const makeReservations = (n) => Array.from({ length: n }, (_, i) => {
  const first = FIRST[i % FIRST.length]
  const last = LAST[(i * 7) % LAST.length]
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@example.com`,
    reserved: CHECKIN_OPTS[i % CHECKIN_OPTS.length],
    checkIn: CHECKIN_OPTS[i % CHECKIN_OPTS.length],
    checkOut: CHECKOUT_OPTS[i % CHECKOUT_OPTS.length],
    hotel: HOTEL,
    room: ROOM_OPTS[i % ROOM_OPTS.length],
    groupId: 'G-000' + pad(81615 + i, 5),
    pipe: 'R-013' + pad(37893 + i, 5),
    conf: 'CONF' + pad(1001 + i, 4),
    status: STATUS_CYCLE[i % STATUS_CYCLE.length],
  }
})
const BULK_RES = makeReservations(120)

const hotelTabs = ['Reservations', 'Room Blocks', 'Group Blocks', 'Property Policies', 'Housing Company Policies', 'Users', 'Notes', 'Documents', 'Activity Logs']
const moreMenu = [
  'Booking Site', 'Private Booking Site', 'Comp Booking Site', 'Event Producer Info',
  'View/Add Note', 'Delete Event', 'Disable Customer Changes', 'Send Pre Arrival Emails',
  'Export Pickup Report', 'Reservation Compliancy Edits', 'Generate Pickup Reports',
]

/* Shared event-hotel header + tabs (breadcrumb, thumbnail, title, Live badge,
   Export Rooming List + optional "…" menu slot, tabs). `extraActions` injects the
   overflow menu; `banner` shows a success banner above the header. */
const hotelHeader = (menuSlot = '') => `
  <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-md">
    <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
    <q-breadcrumbs-el label="Events" />
    <q-breadcrumbs-el label="JAHNet Cheer Super Nationals" />
    <q-breadcrumbs-el label="Reservations" />
    <q-breadcrumbs-el label="Manage Event Hotel" class="text-grey-6" />
  </q-breadcrumbs>
  <div class="row items-start justify-between no-wrap q-mb-md">
    <div class="row items-center no-wrap" style="gap:16px; min-width:0;">
      <ds-thumbnail size="lg" fit="cover" />
      <div style="min-width:0;">
        <div class="row items-center no-wrap" style="gap:10px;">
          <a href="#" class="text-primary" style="text-decoration:none; font-size:1.375rem; font-weight:700;" @click.prevent>Drury Inn &amp; Suites Denver Tech Center</a>
          <q-btn dense no-caps unelevated color="positive" text-color="white" class="q-px-sm" style="border-radius:6px;">Live <q-icon name="arrow_drop_down" size="20px" /></q-btn>
        </div>
        <div class="text-grey-6" style="font-size:0.875rem; margin-top:2px;">9201 E Dry Creek Rd, Centennial, CO 80112 · 1-303-555-0142</div>
      </div>
    </div>
    <div class="row items-center no-wrap" style="gap:10px; flex:none;">
      <q-btn unelevated no-caps color="primary" label="Export Rooming List" />
      ${menuSlot}
    </div>
  </div>
  <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left"
    class="text-grey-7" mobile-arrows outside-arrows>
    <q-tab v-for="t in hotelTabs" :key="t" :name="t.toLowerCase().replace(/ /g,'-')"
      :label="t === 'Reservations' ? 'Reservations (25)' : t" />
  </q-tabs>`

/* ========================================================================= *
 * 1 — Reservations List (entry). "…" → Bulk Edit Reservations opens the wizard.
 * ========================================================================= */
export const ReservationsList = page({
  active: 'requests',
  org: 'Housing Company',
  user: 'Mike Addesa',
  components: { DsPageToolbar, DsThumbnail },
  setup: () => ({
    rows: RES, hotelTabs, moreMenu,
    tab: ref('reservations'), sortField: ref('Create Date'), sortDir: ref('0-9 / A-Z'),
    bulkEditHref: `/?path=/story/${STORY_BASE}--bulk-edit`,
  }),
  slot: `
    <div style="padding:20px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      ${hotelHeader(`
        <q-btn flat round dense icon="more_horiz" color="grey-7">
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width:250px">
              <q-item v-for="m in moreMenu" :key="m" clickable v-close-popup>
                <q-item-section :class="m === 'Delete Event' ? 'text-negative' : 'text-grey-8'">{{ m }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup tag="a" :href="bulkEditHref" target="_top">
                <q-item-section class="text-primary" style="font-weight:600;">Bulk Edit Reservations</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>`)}
    </div>

    <div style="padding:20px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <ds-page-toolbar title="Reservations">
        <template #search>
          <div style="display:flex; align-items:center; gap:16px; flex-wrap:nowrap;">
            <q-input outlined dense bg-color="white" placeholder="Search" style="width:300px" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:nowrap;">
              <span class="text-grey-7" style="white-space:nowrap;">Sort By</span>
              <q-select v-model="sortField" :options="['Create Date','Guest Name','Hotel','Check-In Date']" outlined dense bg-color="white" style="width:160px" hide-bottom-space />
              <q-select v-model="sortDir" :options="['0-9 / A-Z','9-0 / Z-A']" outlined dense bg-color="white" style="width:140px" hide-bottom-space />
            </div>
          </div>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Export" />
          <q-btn-dropdown outline no-caps color="primary" label="Filters">
            <q-list style="min-width:200px">
              <q-item clickable v-close-popup><q-item-section>Status</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section>Hotel</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section>Room Type</q-item-section></q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
      </ds-page-toolbar>

      <div style="margin-top:16px; overflow-x:auto; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
        <table style="width:100%; border-collapse:collapse; min-width:1100px;">
          <thead>
            <tr style="border-bottom:1px solid var(--ds-color-border-container);">
              <th v-for="h in ['Name','Email','Reserved On','Check In','Check Out','Hotel','Group ID','Pipe ID','Hotel Conf #']" :key="h"
                style="text-align:left; padding:14px 16px; font-size:0.8125rem; font-weight:700; color:var(--ds-color-text-subtle); white-space:nowrap;">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.pipe" style="border-bottom:1px solid var(--ds-color-border-container);">
              <td style="padding:14px 16px; white-space:nowrap;"><a href="#" class="text-primary" style="text-decoration:none; font-weight:600;" @click.prevent>{{ r.name }}</a></td>
              <td style="padding:14px 16px; white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.reserved }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.checkIn }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.checkOut }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.hotel }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.groupId }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.pipe }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.conf }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`,
})
ReservationsList.storyName = 'Reservations List'
ReservationsList.parameters = { layout: 'fullscreen' }

/* ========================================================================= *
 * 2 — Bulk Edit wizard: Select Reservations → Edit Reservations → Results.
 * ========================================================================= */
const BULK_FIELDS = [
  { key: 'names', label: 'Edit Names' },
  { key: 'emails', label: 'Edit Emails' },
  { key: 'checkIn', label: 'Edit Check-in Dates' },
  { key: 'hotels', label: 'Edit Hotels' },
  { key: 'group', label: 'Edit Group IDs' },
  { key: 'status', label: 'Edit Reservation Statuses' },
]
const PER_ROW = ['names', 'emails', 'checkIn']

export const BulkEdit = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { DsModal, DsConfirmDialog },
    setup() {
      const step = ref(1) // 1 Select · 2 Edit · 3 Results
      const rows = reactive(BULK_RES.map((r) => ({ ...r, pick: false, sel: false })))
      const picked = computed(() => rows.filter((r) => r.pick))
      const pickedCount = computed(() => picked.value.length)
      const targets = computed(() => rows.filter((r) => r.pick && r.sel))
      const targetCount = computed(() => targets.value.length)

      // Pagination — shared across steps; the source is all rows (Step 1) or the
      // picked rows (Step 2). "Show N per page" dropdown + page nav.
      const perPage = ref(25)
      const pageNum = ref(1)
      const pageSource = computed(() => (step.value === 1 ? rows : picked.value))
      const total = computed(() => pageSource.value.length)
      const pageCount = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))
      const startIdx = computed(() => (pageNum.value - 1) * perPage.value)
      const endIdx = computed(() => Math.min(startIdx.value + perPage.value, total.value))
      const pagedRows = computed(() => pageSource.value.slice(startIdx.value, startIdx.value + perPage.value))
      const resetPage = () => { pageNum.value = 1 }
      watch(pageCount, () => { if (pageNum.value > pageCount.value) pageNum.value = pageCount.value })

      // Header checkboxes (tri-state) for each step.
      const pickState = computed(() => { const n = rows.filter((r) => r.pick).length; return n === 0 ? false : (n === rows.length ? true : null) })
      const togglePick = () => { const t = !rows.every((r) => r.pick); rows.forEach((r) => { r.pick = t }) }
      const selState = computed(() => { const p = picked.value; const n = p.filter((r) => r.sel).length; return n === 0 ? false : (n === p.length ? true : null) })
      const toggleSel = () => { const t = !picked.value.every((r) => r.sel); picked.value.forEach((r) => { r.sel = t }) }

      const goEdit = () => { if (pickedCount.value) { rows.forEach((r) => { r.sel = r.pick }); step.value = 2; resetPage() } }
      const backToSelect = () => { step.value = 1; resetPage() }

      // Bulk Edit modal (one modal, content switches by `bulkKey`).
      const bulkOpen = ref(false)
      const bulkKey = ref('')
      const drafts = reactive({}) // per-row: pipe -> value
      const applyAll = ref('')
      const bulkTitle = computed(() => (BULK_FIELDS.find((f) => f.key === bulkKey.value) || {}).label || '')
      const isPerRow = computed(() => PER_ROW.includes(bulkKey.value))
      const openBulk = (key) => {
        bulkKey.value = key
        if (PER_ROW.includes(key)) targets.value.forEach((r) => { drafts[r.pipe] = '' })
        else applyAll.value = key === 'status' ? 'Confirmed' : ''
        bulkOpen.value = true
      }
      const applyBulk = () => {
        const sel = targets.value
        if (bulkKey.value === 'names') sel.forEach((r) => { if (drafts[r.pipe]) r.name = drafts[r.pipe] })
        else if (bulkKey.value === 'emails') sel.forEach((r) => { if (drafts[r.pipe]) r.email = drafts[r.pipe] })
        else if (bulkKey.value === 'checkIn') sel.forEach((r) => { if (drafts[r.pipe]) r.checkIn = drafts[r.pipe] })
        else if (bulkKey.value === 'hotels') sel.forEach((r) => { if (applyAll.value) r.hotel = applyAll.value })
        else if (bulkKey.value === 'group') sel.forEach((r) => { if (applyAll.value) r.groupId = applyAll.value })
        else if (bulkKey.value === 'status') sel.forEach((r) => { r.status = applyAll.value })
        bulkOpen.value = false
      }

      // Delete selected.
      const delOpen = ref(false)
      const confirmDelete = () => {
        const kill = new Set(targets.value.map((r) => r.pipe))
        for (let i = rows.length - 1; i >= 0; i--) if (kill.has(rows[i].pipe)) rows.splice(i, 1)
        delOpen.value = false
      }

      // Confirm Changes → progress → Results.
      const moving = ref(false)
      const movedRows = ref([])
      const confirmChanges = () => {
        movedRows.value = picked.value.map((r) => ({ ...r }))
        moving.value = true
        setTimeout(() => { moving.value = false; step.value = 3 }, 1600)
      }
      const resultsHref = `/?path=/story/${STORY_BASE}--results`

      return {
        step, rows, picked, pickedCount, targets, targetCount,
        pickState, togglePick, selState, toggleSel, goEdit, backToSelect,
        bulkOpen, bulkKey, bulkTitle, isPerRow, drafts, applyAll, openBulk, applyBulk,
        BULK_FIELDS, HOTEL_OPTS, ROOM_OPTS, STATUS_OPTS, CHECKIN_OPTS,
        delOpen, confirmDelete, moving, movedRows, resultsHref, HOTEL,
        perPage, pageNum, total, pageCount, startIdx, endIdx, pagedRows, resetPage,
      }
    },
    template: `
      <div style="height:100vh; display:flex; flex-direction:column; background:var(--ds-color-surface);">
        <!-- Top bar -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-bottom:1px solid var(--ds-color-border-container); flex:none;">
          <div style="display:flex; align-items:center; gap:14px;">
            <q-btn flat round dense icon="close" color="grey-8" :href="'/?path=/story/${STORY_BASE}--reservations-list'" target="_top"><q-tooltip>Close</q-tooltip></q-btn>
            <span style="font-size:1.125rem; font-weight:700; color:var(--ds-color-text);">{{ HOTEL }}</span>
          </div>
          <div class="row items-center" style="gap:6px; color:var(--ds-color-text-subtle);">Mike Addesa <q-icon name="arrow_drop_down" /></div>
        </div>

        <div style="flex:1 1 auto; display:flex; min-height:0;">
          <!-- Vertical stepper -->
          <div style="flex:none; width:230px; border-right:1px solid var(--ds-color-border-container); padding:28px 20px; display:flex; flex-direction:column; gap:22px;">
            <div v-for="(s, i) in ['Select Reservations','Edit Reservations','Results']" :key="s" class="row items-center no-wrap" style="gap:12px;">
              <div :style="{ width:'26px', height:'26px', flex:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8125rem', fontWeight:700, color: (i+1) <= step ? '#fff' : 'var(--ds-color-text-subtle)', background: (i+1) < step ? 'var(--ds-color-background-brand-bold)' : ((i+1) === step ? 'var(--ds-color-background-brand-bold)' : 'var(--ds-color-surface-sunken)'), border: (i+1) > step ? '1px solid var(--ds-color-border)' : 'none' }">
                <q-icon v-if="(i+1) < step" name="check" size="16px" /><span v-else>{{ i+1 }}</span>
              </div>
              <span :style="{ fontWeight: (i+1) === step ? 700 : 500, color: (i+1) === step ? 'var(--ds-color-text-brand)' : 'var(--ds-color-text-subtle)' }">{{ s }}</span>
            </div>
          </div>

          <!-- Content -->
          <div style="flex:1 1 auto; overflow:auto; padding:24px 32px 32px; min-width:0;">

            <!-- STEP 1 · Select Reservations -->
            <template v-if="step === 1">
              <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand); margin-bottom:16px;">Select Reservations</div>
              <q-input outlined dense bg-color="white" placeholder="Search" style="width:340px; margin-bottom:16px;" hide-bottom-space>
                <template #append><q-icon name="search" /></template>
              </q-input>
              <q-markup-table class="ds-table" flat bordered>
                <thead>
                  <tr>
                    <th style="width:44px; text-align:center;"><q-checkbox :model-value="pickState" @update:model-value="togglePick" dense /></th>
                    <th v-for="h in ['Name','Email','Reserved On','Check In','Check Out','Hotel','Room Type','Group ID','Pipe ID','Hotel Conf #','Status']" :key="h" class="text-left" style="white-space:nowrap;">{{ h }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in pagedRows" :key="r.pipe" :class="{ selected: r.pick }">
                    <td style="text-align:center;"><q-checkbox v-model="r.pick" dense color="primary" /></td>
                    <td style="white-space:nowrap; font-weight:600;">{{ r.name }}</td>
                    <td style="white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
                    <td style="white-space:nowrap;">{{ r.reserved }}</td>
                    <td style="white-space:nowrap;">{{ r.checkIn }}</td>
                    <td style="white-space:nowrap;">{{ r.checkOut }}</td>
                    <td style="white-space:nowrap;">{{ r.hotel }}</td>
                    <td style="white-space:nowrap;">{{ r.room }}</td>
                    <td style="white-space:nowrap;">{{ r.groupId }}</td>
                    <td style="white-space:nowrap;">{{ r.pipe }}</td>
                    <td style="white-space:nowrap;">{{ r.conf }}</td>
                    <td><span style="display:inline-block; padding:2px 10px; border-radius:999px; background:var(--ds-color-background-info-bold); color:#fff; font-size:0.75rem; font-weight:600; white-space:nowrap;">{{ r.status }}</span></td>
                  </tr>
                </tbody>
              </q-markup-table>
              <div class="row items-center justify-between" style="margin-top:16px; flex-wrap:wrap; gap:12px;">
                <div class="text-grey-7" style="font-size:0.875rem;">Showing {{ total ? startIdx + 1 : 0 }}–{{ endIdx }} of {{ total }}</div>
                <div class="row items-center" style="gap:20px;">
                  <div class="row items-center" style="gap:8px;">
                    <span class="text-grey-7" style="font-size:0.875rem;">Show</span>
                    <q-select v-model="perPage" :options="[10, 25, 50, 100]" outlined dense bg-color="white" style="width:88px" hide-bottom-space @update:model-value="resetPage" />
                    <span class="text-grey-7" style="font-size:0.875rem;">per page</span>
                  </div>
                  <q-pagination v-model="pageNum" :max="pageCount" :max-pages="6" direction-links boundary-numbers />
                </div>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                <q-btn flat no-caps color="grey-8" label="Discard" :href="'/?path=/story/${STORY_BASE}--reservations-list'" target="_top" />
                <q-btn unelevated no-caps color="primary" :disable="!pickedCount" :label="'Select Reservations ( ' + pickedCount + ' )'" @click="goEdit" />
              </div>
            </template>

            <!-- STEP 2 · Edit Reservations -->
            <template v-else-if="step === 2">
              <div class="row items-center justify-between no-wrap" style="margin-bottom:16px;">
                <div style="font-size:1.25rem; font-weight:700; color:var(--ds-color-text-brand);">Edit Reservations</div>
                <q-btn-dropdown outline no-caps color="primary" label="Bulk Edit" :disable="!targetCount">
                  <q-list style="min-width:230px">
                    <q-item v-for="f in BULK_FIELDS" :key="f.key" clickable v-close-popup @click="openBulk(f.key)">
                      <q-item-section>{{ f.label }}</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="delOpen = true">
                      <q-item-section class="text-negative">Delete Reservations</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
              <q-input outlined dense bg-color="white" placeholder="Search" style="width:340px; margin-bottom:16px;" hide-bottom-space>
                <template #append><q-icon name="search" /></template>
              </q-input>
              <q-markup-table class="ds-table" flat bordered>
                <thead>
                  <tr>
                    <th style="width:44px; text-align:center;"><q-checkbox :model-value="selState" @update:model-value="toggleSel" dense /></th>
                    <th v-for="h in ['Name','Email','Reserved On','Check In','Check Out','Hotel','Room Type','Group ID','Pipe ID','Hotel Conf #','Reservation Status']" :key="h" class="text-left" style="white-space:nowrap;">{{ h }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in pagedRows" :key="r.pipe" :class="{ selected: r.sel }">
                    <td style="text-align:center;"><q-checkbox v-model="r.sel" dense color="primary" /></td>
                    <td style="padding:6px 10px;"><q-input v-model="r.name" dense outlined bg-color="white" hide-bottom-space style="min-width:170px" /></td>
                    <td style="padding:6px 10px;"><q-input v-model="r.email" type="email" dense outlined bg-color="white" hide-bottom-space style="min-width:230px" /></td>
                    <td style="white-space:nowrap;">{{ r.reserved }}</td>
                    <td style="padding:6px 10px;"><q-select v-model="r.checkIn" :options="CHECKIN_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:160px" /></td>
                    <td style="padding:6px 10px;"><q-select v-model="r.checkOut" :options="CHECKIN_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:160px" /></td>
                    <td style="padding:6px 10px;"><q-select v-model="r.hotel" :options="HOTEL_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:210px" /></td>
                    <td style="padding:6px 10px;"><q-select v-model="r.room" :options="ROOM_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:190px" /></td>
                    <td style="padding:6px 10px;"><q-input v-model="r.groupId" dense outlined bg-color="white" hide-bottom-space style="min-width:140px" /></td>
                    <td style="white-space:nowrap;">{{ r.pipe }}</td>
                    <td style="white-space:nowrap;">{{ r.conf }}</td>
                    <td style="padding:6px 10px;"><q-select v-model="r.status" :options="STATUS_OPTS" outlined dense bg-color="white" hide-bottom-space style="min-width:150px" /></td>
                  </tr>
                </tbody>
              </q-markup-table>
              <div class="row items-center justify-between" style="margin-top:16px; flex-wrap:wrap; gap:12px;">
                <div class="text-grey-7" style="font-size:0.875rem;">Showing {{ total ? startIdx + 1 : 0 }}–{{ endIdx }} of {{ total }}</div>
                <div class="row items-center" style="gap:20px;">
                  <div class="row items-center" style="gap:8px;">
                    <span class="text-grey-7" style="font-size:0.875rem;">Show</span>
                    <q-select v-model="perPage" :options="[10, 25, 50, 100]" outlined dense bg-color="white" style="width:88px" hide-bottom-space @update:model-value="resetPage" />
                    <span class="text-grey-7" style="font-size:0.875rem;">per page</span>
                  </div>
                  <q-pagination v-model="pageNum" :max="pageCount" :max-pages="6" direction-links boundary-numbers />
                </div>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                <q-btn outline no-caps color="primary" label="Cancel" @click="backToSelect" />
                <q-btn unelevated no-caps color="primary" label="Confirm Changes" @click="confirmChanges" />
              </div>
            </template>

            <!-- STEP 3 · Results -->
            <template v-else>
              <div style="max-width:720px;">
                <div class="row items-center" style="gap:12px; margin-bottom:8px;">
                  <q-icon name="check_circle" color="positive" size="30px" />
                  <div style="font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">Reservations updated</div>
                </div>
                <div class="text-grey-7" style="margin-bottom:20px;">{{ movedRows.length }} reservation<span v-if="movedRows.length !== 1">s</span> updated successfully.</div>
                <q-markup-table class="ds-table" flat bordered>
                  <thead>
                    <tr><th class="text-left">Name</th><th class="text-left">Email</th><th class="text-left">Hotel</th><th class="text-left">Pipe ID</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in movedRows" :key="r.pipe">
                      <td style="white-space:nowrap; font-weight:600;">{{ r.name }}</td>
                      <td style="white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
                      <td style="white-space:nowrap;">{{ r.hotel }}</td>
                      <td style="white-space:nowrap;">{{ r.pipe }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                  <q-btn outline no-caps color="primary" label="View Changes" :href="'/?path=/story/${STORY_BASE}--activity-logs'" target="_top" />
                  <q-btn unelevated no-caps color="primary" label="Done" :href="resultsHref" target="_top" />
                </div>
              </div>
            </template>

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

        <!-- Delete confirmation -->
        <ds-confirm-dialog v-model="delOpen" destructive
          :title="'Are you sure you want to delete these ' + targetCount + ' reservations?'"
          message="Deleted reservations will be removed from reports and activity logs. This action is permanent and cannot be undone."
          confirm-label="Delete Reservations" cancel-label="Cancel" @confirm="confirmDelete" />

        <!-- Progress modal -->
        <ds-modal v-model="moving" title="Applying Changes…" size="sm" persistent hide-close>
          <div class="column q-gutter-sm">
            <q-linear-progress indeterminate color="primary" rounded size="6px" />
            <div class="text-grey-8" style="font-size:0.875rem;">Updating {{ picked.length }} reservation<span v-if="picked.length !== 1">s</span>…</div>
            <div class="text-grey-6" style="font-size:0.8125rem;">Estimated time remaining: ~10 seconds</div>
          </div>
        </ds-modal>
      </div>`,
  }),
}
BulkEdit.storyName = 'Bulk Edit'

/* ========================================================================= *
 * 3 — Results: reservations list with a success banner + View Changes.
 * ========================================================================= */
export const Results = page({
  active: 'requests',
  org: 'Housing Company',
  user: 'Mike Addesa',
  components: { DsPageToolbar, DsThumbnail },
  setup: () => ({
    rows: RES.map((r) => ({ ...r, hotel: 'Richmond Marriott' })),
    hotelTabs, tab: ref('reservations'), sortField: ref('Create Date'), sortDir: ref('0-9 / A-Z'),
    activityHref: `/?path=/story/${STORY_BASE}--activity-logs`,
  }),
  slot: `
    <div style="padding:0 0 0; background:var(--ds-color-surface);">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 32px; background:var(--ds-color-background-success); border-bottom:1px solid var(--ds-color-background-success-bold);">
        <div class="row items-center" style="gap:10px; color:var(--ds-color-text-success);">
          <q-icon name="check_circle" size="20px" />
          <span style="font-weight:600;">Your reservations were successfully moved to Richmond Marriott.</span>
        </div>
        <a :href="activityHref" target="_top" class="text-primary" style="text-decoration:none; font-weight:600;">View Changes</a>
      </div>
      <div style="padding:20px 32px 0; border-bottom:1px solid var(--ds-color-border-container);">
        ${hotelHeader('')}
      </div>
    </div>

    <div style="padding:20px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <ds-page-toolbar title="Reservations">
        <template #search>
          <div style="display:flex; align-items:center; gap:16px; flex-wrap:nowrap;">
            <q-input outlined dense bg-color="white" placeholder="Search" style="width:300px" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:nowrap;">
              <span class="text-grey-7" style="white-space:nowrap;">Sort By</span>
              <q-select v-model="sortField" :options="['Create Date','Guest Name','Hotel']" outlined dense bg-color="white" style="width:160px" hide-bottom-space />
              <q-select v-model="sortDir" :options="['0-9 / A-Z','9-0 / Z-A']" outlined dense bg-color="white" style="width:140px" hide-bottom-space />
            </div>
          </div>
        </template>
        <template #actions><q-btn unelevated no-caps color="primary" label="Export" /></template>
      </ds-page-toolbar>

      <div style="margin-top:16px; overflow-x:auto; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
        <table style="width:100%; border-collapse:collapse; min-width:1000px;">
          <thead>
            <tr style="border-bottom:1px solid var(--ds-color-border-container);">
              <th v-for="h in ['Name','Email','Reserved On','Check In','Check Out','Hotel','Pipe ID','Hotel Conf #']" :key="h"
                style="text-align:left; padding:14px 16px; font-size:0.8125rem; font-weight:700; color:var(--ds-color-text-subtle); white-space:nowrap;">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.pipe" style="border-bottom:1px solid var(--ds-color-border-container);">
              <td style="padding:14px 16px; white-space:nowrap;"><a href="#" class="text-primary" style="text-decoration:none; font-weight:600;" @click.prevent>{{ r.name }}</a></td>
              <td style="padding:14px 16px; white-space:nowrap; color:var(--ds-color-text-subtle);">{{ r.email }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.reserved }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.checkIn }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.checkOut }}</td>
              <td style="padding:14px 16px; white-space:nowrap; font-weight:600; color:var(--ds-color-text-brand);">{{ r.hotel }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.pipe }}</td>
              <td style="padding:14px 16px; white-space:nowrap;">{{ r.conf }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`,
})
Results.storyName = 'Results'
Results.parameters = { layout: 'fullscreen' }

/* ========================================================================= *
 * 4 — Activity Logs: audit trail written by the bulk edit.
 * ========================================================================= */
const ACTIVITY = [
  { time: '05/27/2025 1:15 PM', user: 'Justin Girard', activity: 'Initiated reservation transfer to Richmond Marriott for 6 reservations' },
  { time: '05/27/2025 1:15 PM', user: 'System', activity: 'Reservation for John Smith moved successfully' },
  { time: '05/27/2025 1:15 PM', user: 'System', activity: 'Reservation for Emily Johnson moved successfully' },
  { time: '05/27/2025 1:15 PM', user: 'System', activity: 'Reservation for Michael Brown moved successfully' },
  { time: '05/27/2025 1:16 PM', user: 'System', activity: 'Reservation for Sarah Davis moved successfully' },
  { time: '05/27/2025 1:16 PM', user: 'System', activity: 'Reservation for David Wilson moved successfully' },
  { time: '05/27/2025 1:16 PM', user: 'System', activity: 'Reservation for Ashley Martinez moved successfully' },
  { time: '05/27/2025 1:16 PM', user: 'Justin Girard', activity: 'Confirmed successful transfer of all 6 reservations' },
]

export const ActivityLogs = page({
  active: 'requests',
  org: 'Housing Company',
  user: 'Mike Addesa',
  components: { DsThumbnail },
  setup: () => ({ rows: ACTIVITY, hotelTabs, tab: ref('activity-logs') }),
  slot: `
    <div style="padding:20px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      ${hotelHeader('')}
    </div>
    <div style="padding:24px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <q-markup-table class="ds-table" flat bordered>
        <thead>
          <tr><th class="text-left" style="width:220px;">Date/Time</th><th class="text-left" style="width:200px;">User</th><th class="text-left">Activity</th></tr>
        </thead>
        <tbody>
          <tr v-for="(a, i) in rows" :key="i">
            <td style="white-space:nowrap;">{{ a.time }}</td>
            <td style="white-space:nowrap;" :class="{ 'text-grey-6': a.user === 'System' }">{{ a.user }}</td>
            <td>{{ a.activity }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>`,
})
ActivityLogs.storyName = 'Activity Logs'
ActivityLogs.parameters = { layout: 'fullscreen' }

/* ========================================================================= *
 * Prototype — Full Flow. The entire experience in one self-contained component
 * (no page reloads): list → Bulk Edit wizard → results → activity logs. This is
 * what the standalone GitHub Pages prototype mounts.
 * ========================================================================= */
export const Prototype = {
  parameters: { layout: 'fullscreen' },
  render: () => ({ components: { BulkReservationFlow }, template: '<bulk-reservation-flow />' }),
}
Prototype.storyName = 'Prototype — Full Flow'

/* ========================================================================= *
 * Context screens carried over from Pages / 02 Events (kept in-sync copies):
 * the Events list and the event-detail Reservations (card) view.
 * ========================================================================= */
const evEvents = [
  { title: 'Bend Premier Cup | 2026', status: 'Active', location: 'Bend, OR', producer: '365 Sports Travel', dates: 'Fri, 07/10/2026 - Sun, 07/12/2026', release: 'All Closed', cutoff: 'Sat, 06/27/2026',
    stats: { peak: 0, res: 370, unconf: 2, nights: 846, blocks: 64, pending: 21 } },
  { title: 'AT | Jr Canes - Marlborough, MA | Tim - 7/16-19', status: 'Inactive', location: 'Raleigh, NC', producer: '365 Sports Travel', dates: 'Thu, 07/16/2026 - Sun, 07/19/2026', release: 'No Blocks', cutoff: 'No Hotels',
    stats: { peak: 0, res: 0, unconf: 0, nights: 0, blocks: 0, pending: 0 } },
  { title: 'Knights | Show-Me State Games | 2026 | 1st weekend', status: 'Active', location: 'Columbia, MO', producer: '365 Sports Travel', dates: 'Fri, 07/17/2026 - Sun, 07/19/2026', release: 'No Blocks', cutoff: 'No Hotels',
    stats: { peak: 0, res: 0, unconf: 0, nights: 0, blocks: 0, pending: 0 } },
  { title: 'AT | Bend FC - Oregon Super Cup - 8/7-9', status: 'Cancelled', location: 'Bend, OR', producer: '365 Sports Travel', dates: 'Fri, 08/07/2026 - Sun, 08/09/2026', release: 'No Blocks', cutoff: 'No Hotels',
    stats: { peak: 30, res: 0, unconf: 0, nights: 0, blocks: 0, pending: 0 } },
]

export const Events = page({
  active: 'events',
  components: { DsPageToolbar, DsStatus, DsStat, DsThumbnail },
  setup: () => ({ events: evEvents, eventLogos, sort: ref('Earliest Start Date') }),
  slot: `
    <div style="padding:24px 28px 20px; background:var(--ds-color-surface);">
      <ds-page-toolbar title="Events" :count="106">
        <template #search>
          <div class="row items-center q-gutter-md no-wrap">
            <q-input outlined dense placeholder="Search" style="width:340px" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div class="row items-center q-gutter-sm no-wrap">
              <span class="text-grey-7">Sort By</span>
              <q-select v-model="sort" :options="['Earliest Start Date','Latest Start Date','Name']" outlined dense style="width:200px" hide-bottom-space />
            </div>
          </div>
        </template>
        <template #actions>
          <q-btn outline no-caps color="primary" label="Filter" />
          <q-btn-dropdown split unelevated no-caps color="primary" label="New Event">
            <q-list><q-item clickable v-close-popup><q-item-section>Import Events</q-item-section></q-item></q-list>
          </q-btn-dropdown>
        </template>
        <template #filters>
          <span class="text-grey-7">Filter by:</span>
          <q-chip removable dense color="grey-3" text-color="dark">From: Tue, 07/07/2026</q-chip>
        </template>
      </ds-page-toolbar>
    </div>

    <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <div class="column q-gutter-md">
        <div v-for="(e, i) in events" :key="e.title"
          style="display:flex; gap:24px; padding:24px 28px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <ds-thumbnail size="xl" fit="contain" :src="eventLogos[i % eventLogos.length]" />
          <div style="flex:1 1 40%; min-width:0;">
            <div class="row items-center q-gutter-sm">
              <a href="#" class="text-primary" style="text-decoration:none; font-size:1.25rem; font-weight:700;" @click.prevent>{{ e.title }}</a>
              <ds-status variant="pill" :label="e.status" />
            </div>
            <div style="color:var(--ds-color-text-subtle); margin:4px 0 8px;">{{ e.location }}</div>
            <div v-for="m in [['Event Producer:', e.producer],['Start/End Dates:', e.dates],['Earliest Group Release Date:', e.release],['Latest Hotel Cutoff:', e.cutoff]]" :key="m[0]"
              style="display:flex; gap:6px; font-size:0.9375rem; margin-top:2px;">
              <span style="font-weight:700; color:var(--ds-color-text);">{{ m[0] }}</span>
              <span style="color:var(--ds-color-text-subtle);">{{ m[1] }}</span>
            </div>
          </div>
          <div style="flex:1 1 40%; display:grid; grid-template-columns:repeat(3,1fr); gap:16px 24px; align-content:start;">
            <ds-stat :value="e.stats.peak" label="Available on Peak" />
            <ds-stat :value="e.stats.res" label="Total Reservations" />
            <ds-stat :value="e.stats.unconf" label="Unconf. Reservations" />
            <ds-stat :value="e.stats.nights" label="Nights Booked" />
            <ds-stat :value="e.stats.blocks" label="Total Group Blocks" />
            <ds-stat :value="e.stats.pending" label="Pending Changes/Cxls" />
          </div>
          <div style="flex:none; display:flex; flex-direction:column; align-items:flex-end; justify-content:space-between;">
            <a href="#" class="row items-center text-primary" style="text-decoration:none; font-size:0.875rem; gap:4px;" @click.prevent><q-icon name="star_border" size="18px" />Favorite</a>
            <q-btn flat round dense icon="more_horiz" color="grey-7" />
          </div>
        </div>
      </div>
    </div>`,
})
Events.storyName = 'Events'
Events.parameters = { layout: 'fullscreen' }

const evMeta = [
  { label: 'City/State:', value: 'Bend, OR' },
  { label: 'Room Night Goal:', value: '1,200' },
  { label: 'Account Manager:', value: 'Alex Rivera' },
  { label: 'Event Producer:', value: 'Cascade Sports Group' },
  { label: 'Peak Night Goal:', value: '600' },
  { label: 'Stay to Play:', value: 'True' },
  { label: 'Start/End Dates:', value: 'Fri, 07/24/2026 - Sun, 07/26/2026' },
]
const evTabs = ['Hotels', 'RFPs', 'Venues', 'Notes', 'Groups', 'Reservations', 'Waitlist', 'Pickup', 'Registration', 'Customize', 'Activity Logs']
const evMoreMenu = [
  'Admin Booking Site', 'Admin Private Booking Site', 'Admin Comp Booking Site',
  'Guest Booking Site', 'Event Producer Info', 'Delete Event',
  'Enable Customer Changes', 'Send Pre Arrival Emails', 'Create Inventory Request',
]
const evReservations = [
  { name: 'Anderson, Mark', phone: '(541) 382-1100', email: 'manderson@example.com', reservedOn: 'Sun, 01/04/2026 07:53 PM', origin: 'Contracted',
    hotel: 'Riverhouse on the Deschutes', addr: '3075 N Business 97, Bend, OR 97703', room: 'Two Queen Beds', dates: 'Thu, 07/23/2026 - Sun, 07/26/2026',
    conf: '40944890', confEdit: false, pipe: 'R-05146302', status: 'Canceled', tone: 'danger' },
  { name: 'Nguyen, Lisa', phone: '(541) 388-4000', email: 'lnguyen@example.com', reservedOn: 'Mon, 01/05/2026 08:16 PM', origin: 'Contracted',
    hotel: 'The Oxford Hotel Bend', addr: '10 NW Minnesota Ave, Bend, OR 97701', room: 'Two Queen Beds', dates: 'Wed, 07/22/2026 - Sun, 07/26/2026',
    conf: '88383943', confEdit: true, pipe: 'R-05150380', status: 'Processed', tone: 'success' },
  { name: 'Patel, Raj', phone: '(541) 317-8500', email: 'rpatel@example.com', reservedOn: 'Mon, 01/05/2026 09:56 PM', origin: 'Contracted',
    hotel: 'Hampton Inn & Suites Bend', addr: '730 SW Columbia St, Bend, OR 97702', room: 'Two Double Beds', dates: 'Thu, 07/23/2026 - Sun, 07/26/2026',
    conf: '3509745616', confEdit: true, pipe: 'R-05150889', status: 'Processed', tone: 'success' },
  { name: 'Thompson, Sarah', phone: '(541) 330-5000', email: 'sthompson@example.com', reservedOn: 'Mon, 01/05/2026 11:10 PM', origin: 'Contracted',
    hotel: 'SpringHill Suites Bend', addr: '551 SW Industrial Way, Bend, OR 97702', room: 'Two Double Beds', dates: 'Wed, 07/22/2026 - Sun, 07/26/2026',
    conf: '3499195314', confEdit: true, pipe: 'R-05151271', status: 'Processed', tone: 'success' },
  { name: 'Garcia, Miguel', phone: '(541) 382-8282', email: 'mgarcia@example.com', reservedOn: 'Wed, 01/07/2026 03:33 AM', origin: 'Contracted',
    hotel: 'DoubleTree by Hilton Bend', addr: '300 NW Franklin Ave, Bend, OR 97701', room: 'Two Queen Beds', dates: 'Wed, 07/22/2026 - Mon, 07/27/2026',
    conf: '71427560', confEdit: true, pipe: 'R-05158005', status: 'Processed', tone: 'success' },
  { name: 'Wilson, Emily', phone: '(541) 388-8000', email: 'ewilson@example.com', reservedOn: 'Wed, 01/07/2026 10:50 AM', origin: 'Contracted',
    hotel: 'Hilton Garden Inn Bend', addr: '425 SW Bluff Dr, Bend, OR 97702', room: 'Two Double Beds', dates: 'Thu, 07/23/2026 - Sun, 07/26/2026',
    conf: '', confEdit: false, pipe: 'R-05158604', status: 'Pending Cxl', tone: 'danger' },
]

export const EventDetailReservations = page({
  active: 'events',
  org: 'Team Travel Source (TTS)',
  user: 'Justin Girard',
  components: { DsPageHeader, DsInfoGrid, DsPageToolbar, DsStatus },
  setup: () => ({
    meta: evMeta, eventTabs: evTabs, reservations: evReservations, moreMenu: evMoreMenu,
    tab: ref('reservations'), sortField: ref('Create Date'), sortDir: ref('9-0 / Z-A'),
    bulkEditHref: `/?path=/story/${STORY_BASE}--prototype`,
  }),
  slot: `
    <div style="padding:22px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
      <ds-page-header title="Bend Premier Cup | 2026">
        <template #breadcrumb>
          <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2">
            <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
            <q-breadcrumbs-el label="Events" />
            <q-breadcrumbs-el label="Bend Premier Cup | 2026" class="text-grey-6" />
          </q-breadcrumbs>
        </template>
        <template #badge>
          <q-btn dense no-caps unelevated color="positive" text-color="white" class="q-px-sm" style="border-radius:6px;">
            Active <q-icon name="arrow_drop_down" size="20px" />
          </q-btn>
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
                <q-item clickable v-close-popup tag="a" :href="bulkEditHref" target="_top">
                  <q-item-section class="text-primary" style="font-weight:600;">Bulk Reservation Edit</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template #meta><ds-info-grid :items="meta" min-col-width="300px" label-width="150px" /></template>
        <template #tabs>
          <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left"
            class="text-grey-7" mobile-arrows outside-arrows>
            <q-tab v-for="t in eventTabs" :key="t" :name="t.toLowerCase().replace(/ /g,'-')" :label="t" />
          </q-tabs>
        </template>
      </ds-page-header>
    </div>

    <div style="padding:20px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
      <ds-page-toolbar title="Reservations">
        <template #search>
          <div style="display:flex; align-items:center; gap:16px; flex-wrap:nowrap;">
            <q-input outlined dense bg-color="white" placeholder="Search" style="width:300px" hide-bottom-space>
              <template #append><q-icon name="search" /></template>
            </q-input>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:nowrap;">
              <span class="text-grey-7" style="white-space:nowrap;">Sort By</span>
              <q-select v-model="sortField" :options="['Create Date','Guest Name','Hotel','Check-In Date']" outlined dense bg-color="white" style="width:160px" hide-bottom-space />
              <q-select v-model="sortDir" :options="['9-0 / Z-A','0-9 / A-Z']" outlined dense bg-color="white" style="width:140px" hide-bottom-space />
            </div>
          </div>
        </template>
        <template #actions>
          <q-btn unelevated no-caps color="primary" label="Export" />
          <q-btn-dropdown outline no-caps color="primary" label="Filters">
            <q-list style="min-width:200px">
              <q-item clickable v-close-popup><q-item-section>Status</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section>Hotel</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section>Origin</q-item-section></q-item>
              <q-item clickable v-close-popup><q-item-section>Check-In Date</q-item-section></q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
      </ds-page-toolbar>

      <div class="column q-gutter-md" style="margin-top:16px;">
        <div v-for="r in reservations" :key="r.pipe"
          style="display:flex; gap:24px; align-items:center; padding:22px 28px; background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
          <div style="flex:1.3 1 0; min-width:0;">
            <a href="#" class="text-primary" style="text-decoration:none; font-weight:700; font-size:1.0625rem;" @click.prevent>{{ r.name }}</a>
            <div class="text-primary" style="font-size:0.8125rem;">{{ r.phone }}</div>
            <div style="font-size:0.875rem; margin-top:8px;"><span style="font-weight:700;">Email:</span> <span class="text-grey-8">{{ r.email }}</span></div>
            <div style="font-size:0.875rem;"><span style="font-weight:700;">Reserved On:</span> <span class="text-grey-8">{{ r.reservedOn }}</span></div>
            <div style="font-size:0.875rem;"><span style="font-weight:700;">Origin:</span> <span class="text-grey-8">{{ r.origin }}</span></div>
          </div>
          <div style="align-self:stretch; width:1px; flex:none; background:var(--ds-color-border-container);"></div>
          <div style="flex:1.5 1 0; min-width:0;">
            <div style="font-weight:700; color:var(--ds-color-text);">{{ r.hotel }}</div>
            <div class="text-grey-6" style="font-size:0.8125rem;">{{ r.addr }}</div>
            <div style="font-size:0.875rem; margin-top:8px;"><span style="font-weight:700;">Room Type:</span> <span class="text-grey-8">{{ r.room }}</span></div>
            <div style="font-size:0.875rem;"><span style="font-weight:700;">Check In/Out Date:</span> <span class="text-grey-8">{{ r.dates }}</span></div>
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
            <ds-status variant="pill" :label="r.status" :tone="r.tone" />
          </div>
        </div>
      </div>
    </div>`,
})
EventDetailReservations.storyName = '6-reservations'
EventDetailReservations.parameters = { layout: 'fullscreen' }
