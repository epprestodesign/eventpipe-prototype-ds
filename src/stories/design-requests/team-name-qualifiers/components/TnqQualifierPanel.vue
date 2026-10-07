<script setup>
// TnqQualifierPanel — "Team Name Qualifiers" inside Registration Settings ›
// Booking Site Behavior. A collapsible panel where the admin picks which of the
// company's custom fields qualify a manually entered team name, with a live
// preview of how such a name will read ("Augusta Arsenal · U10 · Boys").
//
// `notApplicable` replaces the panel with the disabled note shown when team
// selection is required for both group blocks and reservations: every guest
// then picks from the registered team list, so no name is ever typed.
import { computed, ref } from 'vue'
import DsLink from '../../../../components/DsLink.vue'
import { QUALIFIER_FIELDS, previewParts } from '../_tnq'

const props = defineProps({
  /** Selected field keys, in any order; the preview follows picker order. */
  modelValue: { type: Array, default: () => [] },
  fields: { type: Array, default: () => QUALIFIER_FIELDS },
  /** Start expanded. */
  open: { type: Boolean, default: false },
  notApplicable: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const expanded = ref(props.open)
const refreshing = ref(false)
const selected = computed(() => props.modelValue)
const parts = computed(() => previewParts(selected.value, props.fields))
const isOn = (key) => selected.value.includes(key)
const optionText = (f) => (f.type === 'text' ? 'Free text input' : f.options.join(', '))
const typeLabel = (f) => (f.type === 'text' ? 'Free text' : 'Dropdown')

function toggle(key, on) {
  const next = on ? [...selected.value, key] : selected.value.filter((k) => k !== key)
  emit('update:modelValue', props.fields.map((f) => f.key).filter((k) => next.includes(k)))
}
function refresh() {
  refreshing.value = true
  setTimeout(() => { refreshing.value = false; emit('refresh') }, 700)
}
</script>

<template>
  <div v-if="notApplicable" class="tnqp tnqp--na">
    <span class="tnqp__na-title">Team Name Qualifiers</span>
    Not applicable — all guests are required to select from your registered team list.
    Use Custom Fields if you need to capture additional structured data.
  </div>

  <section v-else class="tnqp">
    <button type="button" class="tnqp__head" :aria-expanded="String(expanded)" @click="expanded = !expanded">
      <span class="tnqp__title">Team Name Qualifiers</span>
      <q-badge outline color="grey-7" label="Optional" class="tnqp__badge" />
      <q-icon :name="expanded ? 'expand_less' : 'expand_more'" size="22px" class="tnqp__chev" />
    </button>

    <div v-show="expanded" class="tnqp__body">
      <p class="tnqp__intro">
        When a guest or group block creator manually enters a team name, qualifier fields prompt them for
        additional structured detail — producing a team name like “Augusta Arsenal · U13 · Girls” on their reservation.
      </p>

      <div class="tnqp__label">
        <span class="tnqp__overline">Select custom fields to use as qualifiers</span>
        <span class="tnqp__count">{{ fields.length }} fields available</span>
      </div>

      <div class="tnqp__list" role="group" aria-label="Custom fields to use as qualifiers">
        <label v-for="f in fields" :key="f.key" class="tnqp__row" :class="{ 'is-on': isOn(f.key) }">
          <q-checkbox :model-value="isOn(f.key)" dense color="primary" :aria-label="f.label"
            @update:model-value="(v) => toggle(f.key, v)" />
          <span class="tnqp__field">
            <span class="tnqp__field-name">{{ f.label }}</span>
            <span class="tnqp__field-options">{{ optionText(f) }}</span>
          </span>
          <q-badge outline :color="isOn(f.key) ? 'primary' : 'grey-7'" :label="typeLabel(f)" class="tnqp__badge" />
        </label>
      </div>

      <div v-if="selected.length" class="tnqp__preview" aria-live="polite">
        <div class="tnqp__overline tnqp__overline--brand">Manually entered team names will appear as</div>
        <div class="tnqp__name">
          <template v-for="(p, i) in parts" :key="i">
            <span v-if="i" class="tnqp__dot" aria-hidden="true">·</span>
            <span :class="{ 'tnqp__ph': p.placeholder }">{{ p.text }}</span>
          </template>
        </div>
      </div>

      <div class="tnqp__foot">
        <ds-link href="#custom-fields" external @click.prevent>Manage Custom Fields</ds-link>
        <q-btn outline no-caps color="primary" icon="refresh" label="Refresh" :loading="refreshing" @click="refresh" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tnqp { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); background: var(--ds-color-surface); }
.tnqp__head {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 16px 20px; background: none; border: 0; text-align: left; cursor: pointer;
  font: inherit; color: var(--ds-color-text);
}
.tnqp__title { flex: 1; font-weight: 600; font-size: 0.9375rem; }
.tnqp__chev { color: var(--ds-color-icon-subtle); }
/* DS Badge (QBadge), outline variant: a quiet tag rather than a solid pill. */
.tnqp__badge { padding: 3px 8px; font-size: 0.8125rem; font-weight: 600; border-radius: var(--ds-radius-sm); }
.tnqp__body { border-top: 1px solid var(--ds-color-border); padding: 16px 20px 20px; }
.tnqp__intro { margin: 0 0 16px; color: var(--ds-color-text-subtle); line-height: 1.5; }
.tnqp__label { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
.tnqp__overline { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-color-text); }
.tnqp__overline--brand { color: var(--ds-color-text-brand); margin-bottom: 4px; }
.tnqp__count { font-size: 0.8125rem; color: var(--ds-color-text-subtlest); }

.tnqp__list { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); overflow: hidden; }
.tnqp__row {
  display: flex; align-items: center; gap: 12px; padding: 10px 16px; cursor: pointer;
  transition: background var(--ds-duration-fast) var(--ds-ease-standard);
}
.tnqp__row + .tnqp__row { border-top: 1px solid var(--ds-color-border); }
.tnqp__row:hover { background: var(--ds-color-surface-sunken); }
.tnqp__row.is-on { background: var(--ds-color-background-brand-subtlest); }
.tnqp__field { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.tnqp__field-name { font-weight: 600; color: var(--ds-color-text); }
.tnqp__row.is-on .tnqp__field-name { color: var(--ds-color-text-brand); }
.tnqp__field-options { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }

.tnqp__preview {
  margin-top: 16px; padding: 12px 16px;
  border: 1px solid var(--ds-color-border-brand); border-radius: var(--ds-radius-lg);
  background: var(--ds-color-background-brand-subtlest);
}
.tnqp__name { font-weight: 700; color: var(--ds-color-text); display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 8px; }
.tnqp__dot { color: var(--ds-color-text-brand); font-weight: 400; }
.tnqp__ph { font-weight: 400; font-style: italic; color: var(--ds-color-text-subtlest); }

.tnqp__foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--ds-color-border);
}

.tnqp--na {
  padding: 14px 20px; background: var(--ds-color-surface-sunken);
  color: var(--ds-color-text-disabled); line-height: 1.5;
}
.tnqp__na-title { font-weight: 600; margin-right: 6px; }
</style>
