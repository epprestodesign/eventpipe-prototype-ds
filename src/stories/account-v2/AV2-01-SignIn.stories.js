/** Account V2 — Flow 01 · Sign in (ENG-3019 LoginView, ENG-3043 pilot gate).
 *
 *  The EventPipe platform's staff login at /portal/login, desktop web only.
 *  Staff are EP admins, housing-company, hotel and event-company users; there
 *  is no signup at this door.
 *
 *  What ENG-3019 asks for, and where it is:
 *  · Email, password with a show/hide toggle, "Forgot password?" — the card.
 *  · No "Remember me". Device trust is offered on the code step instead
 *    (Flows › 02 · Email code), where the user can see what it suppresses.
 *  · Bookings Lookup card layout — superseded: on 2026-09-29 the user replaced
 *    the centred card with the split-screen shell from _account.js (white
 *    panel left, shader showcase right; showcase 'platform' here).
 *  · q-form, field errors linked with aria-describedby, errors announced, fully
 *    keyboard usable — the form is a <q-form>; both fields point at the failed
 *    login message with aria-describedby; the message is role=alert; the
 *    show/hide toggle is a real button (Av2LoginPasswordField).
 *  · Branch on status: AUTHENTICATED → landing page; MFA_REQUIRED →
 *    /login/verify, which is Flows › 02 · Email code.
 *  · The generic error on a failed login.
 *
 *  Deliberately not here:
 *  · SSO and passkey. Neither is in any requirement; the markup lives on as a
 *    concept at Account V2 › Concepts › SSO & passkey.
 *  · A lockout screen. After 10 failures the account locks for 15 minutes, but
 *    a correct password during the lock still gets the generic error — the
 *    user learns about the lock from the ACCOUNT_LOCKED email (ENG-3012).
 *  · The authenticator-app challenge. It moved to Account V2 › Later ·
 *    Authenticator app (ENG-3033) › Challenge; at launch the second factor is
 *    the emailed code.
 *
 *  One page for email + password, not an identifier-then-password two-step:
 *  returning staff let the browser autofill both fields, and a two-step form
 *  makes autofill fire twice for no security gain.
 *
 *  The states live as separate stories rather than args toggles because each
 *  one is a screen a reviewer has to sign off, and a story per screen is what
 *  gets linked in a review.
 */
import { ref } from 'vue'
import { authStep, ACCOUNT, SPEC } from './_account'
import Av2LoginEmailField from './components/Av2LoginEmailField.vue'
import Av2LoginPasswordField from './components/Av2LoginPasswordField.vue'

export default {
  title: 'Account V2/Flows/01 · Sign in',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The staff login at `/portal/login` — [ENG-3019 LoginView](' + SPEC.login + ') and the '
          + '[ENG-3043 pilot gate](' + SPEC.pilotGate + '), from [P-ENG-228](' + SPEC.project + '). '
          + 'Email and password in the split-screen auth shell (right panel: the platform showcase); a successful login with `MFA_REQUIRED` goes '
          + 'to the emailed code (Flows › 02 · Email code). No "Remember me" — device trust is '
          + 'offered on the code step. SSO and passkey are not in scope and live under '
          + 'Concepts › SSO & passkey.',
      },
    },
  },
}

const STEP_COMPONENTS = { Av2LoginEmailField, Av2LoginPasswordField }

const ERROR_ID = 'av2-signin-error'

const story = (text) => ({ docs: { description: { story: text } } })

/* ---------------------------------------------------------------------------
 * The credential card. One markup source for all three of its states so they
 * cannot drift: a reviewer comparing the error screen against the resting one
 * should be looking at one difference, not at two files that disagree.
 * ------------------------------------------------------------------------- */
const signInCard = ({ error = false, loading = false } = {}) => `
  <h1 class="av2__title">Sign in to EventPipe</h1>

  <!-- q-form so Enter submits from either field and the real view can hang its
       validation rules here (ENG-3019). novalidate: the browser's own email
       bubble would duplicate, and out-shout, the app's messages. -->
  <q-form novalidate @submit="onSubmit">
    <!-- q-mt-md, not lg: .av2__title's margin is tuned for a heading that has
         a subhead under it, and this one has none. -->
    <div class="column q-gutter-y-md q-mt-md">
      <av2-login-email-field v-model="email"
        ${error ? `describedby="${ERROR_ID}" invalid` : ''} />
      <av2-login-password-field v-model="password" error-id="${ERROR_ID}"
        ${error ? ':error="passwordError"' : ''} />
    </div>

    <div class="av2__actions">
      <!-- Width is pinned by .av2__primary, so the spinner-for-label swap in the
           loading state cannot reflow anything around it. -->
      <q-btn type="submit" unelevated no-caps color="primary" class="av2__primary"
        label="Sign in" ${loading ? ':loading="true"' : ''} />
    </div>
  </q-form>`

