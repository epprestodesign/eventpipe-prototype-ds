<script setup>
// Checkout step 1 — Review order. Recycles the shared CartReview body
// (hold accordion / reservation summary), interactive so quantities can be
// adjusted before continuing.
import CartReview from '../../CartReview.vue'

defineProps({
  mode: { type: String, default: 'hold' }, // hold | reserve
  cart: { type: Object, default: () => ({}) },
  currency: { type: String, default: '$' },
  bind: { type: Boolean, default: false },
})
const emit = defineEmits(['next'])
</script>

<template>
  <div class="step">
    <div class="step__review"><cart-review :mode="mode" :cart="cart" :currency="currency" :bind="bind" :show-requests="false" :show-price="mode !== 'hold'" :show-add-hotel="false" /></div>
    <q-btn unelevated no-caps class="step__next" label="Next" @click="emit('next')" />
  </div>
</template>

<style scoped>
.step__review { margin: 0 -20px; }
.step__next { margin-top: 20px; height: 48px; padding: 0 28px; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 600; }
</style>
