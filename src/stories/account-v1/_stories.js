import AccountV1Layout from './components/AccountV1Layout.vue'
import AccountV1Credentials from './components/AccountV1Credentials.vue'

// Illustrative editorial content, not a claim that a feature has shipped.
export const sampleUpdate = {
  title: 'Stay up to date with EventPipe',
  body: 'Find the latest product improvements and tips for your team here. This is sample announcement copy for design review.',
}

export const credentialsStory = (args = {}) => ({
  args,
  render: (args) => ({
    components: { AccountV1Layout, AccountV1Credentials },
    setup: () => ({ args }),
    template: '<account-v1-layout :update="args.update"><account-v1-credentials :key="args.initialView + args.scenario" :initial-view="args.initialView" :scenario="args.scenario" /></account-v1-layout>',
  }),
})
