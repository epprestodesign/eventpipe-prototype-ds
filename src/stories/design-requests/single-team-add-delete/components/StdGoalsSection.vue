<script setup>
// Goals & Restrictions — production's layout (11/09 capture): three blocks,
// each a grey caption, then Calculated | Override. Shown in both modes (11/09
// review: overrides can be set while adding a team). In create mode nothing is
// calculated yet, so Calculated reads "—" until the first save.
import { computed } from 'vue'
import DsSelect from '../../../../components/DsSelect.vue'

const form = defineModel('form', { type: Object, required: true })
const props = defineProps({
  /** edit: the saved team, for the calculated values. */
  team: { type: Object, default: null },
})
const STATUS = ['No Override', 'Compliant', 'Non-Compliant', 'Exempt', 'Local', 'Not Coming']
const CALC_STATUS = { Need: 'In Progress', Compliant: 'Compliant', Exempt: 'Exempt', 'Not Coming': 'Not Coming', Local: 'Local' }
const calc = computed(() => (props.team
  ? { status: CALC_STATUS[props.team.status] || props.team.status, goal: `${props.team.goal} Room Nights`, blocks: '0' }
  : { status: '—', goal: '—', blocks: '—' }))
const ROWS = [
  { key: 'status', label: 'Compliance Status', field: 'statusOverride' },
  { key: 'goal', label: 'Compliance Goal', field: 'goalOverride' },
  { key: 'blocks', label: 'Room Block Restrictions', field: 'blockOverride' },
]
</script>

<template>
  <div class="stdg">
    <div v-for="r in ROWS" :key="r.key" class="stdg__block">
      <div class="stdg__cap">{{ r.label }}</div>
      <div class="stdg__grid">
        <div class="stdg__sub">Calculated</div>
        <div class="stdg__sub">Override</div>
        <div class="stdg__val">{{ calc[r.key] }}</div>
        <div v-if="r.key === 'status'" class="stdg__select" :data-field="r.field">
          <ds-select v-model="form[r.field]" :options="STATUS" />
        </div>
        <q-input v-else v-model="form[r.field]" outlined dense hide-bottom-space type="number" :data-field="r.field"
          class="stdg__num" :aria-label="`${r.label} override`" />
      </div>
    </div>
    <div v-if="!team" class="stdg__hint">Calculated values appear after the first save.</div>
  </div>
</template>

<style scoped>
.stdg__block + .stdg__block { margin-top: 14px; }
.stdg__cap { font-size: 0.875rem; color: var(--ds-color-text-subtle); margin-bottom: 10px; }
.stdg__grid { display: grid; grid-template-columns: 200px 160px; gap: 8px 20px; align-items: center; }
.stdg__sub { font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.stdg__val { font-size: 0.9375rem; color: var(--ds-color-text); }
.stdg__select { width: 150px; }
.stdg__num { width: 64px; }
.stdg__hint { margin-top: 12px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
</style>
