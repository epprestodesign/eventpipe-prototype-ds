/** Teams Mgmt Comms Phase 2 — the template editor, shared by BOTH Notification
 *  Preferences screens.
 *
 *  Screens › Notification Preferences and First-Time Setup › Notification
 *  Preferences are the same product surface seen at two moments: one configured,
 *  one on day zero. They must behave identically — Edit opens the same editor,
 *  Preview shows the same email, a test send works the same way — and the only
 *  reliable way to guarantee that is for there to be one implementation.
 *
 *  So the editor, its dialogs and the state behind them live here. What stays in
 *  each story file is what genuinely differs: the list, the starting data, and
 *  what "unsaved" means for that screen.
 *
 *  No backticks inside any template string in this file — they are template
 *  literals, and a stray backtick ends the string and fails the build.
 */
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { DEFAULT_EMAILS, MERGE_VALUES, COMPLIANCE_STATUSES, USER } from './_tmc2fixtures'
import { goBackLink, templateActions } from './_tmc2'
import { emailPaper, mergeFieldToggle, bodyToHtml, renderBody, resolveMergeFields, OPEN, CLOSE } from './_tmc2email'

/** Where a test send defaults to: the signed-in user (Traveloc / Mike Addesa),
 *  since testing your own copy is the overwhelmingly common case. */
export const SIGNED_IN_EMAIL = USER.toLowerCase().replace(/\s+/g, '.') + '@traveloc.com'

export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/* ---- Preview + test send (DES-436 · P1-1) ----
 *
 * The shared row control (templateActions in _tmc2.js) ships a Preview item with
 * no handler and offers no hook for extra items. Forking it here would let the
 * two Notification Preferences screens drift, so instead this screen patches the
 * fragment it is handed: Preview gets its click handler, and a "Send test email"
 * item is appended to the same list. Local to this story — _tmc2.js is untouched.
 */
export const rowActions = (() => {
  const base = templateActions({ onEdit: 'openEditor', onRevert: 'openRevert', onDelete: 'openDelete' })
  const testItem = `
      <q-item clickable v-close-popup @click="openTestSend(it)">
        <q-item-section avatar><q-icon name="outgoing_mail" /></q-item-section>
        <q-item-section>Send test email</q-item-section>
      </q-item>`
  return base
    .replace('<q-item clickable v-close-popup>', '<q-item clickable v-close-popup @click="openPreview(it)">')
    .replace('</q-list>', testItem + '\n    </q-list>')
})()

/** Repeated wherever a test send is offered — the one thing about it that is
 *  easy to get wrong (DES-433 keeps the log to automated sends only). */
export const testSendNote = `
  <div class="row items-start no-wrap" style="gap:6px; line-height:1.45;
    font-size:0.75rem; color:var(--ds-color-text-subtle);">
    <q-icon name="info" size="14px" style="margin-top:1px; flex:none;" />
    <span>Test sends go to this address only and are <b>not</b> recorded in a team's
      Communications Log — that log is the record of automated sends.</span>
  </div>`

/* The email itself comes from the shared fragment used by First-Time Setup ›
 * Default Emails, so the two surfaces cannot disagree about what sends. */
export const previewDialog = `
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
          <!-- Closes by setting the model directly rather than with
               v-close-popup: the directive resolves the popup it is inside at
               runtime, and these templates are compiled at runtime too, so an
               explicit handler is the one thing guaranteed to work here. -->
          <q-btn flat round dense icon="close" color="grey-7" @click="closePreview" style="flex:none;" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section style="padding:14px 26px;">
        <div class="row items-center justify-between no-wrap q-gutter-md">
          ${mergeFieldToggle}
          <q-badge v-if="previewLive" outline color="warning" text-color="warning"
            class="q-px-sm q-py-xs" style="flex:none;">
            Unsaved draft
          </q-badge>
          <q-badge v-else outline color="primary" class="q-px-sm q-py-xs" style="flex:none;">
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
        <!-- Hands off to the test dialog instead of opening it on top: two
             stacked modals meant closing the test send revealed the preview
             still sitting behind it, which reads as "it won't close". -->
        <q-btn unelevated no-caps color="primary" icon="outgoing_mail" label="Send test"
          @click="testFromPreview" />
      </q-card-actions>
    </q-card>
  </q-dialog>`

export const testSendDialog = `
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
        <q-btn unelevated no-caps color="primary" label="Send test" :disable="!testEmail.trim()"
          @click="confirmTestSend" />
      </q-card-actions>
    </q-card>
  </q-dialog>`

