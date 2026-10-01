/** Account V2 — Flow 02 · Email code (ENG-3037 MfaChallengeView).
 *
 *  /portal/login/verify. The LAUNCH second factor: after a login returns
 *  MFA_REQUIRED, EventPipe emails a 6-digit code (the MFA_CODE email) and this
 *  page takes it. There is no enrollment at launch — every staff account
 *  already has an email address, so there is nothing to set up.
 *
 *  What ENG-3037 asks for, and where it is:
 *  · Where the code went — the subhead names `account.emailMasked`, the
 *    backend's `maskedDestination`.
 *  · A 6-digit input that advances per digit and takes a paste — Av2CodeInput
 *    (one real input under six painted slots; paste and autofill just work).
 *  · "Trust this device for 30 days" — unchecked by default, sent as
 *    `rememberDevice`.
 *  · "Resend code" disabled for a 60-second countdown after each send —
 *    Av2CodeResend. Each story freezes the countdown at one value ("Resend code
 *    in 0:42") so screenshots are deterministic; nothing ticks.
 *  · A distinct message for each failure — wrong code, expired, too many
 *    attempts, too many resends. Each one says what to do next, not only what
 *    went wrong.
 *  · Errors announced — a permanently mounted aria-live region under the code
 *    input; the message is swapped into it, so screen readers hear the change.
 *  · Keyboard-only completable — digits, Tab to the checkbox, Enter/Space on
 *    the primary; every escape is a link or a button.
 *
 *  Backend facts the copy leans on: a code lasts 10 minutes; 5 wrong codes
 *  revoke it; at most 5 sends per hour.
 *
 *  Resend and the countdown exist here because a code was SENT. The
 *  authenticator-app challenge (Later · ENG-3033) has neither, because an app
 *  generates its own codes and nothing is delivered. That rule is TOTP-only.
 *
 *  The way back is "Use a different account", a plain link under the primary.
 *  Every reference with an emailed or texted code offers a way out (Stripe
 *  "Sign in another way", Sana "Back"); at launch there IS no other way to
 *  verify, so the honest exit is back to the sign-in card. "Contact support"
 *  sits under it, because a code that never arrives is a dead end only a
 *  person can clear.
 */
import { ref } from 'vue'
import { authStep, SPEC } from './_account'
import Av2CodeInput from './components/Av2CodeInput.vue'
import Av2CodeResend from './components/Av2CodeResend.vue'
import Av2LoginInlineError from './components/Av2LoginInlineError.vue'

export default {
  title: 'Eventpipe Labs/Account V2/Flows/02 · Email code',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The launch second factor at `/portal/login/verify` — [ENG-3037 MfaChallengeView]('
          + SPEC.mfaChallenge + '), from [P-ENG-228](' + SPEC.project + '). A 6-digit code sent by '
          + 'email (10-minute life, revoked after 5 wrong tries, 5 sends per hour). Trust-this-device '
          + 'for 30 days, a 60-second resend countdown, and a distinct message for each failure, '
          + 'announced through an aria-live region. The authenticator-app version is scheduled later '
          + '— see Later · Authenticator app (ENG-3033).',
      },
    },
  },
}

const STEP_COMPONENTS = { Av2CodeInput, Av2CodeResend, Av2LoginInlineError }

const STATUS_ID = 'av2-code-status'

const story = (text) => ({ docs: { description: { story: text } } })
const ticket = `[ENG-3037](${SPEC.mfaChallenge})`

/* Outlined full-width secondary, same edges as everything else in the column. */
const ALT_BTN = 'outline no-caps color="primary" class="full-width" style="font-weight:600;"'

/* ---------------------------------------------------------------------------
 * One card for all seven states, so they can only differ where the state says.
 *
 *  resend   — 'cooling' | 'ready' | 'limited' | 'none' (none: the primary
 *             already IS "send a new code", so the line would duplicate it)
 *  wait     — frozen countdown text for 'cooling'
 *  error    — true renders codeError into the live region
 *  dead     — the code can no longer be used (expired / revoked): input is
 *             cleared and disabled, primary becomes "Send a new code"
 *  loading  — verifying
 * ------------------------------------------------------------------------- */
const codeCard = ({ resend = 'cooling', wait = '1:00', error = false, dead = false, loading = false } = {}) => `
  <h1 class="av2__title">Check your email for a code</h1>
  <p class="av2__sub">
    We sent a 6-digit code to <strong>{{ account.emailMasked }}</strong>.<br>
    It expires in 10 minutes.
  </p>

  <q-form novalidate @submit="onSubmit">
    <!-- Verifying does NOT disable the input: Av2CodeInput's disabled state
         lets the hidden native input's digits show through the dimmed slots
         (reported; the component is shared). Dead codes are disabled AND
         empty, so they are unaffected. -->
    <av2-code-input v-model="code" :error="${error && !dead}"
      ${dead ? ':disabled="true"' : loading ? '' : 'autofocus'} />

    <!-- The live region is always in the DOM, empty until something fails.
         A region that mounts together with its message is often missed by
         screen readers; one that is already there and changes is not.
         assertive: every message here blocks the user from going on. -->
    <div id="${STATUS_ID}" aria-live="assertive" aria-atomic="true">
      ${error ? '<av2-login-inline-error :message="codeError" :announce="false" />' : ''}
    </div>

    ${resend === 'none' ? '' : `<av2-code-resend state="${resend}" wait="${wait}" />`}

    <!-- Unchecked, and the duration is in the label: this box skips the code
         on this browser for a month, a security decision the user has to be
         able to read before they take it. Sent as rememberDevice. -->
    <q-checkbox v-model="trustDevice" dense size="36px" color="primary" class="q-mt-lg"
      label="Trust this device for 30 days" ${dead ? ':disable="true"' : ''} />

    <div class="av2__actions">
      ${dead
        ? '<q-btn unelevated no-caps color="primary" class="av2__primary" label="Send a new code" />'
        : `<q-btn type="submit" unelevated no-caps color="primary" class="av2__primary"
            label="Verify and sign in" ${loading ? ':loading="true"' : ''} />`}
    </div>
  </q-form>

  <div class="av2__escapes">
    <a href="#">Use a different account</a>

    <p style="display:flex; align-items:center; gap:6px; margin:10px 0 0;
              font-size:0.8125rem; color:var(--ds-color-text-subtle);">
      <q-icon name="help_outline" size="16px" aria-hidden="true" />
      Still no email after a few minutes?
    </p>
    <q-btn ${ALT_BTN} label="Contact support" />
  </div>`

