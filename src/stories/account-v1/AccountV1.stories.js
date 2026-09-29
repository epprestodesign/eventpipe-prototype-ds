import { ref } from 'vue'
import DsField from '../../components/DsField.vue'
import DsLink from '../../components/DsLink.vue'
import DsText from '../../components/DsText.vue'
import logoWhite from '../../assets/logo/eventpipe-logo-fff.svg'
import './account-v1.css'

export default {
  title: 'Account V1/Account access',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Existing account login and password reset screens, composed from DsField, QInput, QBtn, DsLink and the existing reversed EventPipe logo. Uses the design system’s typography, colors and controls. Form submissions stay local to this preview.' } },
  },
}

const screen = (initialState) => ({
  render: () => ({
    components: { DsField, DsLink, DsText },
    setup() {
      const state = ref(initialState)
      const email = ref('')
      const password = ref('')
      const switchState = (next) => {
        state.value = next
        password.value = ''
      }
      return { state, email, password, switchState, logoWhite }
    },
    template: `
      <main class="ep-authx account-v1">
        <div class="ep-authx__brand account-v1__brand">
          <img :src="logoWhite" alt="EventPipe" class="account-v1__logo" />
        </div>
        <div class="ep-authx__form account-v1__form">
          <div class="account-v1__content">
            <ds-text as="h1" variant="h2">{{ state === 'login' ? 'Welcome!' : 'Forgot your password?' }}</ds-text>
            <p class="account-v1__intro">
              {{ state === 'login'
                ? 'Please enter your credentials to access your account.'
                : 'We got you, type in an email and we will send you the steps you recover your account.' }}
            </p>
            <q-form @submit.prevent>
              <div class="column q-gutter-lg">
                <ds-field label="Email">
                  <q-input v-model="email" outlined dense hide-bottom-space type="email"
                    aria-label="Email" autocomplete="username"
                    :placeholder="state === 'login' ? 'Email' : ''" />
                </ds-field>
                <ds-field v-if="state === 'login'" label="Password">
                  <q-input v-model="password" outlined dense hide-bottom-space type="password"
                    aria-label="Password" autocomplete="current-password" placeholder="Password" />
                </ds-field>
              </div>
              <div class="account-v1__actions row items-center justify-between q-mt-lg">
                <div v-if="state === 'login'">
                  Forgot your password?
                  <ds-link class="q-ml-sm" href="#reset-password" @click.prevent="switchState('reset')">Reset Password</ds-link>
                </div>
                <q-btn v-else outline no-caps color="primary" label="Cancel" type="button" @click="switchState('login')" />
                <q-btn unelevated no-caps color="primary" type="submit" :label="state === 'login' ? 'Log in' : 'Reset Password'" />
              </div>
            </q-form>
          </div>
        </div>
      </main>`,
  }),
})

export const Login = { name: 'Log in', ...screen('login') }
export const ResetPassword = { name: 'Reset password', ...screen('reset') }