/* ---- Add / delete compliance reminder templates (DES-428 · P0-4) ---- */

export const addReminderDialog = `
  <q-dialog v-model="addOpen">
    <q-card flat bordered style="min-width:480px; border-radius:var(--ds-radius-lg);">
      <q-card-section style="padding:28px 28px 4px;">
        <div class="text-h6" style="font-weight:700;">Add Compliance Reminder</div>
        <div class="text-grey-8" style="font-size:0.8125rem; line-height:1.5; margin-top:6px;">
          The new template starts as a <b>copy of {{ baseReminder ? baseReminder.title : 'the standard Compliance Reminder' }}</b> —
          content, schedule, statuses and recipients included. Edit it once it is added.
        </div>
      </q-card-section>
      <q-card-section style="padding:18px 28px 8px;">
        <ds-input v-model="newName" label="Name" required placeholder="e.g. 30 Day Reminder" />
        <div class="q-mt-md">
          <ds-input v-model="newDesc" label="Description" placeholder="What this reminder is for"
            hint="Optional — defaults to the copied description." />
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat no-caps color="primary" label="Cancel" @click="addOpen = false" />
        <q-btn unelevated no-caps color="primary" label="Add Reminder" :disable="!newName.trim()" @click="confirmAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <ds-confirm-dialog v-model="deleteOpen" title="Delete this template?" destructive
    confirm-label="Delete template" cancel-label="Cancel" @confirm="confirmDelete">
    <template #body>
      <strong>{{ deleteTarget?.title }}</strong> was added by your company. Deleting it removes the
      template and stops any reminders scheduled from it. Templates that ship with EventPipe
      cannot be deleted — only reverted to default.
    </template>
  </ds-confirm-dialog>`

/* ---- Email Settings, expanded from the editor (DES-431 · P0-7) ----
 * Audience (statuses + recipients) applies to every template; the Scheduling
 * block only renders for `compliance-reminder` templates, so it hides cleanly
 * for the Welcome / Previously Compliant one-shot emails. */
export const emailSettings = `
  <div class="q-mb-lg">
    <q-btn outline no-caps color="primary" :icon="showSettings ? 'expand_less' : 'add'"
      label="Email Settings" @click="showSettings = !showSettings" />
    <q-slide-transition>
      <div v-show="showSettings" class="q-mt-md">
        <q-card flat bordered style="background:var(--ds-color-surface-sunken);">
          <q-card-section style="padding:24px 28px;">
            <div class="text-primary text-weight-bold">Email Settings</div>
            <div class="text-grey-8" style="font-size:0.8125rem; margin-top:2px;">
              {{ isReminder ? 'Scheduling and audience for this recurring compliance reminder.' : 'Audience for this email. It is sent when its trigger fires, so there is nothing to schedule.' }}
            </div>

            <q-card v-if="isReminder" flat bordered class="q-mt-md" style="background:var(--ds-color-surface);">
              <q-card-section style="padding:18px 22px;">
                <div class="text-weight-bold text-grey-9 q-mb-sm">Scheduling</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6"><ds-input v-model="begin" type="number" unit="days" label="Days until Event Start to Begin Reminders" :min="0" /></div>
                  <div class="col-12 col-sm-6"><ds-input v-model="end" type="number" unit="days" label="Days until Event Start to End Reminders" :min="0" /></div>
                </div>
                <div class="row q-col-gutter-md q-mt-xs">
                  <div class="col-12 col-sm-6"><ds-select :model-value="rec" @update:model-value="onSelect" :options="options" label="Recurrence" /></div>
                </div>
              </q-card-section>
            </q-card>


            <q-card flat bordered class="q-mt-md" style="background:var(--ds-color-surface);">
              <q-card-section style="padding:18px 22px;">
                <div class="text-weight-bold text-grey-9 q-mb-sm">Audience</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6"><ds-select v-model="statuses" label="Compliance Statuses to Include" multiple :options="statusOptions" hint="Only teams in these statuses receive this email." /></div>
                </div>
                <ds-field label="Recipients" required class="q-mt-md">
                  <q-option-group v-model="recipients" type="checkbox" color="primary" inline :options="[
                    { label: 'Team Manager', value: 'team-manager' },
                    { label: 'Group Block Contacts', value: 'group-block-contacts' },
                  ]" />
                </ds-field>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>

        <q-dialog v-model="showCustom">
          <q-card style="min-width:440px; border-radius:var(--ds-radius-lg);">
            <q-card-section style="padding:28px 28px 8px;">
              <div class="text-h6" style="font-weight:700;">Custom recurrence</div>
            </q-card-section>
            <q-card-section style="padding:12px 28px;">
              <div class="row items-center q-gutter-md">
                <span class="text-grey-8">Repeat every</span>
                <q-input v-model.number="every" type="number" outlined dense min="1" style="width:80px" hide-bottom-space />
                <q-select v-model="unit" :options="['day','week','month','year']" outlined dense style="width:140px" hide-bottom-space />
              </div>
            </q-card-section>
            <q-card-section v-if="unit === 'week'" style="padding:12px 28px;">
              <div class="text-grey-8 q-mb-sm">Repeat on</div>
              <div class="row q-gutter-sm">
                <q-btn v-for="(lbl, d) in DAY_LABELS" :key="d" round unelevated
                  :color="days.includes(d) ? 'primary' : 'grey-3'" :text-color="days.includes(d) ? 'white' : 'dark'"
                  :label="lbl" size="sm" @click="toggleDay(d)" />
              </div>
            </q-card-section>
            <q-card-section style="padding:12px 28px 20px;">
              <div class="text-grey-8 q-mb-sm">Ends</div>
              <q-radio v-model="ends" val="never" label="Never" color="primary" class="block q-mb-sm" />
              <div class="row items-center q-gutter-md q-mb-sm">
                <q-radio v-model="ends" val="on" label="On" color="primary" />
                <q-input v-model="endsOn" outlined dense :disable="ends !== 'on'" style="width:170px" hide-bottom-space>
                  <template #append><q-icon name="event" /></template>
                </q-input>
              </div>
              <div class="row items-center q-gutter-md">
                <q-radio v-model="ends" val="after" label="After" color="primary" />
                <q-input v-model.number="endsAfter" type="number" outlined dense :disable="ends !== 'after'" suffix="occurrences" style="width:200px" hide-bottom-space />
              </div>
            </q-card-section>
            <q-card-actions align="right" class="q-pa-md">
              <q-btn flat no-caps color="primary" label="Cancel" @click="showCustom = false" />
              <q-btn unelevated no-caps color="primary" label="Done" @click="done" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-slide-transition>
  </div>`

