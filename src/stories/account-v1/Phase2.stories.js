import AccountV1MfaPreview from './components/AccountV1MfaPreview.vue'

export default {
  title: 'Account V1/Phase 2 · MFA/Layouts',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Four review milestones for Rob’s second phase. Use the Preview state selector above the screen to inspect related edge cases; Restart preview resets the form and timer. These controls are Storybook-only. Six digits and the masked email are illustrative. Any six digits completes the local preview; authentication and email are simulated. Verifying is frozen for review.' } },
  },
}

const state = (value, label, props = {}) => ({ value, label, props })
const milestone = (name, args) => ({
  name,
  render: () => ({
    components: { AccountV1MfaPreview },
    setup: () => ({ args }),
    template: '<account-v1-mfa-preview v-bind="args" />',
  }),
})

// Keep these export names so the main review URLs continue to work.
export const Authenticator = milestone('Authenticator', {
  states: [
    state('default', 'Enter code'),
    state('invalid', 'Incorrect code', { scenario: 'invalid' }),
    state('expired', 'Expired code', { scenario: 'expired' }),
    state('verifying', 'Verifying', { scenario: 'verifying' }),
    state('sessionExpired', 'Session expired', { scenario: 'sessionExpired' }),
  ],
})
export const EmailCode = { name: 'Email verification', ...milestone('Email verification', {
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
export const TryAnotherWay = { name: 'Choose another method', ...milestone('Choose another method', {
  states: [
    state('both', 'Email and authenticator', { scenario: 'choose' }),
    state('email', 'Email only', { scenario: 'choose', authenticatorAvailable: false }),
    state('authenticator', 'Authenticator only', { scenario: 'choose', emailAvailable: false }),
    state('none', 'No available method', { scenario: 'choose', emailAvailable: false, authenticatorAvailable: false }),
  ],
}) }
export const InteractiveFlow = { name: 'Full flow', ...milestone('Full flow', {
  fullFlow: true,
  states: [
    state('login', 'Start at login'),
    state('authenticator', 'Start at authenticator', { initialMethod: 'authenticator' }),
    state('email', 'Start at email verification', { initialMethod: 'email' }),
  ],
}) }
