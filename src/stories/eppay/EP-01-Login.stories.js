/** EP Pay / Screens / 01 · Login.
 *
 *  The 09/28 capture set the structure; the design system sets everything else.
 *
 *  One piece of that structure is worth noticing: the Merchant / EP View
 *  segmented control. EP Pay has two audiences signing in at the same door, and
 *  which one you are decides what the session can see — so the choice is made
 *  before the credentials, not after.
 *
 *  The ground is the DS app-chrome navy, the same surface the signed-in sidebar
 *  uses, so the door and the room behind it are recognisably one product.
 */
import { ref } from 'vue'
import { epAuthPage } from './_eppay'
import DsInput from '../../components/DsInput.vue'
import logo from '../../assets/logo/eventpipe-logo.svg'

export default {
  title: 'EP Pay/Screens/01 · Login',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Sign in to EventPipe Pay. Built from design-system components on the DS app-chrome navy; the Merchant / EP View toggle splits merchants from internal EventPipe staff.' } },
  },
}

const CARD = `
  <div style="background:var(--ds-color-surface); border-radius:var(--ds-radius-lg);
              box-shadow:var(--ds-shadow-4); width:100%; max-width:470px; padding:34px 40px 40px;">
    <!-- The real EventPipe wordmark, full-colour variant: this card is a white
         surface, and Foundations › Logos specifies full colour on light. -->
    <div class="row justify-center q-mb-md">
      <img :src="logo" alt="EventPipe" style="width:150px; height:auto;" />
    </div>

    <h1 style="font-size:1.375rem; font-weight:700; text-align:center; margin:0 0 22px;">
      Sign in to EventPipe Pay
    </h1>

    <q-btn-toggle v-model="persona" no-caps spread unelevated class="q-mb-lg"
      toggle-color="primary" toggle-text-color="white" color="grey-3" text-color="grey-8"
      :options="[{ label: 'Merchant', value: 'merchant' }, { label: 'EP View', value: 'ep' }]" />

    <div class="column q-gutter-y-md">
      <ds-input label="Username" v-model="username" />
      <ds-input label="Password" v-model="password" type="password" />
    </div>

    <q-btn unelevated no-caps color="primary" label="Sign In" class="full-width q-mt-xl"
      style="font-size:1rem; font-weight:700;" />
  </div>`

const state = (persona = 'merchant') => () => ({
  logo,
  persona: ref(persona),
  username: ref('jeffrey.upp@yourhousingcompany.com'),
  password: ref('supersecretpw'),
})

/** As a merchant sees it. */
export const Merchant = epAuthPage({
  components: { DsInput },
  setup: state('merchant'),
  slot: CARD,
})

/** Internal EventPipe staff signing in to view a merchant's account. */
export const EpView = epAuthPage({
  components: { DsInput },
  setup: state('ep'),
  slot: CARD,
})
EpView.storyName = 'EP View'