/* ---- View 2: the template editor ---- */

export const editorView = `
  <div style="padding:20px 32px 40px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div class="q-mb-md">${goBackLink}</div>
    <q-card flat bordered>
      <q-card-section style="padding:24px 32px;">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm no-wrap">
            <h2 style="margin:0; font-size:1.375rem; font-weight:700; color:var(--ds-color-text);">{{ editing?.title || 'Compliance Reminder' }}</h2>
            <!-- Only reminders are badged. "Triggered email" labelled the normal
                 case on every other template and told you nothing — the same
                 reason the Default badge came off the list. What is worth
                 saying here is that this one recurs. -->
            <q-badge v-if="isReminder" outline color="primary" class="q-px-sm q-py-xs">Recurring reminder</q-badge>
          </div>
          <div class="row items-center q-gutter-sm">
            <!-- DES-428 · P0-4 — delete the template you are looking at.
                 Only user-added reminders: the seeded three are a fixed set and
                 can only be reverted. Kept visually quiet and separated from the
                 primary actions so it is never the accidental click. -->
            <q-btn v-if="editing && editing.userAdded" flat no-caps color="negative"
              icon="delete" label="Delete" @click="deleteEditing" />
            <!-- Preview from the editor header, beside Cancel: deciding a
                 template looks wrong is something you do while reading it. -->
            <q-btn flat no-caps color="primary" icon="visibility" label="Preview email"
              @click="previewEditorContent" />
            <q-btn outline no-caps color="primary" label="Cancel" @click="goBack" />
            <q-btn unelevated no-caps color="primary" label="Save" @click="goBack" />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section style="padding:24px 32px;">

        <div class="q-mb-lg">
          <ds-rich-text-editor v-model="content" label="Content" required :default-content="content" />
        </div>

        <div class="q-mb-lg" style="max-width:520px;">
          <ds-field label="BCC Recipient">
            <q-input v-model="bcc" outlined dense placeholder="Email Address" hide-bottom-space />
          </ds-field>
        </div>

        ${emailSettings}
      </q-card-section>
    </q-card>
  </div>`

