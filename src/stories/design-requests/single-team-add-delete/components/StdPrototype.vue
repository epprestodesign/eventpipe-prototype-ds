<script setup>
// The connected prototype — every end-user step of P-ENG2-251 in one journey:
//
//   Compliance ─ Add/Update Teams ▾ ─ Add single team ─ Team Edit (create)
//     STA-1          STA-1                STA-2 · STA-3 · STA-4
//   ─ Save ─ Team Edit (normal, auto note) ─ Delete Team ─ modal ─ Delete
//            STA-3 · STA-5 (· STA-6 stored)    STD-1         STD-2   STD-3
//   ─ Compliance + success message ─ event Activity Logs entry
//     STD-3                           STD-4 (· STD-5 BigQuery, no UI)
//   ─ event Reconciliation (Reconciliation tab row, or View in Reconciliation)
//     STD-3: the deleted team's blocks and reservations wait here
//
// The review bar above the app is Storybook-only: it names the tickets the
// current screen covers and switches the event's Registered Entity, which is
// what changes "Team" to "Organization" (STD-2, STD-4). Its Autofill controls
// fill the create form — field by field on click, or all at once from a preset —
// to review filled and error states without typing.
import { computed, nextTick, provide, reactive, ref } from 'vue'
import { Notify } from 'quasar'
import AppShell from '../../../../components/AppShell.vue'
import StdComplianceScreen from './StdComplianceScreen.vue'
import StdTeamEditScreen from './StdTeamEditScreen.vue'
import StdActivityLogsScreen from './StdActivityLogsScreen.vue'
import StdReconciliationScreen from './StdReconciliationScreen.vue'
import {
  COMPANY, USER, STD_NAV, EVENTS, TICKETS, FILL_PRESETS, RECON_PRESETS, seedTeams, emptyFilters, singleEventId, seedActivity, autoNote, deletedBlurb,
  displayName, entityWord, eventById, nowStamp, seedRecon, orphansOf,
} from '../_std'

const props = defineProps({
  /** Where the prototype opens: compliance | create | team | delete | deleted | log | recon | recon-res | recon-deleted */
  start: { type: String, default: 'compliance' },
  /** An event id to filter the Compliance list to on load (its Event Name
   *  filter picks that event — STA-2 then preselects it). */
  filter: { type: String, default: '' },
  /** Registered Entity for every event on load: Team | Organization. */
  entity: { type: String, default: '' },
  /** Open create mode with the empty-Save errors showing. */
  showErrors: { type: Boolean, default: false },
  /** Show the Storybook review bar. */
  review: { type: Boolean, default: true },
  /** Start with Click to fill on. */
  clickFill: { type: Boolean, default: false },
  /** Delete Team placement: menu (C, the design) | button (A) | save (B) | bottom (D). */
  deletePlacement: { type: String, default: 'menu' },
})

const DELETE_TEAM = 't4' // Augusta Lions GA 13/14 — the team the review states delete
// The review bar's Registered Entity applies to every event, so what the bar
// shows and what the screens say always agree.
const events = reactive(EVENTS.map((e) => ({ ...e, entity: props.entity || 'Team' })))
const teams = reactive(seedTeams())
const activity = reactive(Object.fromEntries(EVENTS.map((e) => [e.id, seedActivity()])))
const notes = reactive({})
const recon = reactive(seedRecon())
const recTab = ref('blocks')
const route = ref({ name: 'compliance' })
const filtersFor = () => emptyFilters(props.filter ? { eventId: props.filter } : {})
const filters = ref(filtersFor())
const compTab = ref('compliance')
/** STA-2: the event Add single team preselects, from the list's filters. */
const preselect = computed(() => singleEventId(teams, events, filters.value))
const flash = ref(null)
const revision = ref(0)
const entityChoice = ref(props.entity || 'Team')
const placement = ref(props.deletePlacement)
const PLACEMENTS = [
  { label: 'A', value: 'button', slot: 'button', title: 'A · Trash-can button in the header' },
  { label: 'B', value: 'save', slot: 'save', title: 'B · Trash beside Cancel / Save Changes' },
  { label: 'C', value: 'menu', slot: 'menu', title: 'C · ••• menu in the header' },
  { label: 'D', value: 'bottom', slot: 'bottom', title: 'D · Section at the bottom of the page' },
]

