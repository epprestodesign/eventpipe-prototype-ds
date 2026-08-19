/** Concepts / Test Send · A — Single modal.
 *
 *  All three questions on one pane. See _aug19concepts.js for the shared model
 *  and the transcript this is built from.
 */
import { useTestSend, testSendDialog, failToggle } from './_aug19concepts'
import DsField from '../components/DsField.vue'

export default {
  title: 'Design Requests/Aug 19/Concepts/Test Send · A · Single Modal',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Concept, not a decision.** One of two shapes for the test-send workflow Scott
described. Neither is wired into the editor yet — *Send test* there still opens
today's simple dialog.

### What changed, and why there is a modal at all

Test send used to be a button in the **preview** dialog's footer, sending the
template to an address with nothing else asked. Scott separated the two:

> I think these should be two different things. So, preview email and test send.
> Whereas the preview email is a very simple one that just takes this and just
> mocks it up with some default variables resolved. But the test send actually
> asks you a couple questions and then you send it.

That is the whole argument for a modal. A preview can guess at sample data
because nothing leaves the building. A test send cannot — the merge fields have
to resolve against a **real event and a real team**, and only you know which.

### The three fields

| Field | Behaviour |
| --- | --- |
| **Event Name** | Combo box — lists every event, filters as you type, clearable |
| **Team Name** | Combo box, **disabled until an event is chosen**, then lists only that event's teams |
| **Send to** | Prefilled with the signed-in address |

**Both pickers are combo boxes**: open one to see what is available, or type to
narrow it. The team field gated on a 4-character minimum until 2026-08-19,
copied from the reference screenshot's hint — but that screenshot was captured
mid-search, and the rule made the control unusable unless you already knew a name
to type. Often you do not; choosing the team is the reason you opened it.

**Team is nested under event** — *"I do want that to be nested such that you're
not inundated with a billion teams."* Changing the event **clears the team**,
because the previous team almost certainly is not at the new event, and quietly
sending against a mismatched pair is the one outcome this modal exists to
prevent.

### The warning

> Test emails go to your address only. The selected team receives nothing — the
> event and team are used to fill in the merge fields so you can see the email as
> that team would.

Scott's version was *"test emails will send to your email address and will not be
sent to the team selected."* This adds the part that makes it make sense: if I
just picked a team, why is the team not getting it? Because the team is what
fills in the merge fields, not the recipient.

Info-coloured rather than a warning colour — nothing has gone wrong, it is
telling you what will happen.

### Confirmation and failure

A green toast on success naming the address, the team and the event; a red one on
failure, which is explicit that **nothing was delivered** and offers **Retry**.
Use the toggle under the button to see the failure path.

### Against Concept B

Everything is visible at once, so you can see what you are about to do without
stepping. The cost is a taller dialog and no natural place for a review step —
**Send test email** is live the moment the third field is valid.
` } } },
}

export const SingleModal = {
  render: () => ({
    components: { DsField },
    setup: () => useTestSend(),
    /* Renders the shipped dialog, not a copy of it. This story and the two
     * Notification Preferences screens import the same fragment, so it cannot
     * drift into a picture of something that no longer exists. */
    template: `
      <div style="padding:8px; min-height:520px;">
        <q-btn outline no-caps color="primary" icon="outgoing_mail" label="Send test"
          @click="openTestSend" />
        ${failToggle}
        ${testSendDialog}
      </div>`,
  }),
}
SingleModal.storyName = 'A · Single modal'
