/** Account V2 — Concept · Passwordless · Choose view.
 *
 *  A CONCEPT, inspired by Attio's sign-in flow (references/092926/Attio Web
 *  Logging in 0–5.png): email → a code emailed to you → "Where to?", a picker
 *  of every place the account can go → the app. Rendered in the EventPipe
 *  design system inside the Account V2 split shell (authStep in _account.js).
 *
 *  How it differs from the launch flows (Flows › 01 · Sign in and Flows › 02 ·
 *  Email code, per ENG-3019 and ENG-3037 in P-ENG-228):
 *  · Passwordless. The launch flow is email + password, then an emailed code
 *    as the second factor. Here there is no password: the emailed 6-digit code
 *    is the ONLY factor. P-ENG-228 does not cover passwordless at all.
 *  · No Google / SSO button (Attio has one) — no requirement asks for it; SSO
 *    lives in Concepts › SSO & passkey.
 *  · A destination picker after sign-in. One row per merchant account the
 *    person belongs to, each opening that merchant's EP Pay; internal staff
 *    also get an "EventPipe view" row (all merchants), set apart by a divider.
 *
 *  Trust this device — deliberately LEFT OUT. In the launch flow the checkbox
 *  skips the SECOND factor for 30 days; the password still has to be typed, so
 *  a trusted browser is one factor, not zero. In a passwordless flow the code
 *  is the only factor: skipping it would sign anyone who types the email on
 *  that browser straight in — zero factors. What a user actually wants from
 *  the box ("don't make me do this every morning") is a long-lived SESSION, and
 *  that is a session-length policy (open question 5), revocable from Account
 *  security's device list — not a checkbox that removes the only proof of
 *  identity.
 *
 *  Account enumeration: "Check your inbox" is shown for ANY address, known or
 *  not; an unknown address simply gets no code (or a "no account" email). The
 *  step never says whether the account exists.
 *
 *  One destination: a person with exactly one place to go (one merchant, not
 *  staff) never sees the picker — the code step lands them straight in that
 *  merchant's EP Pay. The picker only appears when there is a real choice.
 *
 *  Open questions (for product / eng):
 *   1. Passwordless vs the spec. P-ENG-228 ships password + emailed code; this
 *      concept drops the password. Email-only sign-in makes the mailbox the
 *      whole security boundary — acceptable for merchants? for EP admins, who
 *      can see every merchant?
 *   2. Who gets "EventPipe view"? EP_ADMIN only, or support / finance roles
 *      too? Should it demand a fresh code (step-up) even inside a session?
 *   3. What do destination rows link to — a per-merchant URL
 *      (pay.eventpipe.com/<slug>, as drawn) or one app with an active-merchant
 *      switch? It decides whether cmd-click into two tabs works.
 *   4. "Apply for a merchant account" — should it open the EP Pay merchant
 *      application wizard directly, and should merchant users see it at all?
 *   5. Session length once the code is accepted (replaces trust-this-device).
 *   6. Does the in-app org switcher (AppBar) become this same list?
 */
import { ref } from 'vue'
import { authStep, ACCOUNT } from './_account'
import Av2LoginEmailField from './components/Av2LoginEmailField.vue'
import Av2CodeInput from './components/Av2CodeInput.vue'
import Av2CodeResend from './components/Av2CodeResend.vue'
import Av2ViewLockedEmail from './components/Av2ViewLockedEmail.vue'
import Av2ViewRow from './components/Av2ViewRow.vue'

export default {
  title: 'Account V2/Concepts/Passwordless · Choose view',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Concept — not in P-ENG-228.** A passwordless sign-in inspired by **Attio\'s sign-in flow**: '
          + 'work email → a 6-digit code emailed to you → **"Where to?"**, a picker of every merchant '
          + 'account you belong to (each opens that merchant\'s EP Pay), plus an **EventPipe view** row '
          + 'for internal staff. Rendered in the Account V2 split shell.\n\n'
          + '**How it differs from the launch flows** (Flows › 01 · Sign in, Flows › 02 · Email code — '
          + 'ENG-3019 / ENG-3037): no password — the emailed code is the only factor, which the P-ENG-228 '
          + 'spec does not cover; no Google/SSO button; and a destination picker after sign-in.\n\n'
          + '**No "Trust this device for 30 days".** In the launch flow it skips the *second* factor while '
          + 'the password is still required. Here the code is the *only* factor, so trusting a device would '
          + 'make sign-in zero-factor for anyone who can type the email on that browser. The real need — '
          + 'not signing in every day — is a session-length policy, revocable from Account security.\n\n'
          + '**One destination → no picker.** A user with exactly one place to go lands there straight from '
          + 'the code step. "Check your inbox" is shown for any address, so the flow never reveals whether '
          + 'an account exists.\n\n'
          + '**Open questions:** passwordless vs the spec (the mailbox becomes the whole boundary — OK for '
          + 'EP admins?); who gets EventPipe view, and should it require step-up; what rows link to '
          + '(per-merchant URL vs an active-merchant switch); whether "Apply for a merchant account" opens '
          + 'the EP Pay merchant application wizard and who sees it; session length after the code.',
      },
    },
  },
}

