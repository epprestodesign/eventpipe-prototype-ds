<script setup>
// ManageBooking — the full "Manage Booking" account page (Expedia-style): a left
// column with a greeting, a rewards card, and a selectable menu list; a right
// column showing the active section's content. Opened from the Global Nav's
// "Manage Booking" button. Accents use the DS primary (Zinc).
import { ref, reactive, computed } from 'vue'
import { paymentLogo } from '../../lib/paymentLogos'
import SavedItems from '../yourtrips/SavedItems.vue'
import ProfileEditModal from './ProfileEditModal.vue'
import AddPaymentDialog from '../checkout/AddPaymentDialog.vue'

const props = defineProps({
  user: { type: Object, default: () => ({ name: 'Justin Girard', email: 'hello@girardjustin.com' }) },
  methods: { type: Array, default: () => ([
    { logo: 'Amex', last4: '1009', label: 'Amex', sub: 'Default' },
    { logo: 'Visa', last4: '4242', label: 'Visa' },
  ]) },
  saved: { type: Array, default: () => ([
    { id: 'h1', name: 'Hampton Inn Boston-Logan Airport', rating: 3.8, reviews: 3254, hotelClass: '3-star hotel', imageCategories: ['exterior', 'lobby'], seed: 0 },
    { id: 'h2', name: 'The Concord Hotel', rating: 4.4, reviews: 1190, hotelClass: '4-star hotel', imageCategories: ['lobby', 'rooms'], seed: 1 },
  ]) },
  defaultSection: { type: String, default: 'profile' },
})
const emit = defineEmits(['sign-out', 'select', 'edit-profile'])

// Name → "First L." display + "FL" avatar initials.
const nameParts = computed(() => (props.user.name || '').trim().split(/\s+/).filter(Boolean))
const displayName = computed(() => {
  const p = nameParts.value
  if (!p.length) return ''
  return p.length > 1 ? `${p[0]} ${p[p.length - 1][0].toUpperCase()}.` : p[0]
})
const initials = computed(() => {
  const p = nameParts.value
  if (!p.length) return ''
  return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase()
})
const editProfile = () => { active.value = 'profile'; editSection.value = 'basic'; editOpen.value = true; emit('edit-profile') }

const SECTIONS = [
  { key: 'list', icon: 'bookmarks', title: 'My list', subtitle: 'Hotels and trips you’ve saved' },
  { key: 'profile', icon: 'person', title: 'Profile', subtitle: 'Provide your personal details and travel documents' },
  { key: 'communications', icon: 'mail', title: 'Communications', subtitle: 'Control which notifications you get' },
  { key: 'payment', icon: 'credit_card', title: 'Payment methods', subtitle: 'View saved payment methods' },
  { key: 'security', icon: 'settings', title: 'Security and settings', subtitle: 'Update your email or password' },
  { key: 'help', icon: 'help', title: 'Help and feedback', subtitle: 'Get customer support' },
]

const active = ref(props.defaultSection)
const select = (key) => { active.value = key; emit('select', key) }
const activeSection = computed(() => SECTIONS.find((s) => s.key === active.value) || SECTIONS[0])
// The profile section is headed by the member's full name, not "Profile".
const contentTitle = computed(() => (active.value === 'profile' ? props.user.name : activeSection.value.title))

// Profile data (editable via the full-height modal).
const basicInfo = reactive({ firstName: 'Justin', middleName: '', lastName: 'Girard', bio: '', dobMonth: '', dobDay: '', dobYear: '', gender: '', accessibility: 'Not provided' })
const contactInfo = reactive({ email: 'hello@girardjustin.com', phone: '', emergency: '', address: '' })

