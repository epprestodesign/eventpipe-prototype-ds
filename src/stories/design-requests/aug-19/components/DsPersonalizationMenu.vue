<script setup>
// DsPersonalizationMenu — the searchable, grouped merge-token picker used by the
// email editor. Emits `select` with the token KEY (e.g. `event_name`), which the
// editor wraps as `{{event_name}}`. Reused by the toolbar "Personalization"
// button AND the inline `{{` trigger. Exposes focus()/reset().
// Token list: Teams Management merge fields per DES-430 (P0-6).
import { ref, computed } from 'vue'

// Teams Management merge fields — the minimum set defined by DES-430 (P0-6).
// `name` is the human label shown in the menu; `token` is what actually gets
// inserted into the template, so the prototype matches the spec verbatim.
const DEFAULT_TOKENS = [
  { group: 'Event Information', items: [
    { name: 'Event Name', token: 'event_name', desc: 'Inserts the name of the event.' },
    { name: 'Event Start Date', token: 'event_start_date', desc: 'The start date of the event.' },
    { name: 'Event End Date', token: 'event_end_date', desc: 'The end date of the event.' },
    { name: 'Event Logo', token: 'event_logo', desc: 'Inserts the event logo image.' },
    { name: 'Booking Link', token: 'booking_link', desc: 'The event booking link teams use to reserve rooms.' },
  ] },
  { group: 'Team Information', items: [
    { name: 'Team / Org Name', token: 'entity_name', desc: "Team or Org name, depending on the event's Compliance Entity setting." },
    { name: 'Team Contact Name', token: 'team_contact_name', desc: 'Name of the Team Housing Contact.' },
    { name: 'Team Contact Phone', token: 'team_contact_phone', desc: 'Phone number of the Team Housing Contact.' },
    { name: 'Team Contact Email', token: 'team_contact_email', desc: 'Email address of the Team Housing Contact.' },
    { name: 'Group Block Info', token: 'team_group_block_info', desc: 'Lists each open group block — name, number of reservations, release date and booking link. Falls back to “You have no open group blocks at this time.”' },
  ] },
  { group: 'Compliance Information', items: [
    { name: 'Compliance Criteria', token: 'compliance_criteria', desc: 'Returns either “room nights” or “reservations”, depending on the event compliance setting.' },
    { name: 'Compliance Goal', token: 'compliance_goal', desc: 'Number of room nights or reservations required for compliance.' },
    { name: 'Booked to Date', token: 'compliance_progress_booked', desc: 'Number of room nights or reservations the team has booked.' },
    { name: 'Remaining to Goal', token: 'compliance_progress_remaining', desc: 'Number the team must still book to reach their goal.' },
    { name: 'Non-Compliance Policy', token: 'noncompliance_policy', desc: 'The event’s non-compliance policy text. Requires the event-level policy field (P1-3); returns nothing when left empty.' },
  ] },
  { group: 'Key Dates', items: [
    { name: 'Last Cutoff Date', token: 'last_cutoff_date', desc: 'The last EventHotel cutoff date for this event.' },
    { name: 'Days Until Event', token: 'days_until_event', desc: 'Days remaining until the event starts.' },
    { name: 'Days Until Cutoff', token: 'days_until_cutoff', desc: 'Days until the last EventHotel cutoff date.' },
  ] },
  { group: 'Hoco Contact Information', items: [
    { name: 'Event Manager Name', token: 'event_manager_name', desc: 'Name of the Event Manager.' },
    { name: 'Event Manager Email', token: 'event_manager_email', desc: 'Email address of the Event Manager.' },
    { name: 'TM Comms Email', token: 'tm_comms_email', desc: 'The Teams Management Communications From/Reply email.' },
    { name: 'Customer Service Email', token: 'event_cs_email', desc: 'Customer service email for the event. Respects the event-level override.' },
    { name: 'Customer Service Phone', token: 'event_cs_phone', desc: 'Customer service phone number for the event. Respects the event-level override.' },
  ] },
]

const props = defineProps({ tokens: { type: Array, default: () => [] } })
const emit = defineEmits(['select'])

const searchRef = ref(null)
const search = ref('')
const typeFilter = ref('All types')
const allTokens = computed(() => (props.tokens.length ? props.tokens : DEFAULT_TOKENS))
const types = computed(() => ['All types', ...allTokens.value.map((g) => g.group)])
const filteredGroups = computed(() => {
  const q = search.value.trim().toLowerCase()
  return allTokens.value
    .filter((g) => typeFilter.value === 'All types' || g.group === typeFilter.value)
    .map((g) => ({ group: g.group, items: g.items.filter((it) => !q || it.name.toLowerCase().includes(q) || (it.token || '').toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length)
})

// Built in script, not the template: a literal `{{` inside an interpolation
// closes the delimiter early and fails to compile.
const OPEN = '{' + '{'
const CLOSE = '}' + '}'
function tokenLabel(token) { return OPEN + token + CLOSE }

function reset() { search.value = ''; typeFilter.value = 'All types' }
function focus() { searchRef.value?.focus?.() }
defineExpose({ reset, focus })
</script>

<template>
  <div class="dspm">
    <q-input ref="searchRef" v-model="search" outlined dense placeholder="Search personalization" hide-bottom-space class="q-mb-sm">
      <template #prepend><q-icon name="search" /></template>
    </q-input>
    <q-select v-model="typeFilter" :options="types" outlined dense hide-bottom-space class="q-mb-sm" />
    <q-list class="dspm__list">
      <template v-for="g in filteredGroups" :key="g.group">
        <q-item-label header class="dspm__header">{{ g.group }}</q-item-label>
        <q-item v-for="it in g.items" :key="it.name" clickable @click="emit('select', it.token || it.name)">
          <q-item-section>
            <q-item-label class="dspm__name">{{ it.name }}</q-item-label>
            <q-item-label v-if="it.token" class="dspm__token">{{ tokenLabel(it.token) }}</q-item-label>
            <q-item-label caption lines="3">{{ it.desc }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <q-item v-if="!filteredGroups.length"><q-item-section class="text-grey-6">No matches</q-item-section></q-item>
    </q-list>
  </div>
</template>

<style scoped>
.dspm { width: 360px; padding: 12px; background: var(--ds-color-surface); }
.dspm__list { max-height: 340px; overflow: auto; }
.dspm__header { color: var(--ds-color-text-subtle); font-weight: 700; font-size: 0.75rem; text-transform: none; padding-top: 12px; }
.dspm__name { font-weight: 700; }
.dspm__token {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: var(--ds-color-text-brand);
  margin-top: 1px;
}
</style>
