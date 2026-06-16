<script setup>
// PayWith — Instacart-style "Pay with" selector tiles (saved methods + an
// "Add a payment method" tile with a logo strip). Opens PaymentMethodDialog.
import { ref } from 'vue'
import { paymentLogo } from '../../lib/paymentLogos'
import PaymentMethodDialog from './PaymentMethodDialog.vue'

defineProps({
  modelValue: { type: String, default: 'amex' },
  methods: { type: Array, default: () => ([
    { id: 'amex', logo: 'Amex', last4: '1009', label: 'Amex', sub: 'Default' },
    { id: 'gpay', logo: 'GooglePay', label: 'Google Pay' },
  ]) },
})
const emit = defineEmits(['update:modelValue'])

const dialogOpen = ref(false)
const strip = ['Visa', 'Mastercard', 'Amex', 'Discover', 'PayPal', 'Venmo', 'Klarna']
const onConfirm = (m) => { if (m) emit('update:modelValue', m.id) }
</script>

<template>
  <div class="pw">
    <div class="pw__tiles">
      <button v-for="m in methods" :key="m.id" class="pw__tile" :class="{ 'is-sel': modelValue === m.id }" @click="emit('update:modelValue', m.id)">
        <div class="pw__tilehead">
          <img v-if="paymentLogo(m.logo)" :src="paymentLogo(m.logo)" :alt="m.logo" class="pw__tilelogo" />
          <span v-if="m.last4" class="pw__last4">*{{ m.last4 }}</span>
        </div>
        <div class="pw__tilelabel">{{ m.label }}</div>
        <div v-if="m.sub" class="pw__tilesub">{{ m.sub }}</div>
      </button>

      <button class="pw__tile pw__tile--add" @click="dialogOpen = true">
        <div class="pw__addicon"><q-icon name="add" size="20px" /></div>
        <div class="pw__tilelabel">Add a payment method</div>
        <div class="pw__strip"><img v-for="s in strip" :key="s" :src="paymentLogo(s)" :alt="s" class="pw__striplogo" /></div>
      </button>
    </div>

    <payment-method-dialog v-model="dialogOpen" :selected="modelValue" @confirm="onConfirm" />
  </div>
</template>

<style scoped>
.pw__tiles { display: flex; gap: 16px; flex-wrap: wrap; }
.pw__tile { flex: 1 1 180px; min-width: 180px; text-align: left; background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); padding: 16px; cursor: pointer; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.pw__tile:hover { border-color: var(--ds-color-border-bold); }
.pw__tile.is-sel { border-color: var(--ds-color-background-brand-bold); box-shadow: inset 0 0 0 1px var(--ds-color-background-brand-bold); }
.pw__tilehead { display: flex; align-items: center; gap: 10px; min-height: 30px; }
.pw__tilelogo { width: 40px; height: 26px; object-fit: contain; border-radius: var(--ds-radius-sm); }
.pw__last4 { color: var(--ds-color-text); font-weight: 600; }
.pw__tilelabel { font-weight: 700; color: var(--ds-color-text); margin-top: 14px; }
.pw__tilesub { color: var(--ds-color-text-subtle); font-size: 0.875rem; margin-top: 2px; }
.pw__addicon { width: 34px; height: 34px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-sm); display: flex; align-items: center; justify-content: center; color: var(--ds-color-text); }
.pw__strip { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 12px; }
.pw__striplogo { width: 30px; height: 20px; object-fit: contain; border-radius: 3px; }
</style>
