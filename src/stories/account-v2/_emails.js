/** Account V2 — fixtures for the six auth emails (ENG-3009, ENG-3036).
 *
 *  Deterministic: one account (ACCOUNT from _account.js), one day
 *  (Tuesday 2026-09-29, US Eastern daylight time), one device. The emails tell
 *  one story in order — a code is requested, the new device verifies, later
 *  someone else hammers the password and trips the lock, the password is
 *  changed — so the facts in one email agree with the facts in the next.
 *
 *  Tokens and codes are fixed strings, never generated.
 */
import { ACCOUNT, SPEC } from './_account'

export const FROM = 'EventPipe <no-reply@eventpipe.com>'
export const TO = `${ACCOUNT.name} <${ACCOUNT.email}>`
export const FIRST_NAME = ACCOUNT.name.split(' ')[0]

/** The device that signs in, verifies and gets trusted. Location is the
 *  approximate city from the IP's /16 prefix — never the full address. */
export const DEVICE = {
  agent: 'Chrome 129 on macOS',
  location: 'Near Portland, OR, United States',
  city: 'Portland, OR',
  ipPrefix: '73.25.x.x',
}

/** The attempts that trip the lock come from somewhere else. */
export const ATTACKER = {
  location: 'Near Frankfurt, Germany',
  ipPrefix: '185.220.x.x',
}

export const MFA_CODE = '482913'

/* Fixed, readable tokens. The real ones are long random strings. */
const RESET_TOKEN = 'rst_9Kq2VwX4mPz7'
const INVITE_TOKEN = 'inv_3HtB8nLc6YsR'

export const LINKS = {
  security: { href: '#/account/security', shown: 'https://app.eventpipe.com/account/security' },
  reset: { href: `#/set-password/${RESET_TOKEN}`, shown: `https://app.eventpipe.com/set-password/${RESET_TOKEN}` },
  invite: { href: `#/set-password/${INVITE_TOKEN}`, shown: `https://app.eventpipe.com/set-password/${INVITE_TOKEN}` },
}

export const INVITER = { name: 'Alex Rivera', company: 'Your Housing Company' }

/** Envelope + delivery facts per EmailType. `details` feeds the card under
 *  each email; it is what a reviewer checks the copy against. */
export const EMAILS = {
  MFA_CODE: {
    ticket: { id: 'ENG-3036', url: SPEC.mfaEmails },
    subject: 'Your EventPipe sign-in code',
    sent: 'Tue, Sep 29, 2026, 2:14 PM EDT',
    details: [
      ['EmailType', 'MFA_CODE'],
      ['Trigger', 'Sign-in with a correct password on an untrusted device (MFA_REQUIRED), and each "Resend code"'],
      ['Expiry', '10 minutes; 5 wrong entries revoke it; resend max 5 per hour'],
      ['Links', 'None that sign you in. Only /account/security, as plain text'],
    ],
  },
  NEW_DEVICE_SIGNIN: {
    ticket: { id: 'ENG-3036', url: SPEC.mfaEmails },
    subject: 'New sign-in to your EventPipe account',
    sent: 'Tue, Sep 29, 2026, 2:16 PM EDT',
    details: [
      ['EmailType', 'NEW_DEVICE_SIGNIN'],
      ['Trigger', 'After a sign-in code is verified on a device that was not already trusted'],
      ['Contains', 'Device (user agent), approximate location from the IP prefix, time, whether it was trusted'],
      ['Links', '/account/security (change password, review trusted devices)'],
    ],
  },
  ACCOUNT_LOCKED: {
    ticket: { id: 'ENG-3036', url: SPEC.mfaEmails },
    subject: 'Your EventPipe account is locked for 15 minutes',
    sent: 'Tue, Sep 29, 2026, 3:02 PM EDT',
    details: [
      ['EmailType', 'ACCOUNT_LOCKED'],
      ['Trigger', '10 failed password attempts (ENG-3012)'],
      ['Lock', '15 minutes. A correct password during the lock still gets the generic error on screen — this email is how the user finds out'],
      ['Links', '/account/security'],
    ],
  },
  PASSWORD_CHANGED: {
    ticket: { id: 'ENG-3036', url: SPEC.mfaEmails },
    subject: 'Your EventPipe password was changed',
    sent: 'Tue, Sep 29, 2026, 3:40 PM EDT',
    details: [
      ['EmailType', 'PASSWORD_CHANGED'],
      ['Trigger', 'Password changed from Account security, or set through a reset link'],
      ['Side effects', 'All other sessions signed out; every trusted device revoked'],
      ['Links', '/account/security'],
    ],
  },
  PASSWORD_RESET: {
    ticket: { id: 'ENG-3009', url: SPEC.passwordEmails },
    subject: 'Reset your EventPipe password',
    sent: 'Tue, Sep 29, 2026, 9:05 AM EDT',
    details: [
      ['EmailType', 'PASSWORD_RESET'],
      ['Trigger', 'Forgot password submitted for an email that has an account (the screen confirms either way)'],
      ['Expiry', '1 hour, single use. Setting the password does not sign you in'],
      ['Links', '/set-password/:token'],
      ['Copy', 'Port of today\'s platform reset mailer'],
    ],
  },
  USER_INVITE: {
    ticket: { id: 'ENG-3009', url: SPEC.passwordEmails },
    subject: `${INVITER.name} invited you to EventPipe`,
    sent: 'Tue, Sep 29, 2026, 9:30 AM EDT',
    details: [
      ['EmailType', 'USER_INVITE'],
      ['Trigger', 'A staff user is created and invited'],
      ['Expiry', '7 days, single use. The Set password page shows the terms checkbox (requiresTerms)'],
      ['Links', '/set-password/:token'],
      ['Copy', 'Port of today\'s platform invite mailer'],
    ],
  },
}
