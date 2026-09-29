/** Account V2 — Emails.
 *
 *  The six auth emails from ENG-3036 (MFA and security notices) and ENG-3009
 *  (password reset and invite), one story each, rendered as the recipient
 *  receives them. They reuse the Teams Mgmt Comms Phase 2 email frame —
 *  envelope band, logo, body, ruled footer — so all EventPipe mail reads as
 *  one family. See Av2EmailFrame for why it is a reproduction, not an import.
 *
 *  Security rules every email here follows:
 *   · never the password, in any form;
 *   · never a code AND a link that signs you in, in the same email — the code
 *     email carries no sign-in link at all;
 *   · links go only to /set-password/:token or /account/security, and the URL
 *     is printed in full under every button;
 *   · location is approximate, from the IP prefix, never the full address.
 */
import { ACCOUNT, SPEC } from './_account'
import { FROM, TO, FIRST_NAME, DEVICE, ATTACKER, MFA_CODE, LINKS, INVITER, EMAILS } from './_emails'
import Av2EmailFrame from './components/Av2EmailFrame.vue'
import Av2EmailCode from './components/Av2EmailCode.vue'
import Av2EmailFacts from './components/Av2EmailFacts.vue'
import Av2EmailButton from './components/Av2EmailButton.vue'

export default {
  title: 'Account V2/Emails',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The six emails the new login sends, one story each. Security notices are
**[ENG-3036](${SPEC.mfaEmails})**; password reset and invite are
**[ENG-3009](${SPEC.passwordEmails})**. Project: [P-ENG-228](${SPEC.project}).

| Story | EmailType | Ticket |
| --- | --- | --- |
| MFA code | \`MFA_CODE\` | ENG-3036 |
| New device sign-in | \`NEW_DEVICE_SIGNIN\` | ENG-3036 |
| Account locked | \`ACCOUNT_LOCKED\` | ENG-3036 |
| Password changed | \`PASSWORD_CHANGED\` | ENG-3036 |
| Password reset | \`PASSWORD_RESET\` | ENG-3009 |
| Invite | \`USER_INVITE\` | ENG-3009 |

**Frame.** The Teams Mgmt Comms Phase 2 email (Default Emails, and the preview
modal in Email Preview & Test Send): sunken envelope band with From / To /
Subject, logo, body, hairline-ruled footer. Reproduced in \`Av2EmailFrame\`
because TMC2's version is a template string tied to its own fixtures —
a candidate for one shared DS email component.

**Rules.** Never the password. Never a code and a sign-in link together. Links
only to \`/set-password/:token\` or \`/account/security\`, full URL printed under
every button. Location is approximate, from the IP prefix.

**Copy.** Security notices are new copy (draft). Reset and invite are a **port
of today's platform mailers**, restyled into the frame.

Recipient throughout: ${ACCOUNT.name}, ${ACCOUNT.email}. All times Tuesday,
September 29, 2026, US Eastern.
`,
      },
    },
  },
}

const COMPONENTS = { Av2EmailFrame, Av2EmailCode, Av2EmailFacts, Av2EmailButton }

/* The email, then the delivery card under it — the same pairing as TMC2's
   Default Emails ("Default configuration" under each template). */
function emailStory(type, body, setup = () => ({})) {
  const meta = EMAILS[type]
  return {
    render: () => ({
      components: COMPONENTS,
      setup: () => ({
        from: FROM, to: TO, subject: meta.subject, sent: meta.sent,
        details: meta.details, ticket: meta.ticket,
        firstName: FIRST_NAME, account: ACCOUNT, device: DEVICE, links: LINKS,
        ...setup(),
      }),
      template: `
        <div style="max-width:680px; margin:0 auto;">
          <div class="row items-center q-gutter-sm q-mb-md">
            <q-chip dense outline color="primary" text-color="primary" icon="mail" :label="details[0][1]" />
            <q-chip dense outline color="grey-7" text-color="grey-8" icon="link" clickable tag="a"
              :href="ticket.url" target="_blank" :label="ticket.id" />
          </div>

          <av2-email-frame :from="from" :to="to" :subject="subject" :sent="sent">
            ${body}
          </av2-email-frame>

          <q-card flat bordered style="margin-top:20px;">
            <q-card-section style="padding:20px 26px;">
              <div class="text-primary text-weight-bold q-mb-sm">Delivery</div>
              <div style="display:grid; grid-template-columns:minmax(120px,auto) 1fr; gap:8px 20px;">
                <template v-for="d in details" :key="d[0]">
                  <span style="font-size:0.8125rem; color:var(--ds-color-text-subtle);">{{ d[0] }}</span>
                  <span style="font-size:0.875rem;">{{ d[1] }}</span>
                </template>
              </div>
            </q-card-section>
          </q-card>
        </div>`,
    }),
  }
}

