import AccountMfaPreview from './components/AccountMfaPreview.vue'

export default {
  // ASCII id: the title's "∕" (U+2215) would otherwise end up in the URL.
  id: 'sign-up-login-right-panel-mfa-methods',
  title: 'Sign up ∕ Login/Right panel/MFA methods',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Phase 2 (MFA): one story per verification method, email first. The end-to-end click-through is Sign up ∕ Login › Full flow. Use the Preview state selector above the screen to inspect related edge cases; Restart preview resets the form and timer. These controls are Storybook-only. Six digits and the masked email are illustrative. Any six digits completes the local preview; authentication and email are simulated. Verifying is frozen for review.' } },
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

// Email is the launch method, so it leads.
export const EmailCode = { name: 'Email code', ...milestone('Email code', {
  initialMethod: 'email',
  states: [
    state('default', 'Enter code · resend countdown'),
    state('invalid', 'Incorrect code', { scenario: 'invalid' }),
    state('expired', 'Expired code', { scenario: 'expired' }),
    state('ready', 'Resend available', { resendCooldown: 0 }),
    state('resent', 'Code resent', { scenario: 'resent' }),
    state('resendFailed', 'Resend failed', { scenario: 'resendFailed' }),
    state('verifying', 'Verifying', { scenario: 'verifying' }),
    state('sessionExpired', 'Session expired', { scenario: 'sessionExpired' }),
  ],
}) }
export const Authenticator = milestone('Authenticator', {
  states: [
    state('default', 'Enter code'),
    state('invalid', 'Incorrect code', { scenario: 'invalid' }),
    state('expired', 'Expired code', { scenario: 'expired' }),
    state('verifying', 'Verifying', { scenario: 'verifying' }),
    state('sessionExpired', 'Session expired', { scenario: 'sessionExpired' }),
  ],
})
export const TryAnotherWay = { name: 'Choose another method', ...milestone('Choose another method', {
  states: [
    state('both', 'Email and authenticator', { scenario: 'choose' }),
    state('email', 'Email only', { scenario: 'choose', authenticatorAvailable: false }),
    state('authenticator', 'Authenticator only', { scenario: 'choose', emailAvailable: false }),
    state('none', 'No available method', { scenario: 'choose', emailAvailable: false, authenticatorAvailable: false }),
  ],
}) }
