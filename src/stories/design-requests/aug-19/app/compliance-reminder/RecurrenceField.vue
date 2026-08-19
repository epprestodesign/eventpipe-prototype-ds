<script setup lang="ts">
// Google-Calendar-style recurrence picker: a summary Select whose "Custom…"
// option opens a dialog (repeat-every, weekday circles, an Ends radio). The
// model is the human-readable summary string; emit an RRULE here in a real app.
import { ref } from 'vue'
import DsSelect from '../../components/DsSelect.vue'
import { useRecurrence } from './useRecurrence'

const model = defineModel<string>({ default: '' })

const r = useRecurrence()
const showCustom = ref(false)
if (!model.value) model.value = r.summary.value

function onSelect(value: string) {
  if (value === 'Custom…') { showCustom.value = true; return }
  model.value = value
}
function applyCustom() {
  model.value = r.summary.value
  showCustom.value = false
}
</script>

<template>
  <ds-select :model-value="model" :options="r.presets.value" label="Recurrence" @update:model-value="onSelect" />

  <q-dialog v-model="showCustom">
    <q-card class="rec-dialog">
      <q-card-section class="q-pb-xs">
        <div class="text-h6 text-weight-bold">Custom recurrence</div>
      </q-card-section>

      <q-card-section class="row items-center q-gutter-md">
        <span class="text-grey-8">Repeat every</span>
        <q-input v-model.number="r.every.value" type="number" outlined dense min="1" style="width: 80px" hide-bottom-space />
        <q-select v-model="r.unit.value" :options="['day', 'week', 'month', 'year']" outlined dense style="width: 140px" hide-bottom-space />
      </q-card-section>

      <q-card-section v-if="r.unit.value === 'week'">
        <div class="text-grey-8 q-mb-sm">Repeat on</div>
        <div class="row q-gutter-sm">
          <q-btn
            v-for="(label, d) in r.DAY_LABELS" :key="d" round unelevated size="sm"
            :color="r.days.value.includes(d) ? 'primary' : 'grey-3'"
            :text-color="r.days.value.includes(d) ? 'white' : 'dark'"
            :label="label" @click="r.toggleDay(d)"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-grey-8 q-mb-sm">Ends</div>
        <q-radio v-model="r.ends.value" val="never" label="Never" color="primary" class="block q-mb-sm" />
        <div class="row items-center q-gutter-md q-mb-sm">
          <q-radio v-model="r.ends.value" val="on" label="On" color="primary" />
          <q-input v-model="r.endsOn.value" outlined dense :disable="r.ends.value !== 'on'" style="width: 170px" hide-bottom-space>
            <template #append><q-icon name="event" /></template>
          </q-input>
        </div>
        <div class="row items-center q-gutter-md">
          <q-radio v-model="r.ends.value" val="after" label="After" color="primary" />
          <q-input v-model.number="r.endsAfter.value" type="number" outlined dense :disable="r.ends.value !== 'after'" suffix="occurrences" style="width: 200px" hide-bottom-space />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat no-caps color="primary" label="Cancel" v-close-popup />
        <q-btn unelevated no-caps color="primary" label="Done" @click="applyCustom" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.rec-dialog { min-width: 440px; border-radius: var(--ds-radius-lg); }
</style>