export const DEFAULT_CONTENT = `
<p>Hi {{entity_name}},</p>
<p>This is a friendly reminder about the Stay-to-Play requirement for <strong>{{event_name}}</strong> ({{event_start_date}} – {{event_end_date}}).</p>
<p>Your team has booked <strong>{{compliance_progress_booked}}</strong> of the <strong>{{compliance_goal}}</strong> {{compliance_criteria}} required — <strong>{{compliance_progress_remaining}}</strong> to go. The last hotel cutoff is <strong>{{last_cutoff_date}}</strong> ({{days_until_cutoff}} away).</p>
<p>Book your rooms here: <a href="#">{{booking_link}}</a></p>
<p>Questions? Contact {{event_manager_name}} at {{event_manager_email}}.</p>`

/** Everything the editor and its dialogs need, in one place.
 *
 *  Both screens call this and spread the result into their setup return. What
 *  they pass in is only what genuinely differs between them:
 *
 *    onConfirmAdd({ name, desc, baseTitle })  what "add a reminder" means here.
 *                                             Both stage it rather than applying
 *                                             it, but into different local state.
 *    onConfirmDelete(target)                  likewise for delete. Omit it and
 *                                             the delete path is simply absent,
 *                                             which is right for a screen with
 *                                             nothing user-added to remove.
 *    baseReminderTitle                        what a new reminder copies, named
 *                                             in the add dialog.
 */
