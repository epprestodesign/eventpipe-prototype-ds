/** Components / Email Settings / Group Block Reminder Control.
 *
 *  NEW — PP-42 (GBR-1) + PP-43 (GBR-3). The whole of both tickets' UI, in one
 *  row built from the existing Setting Row.
 */
import { ref } from 'vue'
import GbrReminderControl from './components/GbrReminderControl.vue'
import { REMINDER_TOOLTIP } from './_gbr'

export default {
  title: 'Design Requests/GB Reminder Controls/Sept 10/Components/Email Settings/Group Block Reminder Control',
  component: GbrReminderControl,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New** — [PP-42 · GBR-1](https://linear.app/eventpipe/issue/PP-42) (the toggle)
and [PP-43 · GBR-3](https://linear.app/eventpipe/issue/PP-43) (the interval), in
one control.

### Why one control and not two

The tickets are separate and GBR-2 depends only on GBR-1, but there is no state
where a user wants the interval without the switch: an interval with no way to
stop the sends is the problem customers already have — the project description
notes one who resorted to swapping the block contact email to their own address
and back to suppress them. Splitting them across the section would also mean two
labels for one idea.

### Copy, as Scott specified it

> "Probably the title should be Group Block Reminders, and then the subtext
> under it should say interval between each reminder. And then the info text
> needs to probably say something like… when enabled, group block creators will
> get reminders starting two days after their group block opens. They'll get a
> reminder every n number of days that you set below."

Title and caption are used as given.

The ⓘ copy is now Scott's too, approved verbatim on 2026-09-09:

> "When on, the person who created a group block gets a reminder 2 days after
> the block opens, then additional reminders on the interval you set below until
> the block's release date. The group block confirmation email sends when group
> blocks are initially created regardless of this setting."

The first version **echoed the interval you had typed** — set 14 and it said
"every 14 days" — so the sentence always described the schedule actually
configured. Scott replaced it with static wording, consistent with the call he
made on the modal: he would rather the build not pass values into copy. See
**Info icon copy** below for the approved text.

It still carries PP-42's confirmation-email exception, because the natural
reading of an off switch is that group block email stops altogether.

### Validation (PP-43)

Positive integers only. Zero, negatives, decimals, non-numeric input and empty
are each rejected inline, and the screen disables Save while an error stands.
The rule lives in \`validateInterval()\` in \`_gbr.js\` — one implementation, so
the row and the page agree on what is valid.

### The 2-day first reminder is not configurable

PP-43 governs the gap between reminders only; the first still sends 2 days after
block creation. That constant is stated in the ⓘ rather than exposed as a second
field, because nothing asked for it to move.
` } } },
}

const one = (interval, enabled = true, showNextSend = false) => ({
  components: { GbrReminderControl },
  setup: () => ({ i: ref(interval), on: ref(enabled), showNextSend }),
  template: `
    <div style="max-width:520px;">
      <gbr-reminder-control v-model:interval="i" v-model:enabled="on" :show-next-send="showNextSend" />
    </div>`,
})

/** Defaults — on, every 3 days. Preserves today's behavior exactly, which is
 *  what both tickets specify for existing and new events. */
export const Default = { render: () => one(3) }

/** Off. No group block reminders send for any block on the event; the field
 *  keeps its value, greyed. */
export const Off = { render: () => one(3, false) }

/** A 14-day interval. The field carries the value; the ⓘ no longer repeats it. */
export const LongerInterval = { render: () => one(14) }
LongerInterval.storyName = 'Longer interval'

/** Every rejected input, per PP-43. */
export const Invalid = {
  render: () => ({
    components: { GbrReminderControl },
    setup: () => ({ cases: [0, -2, 1.5, 'soon', ''] }),
    template: `
      <div style="max-width:520px; display:flex; flex-direction:column; gap:26px;">
        <gbr-reminder-control v-for="(c, i) in cases" :key="i" :interval="c" :enabled="true" />
      </div>`,
  }),
}
Invalid.storyName = 'Rejected input'

/** The approved ⓘ copy, readable without hovering. Asserted verbatim in the
 *  unit tests, so it cannot drift without a test failing. */
export const InfoCopy = {
  render: () => ({
    setup: () => ({ text: REMINDER_TOOLTIP }),
    template: `
      <div style="max-width:620px; border:1px solid var(--ds-color-border-container);
                  border-radius:var(--ds-radius-md); padding:16px 18px;">
        <div style="font-size:0.75rem; font-weight:700; color:var(--ds-color-text-subtle); margin-bottom:8px;">
          INFO ICON COPY — approved 2026-09-09
        </div>
        <div style="font-size:0.875rem; line-height:1.55;">{{ text }}</div>
      </div>`,
  }),
}
InfoCopy.storyName = 'Info icon copy'
