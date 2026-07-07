/** ACCOUNT / Log in → split layout: navy brand panel + email/password form. */
import { ref } from 'vue'
import DsInput from '../../components/DsInput.vue'
import logoWhite from '../../assets/logo/eventpipe-logo-fff.svg'

export default {
  title: 'Account/Log in',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
**Log in** — an Untitled-UI-style split layout. Left: a navy (#01113E) brand
panel with the EventPipe headline and value bullets. Right: the email/password
form built from **Input** inside **Form Field**. Collapses to form-only under 900px.
` } },
  },
}

const brandPanel = `
  <div class="ep-authx__brand">
    <img src="${logoWhite}" alt="EventPipe" class="ep-authx__brand-logo" />
    <div class="ep-authx__brand-body">
      <h2 class="ep-authx__headline">Event hotel bookings, made a breeze.</h2>
      <p class="ep-authx__subhead">Manage and monetize lodging for your next event — the platform behind $1B+ in hotel bookings.</p>
      <ul class="ep-authx__features">
        <li class="ep-authx__feature"><q-icon name="check_circle" size="20px" />Spin up a custom booking site in under 10 minutes</li>
        <li class="ep-authx__feature"><q-icon name="check_circle" size="20px" />Manage inventory, RFPs &amp; hotel negotiations in one place</li>
        <li class="ep-authx__feature"><q-icon name="check_circle" size="20px" />Monitor Stay-to-Play compliance with ease</li>
      </ul>
    </div>
  </div>`

export const Default = {
  render: () => ({
    components: { DsInput },
    setup: () => ({ email: ref(''), pwd: ref(''), remember: ref(true) }),
    template: `
      <div class="ep-authx">
        ${brandPanel}
        <div class="ep-authx__form">
          <div class="ep-authx__form-inner">
            <h1 class="ep-auth__title">Log in to your account</h1>
            <p class="ep-auth__sub">Welcome back — please enter your details.</p>

            <div class="column q-gutter-md">
              <ds-input v-model="email" type="email" label="Email" required placeholder="you@company.com" />
              <ds-input v-model="pwd" type="password" label="Password" required placeholder="••••••••" />
            </div>

            <div class="row items-center justify-between q-my-md">
              <q-checkbox v-model="remember" label="Remember me" dense />
              <a href="#" class="ep-auth__link" @click.prevent>Forgot password?</a>
            </div>

            <q-btn unelevated no-caps color="primary" class="full-width" size="md" label="Log in" />
            <p class="ep-auth__foot">Don't have an account? <a href="#" class="ep-auth__link" @click.prevent>Sign up</a></p>
          </div>
        </div>
      </div>`,
  }),
}
