/** ACCOUNT / Forgot password → request-reset + sent states. */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'
import logo from '../../assets/logo/eventpipe-logo.svg'

export default {
  title: 'Account/Forgot password',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Beginning-stage **Forgot password** — request a reset link, plus the confirmation state.' } },
  },
}

export const RequestReset = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ logo, email: ref('') }),
    template: `
      <div class="ep-auth">
        <div class="ep-auth__card">
          <img :src="logo" alt="EventPipe" class="ep-auth__logo" />
          <h1 class="ep-auth__title">Forgot password?</h1>
          <p class="ep-auth__sub">Enter your email and we'll send a reset link.</p>

          <ds-input v-model="email" type="email" label="Email" required placeholder="you@company.com" />

          <q-btn unelevated no-caps color="primary" class="full-width q-mt-lg" label="Send reset link" />

          <p class="ep-auth__foot"><a href="#" class="ep-auth__link" @click.prevent>← Back to log in</a></p>
        </div>
      </div>`,
  }),
}

export const LinkSent = {
  render: () => ({
    setup: () => ({ logo }),
    template: `
      <div class="ep-auth">
        <div class="ep-auth__card" style="text-align:center;">
          <img :src="logo" alt="EventPipe" class="ep-auth__logo" style="margin-left:auto; margin-right:auto;" />
          <q-icon name="mark_email_read" size="48px" color="primary" class="q-mb-md" />
          <h1 class="ep-auth__title">Check your email</h1>
          <p class="ep-auth__sub">We sent a reset link to <strong>you@company.com</strong>. It expires in 30 minutes.</p>
          <q-btn outline no-caps color="primary" class="full-width" label="Resend link" />
          <p class="ep-auth__foot"><a href="#" class="ep-auth__link" @click.prevent>← Back to log in</a></p>
        </div>
      </div>`,
  }),
}
