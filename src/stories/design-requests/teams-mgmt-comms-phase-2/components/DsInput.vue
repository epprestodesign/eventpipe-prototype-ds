<script setup>
// DsInput — the EventPipe text/number/currency/password/date field. A thin,
// restyled wrapper over Quasar's QInput (outlined) composed inside DsField, so it
// inherits the standard label/required/tooltip/hint/error anatomy. Covers the
// field types seen in the references: plain text, number (with optional ▲▼
// stepper + unit suffix), currency ($ prefix), password (show/hide), and date
// (calendar popup).
import { ref, computed } from 'vue'
import DsField from './DsField.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  // Field-wrapper anatomy
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },
  sublabel: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  // Control
  type: { type: String, default: 'text' }, // text | number | currency | password | email | tel | date
  placeholder: { type: String, default: '' },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  unit: { type: String, default: '' },      // trailing unit label, e.g. "days"
  stepper: { type: Boolean, default: false }, // ▲▼ for number
  step: { type: Number, default: 1 },
  min: { type: Number, default: null },
  max: { type: Number, default: null },
  mask: { type: String, default: '' },
  clearable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  dense: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])

const showPwd = ref(false)
const isNumber = computed(() => props.type === 'number' || props.type === 'currency')

const qType = computed(() => {
  if (props.type === 'currency' || props.type === 'number') return 'number'
  if (props.type === 'password') return showPwd.value ? 'text' : 'password'
  if (props.type === 'date') return 'text'
  return props.type
})
const qPrefix = computed(() => props.prefix || (props.type === 'currency' ? '$' : ''))

function set(v) { emit('update:modelValue', v) }
function bump(dir) {
  const cur = Number(props.modelValue) || 0
  let next = cur + dir * props.step
  if (props.min !== null) next = Math.max(props.min, next)
  if (props.max !== null) next = Math.min(props.max, next)
  set(next)
}
</script>

<template>
  <DsField :label="label" :required="required" :tooltip="tooltip" :sublabel="sublabel"
    :hint="hint" :error="error" :disabled="disabled">
    <q-input
      :model-value="modelValue"
      @update:model-value="set"
      outlined
      :dense="dense"
      :type="qType"
      :prefix="qPrefix"
      :suffix="suffix || unit"
      :placeholder="placeholder"
      :mask="mask || undefined"
      :clearable="clearable"
      :disable="disabled"
      :readonly="readonly"
      :error="!!error"
      hide-bottom-space
      :input-class="isNumber ? 'text-right-none' : ''"
    >
      <!-- Password show/hide -->
      <template v-if="type === 'password'" #append>
        <q-icon :name="showPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="showPwd = !showPwd" />
      </template>

      <!-- Date picker -->
      <template v-else-if="type === 'date'" #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date :model-value="modelValue" @update:model-value="set" color="primary" mask="MM/DD/YYYY">
              <div class="row items-center justify-end"><q-btn v-close-popup label="Close" color="primary" flat /></div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <!-- Number stepper ▲▼ -->
      <template v-else-if="stepper" #append>
        <div class="dsi__stepper">
          <button type="button" class="dsi__step" aria-label="Increase" @click="bump(1)"><q-icon name="keyboard_arrow_up" size="16px" /></button>
          <button type="button" class="dsi__step" aria-label="Decrease" @click="bump(-1)"><q-icon name="keyboard_arrow_down" size="16px" /></button>
        </div>
      </template>
    </q-input>
  </DsField>
</template>

<style scoped>
.dsi__stepper { display: flex; flex-direction: column; margin-right: -6px; }
.dsi__step {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 15px; padding: 0; border: 0; background: transparent;
  color: var(--ds-color-icon-subtle); cursor: pointer; border-radius: 3px;
}
.dsi__step:hover { color: var(--ds-color-text); background: var(--ds-color-surface-sunken); }
</style>
