<script setup>
// Checkout step 2 — Contact information. Variant-specific:
//   group       → GroupTeamsBlock (teams flow + primary contact)
//   reservation → ReservationGuests (per-room guest info, aware of the booking
//                 widget's room/traveler selection via `rooms`)
// Clicking Next while incomplete surfaces required-field errors instead of
// advancing.
import { computed, ref } from 'vue'
import ReservationGuests from '../ReservationGuests.vue'
import GroupTeamsBlock from '../GroupTeamsBlock.vue'

const props = defineProps({
  mode: { type: String, default: 'group' }, // group | reservation
  modelValue: { type: [Object, Array], default: () => ({}) },
  // Reservation: the booking-widget selection (one entry per room) + event-
  // configurable extra fields, passed through to ReservationGuests.
  rooms: { type: Array, default: () => [{ adults: 1, children: 0 }] },
  teamName: { type: Boolean, default: false },
  customFields: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'next'])

const showErrors = ref(false)
const resValid = ref(false)
const valid = computed(() => {
  if (props.mode === 'reservation') return resValid.value
  const m = props.modelValue || {}
  const c = m.contact || {}
  const teamsOk = m.notHolding || ((m.teams && m.teams.length) && (m.groupBlockName || '').trim())
  return !!(c.firstName && c.lastName && c.mobile && c.email && teamsOk)
})
const onNext = () => { if (valid.value) emit('next'); else { showErrors.value = true } }
</script>

<template>
  <div class="step">
    <group-teams-block v-if="mode === 'group'" :model-value="modelValue" :show-errors="showErrors" @update:model-value="emit('update:modelValue', $event)" />
    <reservation-guests
      v-else
      :rooms="rooms" :team-name="teamName" :custom-fields="customFields"
      :model-value="Array.isArray(modelValue) ? modelValue : []"
      :show-errors="showErrors"
      @update:model-value="emit('update:modelValue', $event)"
      @update:valid="resValid = $event"
    />
    <q-btn unelevated no-caps class="step__next" label="Next" @click="onNext" />
  </div>
</template>

<style scoped>
.step__next { margin-top: 20px; height: 48px; padding: 0 28px; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 600; }
</style>
