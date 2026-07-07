<script setup>
// DsPersonalizationMenu — the searchable, grouped merge-token picker used by the
// email editor. Emits `select` with the token name. Reused by the toolbar
// "Personalization" button AND the inline `{{` trigger. Exposes focus()/reset().
import { ref, computed } from 'vue'

const DEFAULT_TOKENS = [
  { group: 'Guest Information', items: [
    { name: 'Guest First Name', desc: 'Inserts the first name of the guest who made the reservation. This personalizes the email.' },
    { name: 'Guest Last Name', desc: 'Inserts the last name of the guest who made the reservation. Helps with full identification in the message.' },
  ] },
  { group: 'Reservation Details', items: [
    { name: 'Check-In Date', desc: 'Displays the scheduled date when the guest is expected to arrive at the hotel.' },
    { name: 'Check-Out Date', desc: 'Displays the scheduled date when the guest is expected to depart from the hotel.' },
  ] },
  { group: 'Event Details', items: [
    { name: 'Event Name', desc: "Inserts the name of the event associated with the guest's reservation, ensuring clarity on which event they booked accommodations for." },
    { name: 'Event Start Date', desc: "Displays the start date of the event, providing context for the guest's stay." },
    { name: 'Event End Date', desc: 'Displays the end date of the event, helping guests plan their departure.' },
  ] },
  { group: 'Support & Contact Information', items: [
    { name: 'Housing Company Support Hours', desc: 'Inserts the support hours for the housing company, so guests know when customer service is available.' },
    { name: 'Housing Company Customer Service Phone Number', desc: 'Provides the direct phone number for customer service, making it easy for guests to reach out with questions or concerns.' },
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
    .map((g) => ({ group: g.group, items: g.items.filter((it) => !q || it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length)
})

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
        <q-item v-for="it in g.items" :key="it.name" clickable @click="emit('select', it.name)">
          <q-item-section>
            <q-item-label class="dspm__name">{{ it.name }}</q-item-label>
            <q-item-label caption lines="2">{{ it.desc }}</q-item-label>
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
</style>