const genderLabels = { female: 'Female', male: 'Male', x: 'Unspecified (X)', u: 'Undisclosed (U)' }
const dobDisplay = computed(() => (basicInfo.dobMonth && basicInfo.dobDay && basicInfo.dobYear) ? `${basicInfo.dobMonth}/${basicInfo.dobDay}/${basicInfo.dobYear}` : '')
const basicRows = computed(() => [
  { label: 'Name', value: [basicInfo.firstName, basicInfo.middleName, basicInfo.lastName].filter(Boolean).join(' ') },
  { label: 'Date of birth', value: dobDisplay.value },
  { label: 'Bio', value: basicInfo.bio },
  { label: 'Gender', value: genderLabels[basicInfo.gender] || '' },
  { label: 'Accessibility needs', value: basicInfo.accessibility && basicInfo.accessibility !== 'Not provided' ? basicInfo.accessibility : '' },
])
const contactRows = computed(() => [
  { label: 'Email', value: contactInfo.email },
  { label: 'Phone number', value: contactInfo.phone },
  { label: 'Emergency contact', value: contactInfo.emergency },
  { label: 'Address', value: contactInfo.address },
])

// Saved payment cards (local copy so delete works in the showcase).
const cards = ref(props.methods.map((m) => ({ ...m })))
const removeCard = (m) => { cards.value = cards.value.filter((x) => x !== m) }
const addCardOpen = ref(false)
const onCardAdded = (c) => { cards.value.push({ logo: c.brand, label: c.brand, last4: c.last4 }) }

// Full-height edit modal.
const editOpen = ref(false)
const editSection = ref('basic')
const openEdit = (section) => { editSection.value = section; editOpen.value = true }
const onProfileSave = ({ section, values }) => { Object.assign(section === 'contact' ? contactInfo : basicInfo, values) }
const comms = ref([
  { label: 'Deals and offers', sub: 'Promotions, discounts, and member perks', on: true },
  { label: 'Trip updates', sub: 'Booking confirmations and reminders', on: true },
  { label: 'Recommendations', sub: 'Hotels and destinations you might like', on: false },
  { label: 'Surveys and feedback', sub: 'Occasional invitations to share feedback', on: false },
])
const securityRows = [
  { icon: 'mail', label: 'Email', value: 'hello@girardjustin.com', action: 'Change' },
  { icon: 'lock', label: 'Password', value: 'Last changed 3 months ago', action: 'Change' },
  { icon: 'verified_user', label: 'Two-factor authentication', value: 'Off', action: 'Set up' },
]
const helpRows = [
  { icon: 'forum', label: 'Chat now' },
  { icon: 'help_outline', label: 'Visit the Help Center' },
  { icon: null, label: 'Share your feedback' },
]
</script>

