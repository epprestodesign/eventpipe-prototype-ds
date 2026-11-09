<script setup>
// Registered Team Selection — rebuilt from the TTS production capture: a box
// with the groups icon and the picked team; its menu opens with a Search…
// field, then the event's registered teams grouped under their organization.
//
// Review-only: with Autofill's Click to fill on, clicking the empty box picks
// the suggested team instead of opening the menu.
import { computed, ref } from 'vue'
import { displayName } from '../_std'

const props = defineProps({
  modelValue: { type: String, default: null },
  teams: { type: Array, default: () => [] },
  error: { type: String, default: '' },
  /** Click to fill: the team to pick on click, when on. */
  clickFill: { type: Boolean, default: false },
  suggest: { type: String, default: null },
  ariaLabel: { type: String, default: 'Registered team' },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const query = ref('')
const picked = computed(() => props.teams.find((t) => t.id === props.modelValue))
const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  const byOrg = new Map()
  for (const t of [...props.teams].sort((a, b) => displayName(a).localeCompare(displayName(b)))) {
    const org = t.org || displayName(t)
    if (q && !displayName(t).toLowerCase().includes(q) && !org.toLowerCase().includes(q)) continue
    if (!byOrg.has(org)) byOrg.set(org, [])
    byOrg.get(org).push(t)
  }
  return [...byOrg.entries()].sort(([a], [b]) => a.localeCompare(b))
})

function onClick() {
  if (props.clickFill && !props.modelValue && props.suggest) { emit('update:modelValue', props.suggest); return }
  open.value = !open.value
}
function choose(t) { emit('update:modelValue', t.id); open.value = false; query.value = '' }
</script>

<template>
  <div class="stdtp">
    <button type="button" class="stdtp__box" :class="{ 'is-open': open, 'is-error': !!error }" :aria-label="ariaLabel"
      aria-haspopup="listbox" :aria-expanded="open" @click="onClick">
      <q-icon name="groups" size="22px" class="stdtp__icon" />
      <span class="stdtp__value">{{ picked ? displayName(picked) : '' }}</span>
      <q-icon name="arrow_drop_down" size="24px" class="stdtp__caret" />
      <q-menu v-model="open" no-parent-event fit :offset="[0, 4]" class="stdtp__menu" @hide="query = ''">
        <div class="stdtp__search">
          <q-input v-model="query" dense outlined autofocus placeholder="Search…" aria-label="Search teams">
            <template #append><q-icon name="search" /></template>
          </q-input>
        </div>
        <q-list role="listbox" class="stdtp__list">
          <template v-for="[org, list] in groups" :key="org">
            <q-item-label header class="stdtp__org">{{ org }}</q-item-label>
            <q-item v-for="t in list" :key="t.id" v-close-popup clickable role="option" :active="t.id === modelValue"
              active-class="stdtp__active" class="stdtp__team" @click="choose(t)">
              <q-item-section>{{ displayName(t) }}</q-item-section>
            </q-item>
          </template>
          <div v-if="!groups.length" class="stdtp__empty">No registered teams match “{{ query }}”.</div>
        </q-list>
      </q-menu>
    </button>
    <div v-if="error" class="stdtp__error" role="alert">{{ error }}</div>
  </div>
</template>

<style scoped>
.stdtp__box {
  display: flex; align-items: center; gap: 10px; width: 100%; min-height: 44px; padding: 0 8px 0 14px;
  border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-sm); background: var(--ds-color-surface);
  font: inherit; color: var(--ds-color-text); text-align: left; cursor: pointer;
}
.stdtp__box:hover { border-color: var(--ds-color-text-subtle); }
.stdtp__box.is-open, .stdtp__box:focus-visible { outline: none; border-color: var(--q-primary); box-shadow: 0 0 0 1px var(--q-primary); }
.stdtp__box.is-error { border-color: var(--ds-color-border-danger, var(--q-negative)); box-shadow: 0 0 0 1px var(--ds-color-border-danger, var(--q-negative)); }
.stdtp__icon { color: var(--ds-color-text); flex: none; }
.stdtp__value { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.9375rem; }
.stdtp__caret { color: var(--ds-color-text); flex: none; }
.stdtp__error { margin-top: 6px; font-size: 0.8125rem; color: var(--ds-color-text-danger, var(--q-negative)); }
</style>

<style>
/* q-menu is teleported, so its styles can't be scoped. */
.stdtp__menu { min-width: 340px !important; max-height: 420px; }
.stdtp__menu .stdtp__search { padding: 8px; border-bottom: 1px solid var(--ds-color-border); position: sticky; top: 0; background: var(--ds-color-surface); z-index: 1; }
.stdtp__menu .stdtp__org { padding: 14px 16px; font-size: 0.9375rem; font-weight: 600; color: var(--ds-color-text); background: var(--ds-color-surface-sunken); }
.stdtp__menu .stdtp__team { padding-left: 32px; font-size: 0.9375rem; min-height: 44px; }
.stdtp__menu .stdtp__active { color: var(--q-primary); font-weight: 600; }
.stdtp__menu .stdtp__empty { padding: 16px; font-size: 0.875rem; color: var(--ds-color-text-subtle); }
</style>
