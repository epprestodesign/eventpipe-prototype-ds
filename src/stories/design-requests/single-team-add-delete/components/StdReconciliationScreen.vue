<script setup>
// An event's Reconciliation page — opened by clicking an event on the
// Compliance page's Reconciliation tab (or "View in Reconciliation" after a
// delete, STD-3). Rebuilt from the TTS production captures: a title, Group
// Blocks (n) | Individual Reservations (n) tabs, then one card per unlinked
// block or reservation with a Registered Team Selection, Link and Ignore.
//
// Draft behaviour: picking a team fills Location / Phone / Email. Link with a
// team picked removes the card (the team gets the nights); Link with none
// picked shows an error on the selection. Ignore removes the card. Cards a
// deleted team left behind are listed first and name that team under
// Unlinked Team Name.
//
// Review-only: `review` labels each edge-case card, and Autofill (injected
// from the prototype) picks teams — on click, or for every card via Fill ▾.
import { computed, inject, reactive, watch } from 'vue'
import DsCard from '../../../../components/DsCard.vue'
import DsStatus from '../../../../components/DsStatus.vue'
import StdTeamPicker from './StdTeamPicker.vue'
import { RECON_PRESETS, suggestTeam, teamContact } from '../_std'

const props = defineProps({
  event: { type: Object, required: true },
  /** { blocks: [], res: [] } for this event. */
  items: { type: Object, required: true },
  /** The event's registered teams (the selection's options). */
  teams: { type: Array, default: () => [] },
  /** blocks | res (v-model:tab). */
  tab: { type: String, default: 'blocks' },
  /** Label each edge-case card (review only). */
  review: { type: Boolean, default: false },
})
const emit = defineEmits(['update:tab', 'link', 'ignore'])

const TONE = { Closed: 'warning', Processed: 'success', Open: 'info', Cancelled: 'danger' }
const MISSING = 'Select a registered team to link.'
const picked = reactive({})
const errors = reactive({})
const teamOf = (itemId) => props.teams.find((t) => t.id === picked[itemId])
const contactOf = (itemId) => {
  const t = teamOf(itemId)
  return t ? teamContact({ ...t, location: t.location || props.event.city }, props.teams.indexOf(t)) : null
}
const list = computed(() => props.items[props.tab] || [])

function pick(item, id) { picked[item.id] = id; delete errors[item.id] }
function link(item) {
  if (!picked[item.id]) { errors[item.id] = MISSING; return }
  emit('link', { item, teamId: picked[item.id] }); delete picked[item.id]
}
function ignore(item) { emit('ignore', { item }); delete picked[item.id]; delete errors[item.id] }

/* Autofill — Fill ▾ presets apply to every card on the open tab. */
const autofill = inject('stdAutofill', null)
const suggestFor = (item) => suggestTeam(item, props.teams)
function applyPreset(key) {
  for (const item of list.value) {
    if (key === 'suggest') { const id = suggestFor(item); if (id) pick(item, id) }
    else if (key === 'missing') { delete picked[item.id]; errors[item.id] = MISSING }
    else if (key === 'clear') { delete picked[item.id]; delete errors[item.id] }
  }
}
if (autofill) {
  watch(() => autofill.seq, () => { if (RECON_PRESETS.some((p) => p.key === autofill.preset)) applyPreset(autofill.preset) })
}
</script>

