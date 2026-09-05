/** Components / Registration Settings / Conflict Modal.
 *
 *  NEW — PP-44 (GBR-2). The ticket says "Prototype Pending", so this is
 *  net-new design rather than a rebuild.
 */
import { ref } from 'vue'
import GbrConflictModal from './components/GbrConflictModal.vue'

export default {
  title: 'Design Requests/Sept 4/Components/Registration Settings/Conflict Modal',
  component: GbrConflictModal,
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: `
**New** — [PP-44 · GBR-2](https://linear.app/eventpipe/issue/PP-44). Raised on
save of registration settings when **all three** conditions hold:

1. Compliance reminders are enabled for this event
2. Group block reminders are enabled for this event
3. The company's Compliance Reminder recipients include group block contacts for
   at least one tier

The trigger lives in \`hasReminderConflict()\` in \`_gbr.js\` — one
implementation, so the screen and this component cannot disagree about when it
fires. See **Screens › 02 · Registration Settings** for it firing in place.

### Three decisions

**It names who is affected.** *"Group block creators will get two sets of
reminders"* is the consequence; *"you have two settings on"* is only the cause.
The cause is stated underneath, because the user still has to know which two
things to change — but the headline is the thing they actually care about.

**It shows the real overlap.** The tier count and the configured interval are in
the sentence, so a Hoco deciding whether this matters knows whether it is two
emails or nine. Compare **Default** with **Four tiers, 14-day interval**.

**Neither button is a cancel, and neither is red.** The modal is advisory — PP-44
is explicit that the save proceeds either way. Both buttons save; they differ
only in what gets saved, and the recommended one is primary. Nothing here is
destructive, so nothing is styled as though it were.

### The X — an open question

PP-44 states: *"Secondary action, **or dismissing the modal**, completes the
save with both reminder types left on."* That is what is built, and the X
carries a tooltip saying so.

It is still worth challenging before build. An X that commits a write is not
what an X usually means, and a user pressing Escape has not knowingly chosen
"leave both on". **Concepts › Modal Dismiss Behavior** shows the alternative
side by side.
` } } },
}

const modal = (props = {}) => ({
  components: { GbrConflictModal },
  setup: () => {
    const open = ref(true)
    const last = ref('')
    return { open, last, props,
      onOff: () => { last.value = 'Saved · group block reminders turned off for this event' },
      onAny: () => { last.value = 'Saved · both reminder types left on' } }
  },
  template: `
    <div style="min-width:420px; text-align:center;">
      <q-btn v-if="!open" unelevated no-caps color="primary" label="Save registration settings" @click="open = true; last = ''" />
      <div v-if="last" style="margin-top:14px; color:var(--ds-color-text-subtle); font-size:0.875rem;">{{ last }}</div>
      <gbr-conflict-modal v-model="open" v-bind="props" @turn-off-and-save="onOff" @save-anyway="onAny" />
    </div>`,
})

/** The everyday case: two tiers include group block contacts, reminders every
 *  3 days. Press either button — the result is reported below the trigger. */
export const Default = { render: () => modal({ tiers: 2, interval: 3 }) }

/** A single tier — the sentence reads "1 compliance reminder tier". */
export const SingleTier = { render: () => modal({ tiers: 1, interval: 3 }) }
SingleTier.storyName = 'One tier'

/** The heavy case. Four tiers and a 14-day group block interval: the same modal
 *  now describes a materially different amount of email, which is exactly why
 *  the numbers are in the copy. */
export const HeavyOverlap = { render: () => modal({ tiers: 4, interval: 14 }) }
HeavyOverlap.storyName = 'Four tiers, 14-day interval'

/** Daily reminders — the copy switches to "every day" rather than reading
 *  "every 1 days". */
export const DailyInterval = { render: () => modal({ tiers: 2, interval: 1 }) }
DailyInterval.storyName = 'Daily interval'
