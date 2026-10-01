import AccountMfaPreview from './components/AccountMfaPreview.vue'

export default {
  // ASCII id: the title's "∕" (U+2215) would otherwise end up in the URL.
  id: 'sign-up-login-full-flow',
  title: 'Sign up ∕ Login/Full flow',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The whole sign-in, end to end: log in → email code → completion, with **Try another way** → authenticator one step away. Use **Preview state** to start at log in, the email code or the authenticator; **Restart preview** resets the form and timer. These controls are Storybook-only. Any valid email and password, then any six digits, completes the preview; nothing is sent.' } },
  },
}

const state = (value, label, props = {}) => ({ value, label, props })
const milestone = (name, args) => ({
  name,
  render: () => ({
    components: { AccountMfaPreview },
    setup: () => ({ args }),
    template: '<account-mfa-preview v-bind="args" />',
  }),
})

// The full flow leads with the emailed code after log in (2026-10-01); the
// authenticator is one step away under "Try another way".
export const InteractiveFlow = { name: 'Full flow', ...milestone('Full flow', {
  fullFlow: true,
  initialMethod: 'email',
  states: [
    state('login', 'Start at login'),
    state('email', 'Start at email verification', { initialMethod: 'email' }),
    state('authenticator', 'Start at authenticator', { initialMethod: 'authenticator' }),
  ],
}) }
