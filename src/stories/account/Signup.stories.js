/** ACCOUNT / Sign up → split layout: navy brand panel + registration form. */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'
import logoWhite from '../../assets/logo/eventpipe-logo-fff.svg'

export default {
  title: 'Account/Sign up',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**Sign up** — Untitled-UI split layout with the navy (#01113E) brand panel and a name / work email / password form.' } },
  },
}

const brandPanel = `
  <div class="ep-authx__brand">
    <img src="${logoWhite}" alt="EventPipe" class="ep-authx__brand-logo" />
    <div class="ep-authx__brand-body">
      <h2 class="ep-authx__headline">Start managing event lodging in minutes.</h2>
      <p class="ep-authx__subhead">Join the fastest-growing platform for event hotel bookings — trusted with over $1B in reservations.</p>
      <ul class="ep-authx__features">
        <li class="ep-authx__feature"><q-icon name="check_circle" size="20px" />Custom booking sites in under 10 minutes</li>
        <li class="ep-authx__feature"><q-icon name="check_circle" size="20px" />One dashboard for inventory, RFPs &amp; negotiations</li>
        <li class="ep-authx__feature"><q-icon name="check_circle" size="20px" />Flexible monetization &amp; integrated payments</li>
      </ul>
    </div>
  </div>`

export const Default = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ first: ref(''), last: ref(''), email: ref(''), pwd: ref(''), agree: ref(false) }),
    template: `
      <div class="ep-authx">
        ${brandPanel}
        <div class="ep-authx__form">
          <div class="ep-authx__form-inner">
            <h1 class="ep-auth__title">Create your account</h1>
            <p class="ep-auth__sub">Start managing event inventory in minutes.</p>

            <div class="column q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col"><ds-input v-model="first" label="First name" required placeholder="Jane" /></div>
                <div class="col"><ds-input v-model="last" label="Last name" required placeholder="Doe" /></div>
              </div>
              <ds-input v-model="email" type="email" label="Work email" required placeholder="you@company.com" />
              <ds-input v-model="pwd" type="password" label="Password" required placeholder="••••••••" hint="At least 8 characters." />
            </div>

            <div class="q-my-md">
              <q-checkbox v-model="agree" dense>
                <span class="text-body2">I agree to the <a href="#" class="ep-auth__link" @click.prevent>Terms</a> &amp; <a href="#" class="ep-auth__link" @click.prevent>Privacy Policy</a></span>
              </q-checkbox>
            </div>

            <q-btn unelevated no-caps color="primary" class="full-width" :disable="!agree" label="Create account" />
            <p class="ep-auth__foot">Already have an account? <a href="#" class="ep-auth__link" @click.prevent>Log in</a></p>
          </div>
        </div>
      </div>`,
  }),
}
