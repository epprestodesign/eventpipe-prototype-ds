/** Account V2 — shared scaffold.
 *
 *  The EventPipe platform's staff sign-in and account security, designed
 *  against Linear project P-ENG-228 "Auth: Login Refactor to Blitz + MFA"
 *  (https://linear.app/eventpipe/project/auth-login-refactor-to-blitz-mfa-65cbfec838bd).
 *  Every Flows story maps to a ticket in that project; the ticket is named in
 *  the story's docs so a reviewer can check the screen against it.
 *
 *  Who signs in here: staff — EP admins, housing-company, hotel and
 *  event-company users — at /portal/login. Bookers never see these screens.
 *  Desktop web only.
 *
 *  What ships first, per the spec: email-code MFA for all staff, trusted
 *  devices for 30 days, no enrollment step. Authenticator apps (TOTP) are
 *  scheduled for later (ENG-3033) and live in their own "Later" section so
 *  nobody mistakes them for launch scope. SMS is on demand only and not
 *  designed.
 *
 *  Until 2026-09-29 this category was framed as EventPipe Pay's sign-in and was
 *  built around authenticator apps; it was retargeted when the ENG project
 *  became the only written requirements for auth anywhere in Linear.
 *
 *  THE SHELL. Every pre-login step renders in one split-screen shell
 *  (components/Av2Split.vue): a white panel on the left — top bar with the
 *  EventPipe wordmark and "Get support", the step's content in a 440px
 *  left-aligned column pinned high, the anti-phishing line at the bottom of
 *  that column, and a footer with Terms and the © line — and on the right a
 *  shader ground with two frosted cards and a headline (Av2Showcase), whose
 *  content follows the flow (`showcase` below). The panel's right-hand corners
 *  carry a 32px radius (--av2-panel-radius in src/css/account-v2.scss), a
 *  deliberate, user-requested exception to the DS 4px scale for this layout.
 *
 *  It replaced the centred card on 2026-09-29, at the user's request (the
 *  layout came from a Hotel Partner concept that was then removed). ENG-3019
 *  names the Bookings Lookup card layout; that note is superseded by the
 *  user's decision. Screens that live inside the admin app (Account security,
 *  the in-app MFA banner, TOTP setup and recovery codes) are unaffected.
 *
 *  Three rules the shell enforces, from the reference study in
 *  references/account-v2/mobbin-flows.md — they held for the card and still
 *  hold for the split:
 *
 *   1. One shell, every step. Sign in, the code page and every password page
 *      share the same panel, column width and edges. Shell continuity is the
 *      anti-phishing signal.
 *   2. The second factor is a full page (/login/verify), never a modal.
 *   3. The content column is pinned high, so it grows downward as errors
 *      appear rather than jumping as it recentres.
 */
import Av2Split from './components/Av2Split.vue'

/** Where "Get support" points on every auth step. A placeholder — the only
 *  EventPipe support address in the repo (also used by the Emails) — until the
 *  right inbox for staff sign-in help is confirmed. */
export const SUPPORT_EMAIL = 'support@eventpipe.com'

/** The staff account these flows belong to. An EP admin, because EP_ADMIN is
 *  the pilot user type for both the new login page (ENG-3043) and MFA
 *  enforcement. `emailMasked` is the `maskedDestination` the code page shows
 *  (ENG-3037) — enough to recognise, not enough to leak. */
export const ACCOUNT = {
  name: 'Jeffrey Upp',
  email: 'jeffrey.upp@yourhousingcompany.com',
  emailMasked: 'j••••••••@yourhousingcompany.com',
  userType: 'EP admin',
  phoneMasked: '(•••) ••• 7379',
  authenticatorLabel: 'your authenticator app',
}

/** Ticket links, so each story's docs can point at its requirement. */
export const SPEC = {
  project: 'https://linear.app/eventpipe/project/auth-login-refactor-to-blitz-mfa-65cbfec838bd',
  login: 'https://linear.app/eventpipe/issue/ENG-3019',
  mfaChallenge: 'https://linear.app/eventpipe/issue/ENG-3037',
  setPassword: 'https://linear.app/eventpipe/issue/ENG-3020',
  accountSecurity: 'https://linear.app/eventpipe/issue/ENG-3024',
  pilotGate: 'https://linear.app/eventpipe/issue/ENG-3043',
  mfaBanner: 'https://linear.app/eventpipe/issue/ENG-3044',
  lockout: 'https://linear.app/eventpipe/issue/ENG-3012',
  passwordEmails: 'https://linear.app/eventpipe/issue/ENG-3009',
  mfaEmails: 'https://linear.app/eventpipe/issue/ENG-3036',
  totp: 'https://linear.app/eventpipe/issue/ENG-3033',
}

