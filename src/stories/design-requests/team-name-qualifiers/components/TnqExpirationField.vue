<script setup>
// TnqExpirationField — the date + time "expiration" control Registration
// Settings reveals under Room Block Restrictions and under each "Team Selection
// Required" checkbox. A DsInput date (calendar popup) with a clock button for
// the time, and the "Time is recorded in EST" note the captures carry.
import { computed } from 'vue'
import DsField from '../../../../components/DsField.vue'
import DsInput from '../../../../components/DsInput.vue'

const props = defineProps({
  label: { type: String, required: true },
  date: { type: String, default: '' },
  time: { type: String, default: '' },
})
const emit = defineEmits(['update:date', 'update:time'])
const timeLabel = computed(() => (props.time ? `Time set to ${props.time} EST` : 'Set time'))
</script>

<template>
  <ds-field :label="label" hint="Time is recorded in EST" class="tnqe">
    <div class="tnqe__row">
      <ds-input :model-value="date" type="date" placeholder="mm/dd/yyyy" :aria-label="label" class="tnqe__date"
        @update:model-value="(v) => emit('update:date', v)" />
      <q-btn flat round dense icon="schedule" color="grey-7" :aria-label="timeLabel">
        <q-tooltip>{{ timeLabel }}</q-tooltip>
        <q-menu anchor="bottom left" self="top left">
          <q-time :model-value="time" color="primary" mask="hh:mm A" @update:model-value="(v) => emit('update:time', v)" />
        </q-menu>
      </q-btn>
      <span v-if="time" class="tnqe__time">{{ time }}</span>
    </div>
  </ds-field>
</template>

<style scoped>
.tnqe__row { display: flex; align-items: center; gap: 8px; }
.tnqe__date { width: 300px; max-width: 100%; }
.tnqe__time { font-size: 0.875rem; color: var(--ds-color-text-subtle); }
</style>
