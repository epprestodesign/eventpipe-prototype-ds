/** Account V2 / Flows / 04 · Account security — ENG-3024.
 *
 *  AccountSecurityView at `/account/security`. A logged-in page, reached from
 *  the user menu, so it renders inside the admin app shell (pages/_shell.js)
 *  with nothing in the sidebar highlighted — it isn't a nav destination.
 *
 *  What the ticket asks for, and where it is:
 *   - Change password: current, new, confirm ........... Overview
 *   - On success, a notice that other sessions were signed out ... PasswordChanged
 *   - A failed change (wrong current password) ......... ChangePasswordError
 *   - Trusted devices with user agent, created, last used ... Overview
 *   - Revoke one / revoke all ........ RevokeDeviceConfirm, RevokeAllConfirm
 *   - AC "after revoking a device, the next login from it asks for a code" —
 *     stated in the card caption and in both confirms.
 *   - Empty list ........................................ NoTrustedDevices
 *
 *  Also here, though not in ENG-3024: a "Two-factor authentication" card
 *  stating launch reality — email code, on, where codes go, and no setup
 *  action, because there is no enrollment at launch. It is where ENG-3033's
 *  authenticator setup attaches later (see Later · Authenticator app › Setup).
 *
 *  Left out on purpose: session list / "sign out other sessions" (not in the
 *  ticket), and any lockout UI (the spec designs none — see the brief).
 *
 *  The page body is Av2SecurityPage, shared with the Later stories so the
 *  launch page and the page ENG-3033 extends cannot drift.
 */
import { ACCOUNT, SPEC } from './_account'
import { page } from '../pages/_shell'
import Av2SecurityPage from './components/Av2SecurityPage.vue'

export default {
  title: 'Account V2/Flows/04 · Account security',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          `Account security — [ENG-3024](${SPEC.accountSecurity}). A logged-in page in the admin ` +
          'app shell, linked from the user menu. Change password (success signs out every other ' +
          'session and says so), trusted devices with a readable device name, the raw user agent, ' +
          'created and last-used dates, and revoke one / revoke all behind confirms. A ' +
          'two-factor card states the launch factor (email code) with no setup action; ' +
          `[ENG-3033](${SPEC.totp}) adds authenticator setup to it later.`,
      },
    },
  },
}

/* 'account' matches no nav key and isn't the footer's 'settings', so the
 * sidebar highlights nothing — correct for a page reached from the user menu. */
const securityPage = (attrs = '') => page({
  active: 'account',
  org: 'EventPipe',
  user: ACCOUNT.name,
  components: { Av2SecurityPage },
  setup: () => ({ account: ACCOUNT }),
  slot: `<av2-security-page :account="account" ${attrs} />`,
})

/** The page at rest: Password, Two-factor (email code, on, no action) and
 *  three trusted devices, the current one marked "This device". */
export const Overview = securityPage()

/** After a successful change. The notice says what happened to the other
 *  sessions — "signed out everywhere" only reassures if the user is told. */
export const PasswordChanged = securityPage('password-changed')
PasswordChanged.storyName = 'Password changed'

/** Wrong current password. The error sits on the field it blames; the new
 *  password the user typed is kept so one slip doesn't cost a full retype. */
export const ChangePasswordError = securityPage('pw-error')
ChangePasswordError.storyName = 'Change password · error'

/** Revoke one device. The confirm names the device in words the user will
 *  recognise and states the consequence the ticket's AC describes. */
export const RevokeDeviceConfirm = securityPage('confirm="revoke" revoke-id="dev-3"')
RevokeDeviceConfirm.storyName = 'Revoke device · confirm'

/** Revoke all. The count is in the title so the user knows the scope, and the
 *  body says it includes the device they're on. */
export const RevokeAllConfirm = securityPage('confirm="revoke-all"')
RevokeAllConfirm.storyName = 'Revoke all · confirm'

/** No trusted devices — the user never ticked the box, or revoked them all.
 *  DsEmptyState explains how a device gets here; Revoke all is hidden. */
export const NoTrustedDevices = securityPage(':devices="[]"')
NoTrustedDevices.storyName = 'No trusted devices'