const docs = (text) => ({ docs: { description: { story: text } } })

/* ------------------------------------------------------------------------- */

/** MFA_CODE — ENG-3036. */
export const MfaCode = emailStory('MFA_CODE', `
  <p>Hi {{ firstName }},</p>
  <p>Use this code to finish signing in to EventPipe:</p>
  <av2-email-code :code="code" caption="Expires in 10 minutes, at 2:24 PM EDT. Works once." />
  <p>Requested from {{ device.agent }} near {{ device.city }}.</p>
  <p><strong>Didn't try to sign in?</strong> Someone may know your password. Don't
    share this code with anyone, and change your password at
    <a :href="links.security.href">{{ links.security.shown }}</a>.</p>`,
() => ({ code: MFA_CODE }))
MfaCode.storyName = 'MFA code'
MfaCode.parameters = docs(`
**EmailType \`MFA_CODE\`** · [ENG-3036](${SPEC.mfaEmails}) · the code the
[ENG-3037](${SPEC.mfaChallenge}) page asks for.

- The 6-digit code is large and **one unbroken text run** — the spacing is
  letter-spacing — so a double-click selects it all and it pastes into the six
  boxes in one go. No copy button: email clients strip scripts.
- Valid **10 minutes**, stated as an absolute time too, because email arrives
  late and "10 minutes" alone does not say from when.
- **No sign-in link.** The security link is plain text to \`/account/security\`,
  which does not sign anyone in.
- Code **not in the subject line** (judgement call): it keeps it off lock screens
  and notification previews, at the cost of one tap.
`)

/** NEW_DEVICE_SIGNIN — ENG-3036. */
export const NewDeviceSignIn = emailStory('NEW_DEVICE_SIGNIN', `
  <p>Hi {{ firstName }},</p>
  <p>Someone just signed in to your EventPipe account from a device we haven't
    seen before, using your password and the sign-in code we emailed you.</p>
  <av2-email-facts :rows="facts" />
  <p>If this was you, you don't need to do anything.</p>
  <p><strong>Wasn't you?</strong> Change your password right away, then review your
    trusted devices and remove any you don't recognize. Changing your password
    signs out every other session.</p>
  <av2-email-button label="Review account security" :href="links.security.href" :shown-url="links.security.shown" />`,
() => ({
  facts: [
    { label: 'Device', value: DEVICE.agent },
    { label: 'Location', value: `${DEVICE.location} (approximate, from IP ${DEVICE.ipPrefix})` },
    { label: 'Time', value: 'Tue, Sep 29, 2026, 2:16 PM EDT' },
    { label: 'Trusted', value: 'Yes — no code needed on this device for 30 days' },
  ],
}))
NewDeviceSignIn.storyName = 'New device sign-in'
NewDeviceSignIn.parameters = docs(`
**EmailType \`NEW_DEVICE_SIGNIN\`** · [ENG-3036](${SPEC.mfaEmails}).

- Sent **after** a sign-in code is verified on an untrusted device, so it
  describes a sign-in that happened, not one in progress.
- Device (user agent), **approximate location from the IP prefix**, time, and
  whether "Trust this device for 30 days" was ticked.
- "Wasn't you?" names both actions — change password, review trusted devices —
  and they are one link, because both live on \`/account/security\`
  ([ENG-3024](${SPEC.accountSecurity})).
`)

/** ACCOUNT_LOCKED — ENG-3036. */
export const AccountLocked = emailStory('ACCOUNT_LOCKED', `
  <p>Hi {{ firstName }},</p>
  <p>There were 10 unsuccessful attempts to sign in to your EventPipe account, so
    we've locked sign-in for <strong>15 minutes, until 3:17 PM EDT</strong>.</p>
  <av2-email-facts :rows="facts" />
  <p><strong>If it was you:</strong> wait until 3:17 PM EDT, then sign in again.
    Until then even the correct password won't work. If you've forgotten it, use
    <em>Forgot password?</em> on the sign-in page once the lock lifts.</p>
  <p><strong>If it wasn't you:</strong> your password is still safe — the lock
    stopped the attempts. To be sure, change your password after the lock lifts.</p>
  <av2-email-button label="Go to account security" :href="links.security.href" :shown-url="links.security.shown" />`,
() => ({
  facts: [
    { label: 'Last attempt', value: 'Tue, Sep 29, 2026, 3:02 PM EDT' },
    { label: 'Location', value: `${ATTACKER.location} (approximate, from IP ${ATTACKER.ipPrefix})` },
    { label: 'Locked until', value: '3:17 PM EDT' },
  ],
}))
AccountLocked.storyName = 'Account locked'
AccountLocked.parameters = docs(`
**EmailType \`ACCOUNT_LOCKED\`** · [ENG-3036](${SPEC.mfaEmails}) · lock rule from
[ENG-3012](${SPEC.lockout}): 10 failures, 15-minute lock.

- There is **no lockout screen** by design: a correct password during the lock
  still gets the generic error. This email is how the user finds out, so it says
  outright that the correct password won't work until the stated time.
- Two branches, "if it was you" / "if it wasn't you", each with one action.
- No reset link here: the lock email going to an inbox is not a reason to hand
  out a password-setting token. Forgot password stays on the sign-in page.
`)

