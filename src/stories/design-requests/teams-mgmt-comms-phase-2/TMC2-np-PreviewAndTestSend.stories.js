/** Components / Notification Preferences / Email Preview & Test Send.
 *
 *  NEW IN PHASE 2 — DES-436 · P1-1. There was previously no way to see what a
 *  template actually sends as, and no way to send yourself a copy.
 *
 *  The email itself renders from the shared fragment in _tmc2email.js — the same
 *  one First-Time Setup › Default Emails uses, so the two cannot disagree about
 *  what an email looks like.
 */
import { ref, computed } from 'vue'
import { COMPANY, DEFAULT_EMAILS, EVENT, MERGE_VALUES } from './_tmc2fixtures'
import { emailPaper, mergeFieldToggle, renderBody, resolveMergeFields, OPEN, CLOSE } from './_tmc2email'
import DsInput from './components/DsInput.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Notification Preferences/Email Preview & Test Send',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
**New in Phase 2** — [DES-436 · P1-1](https://linear.app/eventpipe/issue/DES-436).

### Preview

Opens the email rendered with sample data. **Show merge fields** flips between
what a team receives and the template source, so you can check a token is spelled
right without leaving the modal.

Rows are matched to a seeded template by \`type\`, so every row has something real
to show — including custom reminders, which preview as the Compliance Reminder
they were copied from.

Reachable from the row menu and, in the editor, from **Preview email** in the
header.

### Test send

Asks for one address and sends there only. Reachable from the row menu and from
the preview modal footer.

**Send test hands off rather than stacking.** It closes the preview before opening
the test dialog — two stacked modals meant closing the test send revealed the
preview still sitting behind it, which reads as "it won't close".

### Test sends are not logged

Deliberately **not written to a team's Communications Log**. That log is the
record of automated sends ([DES-433](https://linear.app/eventpipe/issue/DES-433));
a test you sent yourself is not one, and mixing them would make the log useless
as evidence.

### On dismissal

Both dialogs close by setting their own model rather than with \`v-close-popup\`.
The directive resolves its popup at runtime and does not reliably find a
teleported QDialog in these runtime-compiled templates, which is what made Cancel
intermittent across this folder.
` } } },
}

const email = DEFAULT_EMAILS.find((e) => e.key === 'compliance-reminder')

const testSendNote = `
  <div class="row items-start no-wrap" style="gap:6px; line-height:1.45;
    font-size:0.75rem; color:var(--ds-color-text-subtle);">
    <q-icon name="info" size="14px" style="margin-top:1px; flex:none;" />
    <span>Test sends go to this address only and are <b>not</b> recorded in a team's
      Communications Log — that log is the record of automated sends.</span>
  </div>`

const previewSetup = (raw) => ({
  components: { DsInput },
  setup: () => {
    const previewOpen = ref(true)
    const showRaw = ref(raw)
    const bodyLines = computed(() => renderBody(email.body, showRaw.value))
    const subjectLine = computed(() => (showRaw.value ? email.subject : resolveMergeFields(email.subject)))
    const toLine = computed(() => (showRaw.value ? OPEN + 'team_contact_email' + CLOSE : MERGE_VALUES.team_contact_email))
    return {
      // Seeded template, not a live draft — emailPaper falls back to bodyLines.
      previewOpen, showRaw, bodyLines, bodyHtml: null, subjectLine, toLine,
      fromLine: 'Event Manager — resolved per event when the email sends',
      company: COMPANY, eventName: EVENT.name,
      previewTitle: email.title, previewEmail: email,
      closePreview: () => { previewOpen.value = false },
      testFromPreview: () => { previewOpen.value = false },
    }
  },
  template: `
    <div style="min-height:640px; padding:24px;">
      <q-btn v-if="!previewOpen" unelevated no-caps color="primary" icon="visibility"
        label="Preview email" @click="previewOpen = true" />
      <q-dialog v-model="previewOpen">
        <q-card flat bordered style="width:720px; max-width:92vw; border-radius:var(--ds-radius-lg);">
          <q-card-section style="padding:22px 26px 14px;">
            <div class="row items-start justify-between no-wrap q-gutter-md">
              <div>
                <div class="text-h6" style="font-weight:700;">{{ previewTitle }}</div>
                <div class="text-grey-8" style="font-size:0.8125rem; line-height:1.5; margin-top:2px;">
                  Rendered with sample data for {{ eventName }}. Nothing is sent by opening this.
                </div>
              </div>
              <q-btn flat round dense icon="close" color="grey-7" @click="closePreview" style="flex:none;" />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section style="padding:14px 26px;">
            <div class="row items-center justify-between no-wrap q-gutter-md">
              ${mergeFieldToggle}
              <q-badge outline color="primary" class="q-px-sm q-py-xs" style="flex:none;">
                Based on {{ previewEmail.title }}
              </q-badge>
            </div>
          </q-card-section>
          <q-card-section style="padding:0 26px 24px; max-height:58vh; overflow:auto;">
            ${emailPaper}
          </q-card-section>
          <q-separator />
          <q-card-section style="padding:14px 26px;">${testSendNote}</q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat no-caps color="primary" label="Close" @click="closePreview" />
            <q-btn unelevated no-caps color="primary" icon="outgoing_mail" label="Send test"
              @click="testFromPreview" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>`,
})

/** What a team receives — every merge field resolved. */
export const Preview = { render: () => previewSetup(false) }
Preview.storyName = 'Preview — sent email'

/** The same email as template source. Paragraphs whose only content is an unset
 *  field disappear entirely, which is how an empty non-compliance policy behaves. */
export const PreviewMergeFields = { render: () => previewSetup(true) }
PreviewMergeFields.storyName = 'Preview — show merge fields'

export const TestSend = {
  render: () => ({
    components: { DsInput },
    setup: () => {
      const testOpen = ref(true)
      const testEmail = ref('mike.addesa@traveloc.com')
      return { testOpen, testEmail, testTitle: email.title, confirmTestSend: () => { testOpen.value = false } }
    },
    template: `
      <div style="min-height:420px; padding:24px;">
        <q-btn v-if="!testOpen" unelevated no-caps color="primary" icon="outgoing_mail"
          label="Send test email" @click="testOpen = true" />
        <q-dialog v-model="testOpen">
          <q-card flat bordered style="min-width:460px; max-width:92vw; border-radius:var(--ds-radius-lg);">
            <q-card-section style="padding:26px 28px 4px;">
              <div class="text-h6" style="font-weight:700;">Send test email</div>
              <div class="text-grey-8" style="font-size:0.8125rem; line-height:1.5; margin-top:6px;">
                Sends <b>{{ testTitle }}</b> to one address, with merge fields filled from sample data.
                No team receives anything.
              </div>
            </q-card-section>
            <q-card-section style="padding:18px 28px 10px;">
              <ds-input v-model="testEmail" type="email" label="Send test email to" required
                placeholder="you@traveloc.com" />
            </q-card-section>
            <q-card-section style="padding:0 28px 8px;">${testSendNote}</q-card-section>
            <q-card-actions align="right" class="q-pa-md">
              <q-btn flat no-caps color="primary" label="Cancel" @click="testOpen = false" />
              <q-btn unelevated no-caps color="primary" label="Send test"
                :disable="!testEmail.trim()" @click="confirmTestSend" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>`,
  }),
}
TestSend.storyName = 'Test send dialog'
