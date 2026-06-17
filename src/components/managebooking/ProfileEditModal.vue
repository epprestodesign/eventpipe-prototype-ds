<script setup>
// ProfileEditModal — a full-height modal for editing profile details, using the
// DS field styles. `section` selects the form: 'basic' (name / bio / DOB /
// gender / accessibility) or 'contact' (email / phone / emergency / address).
// Edits are made on a local copy and committed via `save`.
import { ref, watch, computed } from 'vue'
import PhoneField from '../checkout/PhoneField.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  section: { type: String, default: 'basic' }, // basic | contact
  basic: { type: Object, default: () => ({}) },
  contact: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:modelValue', 'save'])

const clone = (o) => JSON.parse(JSON.stringify(o || {}))
const form = ref({})
// Re-seed the local copy each time the modal opens.
watch(() => props.modelValue, (open) => {
  if (open) form.value = props.section === 'contact' ? clone(props.contact) : clone(props.basic)
}, { immediate: true })

const isContact = computed(() => props.section === 'contact')
const heading = computed(() => (isContact.value ? 'Contact' : 'Basic information'))
const sub = computed(() => (isContact.value
  ? 'Receive account activity alerts and trip updates by sharing this information.'
  : 'Make sure this information matches your travel ID, like your passport or license.'))

const genders = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'x', label: 'Unspecified (X)' },
  { value: 'u', label: 'Undisclosed (U)' },
]
const accessibilityOptions = ['Not provided', 'Wheelchair accessible room', 'Accessible bathroom', 'Service animal', 'Visual aids', 'Hearing aids']

const close = () => emit('update:modelValue', false)
const onSave = () => { emit('save', { section: props.section, values: clone(form.value) }); close() }
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="pe">
      <div class="pe__scrim" @click="close" />
      <div class="pe__panel" role="dialog" aria-modal="true" :aria-label="heading">
        <div class="pe__top">
          <button class="pe__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
        </div>

        <div class="pe__body">
          <div class="pe__inner">
            <h2 class="pe__h2">{{ heading }}</h2>
            <p class="pe__sub">{{ sub }}</p>

            <!-- BASIC -->
            <template v-if="!isContact">
              <h3 class="pe__group">Full name</h3>
              <label class="pe__field"><span>First name <i>*</i></span><input v-model="form.firstName" placeholder="First name" /></label>
              <label class="pe__field"><span>Middle name</span><input v-model="form.middleName" placeholder="Middle name" /></label>
              <label class="pe__field"><span>Last name <i>*</i></span><input v-model="form.lastName" placeholder="Last name" /></label>

              <h3 class="pe__group">About you</h3>
              <label class="pe__field"><span>Bio</span>
                <textarea v-model="form.bio" rows="3" placeholder="Help future hosts get to know you better. You can share your travel style, hobbies, interests, and more." />
              </label>

              <h3 class="pe__group">Date of birth</h3>
              <div class="pe__dob">
                <label class="pe__field"><span>Month</span><input v-model="form.dobMonth" inputmode="numeric" maxlength="2" placeholder="MM" /></label>
                <label class="pe__field"><span>Day</span><input v-model="form.dobDay" inputmode="numeric" maxlength="2" placeholder="DD" /></label>
                <label class="pe__field"><span>Year</span><input v-model="form.dobYear" inputmode="numeric" maxlength="4" placeholder="YYYY" /></label>
              </div>

              <h3 class="pe__group">Gender</h3>
              <div class="pe__radios">
                <button v-for="g in genders" :key="g.value" type="button" class="pe__radio" :class="{ 'is-on': form.gender === g.value }" @click="form.gender = g.value">
                  <span class="pe__dot"><span v-if="form.gender === g.value" /></span>{{ g.label }}
                </button>
              </div>

              <h3 class="pe__group">Accessibility needs</h3>
              <p class="pe__help">Help us build features that make travel accessible for all by sharing this information.</p>
              <div class="pe__selectwrap">
                <select v-model="form.accessibility"><option v-for="o in accessibilityOptions" :key="o" :value="o">{{ o }}</option></select>
                <q-icon name="expand_more" size="20px" />
              </div>
            </template>

            <!-- CONTACT -->
            <template v-else>
              <label class="pe__field"><span>Email</span><input v-model="form.email" type="email" placeholder="youraccount@eventpipe.com" /></label>
              <div class="pe__field"><span>Phone number</span><phone-field v-model="form.phone" /></div>
              <label class="pe__field"><span>Emergency contact</span><input v-model="form.emergency" placeholder="Name and phone number" /></label>
              <label class="pe__field"><span>Address</span><input v-model="form.address" placeholder="Street, city, state, ZIP" /></label>
            </template>
          </div>
        </div>

        <div class="pe__foot">
          <button class="pe__cancel" @click="close">Cancel</button>
          <button class="pe__save" @click="onSave">Save</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.pe { position: fixed; inset: 0; z-index: 3200; }
