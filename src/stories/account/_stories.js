import { ref } from 'vue'
import DsField from '../../components/DsField.vue'
import DsLink from '../../components/DsLink.vue'
import DsText from '../../components/DsText.vue'
import logoWhite from '../../assets/logo/eventpipe-logo-fff.svg'
import AccountLayout from './components/AccountLayout.vue'
import AccountCredentials from './components/AccountCredentials.vue'
import './account.css'

// Illustrative editorial content, not a claim that a feature has shipped.
export const sampleUpdate = {
  title: 'Stay up to date with EventPipe',
  body: 'Find the latest product improvements and tips for your team here. This is sample announcement copy for design review.',
}

/** A right-panel credentials screen (log in or reset) on the brand-only left rail. */
export const credentialsStory = (args = {}) => ({
  args,
  render: (args) => ({
    components: { AccountLayout, AccountCredentials },
    setup: () => ({ args }),
    template: '<account-layout :update="args.update"><account-credentials :key="args.initialView + args.scenario" :initial-view="args.initialView" :scenario="args.scenario" /></account-layout>',
  }),
})

/**
 * Today's production screen, rebuilt from screenshots (formerly Account V1 ›
 * Account access). Kept as the "before" for the redesigned log in and reset.
 */
export const baselineStory = (initialState) => ({
  render: () => ({
    components: { DsField, DsLink, DsText },
    setup() {
      const state = ref(initialState)
      const email = ref('')
      const password = ref('')
      const switchState = (next) => { state.value = next; password.value = '' }
      return { state, email, password, switchState, logoWhite }
    },
    template: `
      <main class="ep-authx acct">
        <div class="ep-authx__brand acct__brand">
          <img :src="logoWhite" alt="EventPipe" class="acct__logo" />
        </div>
        <div class="ep-authx__form acct__form">
          <div class="acct__content">
            <ds-text as="h1" variant="h2">{{ state === 'login' ? 'Welcome!' : 'Forgot your password?' }}</ds-text>
            <p class="acct__intro">
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
              <div class="acct__actions row items-center justify-between q-mt-lg">
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
