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
import { DEFAULT_EMAILS, MERGE_VALUES, COMPLIANCE_STATUSES, USER } from './_aug19fixtures'
import { goBackLink, templateActions } from './_aug19'
import { emailPaper, mergeFieldToggle, bodyToHtml, renderBody, resolveMergeFields, OPEN, CLOSE } from './_aug19email'
/* Test send lives in its own module so it can be shared with the concept
 * stories without a circular import. Re-exported here under the names the two
 * screens already import, so nothing on their side had to change. */
import { useTestSend, testSendDialog as testSendDialogV2, SIGNED_IN_EMAIL as SIGNED_IN } from './_aug19testsend'
export { testSendDialogV2 as testSendDialog }

/** Where a test send defaults to: the signed-in user (Traveloc / Mike Addesa),
 *  since testing your own copy is the overwhelmingly common case. */
export const SIGNED_IN_EMAIL = SIGNED_IN

export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/* ---- The Template-column control ----
 *
 * Both Notification Preferences screens used to patch extra items into the
 * shared row menu here (Preview got its handler, Send test email was appended).
 * On 2026-08-19 the row menu itself came out — everything in it moved into the
 * editor's Actions button — so there is nothing left to patch. templateActions
 * now renders a single Edit button and these two names are the same control.
 *
 * They are kept as separate exports because the two screens each import one by
 * name, and because the tiers model may need to diverge again later. Anything
 * that must differ between the tiers screen and the named-template screens now
 * differs inside the editor, not on the row.
 */
export const rowActions = templateActions({ onEdit: 'openEditor' })
export const tieredRowActions = templateActions({ onEdit: 'openEditor' })

/* ---- The tiers model, shared by BOTH Notification Preferences screens ----
 *
 * These lived only in the configured screen's story file, which is how the two
 * screens ended up with different tier logic — First-Time Setup still had the
 * old named-template dialog long after the configured screen had pivoted. Same
 * failure as the seven copies of the template subtext: state a rule once, or the
 * copies drift. Anything implementing tiers reads these.
 */
export const MAX_TIERS = 4

export const TIER_TOOLTIP = 'Add up to 3 Additional Compliance Reminder Tiers in order to escalate your'
  + ' tone or cadence as events draw closer. Be sure to set the'
  + ' <b>Days until Event Start to Begin/End Reminders</b> to avoid overlapping with other tiers.'

/** The add-row config for the tiers model. `handler` differs per screen only
 *  because each stages additions into its own local state. */
export const tierAddRow = (handler = 'addTier') => ({
  handler,
  label: 'Add Compliance Reminder Tier',
  tooltip: TIER_TOOLTIP,
  disableWhen: 'tierCount >= ' + MAX_TIERS,
  disabledTooltip: 'Maximum of ' + MAX_TIERS + ' tiers reached. Delete the last tier to add another.',
})

