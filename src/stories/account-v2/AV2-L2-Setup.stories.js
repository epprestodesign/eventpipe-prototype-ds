/** Account V2 / Later · Authenticator app (ENG-3033) / Setup.
 *
 *  SCHEDULED LATER — NOT LAUNCH SCOPE. At launch the only second factor is an
 *  emailed code and there is no enrollment step at all (ENG-3037, ENG-3024).
 *
 *  ENG-3033: "Add enrollment to AccountSecurityView: QR code, manual-entry key,
 *  a confirm step, and recovery codes to download." So setup is not a
 *  standalone auth card any more — it starts from the Two-factor card on
 *  Account Security (04 · Account security) and runs in a DsModal over it:
 *
 *    Entry  — the page, with "Set up authenticator app" on the Two-factor card
 *    Scan   — QR + "Can't scan the code?" manual key
 *    Verify — the confirm step (and its wrong-code state)
 *    Codes  — ten recovery codes, Copy / Download / Print, gated on "saved"
 *    Enabled — the page afterwards
 *
 *  Why a modal and not a side panel: see Av2SecurityTotpSetup.
 *
 *  Carried over from the pre-retarget enrollment flow (then "Flows/02 · Set up
 *  two-factor", EventPipe Pay): the QR placeholder, the collapsed manual key,
 *  the clock-drift wrong-code message, and recovery codes handed over in the
 *  same sitting with no skip.
 *
 *  OPEN QUESTION: ENG-3033 doesn't say what happens to the email factor once an
 *  app is added. The Enabled state shows it as "Backup", used only via "choose
 *  another way" at sign-in — an assumption to confirm with engineering. Dropped: the standalone "Keep your account
 *  secure" intro card and its payouts/API-key copy — payments-specific, and the
 *  Two-factor card now does the introducing. SMS is still not offered.
 */
import { ref } from 'vue'
import { ACCOUNT, SPEC } from './_account'
import { page } from '../pages/_shell'
import DsNotification from '../../components/DsNotification.vue'
import Av2SecurityPage from './components/Av2SecurityPage.vue'
import Av2SecurityTotpSetup from './components/Av2SecurityTotpSetup.vue'

export default {
  title: 'Eventpipe Labs/Account V2/Later · Authenticator app (ENG-3033)/Setup',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          `**Scheduled later — not launch.** Authenticator-app setup per [ENG-3033](${SPEC.totp}), ` +
          `re-homed inside Account Security ([ENG-3024](${SPEC.accountSecurity})): the Two-factor ` +
          'card gains a "Set up authenticator app" action that opens a three-step modal — scan the ' +
          'QR (or enter the key by hand), confirm with a code, then save ten recovery codes. ' +
          'At launch there is no enrollment; the only factor is an emailed code.',
      },
    },
  },
}

/** A base32 TOTP secret, shown grouped in fours behind the disclosure. */
const SETUP_KEY = 'KZWX4T2QRN7FHB3MJVDS5YGP6CLA'

/* The same ten as Recovery codes › Generated: one set, two screens. */
const RECOVERY_CODES = [
  '7q4k2-mw9hd', 'b3nx8-rt5vp', '9dz6f-k2qsw', 'hm4rt-8nb7x', '2vkq9-wd3fz',
  'rn8xt-6mp4h', 'q5wz3-bk9dn', '4hft7-zx2rm', 'mp9bd-k7nqw', 'x3rz5-hq8tv',
]

/* The page with the setup modal. `step` '' leaves the modal closed; the
 * button on the Two-factor card opens it, so every story is also clickable
 * end to end. */
const setupStory = ({ step = '', totp = 'available', notice = false } = {}) => page({
  active: 'account',
  org: 'EventPipe',
  user: ACCOUNT.name,
  components: { Av2SecurityPage, Av2SecurityTotpSetup, DsNotification },
  setup: () => {
    const open = ref(!!step)
    const state = ref(totp)
    return {
      account: ACCOUNT,
      open,
      state,
      setupKey: SETUP_KEY,
      codes: RECOVERY_CODES,
      startStep: step || 'scan',
      showNotice: ref(notice),
      onDone: () => { state.value = 'on' },
    }
  },
  slot: `
    <av2-security-page :account="account" :totp="state" @setup="open = true">
      <template #notice>
        <ds-notification v-if="showNotice || state === 'on'" variant="success" flat :closable="false"
          style="max-width:none; margin-bottom:20px;"
          title="Authenticator app is on"
          description="From your next sign-in we'll ask for a code from your app. Your recovery codes are below if you ever need a new set." />
      </template>
    </av2-security-page>
    <av2-security-totp-setup v-model="open" :step="startStep" :email="account.email"
      :secret="setupKey" :codes="codes" @done="onDone" />`,
})

/** Entry point. The Two-factor card now has an Authenticator app row, "Not set
 *  up", with the setup button. Click it to run the whole flow. */
export const Entry = setupStory()
Entry.storyName = 'Account security · set up entry'

/** Step 1. QR plus the collapsed manual-entry key ("Can't scan the code?"). The
 *  QR is a drawn placeholder — nothing fetched, nothing decodable. */
export const ScanQr = setupStory({ step: 'scan' })
ScanQr.storyName = 'Step 1 · scan QR'

/** Step 2, the confirm step: prove the app holds the secret before turning it
 *  on, so a mis-scan can't lock the user out. */
export const Verify = setupStory({ step: 'verify' })
Verify.storyName = 'Step 2 · verify'

/** Wrong code. Clock drift is the commonest cause, so the message names it
 *  rather than looping the user on "try again". The code is kept. */
export const VerifyError = setupStory({ step: 'verify-error' })
VerifyError.storyName = 'Step 2 · wrong code'

/** Step 3. Recovery codes in the same sitting: no close button, no skip, and
 *  Done stays disabled until the user says they've saved them. This is the
 *  only time the codes are shown. */
export const RecoveryCodes = setupStory({ step: 'codes' })
RecoveryCodes.storyName = 'Step 3 · recovery codes'

/** Back on the page. The Two-factor card shows the app on and the recovery
 *  code count, and a notice confirms what changed. */
export const Enabled = setupStory({ totp: 'on', notice: true })
Enabled.storyName = 'Enabled'
