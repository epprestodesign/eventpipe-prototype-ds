/** Shared chrome for the Notification Preferences screen — the company header
 *  (breadcrumb + logo + name + General/Notifications tabs) and the "Go Back to
 *  Preferences" link. Both are template-string fragments; the consuming story's
 *  setup must provide a `tab` ref and `company` (see _aug19fixtures). */

export const companyHeader = `
  <div style="padding:20px 32px 0; background:var(--ds-color-surface); border-bottom:1px solid var(--ds-color-border-container);">
    <q-breadcrumbs active-color="primary" gutter="sm" class="text-body2 q-mb-md">
      <template #separator><q-icon name="chevron_right" size="18px" color="grey-5" /></template>
      <q-breadcrumbs-el label="Companies" />
      <q-breadcrumbs-el :label="company.name" class="text-grey-6" />
    </q-breadcrumbs>
    <div class="row items-center q-gutter-md">
      <img :src="company.logo" :alt="company.name" style="height:34px; width:auto;" />
      <div style="flex:1;">
        <div class="text-primary" style="font-size:1.25rem; font-weight:700;">{{ company.name }}</div>
        <div class="text-grey-6" style="font-size:0.8125rem;">Last updated: {{ company.lastUpdated }}</div>
      </div>
    </div>
    <q-tabs v-model="tab" no-caps active-color="primary" indicator-color="primary" align="left" class="text-grey-7 q-mt-sm">
      <q-tab name="general" label="General" />
      <q-tab name="notifications" label="Notifications" />
    </q-tabs>
  </div>`

/* Calls requestGoBack, not goBack. Leaving the editor with unsaved edits asks
 * first (2026-08-20); requestGoBack is the guarded version and falls straight
 * through to goBack when there is nothing pending. goBack stays the raw action
 * so saving — which has just written the changes — can leave without a prompt. */
export const goBackLink = `
  <a href="#" @click.prevent="requestGoBack"
    style="display:inline-flex; align-items:center; gap:2px; color:var(--ds-color-text-brand); text-decoration:none; font-weight:600; font-size:0.9375rem;">
    <q-icon name="chevron_left" size="18px" /> Go Back to Preferences
  </a>`

/* ---------------------------------------------------------------------------
 * Shared notification-list chrome.
 *
 * Both Notification Preferences screens — Screens/Notification Preferences and
 * First-Time Setup/Notification Preferences — render the same list. These live
 * here so the two cannot drift: a row must look identical whether you are
 * seeing it for the first time or editing it later.
 */

/** Row + column metrics. Send/Template column widths must match between the
 *  header row and the row bodies or the columns visually misalign. */
export const LIST_TITLE_STYLE = 'font-size:0.9375rem; font-weight:500; color:var(--ds-color-text);'
export const COL_SEND = 'width:96px; display:flex; align-items:center; justify-content:center;'
export const COL_TMPL = 'width:132px; display:flex; align-items:center; justify-content:center; margin-left:24px;'
export const COL_HEAD = 'font-size:0.8125rem; font-weight:600; color:var(--ds-color-text-subtle); text-align:center;'

export const colHeaders = `
  <div style="padding:14px 28px 4px; display:flex; justify-content:flex-end;">
    <div style="${COL_SEND}${COL_HEAD}">Send Email</div>
    <div style="${COL_TMPL}${COL_HEAD}">Template</div>
  </div>`

/** The Template-column control. One definition so the affordance is the same on
 *  both screens.
 *
 *  A split button with a four-item menu until 2026-08-19 (Aug 19 revision):
 *  "get rid of the actions dropdown and put it in the email itself in the save
 *  button". Everything that menu held now lives in the editor's Actions button,
 *  where the thing being acted on is on screen — Change description, Preview and
 *  Send test email all described this row's email while showing you none of it.
 *
 *  So the row keeps exactly one job: get me into the email. `onEdit` is a
 *  handler name in the consuming setup. The revert/delete/meta options this
 *  took are gone with the menu; the editor gates those now. */
export const templateActions = ({ onEdit = 'openEditor' } = {}) => `
  <q-btn unelevated no-caps color="primary" label="Edit" @click="${onEdit}(it)" />`

