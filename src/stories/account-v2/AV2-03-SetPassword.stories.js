/** Account V2 / Flows / 03 · Forgot & set password — ENG-3020.
 *
 *  ForgotPasswordView and SetPasswordView (`/set-password/:token`). One page
 *  serves both a password reset and a new-user invite; the token tells it which,
 *  and whether the terms checkbox is needed (`requiresTerms`).
 *
 *  What the ticket asks for, and where it is:
 *   - Forgot: an email field; after submit, ALWAYS the same confirmation whether
 *     or not the account exists .................. ForgotPassword, CheckEmail
 *   - Set password checks the token on load: VALID / EXPIRED / USED / INVALID
 *     ...................... SetPasswordReset/Invite, LinkExpired/Used/Invalid
 *   - New + confirm password with a strength meter ...... SetPasswordWeak
 *   - Terms checkbox only when requiresTerms ............ SetPasswordInvite
 *   - On success, go to /login with a "password set" message ... PasswordSet
 *
 *  Backend facts the copy relies on: reset links last 1 hour, invite links
 *  7 days, and a reset does NOT sign the user in (200 without a session) — so
 *  the flow always ends on the sign-in card.
 *
 *  REMOVED in the 2026-09-29 retarget, because the spec contradicts them:
 *   - "Two Factor Recheck" (a code challenge before the new password was
 *     saved). Reset never logs you in, so there is no session to protect with
 *     a recheck on this page; the second factor is asked for at the next
 *     sign-in, by the normal /login/verify step (ENG-3037).
 *   - "Resend Countdown" on the check-email page. ENG-3020 has no resend; the
 *     user can simply submit the form again.
 *
 *  Everything renders through authStep: the same split-screen shell, column
 *  width and anti-phishing line as sign-in. The right panel shows the
 *  'protection' showcase (a single-use reset link that expires in an hour; a
 *  new password that signs other sessions out).
 */
import { computed, ref } from 'vue'
import { ACCOUNT, SPEC, authStep } from './_account'
import DsInput from '../../components/DsInput.vue'
import DsLink from '../../components/DsLink.vue'
import Av2LoginPasswordField from './components/Av2LoginPasswordField.vue'
import Av2ResetNotice from './components/Av2ResetNotice.vue'
import Av2SetPwStrength, { MIN_LENGTH } from './components/Av2SetPwStrength.vue'

export default {
  title: 'Eventpipe Labs/Account V2/Flows/03 · Forgot & set password',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          `Forgot password and Set password — [ENG-3020](${SPEC.setPassword}). ` +
          'One Set password page serves both a reset and a new-user invite; the invite adds a terms ' +
          'checkbox because its token carries `requiresTerms`. The token is checked on load and ' +
          'every bad state (expired, already used, invalid) offers a next step. A reset never ' +
          'signs the user in, so success lands on the sign-in card with a notice. ' +
          'Removed in the retarget: the second-factor recheck and the resend countdown — neither ' +
          'is in ENG-3020, and the recheck contradicts it.',
      },
    },
  },
}

const PARTS = { DsInput, DsLink, Av2LoginPasswordField, Av2ResetNotice, Av2SetPwStrength }

/** Small print — same treatment wherever it appears. */
const FINE = 'font-size:0.8125rem; line-height:1.5; color:var(--ds-color-text-subtle);'

/* ------------------------------------------------------------ Forgot password */

/** ForgotPasswordView. The email is carried over from the sign-in form, since
 *  the user usually arrives from "Forgot password?" having just typed it. */
export const ForgotPassword = authStep({
  showcase: 'protection',
  components: PARTS,
  setup: () => ({ email: ref(ACCOUNT.email) }),
  slot: `
    <h1 class="av2__title">Reset your password</h1>
    <p class="av2__sub">
      Enter the email address you sign in with and we'll send you a link to set a new password.
    </p>

    <q-form @submit.prevent>
      <ds-input label="Email" type="email" v-model="email" required />

      <div class="av2__actions">
        <q-btn type="submit" unelevated no-caps color="primary" label="Send reset link" class="av2__primary" />
      </div>
    </q-form>

    <div class="av2__escapes">
      <ds-link href="#">Back to sign in</ds-link>
    </div>`,
})
ForgotPassword.storyName = 'Forgot password'