/** PASSWORD_CHANGED — ENG-3036. */
export const PasswordChanged = emailStory('PASSWORD_CHANGED', `
  <p>Hi {{ firstName }},</p>
  <p>The password for your EventPipe account ({{ account.email }}) was changed.</p>
  <av2-email-facts :rows="facts" />
  <p>To keep your account safe, we've also:</p>
  <ul style="margin:0 0 14px; padding-left:20px; line-height:1.6;">
    <li>signed you out of EventPipe everywhere else, and</li>
    <li>removed all your trusted devices — each will ask for a sign-in code next time.</li>
  </ul>
  <p><strong>Didn't change your password?</strong> Someone else may have access.
    Go to the EventPipe sign-in page, choose <em>Forgot password?</em> to set a
    new one, then check your account security. If you can't get in, contact
    support@eventpipe.com.</p>
  <av2-email-button label="Review account security" :href="links.security.href" :shown-url="links.security.shown" />`,
() => ({
  facts: [
    { label: 'Time', value: 'Tue, Sep 29, 2026, 3:40 PM EDT' },
    { label: 'Device', value: DEVICE.agent },
    { label: 'Location', value: `${DEVICE.location} (approximate, from IP ${DEVICE.ipPrefix})` },
  ],
}))
PasswordChanged.storyName = 'Password changed'
PasswordChanged.parameters = docs(`
**EmailType \`PASSWORD_CHANGED\`** · [ENG-3036](${SPEC.mfaEmails}).

- States both side effects: **all other sessions signed out** and **all trusted
  devices revoked** — so the next code prompt is expected, not alarming.
- Never the new password, not even partly.
- "Didn't change it?" routes to Forgot password on the sign-in page rather than
  a link in the email: if someone else changed it, the owner can no longer sign
  in to \`/account/security\`.
`)

/** PASSWORD_RESET — ENG-3009. Copy ported from today's platform mailer. */
export const PasswordReset = emailStory('PASSWORD_RESET', `
  <p>Hi {{ firstName }},</p>
  <p>We received a request to reset the password for your EventPipe account,
    {{ account.email }}. Click the button below to choose a new one.</p>
  <av2-email-button label="Reset password" :href="links.reset.href" :shown-url="links.reset.shown" />
  <p>This link expires in <strong>1 hour</strong> and can only be used once. When
    you've set your new password, sign in with it as usual.</p>
  <p>If you didn't request a password reset, you can ignore this email — your
    password won't change.</p>`)
PasswordReset.storyName = 'Password reset'
PasswordReset.parameters = docs(`
**EmailType \`PASSWORD_RESET\`** · [ENG-3009](${SPEC.passwordEmails}) · lands on
Set password ([ENG-3020](${SPEC.setPassword})).

- **Copy is a port of today's platform reset mailer**, restyled into the frame.
- Link to \`/set-password/:token\`, valid **1 hour**, single use.
- Says to sign in afterwards, because a reset does **not** sign you in.
- Sent only when the account exists; the Forgot password screen shows the same
  confirmation either way.
`)

/** USER_INVITE — ENG-3009. Copy ported from today's platform mailer. */
export const Invite = emailStory('USER_INVITE', `
  <p>Hi {{ firstName }},</p>
  <p>{{ inviter.name }} at <strong>{{ inviter.company }}</strong> has invited you
    to EventPipe, where {{ inviter.company }} manages its event housing.</p>
  <p>To get started, set a password for your account. Your username is
    {{ account.email }}.</p>
  <av2-email-button label="Set your password" :href="links.invite.href" :shown-url="links.invite.shown" />
  <p>This link expires in <strong>7 days</strong>, on Tue, Oct 6, 2026, and can
    only be used once. If it expires, ask {{ inviter.name }} to send a new invite.</p>
  <p>Not expecting this? You can ignore this email and no account will be activated.</p>`,
() => ({ inviter: INVITER }))
Invite.storyName = 'Invite'
Invite.parameters = docs(`
**EmailType \`USER_INVITE\`** · [ENG-3009](${SPEC.passwordEmails}) · lands on
Set password ([ENG-3020](${SPEC.setPassword})) with \`requiresTerms\` on.

- **Copy is a port of today's platform invite mailer**, restyled into the frame.
- Names the **inviting person and company**, since the company is who the
  recipient recognises, not EventPipe.
- Link to \`/set-password/:token\`, valid **7 days**, with the absolute date.
`)