<template>
  <div class="mb">
    <div class="mb__inner">
      <!-- LEFT: greeting + rewards + menu -->
      <aside class="mb__side">
        <div class="mb__profilehead">
          <span class="mb__avatar">{{ initials }}</span>
          <div class="mb__id">
            <strong class="mb__name">{{ displayName }}</strong>
            <span class="mb__email">{{ user.email }}</span>
          </div>
          <button class="mb__edit" @click="editProfile"><q-icon name="edit" size="16px" /> Edit profile</button>
        </div>

        <nav class="mb__menu">
          <button
            v-for="s in SECTIONS" :key="s.key"
            type="button" class="mb__item" :class="{ 'is-active': s.key === active }"
            @click="select(s.key)"
          >
            <span class="mb__item-ico"><q-icon :name="s.icon" size="20px" /></span>
            <span class="mb__item-text">
              <strong>{{ s.title }}</strong>
              <span>{{ s.subtitle }}</span>
            </span>
            <q-icon name="chevron_right" size="20px" class="mb__item-chev" />
          </button>
        </nav>

        <button class="mb__signout" @click="emit('sign-out')">Sign out</button>
      </aside>

      <!-- RIGHT: active section content -->
      <section class="mb__content">
        <h2 class="mb__h2">{{ contentTitle }}</h2>

        <!-- My list -->
        <div v-if="active === 'list'">
          <p class="mb__lede">Hotels and trips you’ve saved for later.</p>
          <saved-items :items="saved" title="Saved Hotels" />
        </div>

        <!-- Profile -->
        <div v-else-if="active === 'profile'" class="mb__profile">
          <section class="mb__subsec">
            <div class="mb__subhead"><h3>Basic information</h3><button class="mb__row-action" @click="openEdit('basic')">Edit</button></div>
            <p class="mb__subsub">Make sure this information matches your travel ID, like your passport or license.</p>
            <dl class="mb__deflist">
              <div v-for="r in basicRows" :key="r.label"><dt>{{ r.label }}</dt><dd :class="{ 'is-empty': !r.value }">{{ r.value || 'Not provided' }}</dd></div>
            </dl>
          </section>

          <section class="mb__subsec">
            <div class="mb__subhead"><h3>Contact</h3><button class="mb__row-action" @click="openEdit('contact')">Edit</button></div>
            <p class="mb__subsub">Receive account activity alerts and trip updates by sharing this information.</p>
            <dl class="mb__deflist">
              <div v-for="r in contactRows" :key="r.label"><dt>{{ r.label }}</dt><dd :class="{ 'is-empty': !r.value }">{{ r.value || 'Not provided' }}</dd></div>
            </dl>
          </section>

          <section class="mb__subsec">
            <h3 class="mb__subonly">More details</h3>
            <dl class="mb__deflist">
              <div><dt>Airport security</dt><dd class="is-empty">TSA PreCheck and Redress number</dd></div>
              <div><dt>Travel documents</dt><dd class="is-empty">Passport and travel IDs</dd></div>
            </dl>
          </section>

          <section class="mb__subsec">
            <h3 class="mb__subonly">Additional travelers</h3>
            <p class="mb__subsub">Make booking a breeze by saving profiles of family, friends, or teammates who often travel with you.</p>
            <button class="mb__rowbox mb__rowbox--btn"><q-icon name="add" size="20px" class="mb__rowico" /><span class="mb__rowlabel">Add additional traveler</span><q-icon name="chevron_right" size="20px" class="mb__rowchev" /></button>
          </section>
        </div>

        <!-- Communications -->
        <div v-else-if="active === 'communications'">
          <p class="mb__lede">Choose what we contact you about.</p>
          <div class="mb__stack">
            <label v-for="c in comms" :key="c.label" class="mb__rowbox mb__rowbox--comm">
              <span class="mb__toggle-text"><strong>{{ c.label }}</strong><span>{{ c.sub }}</span></span>
              <q-toggle v-model="c.on" color="dark" />
            </label>
          </div>
        </div>

        <!-- Payment methods -->
        <div v-else-if="active === 'payment'">
          <p class="mb__lede">Manage the cards saved to your account.</p>
          <ul class="mb__cards">
            <li v-for="m in cards" :key="m.last4" class="mb__card">
              <img v-if="paymentLogo(m.logo)" :src="paymentLogo(m.logo)" :alt="m.label" class="mb__card-logo" />
              <span class="mb__card-text"><strong>{{ m.label }} •••• {{ m.last4 }}</strong><span v-if="m.sub">{{ m.sub }}</span></span>
              <span class="mb__card-actions">
                <button class="mb__editicon" :aria-label="'Edit ' + m.label"><q-icon name="edit" size="19px" /></button>
                <button class="mb__editicon mb__editicon--danger" :aria-label="'Remove ' + m.label" @click="removeCard(m)"><q-icon name="delete" size="19px" /></button>
              </span>
            </li>
          </ul>
          <button class="mb__rowbox mb__rowbox--btn" @click="addCardOpen = true"><q-icon name="add" size="20px" class="mb__rowico" /><span class="mb__rowlabel">Add payment method</span><q-icon name="chevron_right" size="20px" class="mb__rowchev" /></button>
        </div>

        <!-- Security and settings -->
        <div v-else-if="active === 'security'">
          <p class="mb__lede">Update your sign-in details and account security.</p>
          <ul class="mb__stack mb__stack--plain">
            <li v-for="r in securityRows" :key="r.label">
              <div class="mb__rowbox">
                <span class="mb__secico"><q-icon :name="r.icon" size="20px" /></span>
                <span class="mb__sectext"><strong>{{ r.label }}</strong><span>{{ r.value }}</span></span>
                <button class="mb__editicon" :aria-label="'Edit ' + r.label"><q-icon name="edit" size="19px" /></button>
              </div>
            </li>
          </ul>
        </div>

        <!-- Help and feedback -->
        <div v-else-if="active === 'help'">
          <p class="mb__lede">Have questions or feedback for us? We’re listening.</p>
          <ul class="mb__stack mb__stack--plain">
            <li v-for="r in helpRows" :key="r.label">
              <button class="mb__rowbox mb__rowbox--btn" type="button">
                <q-icon v-if="r.icon" :name="r.icon" size="20px" class="mb__rowico" />
                <span class="mb__rowlabel">{{ r.label }}</span>
                <q-icon name="chevron_right" size="20px" class="mb__rowchev" />
              </button>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <profile-edit-modal v-model="editOpen" :section="editSection" :basic="basicInfo" :contact="contactInfo" @save="onProfileSave" />
    <add-payment-dialog v-model="addCardOpen" @save="onCardAdded" />
  </div>