const evt = (id) => events.find((e) => e.id === id) || eventById(id)
const word = (eventId) => entityWord(evt(eventId))
const teamById = (id) => teams.find((t) => t.id === id)

function go(name, extra = {}) { route.value = { name, ...extra } }

/* Autofill (review-only). Team Edit's create form injects this: `click` turns
   Click to fill on; bumping `seq` applies `preset` to the whole form. */
const autofill = reactive({ click: props.clickFill, preset: null, seq: 0 })
provide('stdAutofill', autofill)
const onRecon = computed(() => route.value.name === 'recon')
const presets = computed(() => (onRecon.value ? RECON_PRESETS : FILL_PRESETS))
async function fill(key) {
  if (!onRecon.value && route.value.name !== 'create') { go('create'); await nextTick() }
  autofill.preset = key
  autofill.seq++
}

function onCreated(f) {
  const id = 'n' + Date.now()
  // A brand-new team has booked nothing, so it needs the event's full goal.
  const goal = evt(f.eventId)?.defaultGoal ?? 0
  teams.push({ ...f, id, status: goal ? 'Need' : 'Compliant', need: goal, goal, reservations: 0, resBlocks: 0, nights: 0, nightsBlocks: 0,
    openBlocks: 0, peakAvail: 0, notes: 1, source: 'Manual' })
  notes[id] = [{ title: 'Team added', body: autoNote(USER), added: nowStamp(), author: USER }]
  Notify.create({ message: `${displayName(f)} added`, icon: 'check_circle', timeout: 2200 })
  go('team', { teamId: id })
}
function onDeleted(t) {
  const i = teams.findIndex((x) => x.id === t.id)
  if (i > -1) teams.splice(i, 1)
  const w = word(t.eventId)
  // STD-3: what was linked to this team now waits in Reconciliation.
  const r = recon[t.eventId]
  const orphans = orphansOf(t, r.blocks.length + r.res.length)
  r.blocks.unshift(...orphans.filter((o) => o.kind === 'block'))
  r.res.unshift(...orphans.filter((o) => o.kind === 'res'))
  syncCounts(t.eventId)
  activity[t.eventId].unshift({ when: nowStamp(), user: USER, text: deletedBlurb(w, displayName(t)) })
  flash.value = { text: `${w} ‘${displayName(t)}’ was deleted.`, eventId: t.eventId }
  compTab.value = 'compliance'
  go('compliance')
}
/** The Reconciliation tab's counts are the event's cards. */
function syncCounts(eventId) {
  const e = evt(eventId)
  if (e) { e.unlinkedBlocks = recon[eventId].blocks.length; e.unlinkedRes = recon[eventId].res.length }
}
function dropCard(eventId, item) {
  const arr = recon[eventId][item.kind === 'block' ? 'blocks' : 'res']
  const i = arr.findIndex((x) => x.id === item.id)
  if (i > -1) arr.splice(i, 1)
  syncCounts(eventId)
}
function openRecon(eventId, tab = 'blocks') {
  recTab.value = tab === 'blocks' && !recon[eventId].blocks.length && recon[eventId].res.length ? 'res' : tab
  go('recon', { eventId })
}
/** Link: the card leaves Reconciliation and its nights count toward the team. */
function onLink({ item, teamId }) {
  const t = teamById(teamId)
  if (t) {
    t.nights += item.nights
    if (item.kind === 'block') t.nightsBlocks += 1
    else t.reservations += 1
    if (t.status === 'Need') { t.need = Math.max(0, t.need - item.nights); if (!t.need) t.status = 'Compliant' }
  }
  dropCard(route.value.eventId, item)
  Notify.create({ message: `${item.name} linked to ${t ? displayName(t) : 'team'}`, icon: 'link', timeout: 2200 })
}
function onIgnore({ item }) {
  dropCard(route.value.eventId, item)
  Notify.create({ message: `${item.name} ignored`, icon: 'block', timeout: 2200 })
}
function onNavigate(key) {
  if (key === 'compliance') go('compliance')
  if (key === 'events') go('log', { eventId: preselect.value || 'evt-east' })
}