/* testSendNote stood here — one line explaining that test sends are not recorded
 * in a team's Communications Log. It was mounted in the old address-only dialog
 * and in the preview footer, and both are gone. The point it made now lives in
 * TEST_SEND_WARNING in _aug19testsend.js, beside the fields it qualifies. */

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
      <!-- Send test came out of this footer on 2026-08-19, and the test-send
           note went with it: a warning that "test sends go to this address only"
           read as a live caveat in a dialog that no longer sends anything and
           shows no address. Test sending is reached from the editor header and
           the Actions menu, and the note still runs in the dialog that does it.
           Close is the only action left here, so it is outlined rather than flat
           — a lone flat button reads as secondary to nothing. -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn outline no-caps color="primary" label="Close" @click="closePreview" />
      </q-card-actions>
    </q-card>
  </q-dialog>`

/* The old testSendDialog stood here — a single "Send test email to" address
 * field and nothing else. It could not be honest about what it sent: the merge
 * fields resolved against fixture data whatever template you were in, so the
 * email that arrived was not the email any team would get. Replaced on
 * 2026-08-19 by the event + team dialog in _aug19testsend.js, which is
 * re-exported above under this same name. */

/* ---- Add / delete compliance reminder templates (DES-428 · P0-4) ---- */

/* Serves both "Add Compliance Reminder" and "Change description" — the two ask
 * for the same pair of fields, so a second dialog would be this one with a
 * different heading. `metaTarget` decides which job it is doing. */
export const addReminderDialog = `
  <q-dialog v-model="addOpen">
    <q-card flat bordered style="min-width:480px; border-radius:var(--ds-radius-lg);">
      <q-card-section style="padding:28px 28px 4px;">
        <div class="text-h6" style="font-weight:700;">{{ metaTarget ? 'Change description' : 'Add Compliance Reminder' }}</div>
        <div v-if="metaTarget" class="text-grey-8" style="font-size:0.8125rem; line-height:1.5; margin-top:6px;">
          Rename this template, or reword the line shown beneath it in the list.
          Its content, schedule, statuses and recipients are unaffected.
          <b>Takes effect when you save.</b>
        </div>
        <div v-else class="text-grey-8" style="font-size:0.8125rem; line-height:1.5; margin-top:6px;">
          The new template starts as a <b>copy of {{ baseReminder ? baseReminder.title : 'the standard Compliance Reminder' }}</b> —
          content, schedule, statuses and recipients included. Edit it once it is added.
        </div>
      </q-card-section>
      <q-card-section style="padding:18px 28px 8px;">
        <ds-input v-model="newName" label="Name" required placeholder="e.g. 30 Day Reminder" />
        <div class="q-mt-md">
          <ds-input v-model="newDesc" label="Description" placeholder="What this reminder is for"
            :hint="metaTarget ? 'Shown beneath the template name in the list.' : 'Optional — defaults to the copied description.'" />
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat no-caps color="primary" label="Cancel" @click="addOpen = false" />
        <q-btn unelevated no-caps color="primary" :label="metaTarget ? 'Update' : 'Add Reminder'"
          :disable="!newName.trim()" @click="confirmAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>`

/* Deliberately its own export, NOT part of addReminderDialog above.
 *
 * It used to be appended to that string, and the tiers variant renders no add
 * modal at all — so `deleteOpen` flipped true with nothing mounted to observe
 * it and Delete silently did nothing. Same trap in the editor, which replaces
 * the list view and unmounted the dialog along with it.
 *
 * Mount this next to previewDialog / testSendDialog, outside any v-if that
 * swaps views, so every surface that can open it can also show it. */
/* Restore-to-default warning, opened from the editor's Save ▾ menu.
 *
 * Mount it beside the other dialogs, outside the view switch — same reason as
 * deleteTemplateDialog below. It names the template and says plainly what is
 * lost, because "restore" on its own sounds recoverable and this is not. */
/** The guard on the editor's Go Back link.
 *
 *  Uses DsDiscardChangesDialog, not DsConfirmDialog. The two answer different
 *  questions: DsConfirmDialog is for something irreversible you asked for
 *  (delete, restore) and shouts accordingly; this is for navigating away with
 *  work in progress, where nothing has gone wrong and nothing is being
 *  destroyed. Dressing an ordinary Back click as a delete confirmation
 *  overstated it.
 *
 *  All copy is the component's default, so every discard-changes prompt in the
 *  folder reads identically.
 *
 *  Mount OUTSIDE any v-if that switches views. */
export const leaveTemplateDialog = `
  <ds-discard-changes-dialog v-model="leaveOpen" @confirm="confirmLeave" />`

export const restoreContentDialog = `
  <ds-confirm-dialog v-model="restoreOpen" title="Restore the default template?" destructive
    confirm-label="Restore default" cancel-label="Keep my content" @confirm="confirmRestoreContent">
    <template #body>
      This replaces the content of <strong>{{ editing?.title }}</strong> with the EventPipe
      default template. Everything your company has written here — edits to the default,
      or content written from scratch for a reminder you created — is
      <strong>permanently discarded</strong> and cannot be recovered.
      <div style="margin-top:12px;">Scheduling, recipients and compliance statuses are not affected.</div>
    </template>
  </ds-confirm-dialog>`

export const deleteTemplateDialog = `
  <!-- Wording stays template-neutral: this same dialog serves First-Time Setup,
       where reminders are named rather than numbered and "tier" would be wrong. -->
  <ds-confirm-dialog v-model="deleteOpen" title="Delete this template?" destructive
    confirm-label="Delete template" cancel-label="Cancel" @confirm="confirmDelete">
    <template #body>
      <strong>{{ deleteTarget?.title }}</strong> was added by your company. Deleting it removes the
      template and stops any reminders scheduled from it. Templates that ship with EventPipe
      cannot be deleted — only reverted to default.
    </template>
  </ds-confirm-dialog>`

