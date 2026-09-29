<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, useId } from 'vue'
import DsField from '../../../components/DsField.vue'
import DsText from '../../../components/DsText.vue'
import Av2CodeInput from '../../account-v2/components/Av2CodeInput.vue'
import Av2CodeResend from '../../account-v2/components/Av2CodeResend.vue'
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
const notice = ref({ expired: props.initialMethod === 'email' ? 'This code has expired. Request a new email code.' : 'This code has expired. Enter the latest code from your authenticator app.', resendFailed: 'We couldn’t send a code. Try again or choose another way.', sessionExpired: 'Your verification session has ended. Return to log in.' }[props.scenario] || '')
const resent = ref(props.scenario === 'resent')
const busy = props.scenario === 'verifying'
const sessionExpired = props.scenario === 'sessionExpired'
const heading = ref(null)
const title = computed(() => verified.value ? 'Verification complete' : sessionExpired ? 'Log in again' : choosing.value ? 'Try another way' : method.value === 'email' ? 'Check your email' : 'Enter your authenticator code')
async function focusHeading() { await nextTick(); heading.value?.focus() }
function choose(next) {
  method.value = next; choosing.value = false; code.value = ''; codeError.value = ''; notice.value = ''; resent.value = false
  expired.value = false; remaining.value = props.resendCooldown
  focusHeading()
}
function updateCode(value) {
  code.value = value; codeError.value = ''
  if (expired.value && method.value === 'authenticator') { expired.value = false; notice.value = '' }
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
  notice.value = ''; codeError.value = ''; code.value = ''; resent.value = true; expired.value = false
  remaining.value = props.resendCooldown
}
</script>

<template>
  <section>
    <div ref="heading" tabindex="-1"><ds-text as="h1" variant="h2">{{ title }}</ds-text></div>
    <q-banner v-if="notice" class="q-mt-lg" role="alert">{{ notice }}</q-banner>
    <template v-if="verified">
      <div class="q-my-lg"><ds-text as="p" role="status">This preview ends here. The application would open your account.</ds-text></div>
    </template>
    <template v-else-if="choosing && !sessionExpired">
      <div class="q-my-lg"><ds-text as="p">Choose an available verification method for your account.</ds-text></div>
      <div class="column q-gutter-md">
        <q-btn v-if="emailAvailable" outline no-caps color="primary" label="Email me a code" @click="choose('email')" />
        <q-btn v-if="authenticatorAvailable" outline no-caps color="primary" label="Use authenticator app" @click="choose('authenticator')" />
        <ds-text v-if="!emailAvailable && !authenticatorAvailable" as="p" role="status">No verification method is available. Contact your account administrator for help.</ds-text>
      </div>
    </template>
    <template v-else-if="!sessionExpired">
      <div class="q-my-lg"><ds-text as="p">{{ method === 'email' ? 'Enter the code sent to j••••@example.com.' : 'Open your authenticator app and enter the code for EventPipe.' }}</ds-text></div>
      <q-form novalidate :aria-busy="busy" @submit="verify">
        <ds-field label="Verification code">
          <av2-code-input :model-value="code" :disabled="busy || (expired && method === 'email')"
            :error="!!codeError || expired" :describedby="codeError || expired ? errorId : undefined"
            @update:model-value="updateCode" />
          <div v-if="codeError || expired" :id="errorId" class="text-ds-danger q-mt-sm" role="alert">
            {{ codeError || (method === 'email' ? 'Request a new code to continue.' : 'Use the latest code in your authenticator app.') }}
          </div>
        </ds-field>
        <av2-code-resend v-if="method === 'email'" :state="busy ? 'limited' : remaining > 0 ? 'cooling' : 'ready'"
          :wait="wait" @resend="resend" />
        <q-btn unelevated no-caps color="primary" label="Verify" type="submit" :loading="busy" :disable="expired" class="q-mt-lg full-width" />
      </q-form>
      <div v-if="method === 'email' && resent" class="q-mt-md">
        <ds-text as="p" role="status">A new code has been requested. Check your inbox and spam folder.</ds-text>
      </div>
    </template>
    <div class="av1-verification__actions q-mt-lg">
      <q-btn v-if="!verified && !choosing && !sessionExpired" flat no-caps color="primary" label="Try another way" :disable="busy" @click="choosing = true; focusHeading()" />
      <q-btn flat no-caps color="primary" label="Back to log in" :disable="busy" @click="emit('back')" />
    </div>
  </section>
</template>

<style scoped>
.av1-verification__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
}
</style>
