import AccountLayout from './components/AccountLayout.vue'
import AccountSignup from './components/AccountSignup.vue'

export default {
  // ASCII id: the title's "∕" (U+2215) would otherwise end up in the URL.
  id: 'sign-up-login-right-panel-sign-up',
  title: 'Sign up ∕ Login/Right panel/Sign up',
  parameters: { layout: 'fullscreen', docs: { description: { component: '**Concept.** Sign up on the same form pattern as Log in. Rob still has to confirm whether account creation or invitation pages exist and need migrating (Sign up ∕ Login › Overview, Decisions still needed). Submissions are local; Creating account is frozen for review.' } } },
}
const signupStory = (scenario = 'default') => ({
  render: () => ({
    components: { AccountLayout, AccountSignup },
    setup: () => ({ scenario }),
    template: '<account-layout><account-signup :scenario="scenario" /></account-layout>',
  }),
})
export const SignUp = { name: 'Sign up', ...signupStory() }
export const ValidationErrors = signupStory('validation')
export const EmailAlreadyUsed = signupStory('exists')
export const CreatingAccount = signupStory('submitting')
export const AccountCreated = signupStory('created')
