import { credentialsStory, baselineStory } from './_stories'

export default {
  // ASCII id: the title's "∕" (U+2215) would otherwise end up in the URL.
  id: 'sign-up-login-right-panel-forgot-password',
  title: 'Sign up ∕ Login/Right panel/Forgot password',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Phase 1 (login migration): the reset-password request. Cancel returns to log in and keeps the entered email; the confirmation reads the same whether or not an account exists. **Today’s reset** is the current production screen for comparison. Sending is intentionally frozen for review.' } } },
}
export const ResetPassword = { name: 'Reset password', ...credentialsStory({ initialView: 'reset' }) }
export const InvalidEmail = credentialsStory({ initialView: 'reset', scenario: 'validation' })
export const SendingReset = credentialsStory({ initialView: 'reset', scenario: 'submitting' })
export const ResetUnavailable = credentialsStory({ initialView: 'reset', scenario: 'unavailable' })
export const ResetRequested = credentialsStory({ initialView: 'sent' })
export const TodaysReset = { name: 'Today’s reset (baseline)', ...baselineStory('reset') }
