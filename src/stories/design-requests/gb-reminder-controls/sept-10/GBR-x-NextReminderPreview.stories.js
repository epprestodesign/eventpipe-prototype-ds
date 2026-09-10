/** Concepts / Next Reminder Preview.
 *
 *  Declined 2026-09-09. Raised because PP-43 has a behaviour nothing in the UI
 *  explains; kept so the gap is recorded rather than rediscovered.
 */
import { ref } from 'vue'
import GbrReminderControl from './components/GbrReminderControl.vue'

export default {
  title: 'Design Requests/GB Reminder Controls/Sept 10/Concepts/Next Reminder Preview',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Declined 2026-09-09.** Kept as the record of an idea that was considered.

Scott did not take this up, and his direction on both PP-43 and PP-44 rules it
out: he replaced the interval-aware tooltip with static copy and said of the
modal *"I would rather the devs not have to pull in variables."* A computed
next-send date is more of exactly that.

The gap it was trying to close is still real, so it is written up below rather
than deleted.

---

[PP-43](https://linear.app/eventpipe/issue/PP-43) specifies what happens when
the interval changes on a running event:

> "Changing the value mid-event applies to blocks that already exist; the next
> reminder is the last one sent plus the new interval."

Nothing on the screen says this. A Hoco who shortens 14 days to 3 because
creators are going quiet cannot tell whether that means tomorrow or next week —
the answer depends on when the last reminder went out, which is not on this
page.

### The concept

One computed line under the field, stating the next send for a block opened
today. **B** below.

### Why it might not be worth it

The honest version of this line is harder than it looks. "A block opened today"
is a simplification: an event has many blocks, each opened on a different day,
so each has its own next-send date. A single date is either wrong for most
blocks or has to be worded so loosely ("blocks opened today") that it stops
answering the question the user actually has, which is about the blocks they
already have open.

The version that would genuinely answer it — *"3 blocks will next be reminded on
Dec 4, 2 on Dec 6"* — is a different feature, needs block data on this screen,
and was not asked for.

**Outcome:** not built. The honest version — *"3 blocks will next be reminded on
Dec 4, 2 on Dec 6"* — is a different feature that needs block data on this
screen, and the single-date version is wrong for most blocks. PP-43's dev note
stands on its own.
` } } },
}

const pair = (interval) => ({
  components: { GbrReminderControl },
  setup: () => ({ a: ref(interval), aOn: ref(true), b: ref(interval), bOn: ref(true) }),
  template: `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px,1fr)); gap:36px; max-width:900px;">
      <div>
        <div class="gbr-concept__h">A · As built — no preview</div>
        <gbr-reminder-control v-model:interval="a" v-model:enabled="aOn" />
      </div>
      <div>
        <div class="gbr-concept__h">B · With the computed line</div>
        <gbr-reminder-control v-model:interval="b" v-model:enabled="bOn" :show-next-send="true" />
      </div>
    </div>`,
})

/** Side by side at the default 3-day interval. Change either field — B's date
 *  moves, A's does not. */
export const Compare = { render: () => pair(3) }
Compare.storyName = 'A vs B · 3-day interval'

/** At 14 days the gap the line would close is wider — and so is the chance the
 *  single date is wrong for most of the event's blocks. */
export const LongInterval = { render: () => pair(14) }
LongInterval.storyName = 'A vs B · 14-day interval'