/* ---- Notification Settings, expanded from the editor (DES-431 · P0-7) ----
 *
 * Audience (recipients + statuses) applies to every template; the Scheduling
 * block only renders for `compliance-reminder` templates, so it hides cleanly
 * for the Welcome / Previously Compliant one-shot emails.
 *
 * 2026-08-11 review: Audience now sits ABOVE Scheduling, and within it Team
 * Recipients sits above Compliance Statuses. Both were flipped on request. It
 * also reads better for the one-shot emails, where Scheduling is absent and
 * Audience was the only block anyway. */
export const emailSettings = `
  <div class="q-mb-lg">
    <q-btn outline no-caps color="primary" :icon="showSettings ? 'expand_less' : 'add'"
      label="Notification Settings" @click="showSettings = !showSettings" />
    <q-slide-transition>
      <div v-show="showSettings" class="q-mt-md">
        <q-card flat bordered style="background:var(--ds-color-surface-sunken);">
          <q-card-section style="padding:24px 28px;">
            <div class="text-primary text-weight-bold">Notification Settings</div>
            <div class="text-grey-8" style="font-size:0.8125rem; margin-top:2px;">
              {{ isReminder ? 'Audience and scheduling for this recurring compliance reminder.' : 'Audience for this email. It is sent when its trigger fires, so there is nothing to schedule.' }}
            </div>

            <q-card flat bordered class="q-mt-md" style="background:var(--ds-color-surface);">
              <q-card-section style="padding:18px 22px;">
                <div class="text-weight-bold text-grey-9 q-mb-sm">Audience</div>
                <ds-field label="Team Recipients" required>
                  <q-option-group v-model="recipients" type="checkbox" color="primary" inline :options="[
                    { label: 'Housing Contact', value: 'team-manager' },
                    { label: 'Group Block Contact(s)', value: 'group-block-contacts' },
                  ]" />
                </ds-field>
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 col-sm-6"><ds-select v-model="statuses" label="Compliance Statuses to Include" multiple :options="statusOptions" hint="Only teams in these statuses receive this email." /></div>
                </div>
              </q-card-section>
            </q-card>

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
                <!-- No 'year': a reminder cadence measured in years is
                     meaningless against an event a few hundred days out. -->
                <q-select v-model="unit" :options="['day','week','month']" outlined dense style="width:140px" hide-bottom-space />
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
            <!-- An "Ends" block (Never / On / After) stood here until
                 2026-08-11: "take out the Ends and Never sections, there is no
                 end to these." The run is already bounded by the Days until
                 Event Start to Begin/End Reminders fields above, so asking for
                 an end date here was a second, contradictable answer to a
                 question the schedule had already settled. -->
            <q-card-actions align="right" class="q-pa-md" style="padding-top:20px;">
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
            <!-- No badge beside the title (2026-08-11): "anywhere there is a tag
                 next to the name of the template on the edit page like this
                 'Recurring reminder' please remove it." The same fate as
                 "Triggered email" before it — the Scheduling block below already
                 says the template recurs, and says it with the actual cadence. -->
          </div>
          <div class="row items-center q-gutter-sm">
            <!-- Preview and Send test stay broken out. They are the two things
                 you do while still deciding, so neither should cost a menu.
                 Cancel stood where Send test now does until 2026-08-19; the
                 Go back link at the top of this view already leaves the editor,
                 and with the save bar below owning Discard, Cancel was a third
                 way to say the same thing. -->
            <q-btn flat no-caps color="primary" icon="visibility" label="Preview email"
              @click="previewEditorContent" />
            <q-btn outline no-caps color="primary" icon="outgoing_mail" label="Send test"
              @click="testSendEditing" />
            <!-- Actions (2026-08-19). Was a split Save button; it is now a plain
                 dropdown holding everything that acts on this email, including
                 the four items that used to hang off Edit on the list row. It is
                 not a split button any more because "Actions" names a menu, not
                 a default action — a primary click would have to guess which of
                 six things you meant. Saving is still reachable here, but the
                 unsaved-changes bar is what actually surfaces it the moment
                 there is something to save. -->
            <!-- v-model so the items can close it explicitly. v-close-popup is
                 not available here: Quasar's ClosePopup directive is not
                 registered on this app, so it resolves to nothing and the menu
                 stays open behind whatever the item opened. That is the
                 long-standing "menu hangs around behind the dialog" behaviour on
                 these screens; closing it by model is what actually fixes it. -->
            <q-btn-dropdown v-model="actionsOpen" unelevated no-caps color="primary" label="Actions">
              <q-list style="min-width:230px">
                <!-- No Save item (2026-08-19). It was the first entry here until
                     the unsaved-changes bar took over saving: the bar appears the
                     instant there is something to save and disappears when there
                     is not, so a menu Save was either redundant or a no-op, and
                     the only way to tell which was to open the menu and look.
                     Everything left in here is available whether or not the
                     email has been edited. -->
                <!-- Moved off the list row. Each of these described this email
                     while showing you none of it; here the email is on screen. -->
                <q-item v-if="canChangeMeta" clickable @click="actionsOpen = false; changeEditingMeta()">
                  <q-item-section avatar><q-icon name="edit_note" /></q-item-section>
                  <q-item-section>Change description</q-item-section>
                </q-item>
                <q-item clickable @click="actionsOpen = false; previewEditorContent()">
                  <q-item-section avatar><q-icon name="visibility" /></q-item-section>
                  <q-item-section>Preview</q-item-section>
                </q-item>
                <q-item clickable @click="actionsOpen = false; testSendEditing()">
                  <q-item-section avatar><q-icon name="outgoing_mail" /></q-item-section>
                  <q-item-section>Send test email</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="actionsOpen = false; openRestoreContent()">
                  <q-item-section avatar><q-icon name="undo" color="negative" /></q-item-section>
                  <q-item-section class="text-negative">Restore to Default</q-item-section>
                </q-item>
                <template v-if="editing && editing.userAdded">
                  <!-- Tooltip on the wrapper: a disabled QItem is an unreliable
                       hover target. Gating unchanged by the move — it just has
                       nowhere else to live now the row menu is gone. -->
                  <div>
                    <q-item clickable :disable="!canDeleteTier(editing)"
                      @click="actionsOpen = false; deleteEditing()">
                      <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                      <q-item-section class="text-negative">Delete template</q-item-section>
                    </q-item>
                    <q-tooltip v-if="!canDeleteTier(editing)" max-width="260px" class="text-body2"
                      style="line-height:1.5; padding:8px 10px;">
                      Tiers are removed from the last one back. Delete the highest-numbered tier first.
                    </q-tooltip>
                  </div>
                </template>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section style="padding:24px 32px;">

        <div class="q-mb-lg">
          <!-- show-restore is off: Restore to Default now lives under Save, so
               the toolbar keeps only what acts on the text you are writing. -->
          <ds-rich-text-editor v-model="content" label="Content" required
            :default-content="defaultContent" :show-restore="false" />
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
 *    onConfirmMeta({target, name, desc})      "Change description" — the row's
 *                                             name and subtext. Omit it and the
 *                                             menu item is simply absent.
 *    baseReminderTitle                        what a new reminder copies, named
 *                                             in the add dialog.
 */
export function useTemplateEditor({
  onConfirmAdd = () => {},
  onConfirmDelete = null,
  onConfirmMeta = null,
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
  /* What "Restore to Default" restores to — snapshotted when the template opens
   * and never written to again. The editor used to bind the rich-text field's
   * `default-content` to `content` itself, so restoring reset the content to
   * whatever had just been typed into it. */
  const defaultContent = ref(DEFAULT_CONTENT)
  const openEditor = (it) => {
    editing.value = it
    // This template's own copy, with merge tokens raw because you are editing
    // them. Every template used to open on one shared default.
    defaultContent.value = bodyToHtml(emailFor(it).body, true)
    content.value = defaultContent.value
    view.value = 'editor'
    // Baseline for the unsaved-changes bar. Taken after the fields are set, so
    // opening a template is never itself an edit.
    takeSnapshot()
  }
  /* Restore is destructive and irreversible — it throws away whatever the
   * company wrote and puts the EventPipe default back — so it asks first. It is
   * also one item down a menu, which is exactly where a mis-click happens. */
  const restoreOpen = ref(false)
  const openRestoreContent = () => { restoreOpen.value = true }
  const restoreContent = () => { content.value = defaultContent.value }
  const confirmRestoreContent = () => {
    restoreContent()
    $q.notify({
      message: 'Content restored to default',
      caption: 'Your custom content for this email has been replaced',
      icon: 'undo',
      color: 'positive',
      position: 'bottom-right',
      timeout: 2400,
    })
  }
  const goBack = () => { view.value = 'list' }

  /* ---- Unsaved changes inside the editor (2026-08-19) ----
   *
   * The editor header used to carry a one-click Save. Renaming that button to
   * "Actions" took the one-click save with it, so the save affordance moved to
   * the same bar the list screens already use: "when we make an edit to an
   * email, i want the unsaved changes dialog to appear now."
   *
   * Dirty is a snapshot comparison rather than a set of watchers because the
   * editor owns seven separate pieces of state and a per-field flag would drift
   * the moment an eighth is added. Comparing serialised snapshots also makes
   * edit-and-undo correctly clean: type a word, delete it, and the bar goes away
   * instead of insisting something is pending.
   *
   * `rec` is deliberately included — the recurrence a reminder runs on is as much
   * an edit to the email as its body. `showSettings` is deliberately excluded:
   * opening the Notification Settings panel to look at it is not an edit. */
  const editorFields = () => ({
    content: content.value,
    bcc: bcc.value,
    begin: begin.value,
    end: end.value,
    statuses: statuses.value,
    recipients: recipients.value,
    rec: rec.value,
  })
  const snapshot = ref('')
  const takeSnapshot = () => { snapshot.value = JSON.stringify(editorFields()) }
  const editorDirty = computed(() => view.value === 'editor' && snapshot.value !== ''
    && JSON.stringify(editorFields()) !== snapshot.value)

  const saveEditorContent = () => {
    takeSnapshot()
    $q.notify({
      message: 'Email saved',
      caption: editing.value?.title || 'Template updated',
      icon: 'check_circle',
      color: 'positive',
      position: 'bottom-right',
      timeout: 2400,
    })
    /* Returns to the list, the same as the old Save did. Saving is the end of
     * the errand — staying put would leave you looking at a screen with nothing
     * left to do on it. */
    goBack()
  }
  /* Leaving with unsaved edits (2026-08-20).
   *
   * The save bar is easy to ignore — it sits at the bottom of the viewport while
   * you are working at the top, and nothing stops you clicking Go Back straight
   * past it. This catches that one case: dirty, and heading for the exit without
   * having answered the bar.
   *
   * It is deliberately NOT a second warning for every exit. Save leaves through
   * goBack directly, because it has just written the changes; Discard stays put;
   * and deleting the template runs its own confirmation. Only the Go Back link
   * routes through here, and only while something is actually pending. */
  const leaveOpen = ref(false)
  const requestGoBack = () => {
    if (editorDirty.value) leaveOpen.value = true
    else goBack()
  }
  /* Puts the fields back before leaving. Without this the editor would keep the
   * abandoned edits in memory, and the save bar would be waiting on the next
   * template you opened, blaming it for changes made somewhere else. */
  const confirmLeave = () => {
    discardEditorContent()
    goBack()
  }

  /* Discard puts the fields back and stays in the editor. It does NOT leave:
   * Discard answers "undo what I typed", and the Go back link above answers
   * "get me out of here". Collapsing the two would make one of them a surprise. */
  const discardEditorContent = () => {
    if (!snapshot.value) return
    const was = JSON.parse(snapshot.value)
    content.value = was.content
    bcc.value = was.bcc
    begin.value = was.begin
    end.value = was.end
    statuses.value = was.statuses
    recipients.value = was.recipients
    rec.value = was.rec
  }

  /* The two items that moved off the list row and now act on the open email.
   * Both reuse the row-level handlers verbatim, passing `editing` where the row
   * passed `it` — the dialogs behind them never cared where they were opened
   * from, so nothing about them had to be duplicated for the editor. */
  const actionsOpen = ref(false)
  const changeEditingMeta = () => { if (editing.value) openChangeMeta(editing.value) }
  const testSendEditing = () => { if (editing.value) testSend.openTestSend() }
  const canChangeMeta = !!onConfirmMeta

  /* One save bar serving two contexts. Each screen owns its own list-level
   * dirty/save/discard; which pair the bar is wired to depends only on which
   * view is open, so the bar itself needs no knowledge of either. Composed here
   * rather than in each screen so the two cannot drift apart again. */
  const composeSaveBar = ({ listDirty, saveList, discardList }) => ({
    dirty: computed(() => (view.value === 'editor' ? editorDirty.value : listDirty.value)),
    saveChanges: () => { if (view.value === 'editor') saveEditorContent(); else saveList() },
    discardChanges: () => { if (view.value === 'editor') discardEditorContent(); else discardList() },
  })
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

  /* Test send. Only the editor opens it now — the row menu that used to is gone,
   * and the preview footer no longer offers it. The template title is passed as
   * a getter because it has to follow whichever template is open. */
  const testSend = useTestSend({ templateTitle: () => editing.value?.title })


  // Add a reminder (DES-428 · P0-4). The dialog lives here; what happens on
  // confirm is the screen's business.
  /* One dialog, two jobs. `metaTarget` is null when adding and holds the row
   * when changing an existing template's name and subtext — the fields are the
   * same two either way, so a second dialog would only be the first one with a
   * different heading. */
  const addOpen = ref(false)
  const newName = ref('')
  const newDesc = ref('')
  const metaTarget = ref(null)
  const baseReminder = computed(() => ({ title: baseReminderTitle() }))
  const openAdd = () => {
    metaTarget.value = null
    newName.value = ''
    newDesc.value = ''
    addOpen.value = true
  }
  const openChangeMeta = (it) => {
    metaTarget.value = it
    newName.value = it.title || ''
    newDesc.value = it.desc || ''
    addOpen.value = true
  }
  const confirmAdd = () => {
    const name = newName.value.trim()
    if (!name) return
    if (metaTarget.value) {
      if (onConfirmMeta) onConfirmMeta({ target: metaTarget.value, name, desc: newDesc.value.trim() })
    } else {
      onConfirmAdd({ name, desc: newDesc.value.trim(), baseTitle: baseReminderTitle() })
    }
    addOpen.value = false
    metaTarget.value = null
    /* No toast. Adding a reminder stages it like every other change on this
     * screen, and the unsaved-changes bar already says so — a success toast on
     * top of it claimed something had happened when nothing had yet. */
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
  /* No end state. The Ends block came out on 2026-08-11 — "there is no end to
   * these" — so the summary no longer has an "until …" or "N times" tail to
   * append, and the state behind them went with the UI. */
  const summary = computed(() => {
    const picked = days.value.slice().sort().map((d) => DAY_NAMES[d]).join(', ')
    return (unit.value === 'week' ? 'Weekly' : 'Every ' + every.value + ' ' + unit.value)
      + (picked ? ' on ' + picked : '')
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
    view, editing, content, defaultContent, openEditor, goBack, isReminder,
    editorDirty, saveEditorContent, discardEditorContent, composeSaveBar,
    leaveOpen, requestGoBack, confirmLeave,
    changeEditingMeta, testSendEditing, canChangeMeta, actionsOpen,
    restoreContent, restoreOpen, openRestoreContent, confirmRestoreContent,
    previewOpen, previewTarget, previewLive, showRaw, previewEmail, previewTitle,
    bodyLines, bodyHtml, subjectLine, toLine,
    openPreview, previewEditorContent, closePreview,
    ...testSend,
    addOpen, newName, newDesc, baseReminder, openAdd, confirmAdd,
    metaTarget, openChangeMeta,
    deleteOpen, deleteTarget, openDelete, confirmDelete, deleteEditing,
    /* Default for the named-template screens, where any user-added template can
     * go. The tiers screen overrides this by returning its own after spreading
     * the editor, so the shared editorView can reference it unconditionally. */
    canDeleteTier: () => true,
    revertOpen, revertTarget, openRevert, confirmRevert,
    bcc, showSettings, begin, end, statuses, recipients,
    statusOptions: COMPLIANCE_STATUSES,
    showCustom, every, unit, days, options, rec,
    onSelect, toggleDay, done, DAY_LABELS,
  }
}
