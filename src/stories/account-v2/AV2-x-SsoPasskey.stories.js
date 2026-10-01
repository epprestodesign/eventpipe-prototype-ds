/** Account V2 — Concepts › SSO & passkey.
 *
 *  CONCEPT — NO REQUIREMENT. Single sign-on and passkeys are not in any ticket
 *  in P-ENG-228 (or anywhere else in Linear, checked 2026-09-29), so they came
 *  off the launch sign-in card (Flows › 01). This story keeps the design of
 *  where they would sit if they are ever scoped, so the decision does not have
 *  to be re-derived.
 *
 *  The placement, from the reference study (references/account-v2/
 *  mobbin-flows.md): credentials on top; SSO and passkey BELOW an OR rule as
 *  outlined, full-width buttons. Six of the seven references demote SSO below
 *  the primary; outlined buttons rather than Stripe's small links because a
 *  bordered button is a far bigger target without outranking the primary path.
 */
import { ref } from 'vue'
import { authStep, ACCOUNT, SPEC } from './_account'
import Av2LoginEmailField from './components/Av2LoginEmailField.vue'
import Av2LoginPasswordField from './components/Av2LoginPasswordField.vue'

export default {
  title: 'Eventpipe Labs/Account V2/Concepts/SSO & passkey',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Concept — no requirement.** SSO and passkey sign-in are not in any ticket in '
          + '[P-ENG-228](' + SPEC.project + ') and are not on the launch sign-in card '
          + '([ENG-3019](' + SPEC.login + '), Flows › 01 · Sign in). Kept here to show where they '
          + 'would sit if ever scoped: below an OR rule, as outlined buttons under the primary.',
      },
    },
  },
}

const ALT_BTN = 'outline no-caps color="primary" class="full-width" style="font-weight:600;"'

/** The launch sign-in card plus the OR rule and two secondary routes. Nothing
 *  above the primary changes, so adding these later is additive. */
export const SignInWithSsoAndPasskey = authStep({
  components: { Av2LoginEmailField, Av2LoginPasswordField },
  setup: () => ({ email: ref(ACCOUNT.email), password: ref('supersecretpw') }),
  slot: `
    <h1 class="av2__title">Sign in to EventPipe</h1>

    <div class="column q-gutter-y-md q-mt-md">
      <av2-login-email-field v-model="email" />
      <av2-login-password-field v-model="password" />
    </div>

    <div class="av2__actions">
      <q-btn unelevated no-caps color="primary" class="av2__primary" label="Sign in" />
    </div>

    <div class="av2__rule">OR</div>

    <div class="column q-gutter-y-sm">
      <q-btn ${ALT_BTN} icon="business" label="Continue with single sign-on" />
      <q-btn ${ALT_BTN} icon="fingerprint" label="Sign in with a passkey" />
    </div>`,
})
SignInWithSsoAndPasskey.storyName = 'Sign in with SSO & passkey'
