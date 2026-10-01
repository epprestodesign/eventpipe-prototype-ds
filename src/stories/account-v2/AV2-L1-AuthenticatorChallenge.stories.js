/** Account V2 — Later · Authenticator app (ENG-3033) › Challenge.
 *
 *  SCHEDULED LATER, NOT LAUNCH SCOPE. At launch the second factor is the
 *  emailed code (Flows › 02 · Email code, ENG-3037). ENG-3033 adds
 *  authenticator apps (TOTP) afterwards; these screens are what the challenge
 *  becomes for a user who has set one up. Setup itself lives inside Account
 *  Security, per ENG-3033 (Later › Setup).
 *
 *  These three screens used to sit in Flows › 01 · Sign in, from when this
 *  category was framed around authenticator apps. They moved here unchanged in
 *  structure, retargeted to the ENG-3033 wording:
 *
 *  · The method picker is "Try another way" (ENG-3033's name for it), and the
 *    emailed code stays available as a fallback — so it lists Authenticator
 *    app, Recovery code AND Email code.
 *  · Trust-this-device uses the launch label, "Trust this device for 30 days",
 *    so the consent reads the same whichever factor the user is on.
 *
 *  No resend and no countdown on the AUTHENTICATOR screens — and only there.
 *  An authenticator app generates its codes on the device; nothing was sent,
 *  so a resend control would imply a delivery that never happens. The launch
 *  email code is the opposite case and does have both (ENG-3037).
 *
 *  Same shell as sign in, full page not modal: shell continuity is the
 *  anti-phishing signal.
 */
import { ref } from 'vue'
import { authStep, ACCOUNT, SPEC } from './_account'
import Av2CodeInput from './components/Av2CodeInput.vue'
import Av2LoginInlineError from './components/Av2LoginInlineError.vue'
import Av2LoginMethodList from './components/Av2LoginMethodList.vue'

export default {
  title: 'Eventpipe Labs/Account V2/Later · Authenticator app (ENG-3033)/Challenge',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Scheduled later — not launch scope.** The authenticator-app (TOTP) challenge from '
          + '[ENG-3033](' + SPEC.totp + '). At launch the challenge is the emailed code — see '
          + 'Flows › 02 · Email code ([ENG-3037](' + SPEC.mfaChallenge + ')). "Try another way" '
          + 'lists the authenticator app, a recovery code, and the email code, which ENG-3033 keeps '
          + 'as a fallback. No resend or countdown here, because an authenticator app sends nothing; '
          + 'that applies to TOTP only.',
      },
    },
  },
}

const STEP_COMPONENTS = { Av2CodeInput, Av2LoginInlineError, Av2LoginMethodList }

const story = (text) => ({ docs: { description: { story: text } } })
const later = `**Later —** [ENG-3033](${SPEC.totp}). At launch this step is Flows › 02 · Email code.`

const ALT_BTN = 'outline no-caps color="primary" class="full-width" style="font-weight:600;"'

/* Escape hatches in rank order: two links for people who have something else
   to try, then the plain-language question, then an outlined button for people
   who have nothing. A 2FA dead end has to end at a person, not at a page. */
const ESCAPES = `
  <div class="av2__escapes">
    <a href="#">Use a recovery code</a>
    <a href="#">Try another way</a>

    <p style="display:flex; align-items:center; gap:6px; margin:10px 0 0;
              font-size:0.8125rem; color:var(--ds-color-text-subtle);">
      <q-icon name="help_outline" size="16px" aria-hidden="true" />
      Can't access your device?
    </p>
    <q-btn ${ALT_BTN} label="Contact support" />
  </div>`

const totpCard = ({ error = false } = {}) => `
  <h1 class="av2__title">Enter the code from your authenticator app</h1>
  <p class="av2__sub">
    Open {{ account.authenticatorLabel }} and enter the 6-digit code for
    EventPipe. The code changes every 30 seconds.
  </p>

  <av2-code-input v-model="code" :error="${error}" autofocus />
  <div aria-live="assertive" aria-atomic="true">
    ${error ? '<av2-login-inline-error :message="codeError" :announce="false" />' : ''}
  </div>

  <q-checkbox v-model="trustDevice" dense size="36px" color="primary" class="q-mt-lg"
    label="Trust this device for 30 days" />

  <div class="av2__actions">
    <q-btn unelevated no-caps color="primary" class="av2__primary" label="Verify and sign in" />
  </div>
  ${ESCAPES}`

const totpState = ({ code = '', error = '' } = {}) => () => ({
  code: ref(code),
  codeError: error,
  trustDevice: ref(false),
})

/** The authenticator challenge for a user who has set up an app. Six slots in
 *  one control so paste works, trust-this-device unchecked, escapes ranked
 *  underneath. No resend and no countdown — TOTP only: the app makes the code,
 *  nothing is delivered. */
export const Challenge = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: totpState(),
  slot: totpCard(),
})
Challenge.storyName = 'Authenticator code'
Challenge.parameters = story(later)

/** Wrong code. The message names the failure most likely to be the real one —
 *  a code read a beat too late — because "incorrect code" alone invites the
 *  user to retype the same expired digits. */
export const WrongCode = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: totpState({
    code: '495120',
    error: 'That code isn\'t right. Codes change every 30 seconds — check your app for the current one.',
  }),
  slot: totpCard({ error: true }),
})
WrongCode.storyName = 'Wrong code'
WrongCode.parameters = story(later)

/* In rank order: strongest first, so the default reading order is also the
   recommended one. Email code is last — weakest of the three, but ENG-3033
   keeps it as the fallback for anyone without their phone. */
const METHODS = [
  {
    key: 'totp',
    icon: 'smartphone',
    label: 'Authenticator app',
    detail: 'The 6-digit code from your authenticator app',
    current: true,
  },
  {
    key: 'recovery',
    icon: 'vpn_key',
    label: 'Recovery code',
    detail: 'One of the 10 codes you saved when you set up the app',
  },
  {
    key: 'email',
    icon: 'mail',
    label: 'Email code',
    detail: `We'll send a 6-digit code to ${ACCOUNT.emailMasked}`,
  },
]

/** "Try another way". Rows commit on click — the user is here because something
 *  already failed, so a select-then-confirm pair would add a click to the worst
 *  path in the flow. Choosing Email code lands on the launch email-code page
 *  (Flows › 02), countdown and all. */
export const TryAnotherWay = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: () => ({ methods: METHODS }),
  slot: `
    <h1 class="av2__title">Try another way</h1>
    <p class="av2__sub">Choose how you want to verify it's you.</p>

    <av2-login-method-list :methods="methods" />

    <div class="av2__escapes">
      <a href="#">Back to sign in</a>

      <p style="display:flex; align-items:center; gap:6px; margin:10px 0 0;
                font-size:0.8125rem; color:var(--ds-color-text-subtle);">
        <q-icon name="help_outline" size="16px" aria-hidden="true" />
        Can't use any of these?
      </p>
      <q-btn ${ALT_BTN} label="Contact support" />
    </div>`,
})
TryAnotherWay.storyName = 'Try another way'
TryAnotherWay.parameters = story(
  `${later} Per ENG-3033 the picker is "Try another way" and email stays available as a fallback.`,
)