/** Unsaved-changes bar.
 *
 *  Appears the moment anything on the preferences list differs from what was
 *  last saved — a Send Email checkbox, the From/Reply address, a reminder added
 *  or deleted — and is the only way to commit any of it. Nothing on these
 *  screens takes effect until Save: a reminder you add does not reach Event
 *  Registration Settings until then, and Discard puts it back as it was.
 *
 *  Fixed to the bottom of the viewport rather than the end of the page, because
 *  the list is long enough to scroll and a bar you have to hunt for is worse
 *  than no bar. Shared by both Notification Preferences screens so they cannot
 *  drift. The consuming setup must provide `dirty`, `saveChanges` and
 *  `discardChanges`.
 *
 *  Rendered on the template editor too, since 2026-08-19. It used to be kept
 *  off it deliberately — that view had its own Cancel / Save in the header, and
 *  two competing save affordances on one screen is worse than either alone. The
 *  header's Save became "Actions" in the Aug 19 revision, which left the editor
 *  with no save affordance at all, so this bar is now the one for both views:
 *  "when we make an edit to an email, i want the unsaved changes dialog to
 *  appear now." The screens wire it through composeSaveBar, which points it at
 *  the list's or the editor's handlers depending on which view is open. */
/* Transition CSS for the save bar, injected once per session.
 *
 * Injected here rather than rendered as a <style> inside the Vue template: these
 * are runtime-compiled template strings, and whether a <style> element inside one
 * reliably applies is not something worth depending on. Guarded on `document`
 * because Storybook's indexer evaluates these modules in Node at build time.
 *
 * Hand-written rather than using a Quasar slide transition because the bar's
 * centring already owns translateX, and a canned slide would overwrite it. */
const SAVE_BAR_STYLE_ID = 'aug19-savebar-transition'
if (typeof document !== 'undefined' && !document.getElementById(SAVE_BAR_STYLE_ID)) {
  const el = document.createElement('style')
  el.id = SAVE_BAR_STYLE_ID
  el.textContent = `
    .aug19-savebar-enter-active { transition: transform 260ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity 200ms ease-out; }
    .aug19-savebar-leave-active { transition: transform 180ms cubic-bezier(0.4, 0, 1, 1), opacity 140ms ease-in; }
    .aug19-savebar-enter-from,
    .aug19-savebar-leave-to { transform: translateY(calc(100% + 28px)); opacity: 0; }
    @media (prefers-reduced-motion: reduce) {
      .aug19-savebar-enter-active,
      .aug19-savebar-leave-active { transition: opacity 160ms linear; }
      .aug19-savebar-enter-from,
      .aug19-savebar-leave-to { transform: none; opacity: 0; }
    }`
  document.head.appendChild(el)
}

export const unsavedChangesBar = `
  <!-- The wrapper is fixed and holds the horizontal centring; the bar inside it
       animates on Y alone, so the two transforms never fight. pointer-events are
       off on the wrapper so the empty strip cannot swallow clicks. -->
  <div style="position:fixed; left:50%; bottom:28px; transform:translateX(-50%);
              z-index:3000; pointer-events:none;">
    <transition name="aug19-savebar">
      <div v-if="dirty" role="status" aria-live="polite"
        style="display:flex; align-items:center; gap:12px; padding:10px 12px 10px 22px;
               pointer-events:auto;
               background:rgba(72,72,72,0.94); border-radius:var(--ds-radius-lg);
               box-shadow:0 6px 24px rgba(0,0,0,0.28);">
        <span style="color:#fff; font-size:0.9375rem; font-weight:500; white-space:nowrap;">Unsaved Changes</span>
        <q-btn unelevated no-caps color="white" text-color="primary" label="Discard" @click="discardChanges" />
        <q-btn unelevated no-caps color="primary" label="Save" @click="saveChanges" />
      </div>
    </transition>
  </div>`

/** Validation for the custom From address (DES-429 · P0-5).
 *
 *  Only Other needs it: Event Manager and Customer Support Contact resolve to
 *  real people, this one is whatever was typed. Returns the message DsInput
 *  should show, or an empty string when there is nothing to say.
 *
 *  Deliberately permissive on shape — the point is to catch a typo or a missing
 *  domain, not to adjudicate RFC 5322. */
export function customFromAddressError(fromAddress, custom) {
  if (fromAddress !== 'Other') return ''
  const value = (custom || '').trim()
  if (!value) return 'Enter the address these emails should send from.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter a valid email address.'
  return ''
}

