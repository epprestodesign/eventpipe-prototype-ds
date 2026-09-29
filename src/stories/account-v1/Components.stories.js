import AccountV1Credentials from './components/AccountV1Credentials.vue'
import AccountV1Verification from './components/AccountV1Verification.vue'
import AccountV1Updates from './components/AccountV1Updates.vue'
import { sampleUpdate } from './_stories'

export default {
  title: 'Account V1/Components',
  parameters: { layout: 'padded', docs: { description: { component: 'Reusable compositions of existing DsField, DsText, DsLink, QInput, QBtn, QBanner and QCard. No new control primitives. The announcement is an optional editorial surface; authoring and publishing infrastructure are not implemented.' } } },
}
const componentStory = (component, args = {}) => ({
  args,
  render: (args) => ({
    components: { Preview: component },
    setup: () => ({ args }),
    template: '<div style="max-width:440px"><preview v-bind="args" /></div>',
  }),
})
export const LoginForm = componentStory(AccountV1Credentials)
export const ResetForm = componentStory(AccountV1Credentials, { initialView: 'reset' })
export const VerificationForm = componentStory(AccountV1Verification)
export const MethodPicker = componentStory(AccountV1Verification, { scenario: 'choose' })
export const ProductUpdate = componentStory(AccountV1Updates, sampleUpdate)
export const LongProductUpdate = componentStory(AccountV1Updates, {
  title: 'A longer product announcement for teams managing multiple events and hotel partners',
  body: 'Sample editorial content to review wrapping and readability. Product managers can describe what changed, who benefits, and where to learn more. The card grows with the copy so that text stays readable without truncating important information.',
})
export const TextOnlyUpdate = componentStory(AccountV1Updates, { title: 'Product news', body: 'Sample announcement without a destination link.' })
