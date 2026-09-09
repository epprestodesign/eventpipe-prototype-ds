/** Concepts / Modal Dismiss Behavior — A vs B.
 *
 *  An open question, not a decision. PP-44 specifies A; B is here because A is
 *  worth a second look before it gets built.
 */
import { ref } from 'vue'
import GbrConflictModal from './components/GbrConflictModal.vue'

export default {
  title: 'Design Requests/GB Reminder Controls/Concepts/Modal Dismiss Behavior',
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: `
**Open question.** What should the X — and Escape — do on the conflict modal?

[PP-44](https://linear.app/eventpipe/issue/PP-44) answers it explicitly:

> "Secondary action, **or dismissing the modal**, completes the save with both
> reminder types left on."

That is **A**, and it is what the shipped component does. **B** is the
alternative, built here so the two can be compared rather than argued about.

| | A · X saves | B · X cancels |
| --- | --- | --- |
| **X / Escape** | Completes the save, both reminders left on | Closes the modal, save is abandoned, page stays dirty |
| **Matches PP-44** | Yes | No — would need the AC amended |
| **Risk** | A dismissal silently writes | A user who meant "fine, leave it" has to find the button |

### The case for B

An X that commits a write is not what an X means anywhere else in the product,
and Escape is a reflex, not a decision. A user who hits it has not knowingly
chosen "leave both reminder types on" — they have chosen "go away". Under A that
reflex is recorded as consent to the thing the modal just warned them about.

### The case for A

The modal is advisory and interrupts a save the user already asked for. Under B,
dismissing throws away the save, which is arguably a worse surprise: the user
pressed Save, saw a warning they judged irrelevant, closed it, and lost their
work. B trades a silent write for a silent non-write.

### If A stands

Then the X needs to say so. The shipped component gives it a tooltip reading
*Save with both on*, which is the cheapest possible mitigation. A stronger
version drops the X entirely and forces the choice between the two buttons —
shown as **A2** below.

**Recommendation:** A2. It keeps PP-44's behavior (no AC change, save always
proceeds) while removing the ambiguous affordance rather than annotating it.
` } } },
}

const demo = (variant) => ({
  components: { GbrConflictModal },
  setup: () => {
    const open = ref(true)
    const last = ref('')
    return { open, last, variant,
      onOff: () => { last.value = '✓ Saved · group block reminders turned off' },
      onAny: () => { last.value = '✓ Saved · both reminder types left on' },
      onCancel: () => { last.value = '✗ Save abandoned · page still has unsaved changes' } }
  },
  template: `
    <div style="min-width:460px; text-align:center;">
      <q-btn v-if="!open" unelevated no-caps color="primary" label="Save registration settings" @click="open = true; last = ''" />
      <div v-if="last" style="margin-top:14px; font-size:0.875rem; color:var(--ds-color-text-subtle);">{{ last }}</div>
      <gbr-conflict-modal v-model="open" :tiers="2" :interval="3" :dismiss-mode="variant"
        @turn-off-and-save="onOff" @save-anyway="onAny" @cancel="onCancel" />
    </div>`,
})

/** **A — as specified.** The X completes the save with both left on. Its
 *  tooltip says so, which is the only thing stopping it being a silent write. */
export const A = { render: () => demo('save') }
A.storyName = 'A · X saves (PP-44 as written)'

/** **B — the alternative.** The X abandons the save and returns to the dirty
 *  page. Truthful to what an X means; costs the user their save. */
export const B = { render: () => demo('cancel') }
B.storyName = 'B · X cancels the save'

/** **A2 — recommended.** PP-44's behavior, with the ambiguous affordance
 *  removed: no X at all, so the only ways out are the two buttons, both of
 *  which say what they do. Escape does nothing. */
export const A2 = { render: () => demo('none') }
A2.storyName = 'A2 · no X — force the choice (recommended)'
