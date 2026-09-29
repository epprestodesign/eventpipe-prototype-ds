import { ref } from 'vue'
import AccountV1ProductPanel from './components/AccountV1ProductPanel.vue'
import AccountV1Layout from './components/AccountV1Layout.vue'
import AccountV1Verification from './components/AccountV1Verification.vue'
import AccountV1Credentials from './components/AccountV1Credentials.vue'

export default {
  title: 'Account V1/Phase 2 · MFA/Product update concepts',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Five reusable left-panel compositions using real EventPipe blog posts. Dates are original publication dates, not claims of a new release. Controls above the canvas are review-only: isolate the component, change the MFA method, hide links or simulate missing imagery. Spotlight rotation is manual. Read-more links are optional and open the public article separately to preserve the verification session. No CMS or live feed is implied.' } } },
}
const concept = (type) => ({
  render: () => ({
    components: { AccountV1ProductPanel, AccountV1Layout, AccountV1Verification, AccountV1Credentials },
    setup: () => ({ type, isolated: ref(false), showLink: ref(true), imageUnavailable: ref(false), method: ref('email'), atLogin: ref(false) }),
    template: `<div class="av1-panel-preview">
      <aside class="av1-panel-preview__tools bg-ds-neutral-subtle" aria-label="Concept preview controls">
        <span class="text-weight-bold">Concept preview</span>
        <q-toggle v-model="isolated" label="Component only" />
        <q-toggle v-model="showLink" label="Read more link" />
        <q-toggle v-if="type === 'image'" v-model="imageUnavailable" label="Image unavailable" />
        <q-btn-toggle v-if="!isolated" v-model="method" no-caps unelevated toggle-color="primary" :options="[{label:'Email',value:'email'},{label:'Authenticator',value:'authenticator'}]" aria-label="Verification method preview" @update:model-value="atLogin = false" />
      </aside>
      <div v-if="isolated" class="av1-panel-preview__isolated">
        <account-v1-product-panel :concept="type" :show-link="showLink" :image-unavailable="imageUnavailable" />
      </div>
      <account-v1-layout v-else>
        <template #updates><account-v1-product-panel :concept="type" :show-link="showLink" :image-unavailable="imageUnavailable" class="av1-panel-preview__panel" /></template>
        <account-v1-credentials v-if="atLogin" demo-prefill @authenticated="atLogin = false" />
        <account-v1-verification v-else :key="method" :initial-method="method" @back="atLogin = true" />
      </account-v1-layout>
    </div>`,
  }),
})
export const FeaturedArticle = concept('featured')
export const ReleaseHighlights = concept('releases')
export const RotatingSpotlight = concept('spotlight')
export const ProductTip = concept('tip')
export const ImageAnnouncement = concept('image')