.pe__scrim { position: absolute; inset: 0; background: rgba(9, 9, 11, 0.5); animation: pe-fade 0.18s ease; }
.pe__panel { position: absolute; top: 0; left: 50%; transform: translateX(-50%); height: 100%; width: 720px; max-width: 100vw; background: var(--ds-color-surface); display: flex; flex-direction: column; box-shadow: var(--ds-shadow-4, 0 12px 32px rgba(0,0,0,0.18)); animation: pe-rise 0.2s var(--ds-ease-standard); }
@keyframes pe-fade { from { opacity: 0; } }
@keyframes pe-rise { from { transform: translate(-50%, 1.5%); opacity: 0.6; } }

.pe__top { display: flex; align-items: center; padding: 14px 18px; flex: none; }
.pe__close { width: 38px; height: 38px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.pe__close:hover { background: var(--ds-palette-zinc-200); }

.pe__body { flex: 1; overflow-y: auto; }
.pe__inner { max-width: 480px; margin: 0 auto; padding: 8px 24px 32px; }
.pe__h2 { margin: 0; font-size: 1.75rem; font-weight: 800; color: var(--ds-color-text); }
.pe__sub { margin: 6px 0 16px; color: var(--ds-color-text-subtle); font-size: 0.9375rem; line-height: 1.4; }
.pe__group { margin: 16px 0 8px; font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); }
.pe__help { margin: 0 0 8px; color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.4; }

.pe__field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
.pe__field > span { font-size: 0.8125rem; font-weight: 600; color: var(--ds-color-text); }
.pe__field i { color: var(--ds-color-text-danger); font-style: normal; }
.pe__field input, .pe__field textarea, .pe__selectwrap select {
  width: 100%; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md);
  padding: 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text);
  outline: none; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); background: var(--ds-color-surface);
}
.pe__field input { height: 46px; }
.pe__field textarea { padding: 10px 14px; min-height: 76px; resize: vertical; }
.pe__field input:focus, .pe__field textarea:focus, .pe__selectwrap select:focus { border-color: var(--ds-color-border-focused); }
.pe__field input::placeholder, .pe__field textarea::placeholder { color: var(--ds-color-text-subtlest); }

.pe__dob { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

.pe__radios { display: flex; flex-direction: column; gap: 2px; }
.pe__radio { display: flex; align-items: center; gap: 12px; width: 100%; padding: 6px 0; background: none; border: 0; text-align: left; cursor: pointer; font-size: 0.9375rem; color: var(--ds-color-text); }
.pe__dot { width: 22px; height: 22px; flex: none; border: 2px solid var(--ds-color-border-bold); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.pe__radio.is-on .pe__dot { border-color: var(--ds-color-background-brand-bold); }
.pe__dot span { width: 12px; height: 12px; border-radius: 50%; background: var(--ds-color-background-brand-bold); }
.pe__radio:hover .pe__dot { border-color: var(--ds-color-text); }

.pe__selectwrap { position: relative; display: flex; align-items: center; }
.pe__selectwrap select { height: 46px; padding-right: 40px; appearance: none; -webkit-appearance: none; cursor: pointer; }
.pe__selectwrap .q-icon { position: absolute; right: 14px; color: var(--ds-color-text-subtle); pointer-events: none; }

.pe__foot { flex: none; display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--ds-color-border); background: var(--ds-color-surface); }
.pe__cancel { height: 48px; padding: 0 22px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-pill); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.pe__cancel:hover { background: var(--ds-palette-zinc-100); }
.pe__save { height: 48px; padding: 0 28px; border: 0; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.pe__save:hover { opacity: 0.92; }

@media (max-width: 520px) { .pe__panel { width: 100vw; } }
</style>