const story = (text) => ({ docs: { description: { story: text } } })

/* ---------------------------------------------------------------------------
 * Fixtures. Merchant names are the org switcher's (src/components/AppBar.vue);
 * Team Travel Source is the EP Pay org used across the EP Pay stories.
 * ------------------------------------------------------------------------- */
const MERCHANTS = [
  { name: 'Team Travel Source', slug: 'team-travel-source', initials: 'TT', tone: 'success' },
  { name: 'Summit Events Co.', slug: 'summit-events-co', initials: 'SE', tone: 'discovery' },
  { name: 'Global Sports Group', slug: 'global-sports-group', initials: 'GS', tone: 'info' },
]
const merchantRows = (list) => list.map((m) => ({
  ...m, href: '#', subtitle: `Merchant · pay.eventpipe.com/${m.slug}`,
}))

/** A merchant-side user: two merchant accounts, no EventPipe staff access. */
const MERCHANT_USER = { email: 'dana.reyes@summitevents.co' }

/* ---------------------------------------------------------------------------
 * Step 1 · Enter email
 * ------------------------------------------------------------------------- */
const EMAIL_COMPONENTS = { Av2LoginEmailField }

const emailStep = ({ loading = false } = {}) => `
  <h1 class="av2__title">Sign in to EventPipe</h1>
  <p class="av2__sub">Enter your work email and we'll send you a code to sign in. No password needed.</p>

  <q-form novalidate @submit="onSubmit">
    <av2-login-email-field v-model="email" />
    <div class="av2__actions" style="margin-top:16px;">
      <q-btn type="submit" unelevated no-caps color="primary" class="av2__primary"
        label="Continue" ${loading ? ':loading="true"' : ''} />
    </div>
  </q-form>

  <!-- Attio's consent line, moved up under the primary: the thing you agree
       to by continuing belongs next to the button that continues. -->
  <p style="margin:16px 0 0; font-size:0.8125rem; line-height:1.5; color:var(--ds-color-text-subtle);">
    By continuing you acknowledge that you have read, understood and agree to
    EventPipe's <a href="#" style="color:var(--ds-color-link); font-weight:600;">Terms and Conditions</a>.
  </p>`

const emailState = (email = '') => () => ({ email: ref(email), onSubmit: () => {} })

export const EnterEmail = authStep({
  showcase: 'platform',
  components: EMAIL_COMPONENTS,
  setup: emailState(),
  slot: emailStep(),
})
EnterEmail.storyName = 'Enter email'
EnterEmail.parameters = story(
  'Attio\'s "Sign in", in EventPipe: one work-email field (Av2LoginEmailField, visibly labelled — '
  + 'Attio relies on a placeholder), a full-width Continue, and the consent line with a Terms link. '
  + 'No password and no Google button.',
)

export const EmailEntered = authStep({
  showcase: 'platform',
  components: EMAIL_COMPONENTS,
  setup: emailState(ACCOUNT.email),
  slot: emailStep(),
})
EmailEntered.storyName = 'Email entered'
EmailEntered.parameters = story(
  'Ready to continue. Continue sends the code and moves to "Check your inbox" for ANY address — '
  + 'the flow never confirms whether an account exists.',
)

/* ---------------------------------------------------------------------------
 * Step 2 · Check your inbox
 * ------------------------------------------------------------------------- */
const CODE_COMPONENTS = { Av2CodeInput, Av2CodeResend, Av2ViewLockedEmail }

const codeStep = ({ loading = false } = {}) => `
  <h1 class="av2__title">Check your inbox</h1>
  <p class="av2__sub">
    We've just emailed you a 6-digit code. Enter it below to sign in —
    it expires in 10 minutes.
  </p>

  <av2-view-locked-email :email="email" />

  <q-form novalidate @submit="onSubmit" style="margin-top:20px;">
    <av2-code-input v-model="code" ${loading ? '' : 'autofocus'} />
    <av2-code-resend state="cooling" wait="0:42" />

    <!-- No "Trust this device" here, on purpose: the code is the only factor,
         so trusting a device would make sign-in zero-factor. See file docs. -->
    <div class="av2__actions" style="margin-top:20px;">
      <q-btn type="submit" unelevated no-caps color="primary" class="av2__primary"
        label="Continue" ${loading ? ':loading="true"' : ''} />
    </div>
  </q-form>`

const codeState = (code = '') => () => ({ email: ACCOUNT.email, code: ref(code), onSubmit: () => {} })

/* Showcase 'platform', not 'security', on the code steps: the security
   showcase's cards and headline advertise "Trusted devices skip it for 30
   days" — the exact feature this concept leaves out. Av2Showcase is shared, so
   the concept picks the showcase that doesn't contradict it. */