const codeState = ({ code = '', error = '' } = {}) => () => ({
  code: ref(code),
  codeError: error,
  /* Unchecked by default, every time. A remembered "yes" here would quietly
     re-suppress the code on a device the user may have since stopped trusting. */
  trustDevice: ref(false),
  onSubmit: () => {},
})

/** The moment after the email goes out. The subhead names the masked address
 *  and the 10-minute life; the resend control is disabled with the countdown
 *  frozen at 0:42 (in production it ticks from 1:00). Trust-this-device is
 *  unchecked. */
export const Challenge = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: codeState(),
  slot: codeCard({ resend: 'cooling', wait: '0:42' }),
})
Challenge.storyName = 'Challenge'
Challenge.parameters = story(
  `${ticket}. Code just sent: "We sent a 6-digit code to {{ maskedDestination }}", resend disabled `
  + 'with the 60-second countdown running (frozen at 0:42 for the story), "Trust this device for 30 '
  + 'days" unchecked. The input takes a pasted code.',
)

/** Countdown finished: "Resend code" is an ordinary enabled button. Nothing
 *  else changes — no error, the code the user already has is still good. */
export const ResendAvailable = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: codeState(),
  slot: codeCard({ resend: 'ready' }),
})
ResendAvailable.storyName = 'Resend available'
ResendAvailable.parameters = story(
  `${ticket}. The 60-second countdown has run out, so "Resend code" is enabled.`,
)

/** Wrong code. The digits stay in place so the user can compare them with the
 *  email instead of retyping from memory. The 5-try limit is not counted down
 *  on screen: the API is not specified to return attempts-left, and the
 *  Too-many-attempts state explains the limit when it bites. */
export const WrongCode = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: codeState({
    code: '495120',
    error: 'That code isn\'t right. Check it against the latest email from EventPipe and try again.',
  }),
  slot: codeCard({ resend: 'ready', error: true }),
})
WrongCode.storyName = 'Wrong code'
WrongCode.parameters = story(
  `${ticket} — wrong-code message. Digits are kept; the message is announced through the live region.`,
)

/** Expired: more than 10 minutes since the send. The old code cannot work, so
 *  the input is cleared and disabled, and the primary itself becomes "Send a
 *  new code" — the next step is the button, not a hunt for a small link. */
export const Expired = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: codeState({
    error: 'This code has expired — codes only last 10 minutes. Send a new code, then enter it here.',
  }),
  slot: codeCard({ resend: 'none', error: true, dead: true }),
})
Expired.storyName = 'Code expired'
Expired.parameters = story(
  `${ticket} — expired-code message (codes last 10 minutes). The primary becomes "Send a new code".`,
)

/** Too many attempts: the 5th wrong code revokes it. Same recovery as expiry —
 *  a fresh code — but a different message, because the cause is different and
 *  the ticket requires each failure to be told apart. It says the lock is on
 *  this code, not the account, so nobody thinks they need support. */
export const TooManyAttempts = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: codeState({
    error: 'Too many incorrect tries, so we\'ve cancelled this code to protect your account. '
      + 'Send a new code to try again.',
  }),
  slot: codeCard({ resend: 'none', error: true, dead: true }),
})
TooManyAttempts.storyName = 'Too many attempts'
TooManyAttempts.parameters = story(
  `${ticket} — too-many-attempts message. 5 wrong codes revoke the code; the user must request a new one.`,
)

/** Too many resends: 5 sends in the hour. The code most recently sent is still
 *  valid, so the input stays live and the message points at it; resend is
 *  disabled with no timer, and the message gives the wait in minutes. */
export const TooManyResends = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: codeState({
    error: 'You\'ve asked for 5 codes in the last hour, which is the limit. Enter the code from '
      + 'the most recent email, or request another in 38 minutes.',
  }),
  slot: codeCard({ resend: 'limited', error: true }),
})
TooManyResends.storyName = 'Too many resends'
TooManyResends.parameters = story(
  `${ticket} — too-many-resends message (5 sends per hour). Resend is disabled; the last code still works.`,
)

/** Verifying. The spinner replaces the label in a button that keeps its size,
 *  so the card does not move while the request is out. (Production should also
 *  lock the input; see the note on Av2CodeInput's disabled state above.) */
export const Verifying = authStep({
  showcase: 'security',
  components: STEP_COMPONENTS,
  setup: codeState({ code: '381204' }),
  slot: codeCard({ resend: 'cooling', wait: '0:17', loading: true }),
})
Verifying.storyName = 'Verifying'
Verifying.parameters = story(
  `${ticket}. Submitting \`code\` + \`rememberDevice\`. On success the user lands in the app (and a `
  + 'NEW_DEVICE_SIGNIN email may follow — see Emails).',
)