<template>
  <div class="stdr">
    <h1 class="stdr__title">Reconciliations for {{ event.name }}</h1>
    <q-tabs :model-value="tab" no-caps active-color="primary" indicator-color="primary" align="left"
      class="text-grey-7 stdr__tabs" @update:model-value="(v) => emit('update:tab', v)">
      <q-tab name="blocks" :label="`Group Blocks (${items.blocks.length})`" />
      <q-tab name="res" :label="`Individual Reservations (${items.res.length})`" />
    </q-tabs>

    <div v-if="!list.length" class="stdr__empty">
      Nothing left to reconcile — every {{ tab === 'blocks' ? 'group block' : 'reservation' }} for this event is linked.
    </div>

    <ds-card v-for="item in list" :key="item.id" padding="none" class="stdr__card" :data-item="item.id">
      <div class="stdr__inner">
      <div class="stdr__head">
        <a href="#" class="stdr__name" @click.prevent>{{ item.name }}</a>
        <ds-status variant="pill" :label="item.status" :tone="TONE[item.status] || 'neutral'" />
        <q-space />
        <span v-if="item.kind === 'block'" class="stdr__stat">Registered Teams: <b>{{ item.registeredTeams }}</b></span>
        <span v-if="item.kind === 'block'" class="stdr__stat stdr__stat--sep">Nights Booked: <b>{{ item.nights }}</b></span>
      </div>
      <div v-if="review && (item.edge || item.fromTeam)" class="stdr__edge">
        <q-icon name="science" size="16px" /> Edge case: {{ item.edge || 'Left behind when its team was deleted (STD-3)' }}
      </div>

      <div class="stdr__row">
        <div class="stdr__cell">
          <div class="stdr__label">Unlinked Team Name</div>
          <div class="stdr__value">{{ item.fromTeam || item.unlinkedName || 'None' }}</div>
        </div>
        <div class="stdr__cell stdr__cell--select">
          <div class="stdr__label">Registered Team Selection</div>
          <std-team-picker :model-value="picked[item.id] || null" :teams="teams" :error="errors[item.id] || ''"
            :click-fill="!!autofill?.click" :suggest="suggestFor(item)" :aria-label="`Registered team for ${item.name}`"
            @update:model-value="(id) => pick(item, id)" />
        </div>
        <div class="stdr__cell">
          <div class="stdr__label">Location</div>
          <div class="stdr__value">{{ contactOf(item.id)?.location }}</div>
        </div>
        <div class="stdr__cell">
          <div class="stdr__label">Phone</div>
          <div class="stdr__value">{{ contactOf(item.id)?.phone }}</div>
        </div>
        <div class="stdr__cell">
          <div class="stdr__label">Email</div>
          <div class="stdr__value stdr__email">{{ contactOf(item.id)?.email }}</div>
        </div>
        <div class="stdr__actions">
          <q-btn unelevated color="primary" icon="link" aria-label="Link to the selected team"
            class="stdr__btn" @click="link(item)">
            <q-tooltip>{{ picked[item.id] ? 'Link to the selected team' : 'Select a registered team first' }}</q-tooltip>
          </q-btn>
          <q-btn outline color="negative" icon="block" aria-label="Ignore" class="stdr__btn stdr__btn--ignore" @click="ignore(item)">
            <q-tooltip>Ignore</q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="stdr__foot">
        <span><i>{{ item.kind === 'block' ? 'Group ID' : 'Pipe ID' }}:</i> {{ item.ref }}</span>
        <span v-if="item.kind === 'block'"><i>Contact:</i> {{ item.contact }}, {{ item.phone }}</span>
        <span v-else><i>Contact Phone:</i> {{ item.phone }}</span>
        <span><i>Contact Email:</i> {{ item.email }}</span>
        <span><i>Location:</i> {{ item.location }}</span>
      </div>
      </div>
    </ds-card>
  </div>
</template>

<style scoped>
.stdr { padding: 24px 28px 56px; background: var(--ds-color-surface); min-height: 100%; }
.stdr__title { margin: 0; font-size: 1.75rem; line-height: 1.3; font-weight: 700; letter-spacing: -0.01em; color: var(--ds-color-text); }
.stdr__tabs { margin: 12px 0 24px; border-bottom: 1px solid var(--ds-color-border); }
/* The brand font turns "(4)" into a circled ④ through contextual alternates. */
.stdr__tabs :deep(.q-tab__label) { font-feature-settings: 'calt' 0, 'case' 0; font-variant-ligatures: none; }
.stdr__empty { padding: 32px; text-align: center; color: var(--ds-color-text-subtle); border: 1px dashed var(--ds-color-border); border-radius: var(--ds-radius-lg); }
.stdr__card { margin: 0 0 20px; }
.stdr__inner { padding: 0 28px; }
.stdr__head { display: flex; align-items: center; gap: 14px; padding: 22px 0 18px; border-bottom: 1px solid var(--ds-color-border); }
.stdr__name { font-size: 1.375rem; font-weight: 600; color: var(--ds-color-text-brand, var(--q-primary)); text-decoration: none; }
.stdr__name:hover { text-decoration: underline; }
.stdr__stat { font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.stdr__stat b { font-weight: 600; color: var(--ds-color-text); }
.stdr__stat--sep { padding-left: 14px; border-left: 1px solid var(--ds-color-border); }
.stdr__row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 0.9fr) minmax(0, 0.9fr) minmax(0, 1.2fr) auto; gap: 20px; align-items: start; padding: 28px 0; }
.stdr__label { font-size: 0.9375rem; color: var(--ds-color-text-subtle); margin-bottom: 8px; }
.stdr__value { font-size: 1rem; color: var(--ds-color-text); min-height: 40px; display: flex; align-items: center; }
.stdr__email { overflow-wrap: anywhere; }
.stdr__edge { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 4px 10px; border: 1px dashed var(--ds-color-border-bold); border-radius: var(--ds-radius-sm); font-size: 0.8125rem; color: var(--ds-color-text-subtle); background: var(--ds-color-surface-sunken); }
.stdr__actions { display: flex; gap: 10px; padding-top: 30px; }
.stdr__btn { min-width: 64px; min-height: 42px; }
.stdr__foot { display: flex; flex-wrap: wrap; gap: 6px 20px; padding: 18px 0 22px; border-top: 1px solid var(--ds-color-border); font-size: 0.8125rem; color: var(--ds-color-text); }
.stdr__foot i { font-style: normal; color: var(--ds-color-text-subtle); }
@media (max-width: 1100px) { .stdr__row { grid-template-columns: repeat(2, minmax(0, 1fr)); } .stdr__actions { grid-column: 1 / -1; } }
</style>
