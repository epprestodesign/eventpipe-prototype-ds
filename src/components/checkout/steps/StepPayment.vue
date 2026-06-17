<script setup>
// Checkout step 3 — Add a payment method. Wraps the Instacart-style PayWith
// selector (which opens the Payment Method / Add Payment dialogs).
import PayWith from '../PayWith.vue'

defineProps({
  modelValue: { type: String, default: 'amex' },
  methods: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'next'])
</script>

<template>
  <div class="step">
    <pay-with :model-value="modelValue" :methods="methods" @update:model-value="emit('update:modelValue', $event)" />
    <q-btn unelevated no-caps class="step__next" label="Next" @click="emit('next')" />
  </div>
</template>

<style scoped>
.step__next { margin-top: 20px; height: 48px; padding: 0 28px; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 600; }
</style>
