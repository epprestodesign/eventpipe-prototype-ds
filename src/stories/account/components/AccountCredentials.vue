<script setup>
import { ref, computed, nextTick } from 'vue'
import DsField from '../../../components/DsField.vue'
import DsText from '../../../components/DsText.vue'
import DsLink from '../../../components/DsLink.vue'
import DsAlert from '../../../components/DsAlert.vue'

const props = defineProps({
  initialView: { type: String, default: 'login' },
  scenario: { type: String, default: 'default' },
  demoPrefill: { type: Boolean, default: false },
})
const emit = defineEmits(['authenticated'])
const view = ref(props.initialView)
// Fictional credentials for the local Phase 2 click-through only.
const email = ref(props.demoPrefill ? 'jordan@example.com' : '')
const password = ref(props.demoPrefill ? 'DemoPassword123!' : '')
const showPassword = ref(false)
const emailError = ref(props.scenario === 'validation' ? 'Enter a valid email address.' : '')
const passwordError = ref(props.scenario === 'validation' && props.initialView === 'login' ? 'Enter your password.' : '')
// Form-level errors use the DS inline Alert (error). Field errors stay on the
// fields; when there are any, a summary Alert above the form lists them.
const NOTICES = {
  invalid: { title: 'Email or password is incorrect', description: 'Check your details and try again, or reset your password.' },
  unavailable: { title: 'We can’t connect right now', description: 'Something went wrong on our side. Please try again in a moment.' },
  expired: { title: 'Your session has ended', description: 'For your security, please log in again.' },
}
const RESET_NOTICES = {
  unavailable: { title: 'We can’t send reset instructions right now', description: 'Something went wrong on our side. Please try again in a moment.' },
}
const notice = ref((props.initialView === 'reset' ? RESET_NOTICES : NOTICES)[props.scenario] || null)
const fieldErrors = computed(() => [emailError.value, passwordError.value].filter(Boolean))
const busy = ref(props.scenario === 'submitting')
const heading = ref(null)
const title = computed(() => ({login: 'Welcome!', reset: 'Forgot your password?', sent: 'Check your email', complete: 'You’re signed in'})[view.value])
async function changeView(next) {
  view.value = next
  password.value = ''
  showPassword.value = false
  emailError.value = passwordError.value = ''
  notice.value = null
  await nextTick()
  heading.value?.focus()
}
async function submit() {
  if (busy.value) return
  emailError.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Enter a valid email address.'
  passwordError.value = view.value === 'login' && !password.value ? 'Enter your password.' : ''
  notice.value = null
  if (emailError.value || passwordError.value) return
  if (view.value === 'reset') await changeView('sent')
  else { emit('authenticated'); await changeView('complete') }
}
</script>

<template>
  <section>
    <div ref="heading" tabindex="-1"><ds-text as="h1" variant="h2">{{ title }}</ds-text></div>
    <div class="q-mt-sm q-mb-lg"><ds-text as="p">
      {{ view === 'login' ? 'Please enter your credentials to access your account.' : view === 'reset' ? 'Enter your email and we’ll send you instructions to reset your password.' : view === 'sent' ? 'If an account matches that email, you’ll receive password reset instructions. Check your spam folder, too.' : 'This preview ends here. The application would open your account.' }}
    </ds-text></div>
    <ds-alert v-if="fieldErrors.length" severity="error" title="Check the highlighted fields" class="q-mb-lg">
      <ul><li v-for="e in fieldErrors" :key="e">{{ e }}</li></ul>
    </ds-alert>
    <ds-alert v-else-if="notice" severity="error" :title="notice.title" :description="notice.description" class="q-mb-lg" />
    <q-form v-if="view === 'login' || view === 'reset'" novalidate :aria-busy="busy" @submit="submit">
      <ds-field label="Email" :error="emailError" class="q-mb-lg">
        <q-input v-model="email" outlined dense type="email" autocomplete="username" aria-label="Email" placeholder="Email"
          :disable="busy" :error="!!emailError" hide-bottom-space />
      </ds-field>
      <ds-field v-if="view === 'login'" label="Password" :error="passwordError">
        <q-input v-model="password" outlined dense :type="showPassword ? 'text' : 'password'" autocomplete="current-password"
          aria-label="Password" placeholder="Password" :disable="busy" :error="!!passwordError" hide-bottom-space>
          <template #append><q-btn flat round dense type="button" :disable="busy" :icon="showPassword ? 'visibility_off' : 'visibility'"
            :aria-label="showPassword ? 'Hide password' : 'Show password'" :aria-pressed="showPassword" @click="showPassword = !showPassword" /></template>
        </q-input>
      </ds-field>
      <div class="row items-center justify-between q-mt-lg q-gutter-sm">
        <ds-link v-if="view === 'login' && !busy" href="#reset" @click.prevent="changeView('reset')">Forgot your password?</ds-link>
        <q-btn v-if="view === 'reset'" outline no-caps color="primary" label="Cancel" :disable="busy" @click="changeView('login')" />
        <q-btn unelevated no-caps color="primary" type="submit" :loading="busy" :label="view === 'login' ? 'Log in' : 'Reset Password'" />
      </div>
    </q-form>
    <div v-else role="status">
      <q-btn outline no-caps color="primary" :label="view === 'sent' ? 'Use a different email' : 'Back to log in'" @click="changeView(view === 'sent' ? 'reset' : 'login')" />
      <ds-link v-if="view === 'sent'" href="#login" class="q-ml-md" @click.prevent="changeView('login')">Back to log in</ds-link>
    </div>
  </section>
</template>