const CODE_SHOWCASE = 'platform'

export const CheckInbox = authStep({
  showcase: CODE_SHOWCASE,
  components: CODE_COMPONENTS,
  setup: codeState(),
  slot: codeStep(),
})
CheckInbox.storyName = 'Check your inbox'
CheckInbox.parameters = story(
  'Attio\'s "Check your inbox!": the address shown locked with a Change link back to step 1, the '
  + '6-digit Av2CodeInput (paste / one-time-code autofill), the resend line frozen at 0:42, Continue. '
  + 'The address is shown in full, not masked as in Flows › 02 — the user typed it seconds ago. '
  + '**No "Trust this device for 30 days"**: the code is the only factor here, so trusting a device '
  + 'would make sign-in zero-factor.',
)

export const CodeEntered = authStep({
  showcase: CODE_SHOWCASE,
  components: CODE_COMPONENTS,
  setup: codeState('482913'),
  slot: codeStep(),
})
CodeEntered.storyName = 'Code entered'
CodeEntered.parameters = story('All six digits in; the input runs its "ready" wave. Continue verifies.')

export const Verifying = authStep({
  showcase: CODE_SHOWCASE,
  components: CODE_COMPONENTS,
  setup: codeState('482913'),
  slot: codeStep({ loading: true }),
})
Verifying.storyName = 'Verifying'
Verifying.parameters = story(
  'Continue pressed: the spinner replaces the label inside a full-width button, so nothing moves. '
  + 'On success, a user with ONE destination goes straight there; anyone else gets "Where to?".',
)

/* ---------------------------------------------------------------------------
 * Step 3 · Where to?
 * ------------------------------------------------------------------------- */
const PICKER_COMPONENTS = { Av2ViewRow }

const DIVIDER = '<hr style="border:0; height:1px; background:var(--ds-color-border); margin:16px 0;" />'

const pickerStep = ({ staff = true } = {}) => `
  <h1 class="av2__title">Where to?</h1>
  <p class="av2__sub">These are all the places you can go.</p>

  <nav aria-label="Choose where to go">
    <ul role="list" style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px;">
      <li v-for="m in merchants" :key="m.slug">
        <av2-view-row :href="m.href" :title="m.name" :subtitle="m.subtitle"
          :initials="m.initials" :tone="m.tone" />
      </li>
    </ul>
    ${staff ? `
    ${DIVIDER}
    <ul role="list" style="list-style:none; margin:0; padding:0;">
      <li>
        <av2-view-row href="#" tone="eventpipe" title="EventPipe view"
          subtitle="Internal · all merchants" />
      </li>
    </ul>` : ''}
    ${DIVIDER}
    <!-- In the product this opens the EP Pay merchant application wizard. -->
    <av2-view-row action href="#" title="Apply for a merchant account" />
  </nav>

  <!-- The user IS signed in here, so Sign out has to be reachable; the shell
       footer is shared, so it sits under the list with who is signed in. -->
  <p style="margin:24px 0 0; font-size:0.8125rem; color:var(--ds-color-text-subtle);">
    Signed in as <strong style="color:var(--ds-color-text); font-weight:600;">{{ email }}</strong>
    · <a href="#" style="color:var(--ds-color-link); font-weight:600;">Sign out</a>
  </p>`

export const WhereToStaff = authStep({
  showcase: 'platform',
  components: PICKER_COMPONENTS,
  setup: () => ({ email: ACCOUNT.email, merchants: merchantRows(MERCHANTS) }),
  slot: pickerStep({ staff: true }),
})
WhereToStaff.storyName = 'Where to? · Staff'
WhereToStaff.parameters = story(
  'The step modelled on Attio\'s workspace picker. One bordered row per merchant account (square '
  + 'initial tile, name, "Merchant · pay.eventpipe.com/<slug>", chevron), a divider, the internal '
  + '**EventPipe view** row (the real EventPipe mark on navy, "Internal · all merchants"), a divider, '
  + 'then "+ Apply for a merchant account". Rows are links — Tab reaches each, with a full-row focus '
  + 'ring and hover; cmd-click opens a merchant in a new tab. Sign out sits under the list.',
)

export const WhereToMerchantOnly = authStep({
  showcase: 'platform',
  components: PICKER_COMPONENTS,
  setup: () => ({ email: MERCHANT_USER.email, merchants: merchantRows(MERCHANTS.slice(0, 2)) }),
  slot: pickerStep({ staff: false }),
})
WhereToMerchantOnly.storyName = 'Where to? · Merchant only'
WhereToMerchantOnly.parameters = story(
  'A merchant-side user with two merchant accounts: the same picker without the EventPipe view row — '
  + 'exactly Attio\'s shape (destinations, divider, add). With only ONE merchant account the picker is '
  + 'skipped and the user lands in that merchant\'s EP Pay directly.',
)
