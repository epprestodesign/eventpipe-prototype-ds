<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, useId } from 'vue'
import DsField from '../../../components/DsField.vue'
import DsText from '../../../components/DsText.vue'
import DsAlert from '../../../components/DsAlert.vue'
import AccountCodeInput from './AccountCodeInput.vue'
import AccountCodeResend from './AccountCodeResend.vue'
const props = defineProps({
  initialMethod: { type: String, default: 'authenticator' },
  scenario: { type: String, default: 'default' },
  emailAvailable: { type: Boolean, default: true },
  resendCooldown: { type: Number, default: 42 }, // Illustrative preview duration, not backend policy.
  authenticatorAvailable: { type: Boolean, default: true },
})
const emit = defineEmits(['back'])
const method = ref(props.initialMethod)
const choosing = ref(props.scenario === 'choose')
const code = ref('')
const verified = ref(false)
const codeError = ref(props.scenario === 'invalid' ? 'That code didn’t work. Check it and try again.' : '')
const expired = ref(props.scenario === 'expired')
const errorId = useId()
const remaining = ref(['expired', 'resendFailed'].includes(props.scenario) ? 0 : props.resendCooldown)
const wait = computed(() => `${Math.floor(remaining.value / 60)}:${String(remaining.value % 60).padStart(2, '0')}`)
let timer
onMounted(() => { timer = setInterval(() => { if (remaining.value > 0) remaining.value-- }, 1000) })
onUnmounted(() => clearInterval(timer))
// MFA notices use the DS inline Alert in its info (blue) severity — a calmer
// tone for an extra sign-in step (2026-10-01). The code field keeps its own
// inline validation message.
const notice = ref({
  expired: { title: 'This code has expired', description: props.initialMethod === 'email' ? 'Request a new email code to continue.' : 'Enter the latest code from your authenticator app.' },
  resendFailed: { title: 'We couldn’t send a code', description: 'Try again or choose another way.' },
  sessionExpired: { title: 'Your verification session has ended', description: 'Return to log in to start again.' },
}[props.scenario] || null)
const resent = ref(props.scenario === 'resent')
const busy = props.scenario === 'verifying'
const sessionExpired = props.scenario === 'sessionExpired'
const heading = ref(null)
const title = computed(() => verified.value ? 'Verification complete' : sessionExpired ? 'Log in again' : choosing.value ? 'Try another way' : method.value === 'email' ? 'Check your email' : 'Enter your authenticator code')
async function focusHeading() { await nextTick(); heading.value?.focus() }
function choose(next) {
  method.value = next; choosing.value = false; code.value = ''; codeError.value = ''; notice.value = null; resent.value = false
  expired.value = false; remaining.value = props.resendCooldown
  focusHeading()
}
function updateCode(value) {
  code.value = value; codeError.value = ''
  if (expired.value && method.value === 'authenticator') { expired.value = false; notice.value = null }
}
function verify() {
  if(busy || sessionExpired || expired.value) return
  codeError.value = /^\d{6}$/.test(code.value) ? '' : 'Enter the 6-digit code.'
  if(codeError.value) return
  verified.value = true
  focusHeading()
}
function resend() {
  if (busy || sessionExpired || remaining.value > 0) return
  notice.value = null; codeError.value = ''; code.value = ''; resent.value = true; expired.value = false
  remaining.value = props.resendCooldown
}
</script>

<template>
  <section>
    <div ref="heading" tabindex="-1"><ds-text as="h1" variant="h2">{{ title }}</ds-text></div>
    <ds-alert v-if="notice" severity="info" :title="notice.title" :description="notice.description" class="q-mt-lg" />
    <template v-if="verified">
      <div class="q-my-lg"><ds-text as="p" role="status">This preview ends here. The application would open your account.</ds-text></div>
    </template>
    <template v-else-if="choosing && !sessionExpired">
      <div class="q-my-lg"><ds-text as="p">Choose an available verification method for your account.</ds-text></div>
      <div class="column q-gutter-md">
        <q-btn v-if="emailAvailable" outline no-caps color="primary" label="Email me a code" @click="choose('email')" />
        <q-btn v-if="authenticatorAvailable" outline no-caps color="primary" label="Use authenticator app" @click="choose('authenticator')" />
        <ds-alert v-if="!emailAvailable && !authenticatorAvailable" severity="info" title="No verification method is available" description="Contact your account administrator for help." />
      </div>
    </template>
    <template v-else-if="!sessionExpired">
      <div class="q-my-lg"><ds-text as="p">{{ method === 'email' ? 'Enter the code sent to j••••@example.com.' : 'Open your authenticator app and enter the code for EventPipe.' }}</ds-text></div>
      <q-form novalidate :aria-busy="busy" @submit="verify">
        <ds-field label="Verification code">
          <account-code-input :model-value="code" :disabled="busy || (expired && method === 'email')"
            :error="!!codeError" :describedby="codeError ? errorId : undefined"
            @update:model-value="updateCode" />
          <!-- An expired code is explained by the info Alert above; only a wrong
               code gets the red field message. -->
          <div v-if="codeError" :id="errorId" class="text-ds-danger text-caption q-mt-xs" role="alert">{{ codeError }}</div>
        </ds-field>
        <account-code-resend v-if="method === 'email'" :state="busy ? 'limited' : remaining > 0 ? 'cooling' : 'ready'"
          :wait="wait" @resend="resend" />
        <q-btn unelevated no-caps color="primary" label="Verify" type="submit" :loading="busy" :disable="expired" class="q-mt-lg full-width" />
      </q-form>
      <ds-alert v-if="method === 'email' && resent" severity="info" title="We sent a new code" description="Check your inbox and spam folder." class="q-mt-md" />
    </template>
    <div class="acct-verification__actions q-mt-lg">
      <q-btn v-if="!verified && !choosing && !sessionExpired" flat no-caps color="primary" label="Try another way" :disable="busy" @click="choosing = true; focusHeading()" />
      <q-btn flat no-caps color="primary" label="Back to log in" :disable="busy" @click="emit('back')" />
    </div>
  </section>
</template>

<style scoped>
.acct-verification__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
}
</style>
