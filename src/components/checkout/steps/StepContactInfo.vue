<script setup>
// Checkout step 2 — Contact information. Variant-specific:
//   group       → GroupTeamsBlock (teams flow + primary contact)
//   reservation → ContactGroupForm (contact only)
// Clicking Next while incomplete surfaces required-field errors instead of
// advancing; required fields = names + email + phone (+ ≥1 team for group).
import { computed, ref } from 'vue'
import ContactGroupForm from '../ContactGroupForm.vue'
import GroupTeamsBlock from '../GroupTeamsBlock.vue'

const props = defineProps({
  mode: { type: String, default: 'group' }, // group | reservation
  modelValue: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:modelValue', 'next'])

const showErrors = ref(false)
const valid = computed(() => {
  const m = props.modelValue || {}
  if (props.mode === 'group') {
    const c = m.contact || {}
    return !!(c.firstName && c.lastName && c.mobile && c.email && ((m.teams && m.teams.length) || m.notHolding))
  }
  return !!(m.firstName && m.lastName && m.email && m.phone)
})
const onNext = () => { if (valid.value) emit('next'); else { showErrors.value = true } }
</script>

<template>
  <div class="step">
    <group-teams-block v-if="mode === 'group'" :model-value="modelValue" :show-errors="showErrors" @update:model-value="emit('update:modelValue', $event)" />
    <contact-group-form v-else :mode="mode" :model-value="modelValue" :show-errors="showErrors" @update:model-value="emit('update:modelValue', $event)" />
    <q-btn unelevated no-caps class="step__next" label="Next" @click="onNext" />
  </div>
</template>

<style scoped>
.step__next { margin-top: 20px; height: 48px; padding: 0 28px; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 600; }
</style>
