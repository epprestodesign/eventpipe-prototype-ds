<script setup>
// DsField — the standard EventPipe form-field wrapper. Provides the consistent
// field anatomy seen across the app: a gray label above the control (with an
// optional required * and ⓘ tooltip), an optional gray sub-label, a control slot,
// and a helper/error message below. Inputs (DsInput, DsSelect, …) compose into
// this so every field lines up. Label sits ABOVE the control (stacked), never
// floating, matching the Edit Event / Edit Refund Policy references.
defineProps({
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },     // ⓘ helper on hover
  sublabel: { type: String, default: '' },     // secondary gray line under the label
  hint: { type: String, default: '' },          // helper text below the control
  error: { type: String, default: '' },         // error message (overrides hint)
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <div class="dsf" :class="{ 'is-disabled': disabled, 'is-error': !!error }">
    <label v-if="label" class="dsf__label">
      <span class="dsf__label-text">{{ label }}</span>
      <span v-if="required" class="dsf__req" aria-hidden="true">*</span>
      <q-icon v-if="tooltip" name="info" size="15px" class="dsf__info">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 6]">{{ tooltip }}</q-tooltip>
      </q-icon>
    </label>
    <div v-if="sublabel" class="dsf__sublabel">{{ sublabel }}</div>

    <div class="dsf__control"><slot /></div>

    <div v-if="error || hint" class="dsf__msg" :class="{ 'is-error': !!error }">
      {{ error || hint }}
    </div>
  </div>
</template>

<style scoped>
.dsf { display: flex; flex-direction: column; gap: 6px; }
.dsf__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ds-color-text-subtle);
  line-height: 1.3;
}
.dsf__req { color: var(--ds-color-text-danger); font-weight: 700; }
.dsf__info { color: var(--ds-color-icon-subtle); cursor: help; }
.dsf__sublabel { margin-top: -2px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.dsf__control { display: block; }
.dsf__msg { font-size: 0.75rem; color: var(--ds-color-text-subtle); line-height: 1.3; }
.dsf__msg.is-error { color: var(--ds-color-text-danger); }
.dsf.is-disabled { opacity: 0.6; }
</style>