/* Runtime-compiled templates: when one fails Vue renders nothing and logs to
 * the console, which reads as a blank story. Show the error instead. */
const fatalTemplate = `
  <div style="padding:32px; font-family:ui-monospace, SFMono-Regular, Menlo, monospace;">
    <div style="max-width:900px; border:2px solid var(--ds-color-background-danger-bold);
                border-radius:var(--ds-radius-md); overflow:hidden;">
      <div style="background:var(--ds-color-background-danger-bold); color:var(--ds-color-text-inverse);
                  padding:12px 18px; font-weight:700;">
        This step failed to render
      </div>
      <pre style="margin:0; padding:18px; white-space:pre-wrap; word-break:break-word;
                  font-size:0.8125rem; line-height:1.6;">{{ fatal }}</pre>
    </div>
  </div>`

/** Wrap a step in the shared auth shell (Av2Split).
 *
 *  `showcase` picks what the right panel says, to match the flow:
 *    'platform'   (default) — sign in, the pilot gate, the SSO concept.
 *    'security'   — the emailed code, the MFA-coming login page, the later
 *                   authenticator challenge.
 *    'protection' — forgot and set password.
 *
 *  `variant` / `forceFallback` drive the right panel's shader (Av2ShaderGround:
 *  'depth' | 'liquid' | 'wave'); 'liquid' is the default. `ground`, if given,
 *  is template markup that replaces the shader outright.
 *
 *  `cards` (default true) shows the showcase's two frosted cards. Pass false
 *  with a ground that already contains its own — the pre-rendered video
 *  grounds (Av2VideoGround) in Concepts / Login Backgrounds.
 *
 *  `headline` (default '') overrides the showcase headline for one story —
 *  for concepts testing new copy (e.g. "Event housing. In sync." on video
 *  concept D). The subline and every other flow's copy are unaffected.
 *
 *  `light` flags a ground pale enough (the 'wave' shader) that the showcase
 *  headline has to run in dark ink rather than white. It is a property of the
 *  ground's lightness, not of whether a shader is in use.
 *
 *  `background` is kept for compatibility. In the card shell it chose the page
 *  ground behind the card ('plain' or 'shader'); in the split shell the ground
 *  is always the right panel's shader, so it now only sets an
 *  `av2--bg-<value>` class on the wrapper.
 *
 *  The `.eppay` class stays on the wrapper because other code keys off it, but
 *  it no longer carries any colour of its own. These screens render in the
 *  EventPipe design system: Azure #2561FA brand, #01113E navy chrome, Graphite
 *  neutrals, Product Sans, 4px radius, 40px controls.
 *
 *  Step markup must NOT include <av2-brand /> — the wordmark is in the shell's
 *  top bar.
 */
export function authStep({
  components = {}, setup = () => ({}), slot = '', background = 'plain', ground = '', light = false,
  showcase = 'platform', variant = 'liquid', forceFallback = false, cards = true, headline = '',
} = {}) {
  return {
    render: (args) => ({
      components: { Av2Split, ...components },
      setup: () => {
        try {
          return {
            fatal: '', account: ACCOUNT, background, light,
            av2Shell: { showcase, variant, forceFallback, light, cards, headline, supportEmail: SUPPORT_EMAIL },
            ...setup(args),
          }
        } catch (err) {
          return { fatal: 'setup() threw:\n\n' + (err && err.stack ? err.stack : String(err)) }
        }
      },
      template: `
        <template v-if="fatal">${fatalTemplate}</template>
        <template v-else>
          <div class="eppay av2" :class="['av2--bg-' + background, { 'av2--light': light }]">
            <av2-split :support-email="av2Shell.supportEmail" :showcase="av2Shell.showcase"
              :variant="av2Shell.variant" :force-fallback="av2Shell.forceFallback" :light="av2Shell.light"
              :cards="av2Shell.cards" :headline="av2Shell.headline">
              ${slot}
              ${ground ? `<template #ground>${ground}</template>` : ''}
              <template #footnote>
                <!-- Anti-phishing line, at the bottom of the content column on
                     every step. It used to read "will never ask for … a
                     verification code by email", which became false the day MFA
                     launched as an emailed code. EventPipe does SEND the code by
                     email; what it never does is ASK you for it. -->
                <p class="av2__phish">
                  EventPipe staff will never ask you for your password or a verification code.
                </p>
              </template>
            </av2-split>
          </div>
        </template>`,
    }),
  }
}
