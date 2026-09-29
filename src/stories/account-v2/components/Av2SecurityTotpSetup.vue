<script setup>
/* Av2SecurityTotpSetup — authenticator-app setup, opened from the Two-factor
 * card on Account Security. ENG-3033 (scheduled later, not launch): "QR code,
 * manual-entry key, a confirm step, and recovery codes to download".
 *
 * A DsModal rather than a DsSidePanel: this is a short, linear, blocking task
 * — scan, confirm, save codes — that should hold the user's full attention and
 * end back on the page it started from. A side panel suits editing a record
 * alongside the page; nothing on the page behind is useful mid-setup.
 *
 * Three steps: scan → verify → codes. Escapable until the code is verified;
 * from the codes step on, the modal is persistent with no close button and the
 * primary is gated on "I've saved these", because the codes are shown once and
 * a user who closes this page has a second factor with no way around it.
 */
import { computed, ref } from 'vue'
import DsModal from '../../../components/DsModal.vue'
import Av2CodeInput from './Av2CodeInput.vue'
import Av2EnrollQr from './Av2EnrollQr.vue'
import Av2EnrollSetupKey from './Av2EnrollSetupKey.vue'
import Av2EnrollCodeSheet from './Av2EnrollCodeSheet.vue'
import Av2EnrollNotice from './Av2EnrollNotice.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** 'scan' | 'verify' | 'verify-error' | 'codes' */
  step: { type: String, default: 'scan' },
  email: { type: String, required: true },
  secret: { type: String, required: true },
  codes: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue', 'done'])

const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const current = ref(props.step === 'verify-error' ? 'verify' : props.step)
const code = ref(props.step === 'verify-error' ? '104822' : '')
const error = ref(props.step === 'verify-error'
  ? 'That code wasn’t accepted. Enter the code showing in your app now — they change every 30 seconds. If it keeps failing, check your phone’s clock is set automatically.'
  : '')
const saved = ref(false)

const STEP_NO = { scan: 1, verify: 2, codes: 3 }
const locked = computed(() => current.value === 'codes')
const title = computed(() => (locked.value ? 'Save your recovery codes' : 'Set up authenticator app'))

function finish () { emit('done'); open.value = false }
</script>

<template>
  <ds-modal v-model="open" size="md" :title="title"
    :subtitle="'Step ' + STEP_NO[current] + ' of 3'"
    :persistent="locked" :hide-close="locked">

    <!-- 1 · Scan ------------------------------------------------------------>
    <div v-if="current === 'scan'" class="av2tot">
      <p class="av2tot__lead">
        In your authenticator app, choose <strong>Add account</strong> and scan this code.
        It will be saved as <strong>{{ email }}</strong>.
      </p>
      <div class="av2tot__qr"><av2-enroll-qr /></div>
      <av2-enroll-setup-key :secret="secret" />
    </div>

    <!-- 2 · Verify ---------------------------------------------------------->
    <div v-else-if="current === 'verify'" class="av2tot">
      <p class="av2tot__lead">
        Enter the 6-digit code your app shows for EventPipe. This proves the app is set up before
        we switch it on, so a bad scan can't lock you out.
      </p>
      <div class="av2tot__code">
        <av2-code-input v-model="code" :error="!!error" autofocus />
      </div>
      <p v-if="error" class="av2tot__error" role="alert">
        <q-icon name="error" size="17px" class="av2tot__erricon" /><span>{{ error }}</span>
      </p>
      <p v-else class="av2tot__hint">The code changes every 30 seconds.</p>
    </div>

    <!-- 3 · Recovery codes -------------------------------------------------->
    <div v-else class="av2tot">
      <av2-enroll-notice tone="success" title="Authenticator app is on" style="margin-top:0;">
        <p>From your next sign-in we'll ask for a code from your app.</p>
      </av2-enroll-notice>
      <p class="av2tot__lead" style="margin-top:18px;">
        These ten codes get you in if you lose your phone. Each one works once.
      </p>
      <av2-enroll-code-sheet :codes="codes" />
      <av2-enroll-notice tone="warning" icon="visibility_off" title="This is the only time we'll show them">
        <p>
          We keep only a hash of each code, so nobody at EventPipe can read them back to you. If you
          lose them, generate a new set from this page.
        </p>
      </av2-enroll-notice>
      <div style="margin-top:16px;">
        <q-checkbox v-model="saved" color="primary" size="sm" label="I've saved these codes somewhere safe" />
      </div>
    </div>

    <template #footer>
      <q-btn v-if="current === 'scan'" flat no-caps color="primary" label="Cancel" @click="open = false" />
      <q-btn v-else-if="current === 'verify'" flat no-caps color="primary" label="Back" @click="current = 'scan'" />
      <span v-else />

      <q-btn v-if="current === 'scan'" unelevated no-caps color="primary" label="Continue"
        @click="current = 'verify'" />
      <q-btn v-else-if="current === 'verify'" unelevated no-caps color="primary" label="Verify and turn on"
        :disable="code.length < 6" @click="error = ''; current = 'codes'" />
      <q-btn v-else unelevated no-caps color="primary" label="Done" :disable="!saved" @click="finish" />
    </template>
  </ds-modal>
</template>

<style scoped>
.av2tot__lead { margin: 0 0 16px; font-size: 0.9375rem; line-height: 1.55; color: var(--ds-color-text); }
.av2tot__qr { display: flex; justify-content: center; }
.av2tot__code { max-width: 360px; }
.av2tot__error {
  display: flex; gap: 7px; align-items: flex-start; margin: 12px 0 0;
  font-size: 0.8125rem; line-height: 1.5; color: var(--ds-color-text-danger);
}
.av2tot__erricon { flex: none; margin-top: 1px; }
.av2tot__hint { margin: 12px 0 0; font-size: 0.8125rem; color: var(--ds-color-text-subtlest); }
</style>
