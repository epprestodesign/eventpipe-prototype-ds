<script setup>
// PhoneField — a phone input with a country-code dropdown segment (+1 ▾).
// Shared by the reservation and group contact steps. v-model = the number.
import { ref } from 'vue'

defineProps({ modelValue: { type: String, default: '' }, error: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'blur'])

const countries = [
  { name: 'USA', code: '+1', flag: '🇺🇸' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
]
const country = ref(countries[0])
</script>

<template>
  <div class="pf" :class="{ 'is-error': error }">
    <button type="button" class="pf__cc">
      {{ country.code }} <q-icon name="expand_more" size="16px" />
      <q-menu auto-close anchor="bottom left" self="top left">
        <q-list style="min-width: 220px">
          <q-item v-for="c in countries" :key="c.name" clickable @click="country = c">
            <q-item-section side><span class="pf__radio" :class="{ 'is-on': country.name === c.name }"><span v-if="country.name === c.name" class="pf__radiodot" /></span></q-item-section>
            <q-item-section avatar class="pf__flag">{{ c.flag }}</q-item-section>
            <q-item-section>{{ c.name }}</q-item-section>
            <q-item-section side class="pf__code">{{ c.code }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </button>
    <input :value="modelValue" type="tel" placeholder="(617) 470-7879" class="pf__input" @input="emit('update:modelValue', $event.target.value)" @blur="emit('blur')" />
  </div>
</template>

<style scoped>
.pf { display: flex; width: 100%; align-items: stretch; height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); overflow: hidden; }
.pf.is-error { border-color: var(--ds-color-text-danger); }
.pf__cc { display: flex; align-items: center; gap: 4px; padding: 0 14px; border: 0; border-right: 1px solid var(--ds-color-border); background: none; cursor: pointer; font-weight: 600; font-size: 0.9375rem; color: var(--ds-color-text); white-space: nowrap; }
.pf__cc:hover { background: var(--ds-palette-zinc-50); }
.pf__input { flex: 1; min-width: 0; border: 0; outline: none; background: none; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); padding: 0 14px; }
.pf__input::placeholder { color: var(--ds-color-text-subtlest); }
.pf__flag { font-size: 1.25rem; min-width: 32px; }
.pf__code { color: var(--ds-color-text-subtle); }
.pf__radio { width: 20px; height: 20px; border: 1.5px solid var(--ds-color-border-bold); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.pf__radio.is-on { border-color: var(--ds-color-background-brand-bold); }
.pf__radiodot { width: 10px; height: 10px; border-radius: 50%; background: var(--ds-color-background-brand-bold); }
</style>
