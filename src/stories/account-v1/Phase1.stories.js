import { credentialsStory, sampleUpdate } from './_stories'
export default {
  title: 'Account V1/Phase 1 · Login migration/Layouts',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Rob’s first phase: the existing EventPipe login and reset request. Existing DS controls with clearer reset copy, a keyboard-accessible password toggle and inline validation. Submissions are local simulations; any valid email and nonempty password advances the preview. Loading stories are intentionally frozen for review.' } } },
}
export const Login = credentialsStory()
export const ResetPassword = credentialsStory({ initialView: 'reset' })
export const WithProductUpdate = credentialsStory({ update: sampleUpdate })
export const NoProductUpdate = credentialsStory({ update: null })
export const ValidationErrors = credentialsStory({ scenario: 'validation' })
export const InvalidCredentials = credentialsStory({ scenario: 'invalid' })
export const SigningIn = credentialsStory({ scenario: 'submitting' })
export const ServiceUnavailable = credentialsStory({ scenario: 'unavailable' })
export const SessionExpired = credentialsStory({ scenario: 'expired' })
export const ResetInvalidEmail = credentialsStory({ initialView: 'reset', scenario: 'validation' })
export const SendingReset = credentialsStory({ initialView: 'reset', scenario: 'submitting' })
export const ResetUnavailable = credentialsStory({ initialView: 'reset', scenario: 'unavailable' })
export const ResetRequested = credentialsStory({ initialView: 'sent' })
