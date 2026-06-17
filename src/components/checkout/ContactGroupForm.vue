<script setup>
// ContactGroupForm — the reservation contact step. Contact only: name pair,
// email on its own line, and a phone field with a country-code dropdown.
// Required-field + email-format errors show on blur or when showErrors is set.
import { reactive, computed, watch } from 'vue'
import PhoneField from './PhoneField.vue'

const props = defineProps({
  mode: { type: String, default: 'reservation' },
  modelValue: { type: Object, default: () => ({}) },
  showErrors: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const form = reactive({ firstName: '', lastName: '', email: '', phone: '', ...props.modelValue })
watch(form, () => emit('update:modelValue', { ...form }), { deep: true })

const touched = reactive({})
const emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
const show = (f) => props.showErrors || touched[f]
const err = (f) => {
  if (!show(f)) return ''
  if (!form[f]) return 'Required'
  if (f === 'email' && !emailOk.value) return 'Enter a valid email'
  return ''
}
</script>

<template>
  <div class="cgf">
    <h4 class="cgf__h">Contact information</h4>
    <div class="cgf__grid">
      <label class="cgf__field">
        <span>First name <i class="cgf__req">*</i></span>
        <input v-model="form.firstName" placeholder="First name" :class="{ 'is-error': err('firstName') }" @blur="touched.firstName = true" />
        <small v-if="err('firstName')" class="cgf__err">{{ err('firstName') }}</small>
      </label>
      <label class="cgf__field">
        <span>Last name <i class="cgf__req">*</i></span>
        <input v-model="form.lastName" placeholder="Last name" :class="{ 'is-error': err('lastName') }" @blur="touched.lastName = true" />
        <small v-if="err('lastName')" class="cgf__err">{{ err('lastName') }}</small>
      </label>
      <label class="cgf__field cgf__field--full">
        <span>Email <i class="cgf__req">*</i></span>
        <input v-model="form.email" type="email" placeholder="you@example.com" :class="{ 'is-error': err('email') }" @blur="touched.email = true" />
        <small v-if="err('email')" class="cgf__err">{{ err('email') }}</small>
      </label>

      <div class="cgf__field cgf__field--full">
        <span>Phone number <i class="cgf__req">*</i></span>
        <phone-field v-model="form.phone" :error="!!err('phone')" @blur="touched.phone = true" />
        <small v-if="err('phone')" class="cgf__err">{{ err('phone') }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cgf__h { font-size: 1rem; font-weight: 700; color: var(--ds-color-text); margin: 0 0 12px; }
.cgf__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cgf__field { display: flex; flex-direction: column; gap: 6px; }
.cgf__field--full { grid-column: 1 / -1; }
.cgf__field span { font-size: 0.8125rem; font-weight: 600; color: var(--ds-color-text); }
.cgf__req { color: var(--ds-color-text-danger); font-style: normal; }
.cgf__field > input { height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.cgf__field > input:focus { border-color: var(--ds-color-border-focused); }
.cgf__field > input::placeholder { color: var(--ds-color-text-subtlest); }
.cgf__field > input.is-error { border-color: var(--ds-color-text-danger); }
.cgf__err { color: var(--ds-color-text-danger); font-size: 0.75rem; font-weight: 500; }
</style>
