<script setup>
/* GbrSettingRow — the Email Settings row anatomy.
 *
 * Not new. This is the shape the four existing rows on that screen already use:
 * a small grey label with an ⓘ, a number field with a unit suffix, a toggle on
 * the right, and an optional caption underneath.
 *
 * It is extracted as a component because the group block control (PP-42/PP-43)
 * has to be built from exactly this and nothing else — a fifth row that
 * invented its own layout would read as bolted on. Having one implementation
 * means the new row cannot quietly drift from the four beside it.
 *
 * The field is disabled rather than hidden when the toggle is off. Pre Arrival
 * sits switched off on this screen with its field still visible; hiding it
 * would make rows jump as they're toggled and hide the value the user is about
 * to come back to.
 */
defineProps({
  label: { type: String, required: true },
  /** Number in the field — days, in every current use. */
  modelValue: { type: [String, Number], default: '' },
  /** Toggle state. */
  enabled: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },
  /** Small line under the control (e.g. "Prior to the first hotel cutoff date"). */
  caption: { type: String, default: '' },
  unit: { type: String, default: 'Days' },
  /** Inline validation message; also reserves space so the toggle stays aligned. */
  error: { type: String, default: '' },
  /** Grey the field out while the row is switched off. */
  disableWhenOff: { type: Boolean, default: true },
})
defineEmits(['update:modelValue', 'update:enabled'])
</script>

<template>
  <div class="gbr-row">
    <div class="gbr-em__label">
      {{ label }}
      <q-icon v-if="tooltip" name="info" size="15px" class="gbr-em__info">
        <q-tooltip anchor="top middle" self="bottom middle" max-width="330px">{{ tooltip }}</q-tooltip>
      </q-icon>
    </div>

    <div class="row items-center no-wrap" style="gap:14px;">
      <q-input
        :model-value="modelValue"
        @update:model-value="(v) => $emit('update:modelValue', v)"
        outlined dense :suffix="unit" style="width:170px;"
        :disable="disableWhenOff && !enabled"
        :error="!!error" :error-message="error" :hide-bottom-space="!error" />
      <q-toggle
        :model-value="enabled"
        @update:model-value="(v) => $emit('update:enabled', v)"
        color="primary" dense
        :style="error ? 'margin-bottom:20px;' : ''"
        :aria-label="label" />
    </div>

    <div v-if="caption" class="gbr-em__caption">{{ caption }}</div>
    <slot name="below" />
  </div>
</template>

<style scoped>
.gbr-row { margin-bottom: 18px; }
.gbr-row:last-child { margin-bottom: 4px; }
</style>