</template>

<style scoped>
.mb { background: var(--ds-color-surface); min-height: 100vh; padding: 32px 24px 64px; }
.mb__inner { max-width: 1040px; margin: 0 auto; display: grid; grid-template-columns: 340px 1fr; gap: 36px; align-items: start; }

/* left column — centered, vertically stacked profile header */
.mb__profilehead { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; margin-bottom: 26px; }
.mb__avatar { width: 64px; height: 64px; flex: none; border-radius: 50%; background: var(--ds-color-background-brand-bold); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.375rem; font-weight: 700; }
.mb__id { display: flex; flex-direction: column; align-items: center; gap: 2px; max-width: 100%; }
.mb__name { font-size: 1.25rem; font-weight: 800; color: var(--ds-color-text); line-height: 1.2; }
.mb__email { font-size: 0.875rem; color: var(--ds-color-text-subtle); max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.mb__edit { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 18px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-pill); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.mb__edit:hover { background: var(--ds-palette-zinc-100); }

.mb__menu { display: flex; flex-direction: column; gap: 10px; }
.mb__item { display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 16px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); background: var(--ds-color-surface); text-align: left; cursor: pointer; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard), box-shadow var(--ds-duration-fast) var(--ds-ease-standard); }
.mb__item:hover { border-color: var(--ds-color-border-bold); }
.mb__item.is-active { border-color: var(--ds-color-background-brand-bold); box-shadow: inset 0 0 0 1px var(--ds-color-background-brand-bold); }
.mb__item-ico { width: 36px; height: 36px; flex: none; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); display: flex; align-items: center; justify-content: center; }
.mb__item.is-active .mb__item-ico { background: var(--ds-color-background-brand-bold); color: #fff; }
.mb__item-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.mb__item-text strong { font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); }
.mb__item-text span { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.mb__item-chev { color: var(--ds-color-text-subtle); flex: none; }

.mb__signout { display: block; width: 100%; text-align: center; margin-top: 18px; background: none; border: 0; color: var(--ds-color-background-brand-bold); font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.mb__signout:hover { text-decoration: underline; }

/* right column */
.mb__content { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); padding: 28px; min-height: 420px; }
.mb__h2 { margin: 0 0 6px; font-size: 1.5rem; font-weight: 800; color: var(--ds-color-text); }
.mb__lede { margin: 0 0 22px; color: var(--ds-color-text-subtle); font-size: 0.9375rem; }

/* shared bordered row (Help-and-feedback style), reused across sections */
.mb__stack { display: flex; flex-direction: column; gap: 12px; }
.mb__stack--plain { list-style: none; margin: 0; padding: 0; }
.mb__rowbox { display: flex; align-items: center; gap: 12px; width: 100%; padding: 16px 18px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); text-align: left; }
.mb__rowbox--btn { cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.mb__rowbox--btn:hover { background: var(--ds-palette-zinc-100); }
.mb__rowbox--comm { justify-content: space-between; cursor: pointer; }
.mb__rowico { color: var(--ds-color-text); flex: none; }
.mb__rowlabel { flex: 1; font-weight: 700; font-size: 0.9375rem; color: var(--ds-color-text); }
.mb__rowchev { color: var(--ds-color-text-subtle); flex: none; }
.mb__row-action { background: none; border: 0; color: var(--ds-color-background-brand-bold); font-weight: 700; font-size: 0.875rem; cursor: pointer; flex: none; }
.mb__row-action:hover { text-decoration: underline; }

/* profile sub-sections */
.mb__profile { display: grid; grid-template-columns: 1fr 1fr; gap: 28px 36px; }
.mb__subsec { min-width: 0; }
.mb__subhead { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.mb__subhead h3, .mb__subonly { margin: 0; font-size: 1.125rem; font-weight: 800; color: var(--ds-color-text); }
.mb__subonly { margin-bottom: 12px; }
.mb__subsub { margin: 6px 0 14px; color: var(--ds-color-text-subtle); font-size: 0.875rem; line-height: 1.45; }
.mb__deflist { margin: 0; display: flex; flex-direction: column; gap: 14px; }
.mb__deflist > div { display: flex; flex-direction: column; gap: 2px; }
.mb__deflist dt { margin: 0; color: var(--ds-color-text-subtle); font-size: 0.8125rem; }
.mb__deflist dd { margin: 0; font-weight: 600; font-size: 0.9375rem; color: var(--ds-color-text); }
.mb__deflist dd.is-empty { color: var(--ds-color-text-subtlest); font-weight: 400; }

/* communications toggle text */
.mb__toggle-text { display: flex; flex-direction: column; gap: 2px; }
.mb__toggle-text strong { font-size: 0.9375rem; color: var(--ds-color-text); }
.mb__toggle-text span { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }

/* payment cards */
.mb__cards { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.mb__card { display: flex; align-items: center; gap: 14px; padding: 14px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); }
.mb__card-logo { width: 44px; height: 30px; object-fit: contain; flex: none; }
.mb__card-text { flex: 1; display: flex; flex-direction: column; }
.mb__card-text strong { font-size: 0.9375rem; color: var(--ds-color-text); }
.mb__card-text span { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }

/* security */
.mb__secico { width: 40px; height: 40px; flex: none; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); display: flex; align-items: center; justify-content: center; }
.mb__sectext { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.mb__sectext strong { font-size: 0.9375rem; color: var(--ds-color-text); }
.mb__sectext span { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.mb__editicon { width: 38px; height: 38px; flex: none; border: 0; border-radius: 50%; background: none; color: var(--ds-color-text-subtle); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--ds-duration-fast) var(--ds-ease-standard), color var(--ds-duration-fast) var(--ds-ease-standard); }
.mb__editicon:hover { background: var(--ds-palette-zinc-100); color: var(--ds-color-text); }
.mb__editicon--danger { color: var(--ds-color-text-danger); }
.mb__editicon--danger:hover { background: var(--ds-color-background-danger, rgba(220, 38, 38, 0.08)); color: var(--ds-color-text-danger); }
.mb__card-actions { display: flex; align-items: center; gap: 2px; flex: none; }

@media (max-width: 880px) {
  .mb__inner { grid-template-columns: 1fr; gap: 24px; }
  .mb__profile { grid-template-columns: 1fr; gap: 24px; }
}
</style>
