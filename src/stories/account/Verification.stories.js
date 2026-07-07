/** ACCOUNT / Verification → code entry using Pin Input. */
import { ref } from 'vue'
import DsPinInput from '../../components/DsPinInput.vue'
import logo from '../../assets/logo/eventpipe-logo.svg'

export default {
  title: 'Account/Verification',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Beginning-stage **Verification** — enter the emailed code via **Pin Input**.' } },
  },
}

export const Default = {
  render: () => ({
    components: { DsPinInput },
    setup: () => ({ logo, code: ref(''), done: ref(false) }),
    template: `
      <div class="ep-auth">
        <div class="ep-auth__card" style="text-align:center;">
          <img :src="logo" alt="EventPipe" class="ep-auth__logo" style="margin-left:auto; margin-right:auto;" />
          <h1 class="ep-auth__title">Verify your email</h1>
          <p class="ep-auth__sub">Enter the 6-digit code we sent to <strong>you@company.com</strong>.</p>

          <div class="flex flex-center q-my-lg">
            <ds-pin-input v-model="code" :length="6" type="number" @complete="done = true" />
          </div>

          <q-btn unelevated no-caps color="primary" class="full-width" :disable="code.length < 6" label="Verify" />
          <p class="ep-auth__hint q-mt-md">Didn't get a code? <a href="#" class="ep-auth__link" @click.prevent>Resend</a></p>
        </div>
      </div>`,
  }),
}
