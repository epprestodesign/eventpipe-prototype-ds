<script setup>
// AddPaymentDialog — Instacart-style "Add Payment" form modal: card number,
// expiry, CVC, billing ZIP, and a human-check, with a Save that stays disabled
// until the form is valid. Emits `save` with the new card on success.
import { ref, computed } from 'vue'

defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'save', 'back'])

const number = ref('')
const exp = ref('')
const cvc = ref('')
const zip = ref('')
const human = ref(false)

const digits = (s) => s.replace(/\D/g, '')
const brandOf = (n) => {
  const d = digits(n)
  if (/^3/.test(d)) return 'Amex'
  if (/^4/.test(d)) return 'Visa'
  if (/^5/.test(d)) return 'Mastercard'
  if (/^6/.test(d)) return 'Discover'
  return 'Card'
}
// Light formatting as the user types.
const onNumber = (e) => { number.value = digits(e.target.value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }
const onExp = (e) => { const d = digits(e.target.value).slice(0, 4); exp.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }

const valid = computed(() =>
  digits(number.value).length >= 15 &&
  /^\d\d\/\d\d$/.test(exp.value) &&
  digits(cvc.value).length >= 3 &&
  digits(zip.value).length >= 5 &&
  human.value)

const close = () => emit('update:modelValue', false)
const reset = () => { number.value = ''; exp.value = ''; cvc.value = ''; zip.value = ''; human.value = false }
const save = () => {
  if (!valid.value) return
  emit('save', { id: `card-${digits(number.value).slice(-4)}`, brand: brandOf(number.value), last4: digits(number.value).slice(-4), exp: exp.value })
  close()
  reset()
}
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="apd">
      <div class="apd__head">
        <button class="apd__icon" aria-label="Back" @click="emit('back'); close()"><q-icon name="arrow_back" size="22px" /></button>
        <h3 class="apd__title">Add Payment</h3>
        <span class="apd__spacer" />
      </div>

      <div class="apd__body">
        <div class="apd__field apd__field--full">
          <q-icon name="credit_card" size="22px" class="apd__cardicon" />
          <input class="apd__input" inputmode="numeric" placeholder="Card number" :value="number" @input="onNumber" />
        </div>
        <div class="apd__row">
          <input class="apd__field apd__input" inputmode="numeric" placeholder="MM/YY" :value="exp" @input="onExp" />
          <input class="apd__field apd__input" inputmode="numeric" maxlength="4" placeholder="CVC" v-model="cvc" />
        </div>
        <div class="apd__field apd__zip">
          <q-icon name="place" size="20px" />
          <div class="apd__zipfields">
            <label>Billing ZIP code</label>
            <input class="apd__input apd__input--zip" inputmode="numeric" maxlength="5" placeholder="ZIP" v-model="zip" />
          </div>
          <span class="apd__city">Everett, MA</span>
        </div>
        <label class="apd__robot">
          <input type="checkbox" v-model="human" />
          <span>I'm not a robot</span>
          <span class="apd__recaptcha"><q-icon name="autorenew" size="20px" color="primary" /><small>reCAPTCHA</small></span>
        </label>
      </div>

      <div class="apd__foot">
        <q-btn unelevated no-caps class="apd__save" :class="{ 'is-disabled': !valid }" :tabindex="valid ? 0 : -1" label="Save" @click="save" />
      </div>
    </div>
  </q-dialog>
</template>

<style scoped>
.apd { width: 560px; max-width: 92vw; background: var(--ds-color-surface); border-radius: var(--ds-radius-lg); overflow: hidden; display: flex; flex-direction: column; }
.apd__head { display: flex; align-items: center; padding: 16px 18px; }
.apd__icon { width: 36px; height: 36px; border: 0; border-radius: 50%; background: none; color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.apd__icon:hover { background: var(--ds-palette-zinc-100); }
.apd__title { flex: 1; text-align: center; font-size: 1.25rem; font-weight: 700; margin: 0; color: var(--ds-color-text); }
.apd__spacer { width: 36px; }
.apd__body { padding: 4px 24px 24px; display: flex; flex-direction: column; gap: 16px; }
.apd__field { display: flex; align-items: center; gap: 12px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 16px; height: 64px; }
.apd__cardicon { color: var(--ds-color-text); flex: none; }
.apd__input { flex: 1; min-width: 0; border: 0; outline: none; background: none; font-family: inherit; font-size: 1.0625rem; color: var(--ds-color-text); height: 100%; }
.apd__input::placeholder { color: var(--ds-color-text-subtlest); }
.apd__row { display: flex; gap: 16px; }
.apd__row .apd__field { flex: 1; }
.apd__zip { justify-content: space-between; }
.apd__zipfields { flex: 1; display: flex; flex-direction: column; }
.apd__zipfields label { font-size: 0.75rem; color: var(--ds-color-text-subtle); }
.apd__input--zip { height: auto; font-size: 1.0625rem; }
.apd__city { color: var(--ds-color-text-subtle); }
.apd__robot { display: flex; align-items: center; gap: 14px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); padding: 16px; background: var(--ds-color-surface-sunken); cursor: pointer; }
.apd__robot input { width: 24px; height: 24px; }
.apd__robot > span:nth-child(2) { flex: 1; font-size: 1rem; color: var(--ds-color-text); }
.apd__recaptcha { display: flex; flex-direction: column; align-items: center; color: var(--ds-color-text-subtle); }
.apd__foot { border-top: 1px solid var(--ds-color-border); padding: 16px 24px; }
.apd__save { width: 100%; height: 56px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 1.0625rem; }
.apd__save.is-disabled { background: var(--ds-palette-zinc-200); color: var(--ds-color-text-subtlest); pointer-events: none; }
</style>
