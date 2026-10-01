/** Account V2 / Later · Authenticator app (ENG-3033) / Recovery codes.
 *
 *  SCHEDULED LATER — NOT LAUNCH SCOPE. Recovery codes only exist once an
 *  authenticator app is set up (ENG-3033); at launch the emailed code needs
 *  none.
 *
 *  Re-homed from a standalone auth card (pre-retarget "Flows/03 · Recovery
 *  codes") onto Account Security, where ENG-3033 puts them: the Two-factor card
 *  shows how many are left and offers "Generate new codes"; regenerating is a
 *  destructive confirm (DsConfirmDialog), then the new set is shown once in a
 *  DsModal gated on "I've saved these".
 *
 *  The first set is handed over at the end of setup — see Setup › Step 3.
 *
 *  Kept from the earlier design: display once, Copy / Download / Print, the
 *  not-pre-ticked "saved" checkbox, the pip row that makes "7 of 10" legible at
 *  a glance, and "last used" as a tripwire. The "where it was used" location
 *  line was dropped — nothing in the spec records it.
 */
import { ref } from 'vue'
import { ACCOUNT, SPEC } from './_account'
import { page } from '../pages/_shell'
import DsConfirmDialog from '../../components/DsConfirmDialog.vue'
import Av2SecurityPage from './components/Av2SecurityPage.vue'
import Av2SecurityCodesModal from './components/Av2SecurityCodesModal.vue'

export default {
  title: 'Eventpipe Labs/Account V2/Later · Authenticator app (ENG-3033)/Recovery codes',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          `**Scheduled later — not launch.** Recovery codes per [ENG-3033](${SPEC.totp}), shown ` +
          `and regenerated from Account Security ([ENG-3024](${SPEC.accountSecurity})) rather ` +
          'than a standalone card: remaining count on the Two-factor card, a destructive confirm ' +
          'before replacing the set, and the new codes shown once with Copy / Download / Print.',
      },
    },
  },
}

/* A different ten from Setup's: these replace that set. */
const NEW_CODES = [
  'k8dm3-zq7wt', 'p2hv9-xr4nb', 'w6tc5-md8qk', 'f3zn7-bh2rx', 'r9qk4-vt6mw',
  'c5bx2-nk9hd', 'z7mw8-qp3tf', 'h4rd6-xk2vn', 't2nq5-bw7zm', 'v8kf3-hd5qx',
]

const codesStory = ({ remaining = 7, dialog = '' } = {}) => page({
  active: 'account',
  org: 'EventPipe',
  user: ACCOUNT.name,
  components: { Av2SecurityPage, Av2SecurityCodesModal, DsConfirmDialog },
  setup: () => {
    const confirmOpen = ref(dialog === 'confirm')
    const codesOpen = ref(dialog === 'generated')
    const left = ref(dialog === 'generated' ? 10 : remaining)
    return {
      account: ACCOUNT,
      confirmOpen,
      codesOpen,
      left,
      newCodes: NEW_CODES,
      regenerate: () => { left.value = 10; codesOpen.value = true },
    }
  },
  slot: `
    <av2-security-page :account="account" totp="on" :recovery-remaining="left"
      :recovery-last-used="left < 10 ? 'Sep 12, 2026' : ''" @regenerate="confirmOpen = true" />

    <!-- Names what breaks instead of asking "are you sure?": the old codes stop
         working everywhere they're kept, the moment the new set exists. -->
    <ds-confirm-dialog v-model="confirmOpen" destructive title="Generate new recovery codes?"
      confirm-label="Generate new codes" cancel-label="Cancel" @confirm="regenerate">
      <template #body>
        Your {{ left }} unused codes stop working immediately — the copy in your password manager,
        the printout, any you've shared. We'll show the new ten once.
      </template>
    </ds-confirm-dialog>

    <av2-security-codes-modal v-model="codesOpen" :codes="newCodes" />`,
})

/** The Two-factor card with the app on and three codes spent. The count and
 *  pips show what's left; "last used" doubles as a tripwire. */
export const Remaining = codesStory()
Remaining.storyName = 'Account security · 7 of 10 left'

/** Running low. The pill turns amber at three or fewer so the user replaces
 *  the set before it runs out, not after. */
export const RunningLow = codesStory({ remaining: 2 })
RunningLow.storyName = 'Account security · running low'

/** The confirm before replacing a live set. Destructive, because the damage
 *  is invisible: every copy of the old set silently stops working. */
export const RegenerateConfirm = codesStory({ dialog: 'confirm' })
RegenerateConfirm.storyName = 'Regenerate · confirm'

/** The new set, shown once. Persistent, no close button, Done gated on the
 *  "saved" checkbox. */
export const Generated = codesStory({ dialog: 'generated' })
Generated.storyName = 'Generated · display once'