/** The confirmation, identical for every address typed. ENG-3020: "always the
 *  same confirmation, whether or not the account exists". So the copy is
 *  conditional — "If an account exists for …" — and true either way; a
 *  definite "we've sent it" would confirm which addresses are EventPipe staff.
 *
 *  No primary button: the next action is in the inbox. No resend either (not
 *  in the ticket) — "try again" returns to the form, which does the same job. */
export const CheckEmail = authStep({
  showcase: 'protection',
  components: PARTS,
  slot: `
    <h1 class="av2__title">Check your email</h1>
    <p class="av2__sub">
      If an account exists for <strong>{{ account.email }}</strong>, we've sent it a link to set a
      new password. The link works for 1 hour.
    </p>
    <p class="av2__sub" style="margin-bottom:0;">
      Nothing arrived? Check your spam folder, or <ds-link href="#">try again</ds-link> with a
      different address.
    </p>

    <div class="av2__escapes">
      <ds-link href="#">Back to sign in</ds-link>
    </div>`,
})
CheckEmail.storyName = 'Check your email'

/* --------------------------------------------------------------- Set password */

/* One template for reset and invite so the two cannot drift. `invite` swaps the
 * heading and intro and adds the terms checkbox; nothing else changes. */
const setPasswordCard = ({ invite = false } = {}) => `
  ${invite ? `
  <h1 class="av2__title">Welcome to EventPipe</h1>
  <p class="av2__sub">
    Create a password for <strong>{{ account.email }}</strong> to finish setting up your account.
  </p>` : `
  <h1 class="av2__title">Set a new password</h1>
  <p class="av2__sub">
    For <strong>{{ account.email }}</strong>. This replaces your current password and signs you
    out everywhere else.
  </p>`}

  <q-form @submit.prevent>
    <div class="column q-gutter-y-md">
      <div>
        <ds-input label="New password" type="password" v-model="pw1" required />
        <av2-set-pw-strength :password="pw1" />
      </div>
      <ds-input label="Confirm new password" type="password" v-model="pw2" required
        :error="mismatch ? 'These passwords don’t match.' : ''" />
    </div>

    ${invite ? `
    <!-- Only because this token carries requiresTerms (ENG-3020). The primary
         stays disabled until it is ticked — agreeing is a condition of the
         account, not an opinion. -->
    <div style="margin-top:18px;">
      <q-checkbox v-model="terms" color="primary" size="sm">
        <span style="font-size:0.875rem;">
          I agree to the EventPipe <ds-link href="#">Terms of Service</ds-link> and
          <ds-link href="#">Privacy Policy</ds-link>.
        </span>
      </q-checkbox>
    </div>` : ''}

    <div class="av2__actions">
      <q-btn type="submit" unelevated no-caps color="primary" class="av2__primary"
        label="${invite ? 'Create account' : 'Set password'}" :disable="!ready" />
    </div>
  </q-form>`

const setPasswordState = ({ pw = '', confirm = pw, invite = false, terms = false } = {}) => () => {
  const pw1 = ref(pw)
  const pw2 = ref(confirm)
  const agreed = ref(terms)
  return {
    pw1,
    pw2,
    terms: agreed,
    // Only flagged once the confirm box has as many characters as the first —
    // judging a half-typed confirmation is nagging, not validation.
    mismatch: computed(() => pw2.value.length >= pw1.value.length && !!pw2.value && pw1.value !== pw2.value),
    ready: computed(() =>
      pw1.value.length >= MIN_LENGTH && pw1.value === pw2.value && (!invite || agreed.value)),
  }
}

/** VALID token, reset. Both fields empty; the meter shows the one hard rule
 *  (minimum length) before anything is typed, so no one learns it by failing. */
export const SetPasswordReset = authStep({
  showcase: 'protection',
  components: PARTS,
  setup: setPasswordState(),
  slot: setPasswordCard(),
})
SetPasswordReset.storyName = 'Set password · reset'

/** VALID token, invite. Same page; the token carries `requiresTerms`, so the
 *  terms checkbox appears and gates the primary. Filled with a strong password
 *  so the only thing between the user and "Create account" is the checkbox. */
export const SetPasswordInvite = authStep({
  showcase: 'protection',
  components: PARTS,
  setup: setPasswordState({ pw: 'Harbour-lantern-quietly-7', invite: true }),
  slot: setPasswordCard({ invite: true }),
})
SetPasswordInvite.storyName = 'Set password · invite'