/** Rebuild everything from the seeds — Restart, and the entity switch. */
function reset(startAt = props.start) {
  events.splice(0, events.length, ...EVENTS.map((e) => ({ ...e, entity: entityChoice.value })))
  teams.splice(0, teams.length, ...seedTeams())
  Object.keys(notes).forEach((k) => delete notes[k])
  for (const e of EVENTS) activity[e.id] = seedActivity()
  Object.assign(recon, seedRecon())
  recTab.value = 'blocks'
  filters.value = filtersFor()
  compTab.value = 'compliance'
  flash.value = null
  revision.value++
  applyStart(startAt)
}
function applyStart(s) {
  if (s === 'create') go('create')
  else if (s === 'team' || s === 'delete') go('team', { teamId: DELETE_TEAM, confirm: s === 'delete' })
  else if (s === 'deleted') onDeleted(teamById(DELETE_TEAM))
  else if (s === 'log') { onDeleted(teamById(DELETE_TEAM)); go('log', { eventId: 'evt-east' }) }
  else if (s === 'recon') openRecon('evt-aspire')
  else if (s === 'recon-res') openRecon('evt-aspire', 'res')
  else if (s === 'recon-deleted') { onDeleted(teamById(DELETE_TEAM)); compTab.value = 'reconciliation'; openRecon('evt-east') }
  else go('compliance')
}
applyStart(props.start)

/* The tickets each screen covers — shown in the review bar. */
const STEP_TICKETS = {
  compliance: ['STA-1', 'STA-2'],
  create: ['STA-2', 'STA-3', 'STA-4'],
  team: ['STA-3', 'STA-5', 'STD-1', 'STD-2'],
  log: ['STD-4'],
  recon: ['STD-3'],
}
const stepTickets = computed(() => (route.value.name === 'compliance' && flash.value ? ['STA-1', 'STD-3'] : STEP_TICKETS[route.value.name]))
const STEP_LABEL = { compliance: 'Compliance list', create: 'Team Edit · create mode', team: 'Team Edit', log: 'Event Activity Logs', recon: 'Event Reconciliation' }
const active = computed(() => (route.value.name === 'log' ? 'events' : 'compliance'))
</script>

