<script setup>
// Sign up on the same right-panel form pattern as AccountCredentials: DsField +
// QInput, inline validation, keyboard-accessible password toggle, heading
// focus on view change. Concept only: Rob still has to confirm whether account
// creation or invitation pages exist (see Sign up ∕ Login › Overview). Submissions stay
// local to the preview.
import { ref, computed, nextTick } from 'vue'
import DsField from '../../../components/DsField.vue'
import DsText from '../../../components/DsText.vue'
import DsLink from '../../../components/DsLink.vue'
import DsAlert from '../../../components/DsAlert.vue'

const props = defineProps({
  scenario: { type: String, default: 'default' },
})
const emit = defineEmits(['login'])
const invalid = props.scenario === 'validation'
const view = ref(props.scenario === 'created' ? 'created' : 'form')
const first = ref('')
const last = ref('')
const email = ref(props.scenario === 'created' ? 'jordan@example.com' : '')
const password = ref('')
const agree = ref(false)
const showPassword = ref(false)
const errors = ref(invalid ? {
  first: 'Enter your first name.', last: 'Enter your last name.', email: 'Enter a valid email address.',
  password: 'Use at least 8 characters.', agree: 'Accept the Terms and Privacy Policy to continue.',
} : {})
const notice = ref(props.scenario === 'exists')
const fieldErrors = computed(() => Object.values(errors.value).filter(Boolean))
const busy = ref(props.scenario === 'submitting')
const heading = ref(null)
const title = computed(() => view.value === 'created' ? 'Check your email' : 'Create your account')

async function submit() {
  if (busy.value) return
  errors.value = {
    first: first.value.trim() ? '' : 'Enter your first name.',
    last: last.value.trim() ? '' : 'Enter your last name.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Enter a valid email address.',
    password: password.value.length >= 8 ? '' : 'Use at least 8 characters.',
    agree: agree.value ? '' : 'Accept the Terms and Privacy Policy to continue.',
  }
  notice.value = false
  if (Object.values(errors.value).some(Boolean)) return
  view.value = 'created'
  password.value = ''
  await nextTick()
  heading.value?.focus()
}
</script>

<template>
  <section>
    <div ref="heading" tabindex="-1"><ds-text as="h1" variant="h2">{{ title }}</ds-text></div>
    <div class="q-mt-sm q-mb-lg"><ds-text as="p">
      {{ view === 'form' ? 'Start managing event lodging in minutes.' : `We sent a link to ${email}. Open it to verify your email and finish setting up your account.` }}
    </ds-text></div>
    <ds-alert v-if="view === 'form' && fieldErrors.length" severity="error" title="Check the highlighted fields" class="q-mb-lg">
      <ul><li v-for="e in fieldErrors" :key="e">{{ e }}</li></ul>
    </ds-alert>
    <ds-alert v-else-if="notice" severity="error" title="An account already uses that email" class="q-mb-lg">
      <ds-link href="#login" @click.prevent="emit('login')">Log in</ds-link> or reset your password instead.
    </ds-alert>
    <q-form v-if="view === 'form'" novalidate :aria-busy="busy" @submit="submit">
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6">
          <ds-field label="First name" :error="errors.first">
            <q-input v-model="first" outlined dense autocomplete="given-name" aria-label="First name" placeholder="First name"
              :disable="busy" :error="!!errors.first" hide-bottom-space />
          </ds-field>
        </div>
        <div class="col-12 col-sm-6">
          <ds-field label="Last name" :error="errors.last">
            <q-input v-model="last" outlined dense autocomplete="family-name" aria-label="Last name" placeholder="Last name"
              :disable="busy" :error="!!errors.last" hide-bottom-space />
          </ds-field>
        </div>
      </div>
      <ds-field label="Work email" :error="errors.email" class="q-mb-lg">
        <q-input v-model="email" outlined dense type="email" autocomplete="email" aria-label="Work email" placeholder="Email"
          :disable="busy" :error="!!errors.email" hide-bottom-space />
      </ds-field>
      <ds-field label="Password" hint="At least 8 characters." :error="errors.password">
        <q-input v-model="password" outlined dense :type="showPassword ? 'text' : 'password'" autocomplete="new-password"
          aria-label="Password" placeholder="Password" :disable="busy" :error="!!errors.password" hide-bottom-space>
          <template #append><q-btn flat round dense type="button" :disable="busy" :icon="showPassword ? 'visibility_off' : 'visibility'"
            :aria-label="showPassword ? 'Hide password' : 'Show password'" :aria-pressed="showPassword" @click="showPassword = !showPassword" /></template>
        </q-input>
      </ds-field>
      <div class="q-mt-lg">
        <q-checkbox v-model="agree" dense :disable="busy">
          I agree to the <ds-link href="#terms" @click.stop.prevent>Terms</ds-link> and <ds-link href="#privacy" @click.stop.prevent>Privacy Policy</ds-link>
        </q-checkbox>
        <div v-if="errors.agree" class="text-ds-danger text-caption q-mt-xs">{{ errors.agree }}</div>
      </div>
      <q-btn unelevated no-caps color="primary" type="submit" :loading="busy" label="Create account" class="q-mt-lg full-width" />
      <div class="q-mt-lg">
        <ds-text as="p">Already have an account? <ds-link href="#login" @click.prevent="emit('login')">Log in</ds-link></ds-text>
      </div>
    </q-form>
    <div v-else role="status">
      <q-btn outline no-caps color="primary" label="Back to log in" @click="emit('login')" />
    </div>
  </section>
</template>
