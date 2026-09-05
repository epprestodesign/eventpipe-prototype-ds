/** Concepts / Next Reminder Preview.
 *
 *  Not requested. Raised because PP-43 has a behavior nothing in the UI
 *  currently explains.
 */
import { ref } from 'vue'
import GbrReminderControl from './components/GbrReminderControl.vue'

export default {
  title: 'Design Requests/Sept 4/Concepts/Next Reminder Preview',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Open question — nothing here is in scope yet.**

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

**Recommendation:** don't build B as drawn. Either scope the real version
deliberately, or leave the field bare and let PP-43's dev note stand on its own.
Included here so the gap is recorded rather than discovered during build.
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