<template>
  <div class="stdp">
    <aside v-if="review" class="stdp__review" aria-label="Prototype review controls">
      <span class="stdp__brand">Prototype</span>
      <span class="stdp__step">{{ STEP_LABEL[route.name] }}</span>
      <span class="stdp__tickets">
        <q-badge v-for="k in stepTickets" :key="k" outline color="primary" class="stdp__ticket">
          {{ k }} · {{ TICKETS[k].id }}<q-tooltip>{{ TICKETS[k].title }}</q-tooltip>
        </q-badge>
      </span>
      <q-space />
      <span class="stdp__label">Autofill</span>
      <q-toggle v-model="autofill.click" dense size="sm" color="primary" label="Click to fill" class="stdp__click">
        <q-tooltip>Click any empty field to fill it: sample data on the create form, the matching team on Reconciliation</q-tooltip>
      </q-toggle>
      <q-btn-dropdown outline dense no-caps color="primary" icon="bolt" label="Fill" class="stdp__fill"
        menu-anchor="bottom right" menu-self="top right">
        <q-list style="min-width:280px;" class="q-py-xs">
          <q-item-label header class="stdp__menu-head">{{ onRecon ? 'Fill the team selections' : 'Fill the create form' }}</q-item-label>
          <template v-for="pr in presets" :key="pr.key">
            <q-separator v-if="pr.key === 'required' || pr.key === 'missing' || pr.key === 'clear'" class="q-my-xs" />
            <q-item v-close-popup clickable dense @click="fill(pr.key)">
              <q-item-section avatar class="stdp__menu-icon"><q-icon :name="pr.icon" size="18px" /></q-item-section>
              <q-item-section>
                <q-item-label>{{ pr.label }}</q-item-label>
                <q-item-label caption>{{ pr.caption }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-btn-dropdown>
      <q-separator vertical class="stdp__sep" />
      <span class="stdp__label">Entity</span>
      <q-btn-toggle v-model="entityChoice" no-caps unelevated dense toggle-color="primary" class="stdp__toggle"
        :options="[{ label: 'Teams', value: 'Team' }, { label: 'Orgs', value: 'Organization' }]"
        @update:model-value="reset(route.name === 'team' ? 'team' : route.name)" />
      <q-separator vertical class="stdp__sep" />
      <span class="stdp__label">Delete Team</span>
      <q-btn-toggle v-model="placement" no-caps unelevated dense toggle-color="primary" class="stdp__toggle stdp__abc" :options="PLACEMENTS">
        <template v-for="pl in PLACEMENTS" :key="pl.value" #[pl.value]><q-tooltip>{{ pl.title }}</q-tooltip></template>
      </q-btn-toggle>
      <q-btn flat no-caps dense color="primary" icon="restart_alt" label="Restart" @click="reset()" />
    </aside>

    <div :key="revision" class="stdp__app">
      <app-shell :items="STD_NAV" :active="active" :org="COMPANY" :user="USER" bleed @navigate="onNavigate">
        <std-compliance-screen v-if="route.name === 'compliance'" v-model:filters="filters" v-model:tab="compTab"
          :teams="teams" :events="events" :flash="flash"
          @open-reconciliation="(id) => openRecon(id)"
          @open-team="(id) => go('team', { teamId: id })" @add-single="go('create')"
          @upload="Notify.create({ message: 'Opens the Registration Data Uploader (unchanged)', icon: 'upload_file', timeout: 2200 })"
          @dismiss-flash="flash = null" />

        <std-team-edit-screen v-else-if="route.name === 'create'" key="create" mode="create"
          :teams="teams" :events="events" :default-event-id="preselect" :show-errors="showErrors"
          @back="go('compliance')" @created="onCreated" />

        <std-team-edit-screen v-else-if="route.name === 'team' && teamById(route.teamId)" :key="route.teamId" mode="edit"
          :team="teamById(route.teamId)" :events="events" :notes="notes[route.teamId] || []"
          :confirm-open="!!route.confirm" :delete-placement="placement" @back="go('compliance')" @deleted="onDeleted" />

        <std-activity-logs-screen v-else-if="route.name === 'log'" :event="evt(route.eventId)"
          :rows="activity[route.eventId]" @back="go('compliance')" />

        <std-reconciliation-screen v-else-if="route.name === 'recon'" :key="'recon-' + route.eventId" v-model:tab="recTab"
          :event="evt(route.eventId)" :items="recon[route.eventId]" :teams="teams.filter((t) => t.eventId === route.eventId)"
          :review="review" @link="onLink" @ignore="onIgnore" />
      </app-shell>
    </div>
  </div>
</template>

<style scoped>
.stdp { display: flex; flex-direction: column; height: 100vh; }
.stdp__review {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px 14px; padding: 8px 16px;
  background: var(--ds-color-surface-sunken); border-bottom: 1px solid var(--ds-color-border); font-size: 0.875rem;
}
.stdp__brand { font-weight: 700; }
.stdp__step { color: var(--ds-color-text-subtle); }
.stdp__tickets { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.stdp__ticket { padding: 3px 8px; font-size: 0.75rem; font-weight: 600; border-radius: var(--ds-radius-sm); }
.stdp__label { color: var(--ds-color-text-subtle); }
.stdp__toggle { border: 1px solid var(--ds-color-border); }
.stdp__abc :deep(.q-btn) { min-width: 30px; }
.stdp__click { font-size: 0.875rem; }
.stdp__fill { padding: 0 10px; }
.stdp__sep { margin: 0 4px; }
.stdp__menu-head { padding-top: 8px; padding-bottom: 4px; }
.stdp__menu-icon { min-width: 28px; color: var(--ds-color-icon-subtle); }
.stdp__app { flex: 1; min-height: 0; }
.stdp__app :deep(.appshell) { height: 100%; }
</style>