export function useTemplateEditor({
  onConfirmAdd = () => {},
  onConfirmDelete = null,
  baseReminderTitle = () => 'the standard Compliance Reminder',
} = {}) {
  const $q = useQuasar()

  /* A row is matched to a seeded template by type, so every row has something
   * real to preview — including user-added reminders, which fall back to the
   * Compliance Reminder they were copied from. */
  const emailFor = (it) =>
    DEFAULT_EMAILS.find((e) => e.type === it?.type) ||
    DEFAULT_EMAILS.find((e) => e.key === 'compliance-reminder')

  // list <-> editor
  const view = ref('list')
  const editing = ref(null)
  const content = ref(DEFAULT_CONTENT)
  const openEditor = (it) => {
    editing.value = it
    // This template's own copy, with merge tokens raw because you are editing
    // them. Every template used to open on one shared default.
    content.value = bodyToHtml(emailFor(it).body, true)
    view.value = 'editor'
  }
  const goBack = () => { view.value = 'list' }
  // Drives the conditional config sections in the editor (DES-431 · P0-7).
  const isReminder = computed(() => editing.value?.type === 'compliance-reminder')

  /* Preview (DES-436 · P1-1). Two ways in, previewing different things: from a
   * row there is no draft, so the template's saved copy is the honest answer;
   * from the editor header you are looking at content you have been editing. */
  const previewOpen = ref(false)
  const previewTarget = ref(null)
  const previewLive = ref(false)
  const showRaw = ref(false)
  const previewEmail = computed(() => emailFor(previewTarget.value))
  const previewTitle = computed(() => previewTarget.value?.title || previewEmail.value.title)
  const bodyLines = computed(() => renderBody(previewEmail.value.body, showRaw.value))
  const bodyHtml = computed(() => {
    const raw = previewLive.value ? content.value : bodyToHtml(previewEmail.value.body, true)
    return showRaw.value ? raw : resolveMergeFields(raw)
  })
  const subjectLine = computed(() => (showRaw.value
    ? previewEmail.value.subject
    : resolveMergeFields(previewEmail.value.subject)))
  const toLine = computed(() => (showRaw.value
    ? OPEN + 'team_contact_email' + CLOSE
    : MERGE_VALUES.team_contact_email))
  const openPreview = (it) => {
    previewTarget.value = it
    showRaw.value = false
    previewLive.value = false
    previewOpen.value = true
  }
  const previewEditorContent = () => {
    previewTarget.value = editing.value
    showRaw.value = false
    previewLive.value = true
    previewOpen.value = true
  }
  const closePreview = () => { previewOpen.value = false }

  // Test send. Reachable from the row menu and the preview footer.
  const testOpen = ref(false)
  const testTarget = ref(null)
  const testEmail = ref(SIGNED_IN_EMAIL)
  const testTitle = computed(() => testTarget.value?.title || previewTitle.value)
  const notifyTestSent = (address, title) => $q.notify({
    message: 'Test email sent to ' + address,
    caption: title + ' — not recorded in any team Communications Log',
    icon: 'outgoing_mail',
    color: 'positive',
    position: 'bottom-right',
    timeout: 3000,
  })
  const openTestSend = (it) => { testTarget.value = it; testOpen.value = true }
  const confirmTestSend = () => {
    const address = testEmail.value.trim()
    if (!address) return
    testOpen.value = false
    notifyTestSent(address, testTitle.value)
  }
  // Hands off rather than stacking: two modals meant closing the test send
  // revealed the preview still sitting behind it.
  const testFromPreview = () => {
    const it = previewTarget.value
    previewOpen.value = false
    openTestSend(it)
  }
  const preview = ref(SIGNED_IN_EMAIL)
  const sendEditorTest = () => {
    const address = preview.value.trim()
    if (!address) return
    notifyTestSent(address, editing.value?.title || previewTitle.value)
  }

  // Add a reminder (DES-428 · P0-4). The dialog lives here; what happens on
  // confirm is the screen's business.
  const addOpen = ref(false)
  const newName = ref('')
  const newDesc = ref('')
  const baseReminder = computed(() => ({ title: baseReminderTitle() }))
  const openAdd = () => { newName.value = ''; newDesc.value = ''; addOpen.value = true }
  const confirmAdd = () => {
    const name = newName.value.trim()
    if (!name) return
    onConfirmAdd({ name, desc: newDesc.value.trim(), baseTitle: baseReminderTitle() })
    addOpen.value = false
    $q.notify({
      message: name,
      caption: 'Added as a copy of ' + baseReminderTitle() + ' — save to apply',
      icon: 'add_circle',
      color: 'positive',
      position: 'bottom-right',
      timeout: 2600,
    })
  }

  // Delete (DES-428 · P0-4). Only ever a user-added reminder.
  const deleteOpen = ref(false)
  const deleteTarget = ref(null)
  const openDelete = (it) => { deleteTarget.value = it; deleteOpen.value = true }
  const confirmDelete = () => {
    if (onConfirmDelete && deleteTarget.value) onConfirmDelete(deleteTarget.value)
    // Deleting from inside the editor has to leave it — the template being
    // edited no longer exists.
    if (view.value === 'editor') { editing.value = null; view.value = 'list' }
  }
  const deleteEditing = () => { if (editing.value?.userAdded) openDelete(editing.value) }

  // Revert to default.
  const revertOpen = ref(false)
  const revertTarget = ref(null)
  const openRevert = (it) => { revertTarget.value = it; revertOpen.value = true }
  const confirmRevert = () => { if (revertTarget.value) revertTarget.value.custom = false }

  // Editor fields and the recurrence picker.
  const bcc = ref('')
  const showSettings = ref(false)
  const begin = ref(200)
  const end = ref(0)
  const statuses = ref(['Not Started', 'In Progress', 'Previously Compliant'])
  const recipients = ref(['team-manager'])
  const showCustom = ref(false)
  const every = ref(1)
  const unit = ref('week')
  const days = ref([1])
  const ends = ref('never')
  const endsOn = ref('2026-08-06')
  const endsAfter = ref(13)
  const summary = computed(() => {
    const picked = days.value.slice().sort().map((d) => DAY_NAMES[d]).join(', ')
    let s = (unit.value === 'week' ? 'Weekly' : 'Every ' + every.value + ' ' + unit.value)
      + (picked ? ' on ' + picked : '')
    if (ends.value === 'on') s += ', until Aug 6, 2026'
    if (ends.value === 'after') s += ', ' + endsAfter.value + ' times'
    return s
  })
  const options = computed(() => ['Does not repeat', 'Daily', 'Every weekday (Mon–Fri)', summary.value, 'Custom…'])
  const rec = ref(summary.value)
  const onSelect = (val) => {
    if (val === 'Custom…') { showCustom.value = true; rec.value = summary.value } else rec.value = val
  }
  const toggleDay = (d) => {
    const i = days.value.indexOf(d)
    if (i === -1) days.value.push(d)
    else days.value.splice(i, 1)
  }
  const done = () => { rec.value = summary.value; showCustom.value = false }

  return {
    $q,
    emailFor,
    view, editing, content, openEditor, goBack, isReminder,
    previewOpen, previewTarget, previewLive, showRaw, previewEmail, previewTitle,
    bodyLines, bodyHtml, subjectLine, toLine,
    openPreview, previewEditorContent, closePreview,
    testOpen, testTarget, testEmail, testTitle, openTestSend, confirmTestSend,
    testFromPreview, preview, sendEditorTest, notifyTestSent,
    addOpen, newName, newDesc, baseReminder, openAdd, confirmAdd,
    deleteOpen, deleteTarget, openDelete, confirmDelete, deleteEditing,
    revertOpen, revertTarget, openRevert, confirmRevert,
    bcc, showSettings, begin, end, statuses, recipients,
    statusOptions: COMPLIANCE_STATUSES,
    showCustom, every, unit, days, ends, endsOn, endsAfter, options, rec,
    onSelect, toggleDay, done, DAY_LABELS,
  }
}