/** A weak but valid password. The meter says Weak in red and explains why;
 *  the button still arms because the password meets the minimum. The meter is
 *  advice, and the length rule is the only rule. */
export const SetPasswordWeak = authStep({
  showcase: 'protection',
  components: PARTS,
  setup: setPasswordState({ pw: 'housingco2024' }),
  slot: setPasswordCard(),
})
SetPasswordWeak.storyName = 'Set password · weak'

/* ------------------------------------------------------------ Bad token states */

/** EXPIRED. The next step is a new link — the primary goes to Forgot password.
 *  Invite links expire too (7 days), and a new user can't request a reset for
 *  an account they never finished, so they get their own line. */
export const LinkExpired = authStep({
  showcase: 'protection',
  components: PARTS,
  slot: `
    <h1 class="av2__title">This link has expired</h1>
    <p class="av2__sub">
      Password reset links work for 1 hour. Request a new one and we'll email it straight away.
    </p>

    <div class="av2__actions">
      <q-btn unelevated no-caps color="primary" label="Request a new link" class="av2__primary" />
    </div>

    <p style="${FINE} margin:16px 0 0;">
      Setting up a new account? Invitations last 7 days — ask the person who invited you to send
      another.
    </p>

    <div class="av2__escapes">
      <ds-link href="#">Back to sign in</ds-link>
    </div>`,
})
LinkExpired.storyName = 'Link expired'

/** USED. The likeliest reason is that the user already set their password —
 *  often seconds ago, in another tab — so "Sign in" is the primary and a new
 *  link is the fallback. */
export const LinkUsed = authStep({
  showcase: 'protection',
  components: PARTS,
  slot: `
    <h1 class="av2__title">This link has already been used</h1>
    <p class="av2__sub">
      Each link works once. If you've just set your password, sign in with it. If not, request a
      new link.
    </p>

    <div class="av2__actions">
      <q-btn unelevated no-caps color="primary" label="Sign in" class="av2__primary" />
    </div>

    <div class="av2__escapes">
      <ds-link href="#">Request a new link</ds-link>
    </div>`,
})
LinkUsed.storyName = 'Link already used'

/** INVALID. Usually a link broken by an email client wrapping it, or copied
 *  incompletely. Saying so gives the user something to check before starting
 *  over. */
export const LinkInvalid = authStep({
  showcase: 'protection',
  components: PARTS,
  slot: `
    <h1 class="av2__title">This link isn't valid</h1>
    <p class="av2__sub">
      It may have been cut short when it was copied. Try opening it straight from the email, or
      request a new one.
    </p>

    <div class="av2__actions">
      <q-btn unelevated no-caps color="primary" label="Request a new link" class="av2__primary" />
    </div>

    <div class="av2__escapes">
      <ds-link href="#">Back to sign in</ds-link>
    </div>`,
})
LinkInvalid.storyName = 'Link invalid'

/* -------------------------------------------------------------------- Success */

/** After a successful set, ENG-3020 redirects to /login with a message. A
 *  reset does not sign the user in, so this is the ordinary sign-in card
 *  (ENG-3019) with a success notice on top — and the full sign-in, including
 *  the emailed code, runs from here.
 *
 *  The card is rebuilt from the launch sign-in's parts (Av2LoginPasswordField,
 *  same title, no SSO or passkey) rather than imported, because 01 · Sign in
 *  doesn't export its markup. If that card changes, change this one too. */
export const PasswordSet = authStep({
  showcase: 'protection',
  components: PARTS,
  setup: () => ({ email: ref(ACCOUNT.email), password: ref('') }),
  slot: `
    <h1 class="av2__title">Sign in to EventPipe</h1>

    <div class="q-mt-md">
      <av2-reset-notice tone="success">
        Your password has been set. Sign in with your new password.
      </av2-reset-notice>
    </div>

    <q-form @submit.prevent>
      <div class="column q-gutter-y-md">
        <ds-input label="Email" type="email" v-model="email" />
        <av2-login-password-field v-model="password" />
      </div>

      <div class="av2__actions">
        <q-btn type="submit" unelevated no-caps color="primary" class="av2__primary" label="Sign in" />
      </div>
    </q-form>`,
})
PasswordSet.storyName = 'Password set → sign in'
