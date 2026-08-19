/** Concepts / Test Send · B — Stepped modal.
 *
 *  Two steps: choose, then confirm. Shares every behaviour with Concept A —
 *  see _aug19concepts.js. Only the shape differs.
 */
import { ref, computed } from 'vue'
import { useTestSend, eventField, teamField, sendToField, warningNote, failToggle } from './_aug19concepts'
import { PAPER } from '../_aug19email'
import DsField from '../components/DsField.vue'

export default {
  title: 'Design Requests/Aug 19/Concepts/Test Send · B · Stepped Modal',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Concept, not a decision.** The second of two shapes for the test-send workflow.
Same data, same validation, same copy, same toasts as **Concept A** — so any
difference you notice is a difference of shape, not of behaviour.

### Two steps, not three

| Step | Holds |
| --- | --- |
| **1 · Select** | Event, Team, Send to — team still gated on event |
| **2 · Review** | What will send, where it is going, and the warning |

Event and Team share the first pane rather than getting one each. Splitting them
would make the nesting look like a rule the wizard imposes, when it is really
just a fact about the data — a team belongs to an event. Gating the field says
that; a whole extra pane overstates it.

### What step 2 is for

The single-modal concept has nowhere to put a last look. Here the review pane is
the only thing standing between you and a send, so it does two things.

**It restates the three answers as a sentence**, not as fields:

> **STP - Compliance Reminder** rendered for **Gold Star AS CH** at
> **2026 - Diamond Dawg Baseball Classic**, delivered to **you**.

**Then it shows the email itself**, with the merge fields resolved against the
event and team you just picked. That is the part the sentence cannot do. Asking
for an event and a team is only worth the friction because the email reads
differently for each one — so this is where you find out whether the pair you
chose produces the email you expected, rather than discovering it in your inbox.

Merge tokens are **resolved, with no raw toggle**. Raw tokens here would be
showing you the template you just came from, not the test that is about to send.

The **To** line is your address, not the team's. The team decides what the email
*says*, not where it goes — showing the team's address would contradict the
warning sitting directly beneath it.

**Back** returns to step 1 with everything intact.

### Confirmation and failure

Identical to Concept A: a green toast naming address, team and event; a red one
that is explicit nothing was delivered and offers **Retry**. Retry reopens at
**step 1**, since a failure gives you no reason to trust the selections were the
problem — but no reason to assume they were not, either.

### Against Concept A

The review pane is the whole argument, and the email preview is what makes it
one. A test send is not destructive, so an extra click has to buy something —
here it buys seeing the resolved email before it sends rather than after.

**Concept A cannot offer this.** With everything on one pane there is nowhere to
put an email preview without making the dialog a scrolling wall, and no moment
between choosing and sending in which to look at it.

The cost is a click every time, on a task people repeat while iterating on copy.
**If test sends are a tight loop and you already trust the merge fields, Concept
A is the faster shape.** If the point is checking how the email reads for a
particular team, this one does the job A cannot.
` } } },
}

export const SteppedModal = {
  render: () => ({
    components: { DsField },
    setup: () => {
      const t = useTestSend()
      const step = ref(1)
      /* Reopening always lands on step 1. A wizard that reopens halfway through
       * makes you check where you are before you can act. */
      const openWizard = () => { step.value = 1; t.openTestSend() }
      const summary = computed(() => ({
        template: 'STP - Compliance Reminder',
        team: t.testTeam.value,
        event: t.testEvent.value,
        to: t.testSendTo.value,
      }))
      return { ...t, step, openWizard, summary }
    },
    template: `
      <div style="padding:8px; min-height:520px;">
        <q-btn outline no-caps color="primary" icon="outgoing_mail" label="Send test"
          @click="openWizard" />
        ${failToggle}

        <q-dialog v-model="testOpen">
          <q-card style="width:640px; max-width:94vw; border-radius:var(--ds-radius-lg);">
            <q-card-section style="padding:26px 28px 6px;">
              <div class="text-h6" style="font-weight:700;">Send test email</div>
              <div class="text-grey-8" style="font-size:0.8125rem; margin-top:4px;">
                STP - Compliance Reminder
              </div>
            </q-card-section>

            <!-- The rail is a status line, not a nav: the steps are not clickable
                 because step 2 has no meaning until step 1 is answered. -->
            <q-card-section style="padding:14px 28px 4px;">
              <div class="row items-center no-wrap" style="gap:10px;">
                <template v-for="s in [{ n: 1, label: 'Select' }, { n: 2, label: 'Review' }]" :key="s.n">
                  <div class="row items-center no-wrap" style="gap:7px;">
                    <div style="width:22px; height:22px; border-radius:50%; display:flex;
                                align-items:center; justify-content:center; font-size:0.75rem; font-weight:700;"
                      :style="step >= s.n
                        ? 'background:var(--ds-color-primary); color:#fff;'
                        : 'background:var(--ds-color-surface-sunken); color:var(--ds-color-text-subtle);'">
                      {{ s.n }}
                    </div>
                    <span style="font-size:0.8125rem;"
                      :style="step === s.n ? 'font-weight:700; color:var(--ds-color-text);' : 'color:var(--ds-color-text-subtle);'">
                      {{ s.label }}
                    </span>
                  </div>
                  <div v-if="s.n === 1" style="flex:1; height:1px; background:var(--ds-color-border);"></div>
                </template>
              </div>
            </q-card-section>

            <q-separator class="q-mt-md" />

            <!-- Step 1 -->
            <q-card-section v-if="step === 1"
              style="padding:20px 28px 8px; display:flex; flex-direction:column; gap:18px;">
              ${eventField}
              ${teamField}
              ${sendToField}
            </q-card-section>

            <!-- Step 2 — the sentence, then the email it describes.
                 The sentence alone made you take the merge fields on trust. The
                 point of asking for an event and a team is that the email reads
                 differently for each one, so this is where you find out whether
                 the pair you chose produces the email you expected. Merge fields
                 are resolved: showing raw tokens here would be showing you the
                 template you just came from, not the test that is about to send. -->
            <q-card-section v-else style="padding:20px 28px 8px;">
              <div style="font-size:0.9375rem; line-height:1.65; color:var(--ds-color-text);">
                <strong>{{ summary.template }}</strong> rendered for
                <strong>{{ summary.team }}</strong> at
                <strong>{{ summary.event }}</strong>, delivered to
                <strong>{{ summary.to }}</strong>.
              </div>

              <!-- Scrolls inside the pane rather than growing the dialog: the
                   reminder body is long enough to push the actions off-screen. -->
              <div class="q-mt-md" style="max-height:44vh; overflow:auto; padding:2px;">
                <div style="${PAPER}">
                  <div style="padding:16px 20px; border-bottom:1px solid var(--ds-color-border-container);
                              background:var(--ds-color-surface-sunken);">
                    <div style="display:grid; grid-template-columns:60px 1fr; gap:5px 12px;
                                font-size:0.8125rem; color:var(--ds-color-text-subtle);">
                      <span>From</span><span style="color:var(--ds-color-text);">{{ previewFrom }}</span>
                      <span>To</span><span style="color:var(--ds-color-text);">{{ previewTo }}</span>
                      <span>Subject</span>
                      <span style="color:var(--ds-color-text); font-weight:700;">{{ previewSubject }}</span>
                    </div>
                  </div>
                  <div style="padding:22px 26px 26px;">
                    <img :src="testCompany.logo" :alt="testCompany.name"
                      style="height:26px; width:auto; margin-bottom:18px;" />
                    <p v-for="(para, i) in previewBody" :key="i"
                      style="margin:0 0 12px; line-height:1.6; color:var(--ds-color-text);
                             white-space:pre-wrap;">{{ para }}</p>
                  </div>
                </div>
              </div>

              <div class="q-mt-md">${warningNote}</div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md" style="padding:16px 20px 20px;">
              <q-btn v-if="step === 1" flat no-caps color="primary" label="Cancel"
                @click="testOpen = false" />
              <q-btn v-else flat no-caps color="primary" label="Back" @click="step = 1" />
              <q-btn v-if="step === 1" unelevated no-caps color="primary" label="Next"
                :disable="!testCanSend" @click="step = 2" />
              <q-btn v-else unelevated no-caps color="primary" icon="outgoing_mail"
                label="Send test email" @click="sendTest" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>`,
  }),
}
SteppedModal.storyName = 'B · Stepped modal'
