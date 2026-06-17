// MANAGE BOOKING / Account — the full account page reached from the Global Nav's
// "Manage Booking" button: a left greeting + rewards + selectable menu, and a
// right content panel per section. Each story opens a different section; the
// "From Global Nav" story wires the nav button to reveal the page.
import { ref } from 'vue'
import ManageBooking from '../../components/managebooking/ManageBooking.vue'
import GlobalNav from '../../components/GlobalNav.vue'

export default {
  title: 'Manage Booking/Account',
  component: ManageBooking,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Overview
The **Manage Booking** account page. The left column has a greeting, a rewards
card, and a selectable menu (**My list, Profile, Communications, Payment methods,
Security and settings, Help and feedback**); the right column shows the active
section. Click a menu row to switch sections. Accents use the DS primary (Zinc).
Opens from the Global Nav's **Manage Booking** button — see *From Global Nav*.
` } } },
}

const section = (key) => ({
  render: () => ({
    components: { ManageBooking },
    setup: () => ({ key }),
    template: `<manage-booking :default-section="key" />`,
  }),
})

/** Default — Help and feedback (matches the reference). */
export const Default = section('help')
export const MyList = { name: 'My list', ...section('list') }
export const Profile = section('profile')
export const Communications = section('communications')
export const PaymentMethods = { name: 'Payment methods', ...section('payment') }
export const SecurityAndSettings = { name: 'Security and settings', ...section('security') }
export const HelpAndFeedback = { name: 'Help and feedback', ...section('help') }

/** From the Global Nav — click "Manage Booking" to open the account page. */
export const FromGlobalNav = {
  name: 'From Global Nav',
  render: () => ({
    components: { GlobalNav, ManageBooking },
    setup() {
      const showAccount = ref(false)
      return { showAccount }
    },
    template: `
      <div>
        <global-nav brand="Presto" @manage="showAccount = true" />
        <manage-booking v-if="showAccount" default-section="profile" @sign-out="showAccount = false" />
        <div v-else style="max-width:1040px;margin:0 auto;padding:48px 24px;color:var(--ds-color-text-subtle)">
          Click <strong style="color:var(--ds-color-text)">Manage Booking</strong> in the nav to open your account.
        </div>
      </div>`,
  }),
}
