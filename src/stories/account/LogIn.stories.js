import { credentialsStory, baselineStory } from './_stories'

export default {
  // ASCII id: the title's "∕" (U+2215) would otherwise end up in the URL.
  id: 'sign-up-login-right-panel-log-in',
  title: 'Sign up ∕ Login/Right panel/Log in',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Phase 1 (login migration): the existing EventPipe login, rebuilt with DS controls, a keyboard-accessible password toggle and inline validation. **Today’s login** is the current production screen for comparison. Submissions are local simulations; any valid email and nonempty password advances the preview. Signing in is intentionally frozen for review. Left-rail treatments are reviewed under Sign up ∕ Login › Left rail.' } } },
}
export const Login = { name: 'Log in', ...credentialsStory() }
export const ValidationErrors = credentialsStory({ scenario: 'validation' })
export const InvalidCredentials = credentialsStory({ scenario: 'invalid' })
export const SigningIn = credentialsStory({ scenario: 'submitting' })
export const ServiceUnavailable = credentialsStory({ scenario: 'unavailable' })
export const SessionExpired = credentialsStory({ scenario: 'expired' })
export const TodaysLogin = { name: 'Today’s login (baseline)', ...baselineStory('login') }
