import { ref } from 'vue'
import AccountProductPanel from './components/AccountProductPanel.vue'
import AccountUpdates from './components/AccountUpdates.vue'
import AccountLayout from './components/AccountLayout.vue'
import AccountVerification from './components/AccountVerification.vue'
import AccountCredentials from './components/AccountCredentials.vue'
import AccountSignup from './components/AccountSignup.vue'
import { sampleUpdate } from './_stories'

export default {
  // ASCII id: the title's "∕" (U+2215) would otherwise end up in the URL.
  id: 'sign-up-login-left-rail',
  title: 'Sign up ∕ Login/Left rail',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Every treatment for the navy left rail, each beside any right-panel screen. **Brand only** is the default; the others add product news for existing customers, which Rob supported but did not commit to the first release. Article concepts use real EventPipe blog posts with their original publication dates; they are not new-release claims or a live feed. Controls above the canvas are review-only: **Right panel** swaps the screen beside the rail, **Component only** isolates the rail content, **Read more link** and **Image unavailable** check optional states. Spotlight rotation is manual. Read-more links open the article separately to preserve the session.' } } },
}

const RIGHT = [
  { label: 'Sign up', value: 'signup' },
  { label: 'Log in', value: 'login' },
  { label: 'Email code', value: 'email' },
  { label: 'Authenticator', value: 'authenticator' },
]
// Which review toggles apply to each rail treatment.
const HAS_LINK = ['featured', 'releases', 'spotlight', 'tip', 'image']

const rail = (type) => ({
  render: () => ({
    components: { AccountProductPanel, AccountUpdates, AccountLayout, AccountVerification, AccountCredentials, AccountSignup },
    setup: () => ({ type, sampleUpdate, RIGHT, hasLink: HAS_LINK.includes(type), isolated: ref(false), showLink: ref(true), imageUnavailable: ref(false), right: ref('login') }),
    template: `<div class="acct-panel-preview">
      <aside class="acct-panel-preview__tools bg-ds-neutral-subtle" aria-label="Left rail preview controls">
        <span class="text-weight-bold">Preview only</span>
        <q-btn-toggle v-if="!isolated" v-model="right" no-caps unelevated toggle-color="primary" :options="RIGHT" aria-label="Right panel screen" />
        <q-toggle v-if="type !== 'brand'" v-model="isolated" label="Component only" />
        <q-toggle v-if="hasLink" v-model="showLink" label="Read more link" />
        <q-toggle v-if="type === 'image'" v-model="imageUnavailable" label="Image unavailable" />
      </aside>
      <div v-if="isolated" class="acct-panel-preview__isolated">
        <account-updates v-if="type === 'whats-new'" v-bind="sampleUpdate" class="acct-panel-preview__panel" />
        <account-product-panel v-else :concept="type" :show-link="showLink" :image-unavailable="imageUnavailable" />
      </div>
      <account-layout v-else>
        <template #updates>
          <account-updates v-if="type === 'whats-new'" v-bind="sampleUpdate" class="acct-panel-preview__panel" />
          <account-product-panel v-else-if="type !== 'brand'" :concept="type" :show-link="showLink" :image-unavailable="imageUnavailable" class="acct-panel-preview__panel" />
        </template>
        <account-credentials v-if="right === 'login'" key="login" demo-prefill @authenticated="right = 'email'" />
        <account-signup v-else-if="right === 'signup'" key="signup" @login="right = 'login'" />
        <account-verification v-else :key="right" :initial-method="right" @back="right = 'login'" />
      </account-layout>
    </div>`,
  }),
})
export const BrandOnly = rail('brand')
export const ValueProps = rail('value-props')
export const WhatsNewCard = { name: 'What’s new card', ...rail('whats-new') }
export const FeaturedArticle = rail('featured')
export const ReleaseHighlights = rail('releases')
export const RotatingSpotlight = rail('spotlight')
export const ProductTip = rail('tip')
export const ImageAnnouncement = rail('image')
