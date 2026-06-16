<script setup>
// PaymentMethodDialog — Instacart-style payment selector modal: saved methods
// (single-select with a check) plus an "Add payment method" list. Choosing
// Debit/Credit opens AddPaymentDialog; saving a card adds + selects it.
import { ref } from 'vue'
import { paymentLogo } from '../../lib/paymentLogos'
import AddPaymentDialog from './AddPaymentDialog.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  methods: { type: Array, default: () => ([
    { id: 'amex', logo: 'Amex', label: 'Amex *1009', sub: 'Exp. 5/27' },
    { id: 'gpay', logo: 'GooglePay', label: 'Google Pay' },
  ]) },
  selected: { type: String, default: 'amex' },
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const saved = ref(props.methods.map((m) => ({ ...m })))
const sel = ref(props.selected)
const addOpen = ref(false)

const addMethods = [
  { id: 'card', name: 'Debit/Credit', add: true },
  { id: 'venmo', name: 'Venmo', logo: 'Venmo' },
  { id: 'paypal', name: 'PayPal', logo: 'PayPal' },
  { id: 'klarna', name: 'Klarna', logo: 'Klarna' },
  { id: 'amazon', name: 'Amazon Pay', logo: 'AmazonPay' },
  { id: 'affirm', name: 'Affirm', logo: 'Affirm' },
]

const close = () => emit('update:modelValue', false)
const onAddCard = (card) => {
  saved.value.unshift({ id: card.id, logo: card.brand, label: `${card.brand} *${card.last4}`, sub: `Exp. ${card.exp}` })
  sel.value = card.id
}
const confirm = () => { emit('confirm', saved.value.find((m) => m.id === sel.value)); close() }
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="pmd">
      <div class="pmd__head">
        <button class="pmd__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
        <h3 class="pmd__title">Payment Method</h3>
        <span class="pmd__spacer" />
      </div>

      <div class="pmd__body">
        <h4 class="pmd__group">Saved payment methods</h4>
        <button v-for="m in saved" :key="m.id" class="pmd__row" @click="sel = m.id">
          <img v-if="paymentLogo(m.logo)" :src="paymentLogo(m.logo)" :alt="m.logo" class="pmd__logo" />
          <span v-else class="pmd__logo pmd__logo--blank" />
          <span class="pmd__meta"><span class="pmd__label">{{ m.label }}</span><span v-if="m.sub" class="pmd__sub">{{ m.sub }}</span></span>
          <q-icon v-if="sel === m.id" name="check" size="22px" class="pmd__check" />
        </button>

        <h4 class="pmd__group">Add payment method</h4>
        <button v-for="a in addMethods" :key="a.id" class="pmd__row" @click="a.add && (addOpen = true)">
          <span v-if="a.add" class="pmd__logo pmd__logo--add"><q-icon name="add" size="20px" /></span>
          <img v-else-if="paymentLogo(a.logo)" :src="paymentLogo(a.logo)" :alt="a.name" class="pmd__logo" />
          <span v-else class="pmd__logo pmd__logo--blank" />
          <span class="pmd__meta"><span class="pmd__label">{{ a.name }}</span></span>
          <q-icon name="chevron_right" size="22px" class="pmd__chev" />
        </button>
      </div>

      <div class="pmd__foot">
        <q-btn unelevated no-caps class="pmd__confirm" label="Confirm payment method" @click="confirm" />
      </div>

      <add-payment-dialog v-model="addOpen" @save="onAddCard" />
    </div>
  </q-dialog>
</template>

<style scoped>
.pmd { width: 480px; max-width: 92vw; max-height: 88vh; background: var(--ds-color-surface); border-radius: var(--ds-radius-lg); overflow: hidden; display: flex; flex-direction: column; }
.pmd__head { display: flex; align-items: center; padding: 14px 16px; flex: none; }
.pmd__close { width: 36px; height: 36px; border: 0; border-radius: 50%; background: none; color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.pmd__close:hover { background: var(--ds-palette-zinc-100); }
.pmd__title { flex: 1; text-align: center; font-size: 1.1875rem; font-weight: 700; margin: 0; color: var(--ds-color-text); }
.pmd__spacer { width: 36px; }
.pmd__body { flex: 1; overflow-y: auto; padding: 4px 20px 16px; }
.pmd__group { font-size: 1rem; font-weight: 700; color: var(--ds-color-text); margin: 16px 0 8px; }
.pmd__row { display: flex; align-items: center; gap: 14px; width: 100%; padding: 12px 0; background: none; border: 0; border-bottom: 1px solid var(--ds-color-border); cursor: pointer; text-align: left; }
.pmd__logo { width: 42px; height: 28px; object-fit: contain; flex: none; border-radius: var(--ds-radius-sm); }
.pmd__logo--blank { background: var(--ds-palette-zinc-100); }
.pmd__logo--add { display: flex; align-items: center; justify-content: center; border: 1px solid var(--ds-color-border-bold); color: var(--ds-color-text); }
.pmd__meta { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.pmd__label { font-weight: 600; color: var(--ds-color-text); }
.pmd__sub { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.pmd__check { color: var(--ds-color-text-success); }
.pmd__chev { color: var(--ds-color-text-subtle); }
.pmd__foot { flex: none; border-top: 1px solid var(--ds-color-border); padding: 16px 20px; }
.pmd__confirm { width: 100%; height: 52px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 1rem; }
</style>