const signInState = ({ password = '', error = '' } = {}) => () => ({
  email: ref(ACCOUNT.email),
  password: ref(password),
  passwordError: error,
  onSubmit: () => {},
})

/** Resting state: email and password on one card, "Forgot password?" on the
 *  Password label row, the show/hide toggle inside the field. Nothing under the
 *  primary — SSO and passkey came off this screen (see Concepts). */
export const SignIn = authStep({
  components: STEP_COMPONENTS,
  setup: signInState({ password: 'supersecretpw' }),
  slot: signInCard(),
})
SignIn.storyName = 'Sign in'
SignIn.parameters = story(
  `[ENG-3019](${SPEC.login}). Email, password with a keyboard-operable show/hide toggle, `
  + '"Forgot password?" on the label row. No "Remember me" — trust-this-device is on the code step.',
)

/** Wrong credentials. The message is inline under the password field rather
 *  than a block alert above the form, and the typed password is retained,
 *  because clearing it turns one typo into a full retype.
 *
 *  Both fields carry aria-invalid and aria-describedby → the message, since it
 *  deliberately blames the pair. The message is role=alert, so it is announced
 *  the moment it appears. This is also what a locked account sees (ENG-3012):
 *  the lock is never revealed on screen. */
export const SignInError = authStep({
  components: STEP_COMPONENTS,
  setup: signInState({
    password: 'supersecretpw',
    /* Deliberately does not say which of the two was wrong: naming the email as
       correct would confirm the account exists to anyone probing it. */
    error: 'That email and password don\'t match. Check both and try again.',
  }),
  slot: signInCard({ error: true }),
})
SignInError.storyName = 'Sign in · error'
SignInError.parameters = story(
  `[ENG-3019](${SPEC.login}) — "show the generic error on a failed login". It does not say which `
  + 'field is wrong, and a locked account ([ENG-3012](' + SPEC.lockout + ')) sees exactly this too. '
  + 'Both fields are `aria-invalid` and `aria-describedby` the message; the message is `role=alert`.',
)

/** Submitting. The spinner replaces the button label inside a button that keeps
 *  its full width and height, so the card does not move at the most anxious
 *  moment in the flow. */
export const SignInLoading = authStep({
  components: STEP_COMPONENTS,
  setup: signInState({ password: 'supersecretpw' }),
  slot: signInCard({ loading: true }),
})
SignInLoading.storyName = 'Sign in · submitting'
SignInLoading.parameters = story(
  `[ENG-3019](${SPEC.login}). The response branches: \`AUTHENTICATED\` → landing page, `
  + '`MFA_REQUIRED` → `/login/verify` (Flows › 02 · Email code).',
)

/** ENG-3043. A user outside the pilot signs in on the new page and gets this
 *  instead of the app. They are NOT signed in, so the page says so plainly and
 *  hands them the one thing that works: the current login at /auth/new.
 *
 *  A full step in the same shell rather than an alert over the form: the form
 *  is no use to this person any more, and leaving it up invites them to retype
 *  a password that was never the problem. "Use a different account" stays for
 *  the admin who signed in with the wrong one. */
export const PilotNotAvailable = authStep({
  components: STEP_COMPONENTS,
  slot: `
    <h1 class="av2__title">The new login isn't available for your account yet</h1>
    <p class="av2__sub">
      We're moving everyone to this page in stages. Until your account is
      included, sign in with the current EventPipe login — your account and
      password work there exactly as before.
    </p>
    <p class="av2__sub" style="margin-top:-12px; font-size:0.8125rem;">
      You have not been signed in.
    </p>

    <div class="av2__actions" style="margin-top:0;">
      <q-btn unelevated no-caps color="primary" class="av2__primary"
        href="/auth/new" label="Go to the current login" />
    </div>

    <div class="av2__escapes">
      <a href="#">Use a different account</a>
    </div>`,
})
PilotNotAvailable.storyName = 'Pilot · not available yet'
PilotNotAvailable.parameters = story(
  `[ENG-3043](${SPEC.pilotGate}) pilot gate. A non-pilot user is not logged in and is linked to the `
  + 'old login (`/auth/new`). The matching "Try the new login" link on the OLD page is not ours to '
  + 'design and is left out.',
)