/** DES-429 · P0-5 — per-section config strip.
 *
 *  Review of the earlier card: too bloated, it showed a concrete resolved address it
 *  cannot actually know, and it "feels independent of the Teams Management
 *  Communications section ... over time there will be more sections like Guests,
 *  Hotels, and each of those may have specific config parameters".
 *
 *  So this is a GENERIC per-section config slot, not a one-off for From/Reply:
 *  it renders inside the section it configures, and a future section fills the
 *  same slot with its own parameters. It states that the address resolves per
 *  event rather than naming one, which is the honest answer — Event Manager and
 *  Customer Support Contact both vary by event.
 *
 *  Lives here, not in a story file, because both Notification Preferences
 *  screens render it and they must not drift. The caller supplies the section
 *  wrapper: the configured screen loops over sections, first-run has one.
 *  Setup must provide `fromAddress`, `fromAddressCustom` and `fromOptions`. */
export const fromAddressSectionStrip = `
  <div style="padding:14px 28px; background:var(--ds-color-surface-sunken);">
    <div class="row items-start no-wrap q-gutter-md">
      <!-- No asterisk and not clearable. Event Manager is the default and there
           is no way back to empty, so the field can never be unset — marking it
           required would be labelling a state the user cannot reach. -->
      <div style="width:270px; flex:none;">
        <ds-select v-model="fromAddress" :options="fromOptions" label="From/Reply Address" />
      </div>
      <!-- Other is the one option that needs checking: the first two resolve to
           real people, this one is whatever was typed. The field only appears
           after you explicitly choose Other, so flagging it empty is answering
           the question you just asked, not scolding you unprompted. -->
      <div v-if="fromAddress === 'Other'" style="width:270px; flex:none;">
        <!-- DES-429 (2026-08-19) — "have it say ... Ensure the email domain
             matches the domain you setup for white labeling through EventPipe
             ...or something like that but maybe more succinct." Only Other can
             break this: the other two options resolve to EventPipe-side roles
             already on the right domain.

             NOT passed as DsField's hint prop. DsField gives error priority
             over hint and shows one line, so the guidance would be suppressed by the
             empty-field error — which is the state you are in the instant you
             choose Other, and the exact moment the guidance is worth reading.
             It is a standing instruction about the domain, not a comment on what
             you have typed, so it sits below the validation line and stays put
             while the error above it comes and goes. -->
        <ds-input v-model="fromAddressCustom" type="email" label="Custom From Address" required
          placeholder="teams@traveloc.com" :error="customFromError" />
        <!-- One line, never wrapped. The field column is 270px and the longer
             phrasing broke across two lines under it, which read as a second
             error rather than a standing note. Shortened to fit rather than
             just clipped, and nowrap so it cannot re-wrap at another width. -->
        <div style="margin-top:6px; font-size:0.75rem; line-height:1.45;
                    color:var(--ds-color-text-subtle); white-space:nowrap;">
          Use your EventPipe white-labeling domain.
        </div>
      </div>
    </div>
  </div>
  <q-separator />`

/** "Add Compliance Reminder" affordance (DES-428 · P0-4).
 *  Outline/bordered, matching the other add-actions in this folder
 *  ("+ Add New Note", "+ Add New Compliance Credit" on Team Detail).
 *
 *  The explanation sits in an info icon rather than a blurb beside the button:
 *  review asked for the help to be available but not permanently occupying the
 *  row, and for the copy to explain what you would USE this for rather than
 *  restating that the limit is gone. */
export const addReminderRow = ({
  handler = 'openAdd',
  label = 'Add Compliance Reminder',
  tooltip = 'Add additional Compliance Reminder templates to set a specific escalating tone or'
    + ' cadence to your communications as your event draws closer. Be sure to set the'
    + ' <b>Days until Event Start to Begin/End Reminders</b> to avoid overlapping with other'
    + ' reminders you have in place.',
  // A Vue expression, not a boolean: the tiers variant disables at its limit and
  // the state has to be live. Empty string means never disabled.
  disableWhen = '',
  disabledTooltip = '',
} = {}) => `
  <div class="row items-center no-wrap" style="padding:12px 28px 16px; gap:8px;">
    <q-btn outline no-caps color="primary" icon="add" label="${label}" @click="${handler}"
      ${disableWhen ? `:disable="${disableWhen}"` : ''} style="flex:none;">
      ${disabledTooltip ? `
      <q-tooltip v-if="${disableWhen}" max-width="300px" class="text-body2" style="padding:8px 10px;">
        ${disabledTooltip}
      </q-tooltip>` : ''}
    </q-btn>
    <q-btn flat round dense color="grey-7" icon="info" size="sm" style="flex:none;" aria-label="About compliance reminders">
      <q-tooltip max-width="340px" anchor="center right" self="center left"
        class="text-body2" style="line-height:1.5; padding:10px 12px;">
        ${tooltip}
      </q-tooltip>
    </q-btn>
  </div>`
