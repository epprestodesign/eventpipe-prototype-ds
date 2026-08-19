/* ---- Test send (2026-08-19) ----
 *
 * The workflow Scott described, and the dialog both Notification Preferences
 * screens now open from the editor's Send test button and its Actions menu.
 *
 *   "we want to get rid of this context menu ... these things to be triggered
 *    from the email template itself ... when you click send test email, then the
 *    user would get some kind of modal where they basically have to select the
 *    event that they want to send the test email for and the team at that event
 *    ... maybe there would be some copy under that that says something like:
 *    test emails will send to your email address and will not be sent to the
 *    team selected ... then some kind of confirmation that the email sent
 *    properly. Maybe that's a toaster ... and then if there was a failure,
 *    obviously a failure notification."
 *
 * And on why the preview dialog does not do this job:
 *
 *   "I think these should be two different things. So, preview email and test
 *    send. Whereas the preview email is a very simple one that just takes this
 *    and just mocks it up with some default variables resolved. But the test
 *    send actually asks you a couple questions and then you send it."
 *
 * This replaced a dialog that asked only for an address. That one could not be
 * honest about what it was sending: the merge fields resolved against fixture
 * data no matter which template you were in, so the email you received was not
 * the email any team would get.
 *
 * WHY THIS LIVES AT THE FOLDER ROOT rather than in concepts/. It started as
 * Concept A and was chosen, so it is now the shipping dialog. The concept
 * stories re-export from here rather than the other way round: a root module
 * importing from concepts/ would invert the dependency, and _aug19concepts.js
 * already imports from this folder, which would make the pair circular.
 */
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { COMPANY, DEFAULT_EMAILS, TEAM, USER } from './_aug19fixtures'
import { renderBody, resolveMergeFields, OPEN, CLOSE } from './_aug19email'

/** Defined here rather than in _aug19np so that module can import this one
 *  without a cycle. _aug19np re-exports it, so existing importers are unchanged. */
export const SIGNED_IN_EMAIL = USER.toLowerCase().replace(/\s+/g, '.') + '@traveloc.com'

/* Event names copied from the reference screenshots so the list reads like the
 * real dropdown — same "YYYY - Name" shape, same span of years, long enough that
 * type-to-search is obviously necessary rather than decorative. */
export const EVENTS = [
  '2022 - The Next Test Event',
  '2023 - The Next Test Event',
  '2024 - The Next Test Event',
  '2025 - Diamond Dawg Baseball Classic - TEST',
  '2025 - Double Double Dribble Classic',
  '2025 - Double Dribble Classic',
  '2025 - The Next Test Event',
  '2026 - Diamond Dawg Baseball Classic',
  '2026 - The Next Test Event',
  '2027 - Diamond Dawg Baseball Classic',
  '2027 - San Antonio Soccer Classic',
]

/* The nine names from the reference screenshot, plus a spread of other clubs.
 *
 * That screenshot was captured mid-search on "gold", so every name in it
 * contains that word. Seeding only those made the combo box impossible to
 * review: opening it showed nine near-identical names and every search returned
 * all of them or none. The additions give the list something to narrow down. */
const REFERENCE_GOLD = [
  'AVC ATL 13 Gold', 'AVC ATL 14 Gold', 'Boiler Jrs 13-1O Gold', 'Boiler Jrs 14-1O Gold',
  'Boiler Jrs 15-1O Gold', 'Boiler Jrs 16-1O Gold', 'Boiler Jrs 17-1O Gold',
  'Gold Rush Elite AS CH', 'Gold Star AS CH',
]
const OTHER_CLUBS = [
  'Circle City 14 Black', 'Circle City 15 Red', 'Northside Thunder 13U',
  'Northside Thunder 14U', 'Premier Select 16-1', 'Riverbend Rapids 15U',
  'Summit Volleyball 17 Navy',
]
const ALL_TEAMS = [...REFERENCE_GOLD, ...OTHER_CLUBS].sort()

/* Teams are per-event on purpose — "I do want that to be nested such that you
 * know you're not inundated with a billion teams." */
export const TEAMS_BY_EVENT = EVENTS.reduce((acc, name) => {
  acc[name] = name.includes('San Antonio')
    ? [...ALL_TEAMS, 'Alamo City FC 05G', TEAM.name, 'Southern United 06B'].sort()
    : ALL_TEAMS
  return acc
}, {})

/** The warning under the fields.
 *
 *  Scott's version was "test emails will send to your email address and will not
 *  be sent to the team selected. This email is meant only for testing purposes."
 *  Compressed, and made to answer the question the fields raise rather than
 *  restate them: if I just picked a team, why is the team not getting this?
 *  Because the team is what fills in the merge fields, not the recipient. */
export const TEST_SEND_WARNING = 'Test emails go to your address only. The selected'
  + ' team receives nothing — the event and team are used to fill in the merge'
  + ' fields so you can see the email as that team would.'

/** Everything the dialog needs.
 *
 *  `templateTitle` is a getter, not a value: on the screens it has to follow
 *  whichever template is open in the editor, which changes under it.
 */
export function useTestSend({ templateTitle = () => 'STP - Compliance Reminder' } = {}) {
  const $q = useQuasar()

  const testOpen = ref(false)
  const testEvent = ref(null)
  const testTeam = ref(null)
  const testSendTo = ref(SIGNED_IN_EMAIL)
  /* Prototype scaffolding, exposed only by the concept stories: Scott asked for
   * a failure notification, and a failure you cannot trigger is one nobody
   * reviews. The screens never surface this toggle. */
  const failNext = ref(false)

  const testTemplateTitle = computed(() => templateTitle() || 'this email')
  const testEventOptions = ref(EVENTS)
  const testTeamOptions = ref([])

  const filterTestEvents = (val, update) => {
    update(() => {
      const q = val.trim().toLowerCase()
      testEventOptions.value = q ? EVENTS.filter((e) => e.toLowerCase().includes(q)) : EVENTS
    })
  }
  /* Empty query lists every team at the event rather than nothing, which is what
   * makes this a combo box and not a search box that happens to have an arrow. */
  const filterTestTeams = (val, update) => {
    update(() => {
      const all = TEAMS_BY_EVENT[testEvent.value] || []
      const q = val.trim().toLowerCase()
      testTeamOptions.value = q ? all.filter((t) => t.toLowerCase().includes(q)) : all
    })
  }
  /* Changing the event clears the team. The old team almost certainly is not at
   * the new event, and silently sending against a mismatched pair is the one
   * outcome this dialog exists to prevent. Options are primed rather than
   * emptied so the combo box has something to show the first time it opens. */
  const onTestEvent = (val) => {
    testEvent.value = val
    testTeam.value = null
    testTeamOptions.value = TEAMS_BY_EVENT[val] || []
  }

  const testCanSend = computed(() => !!testEvent.value && !!testTeam.value
    && /\S+@\S+\.\S+/.test(testSendTo.value))

  const openTestSend = () => {
    testEvent.value = null
    testTeam.value = null
    testTeamOptions.value = []
    testOpen.value = true
  }

  /* ---- The email, rendered for the chosen event and team ----
   * Used by the stepped concept's review pane. The two chosen values are
   * substituted first, then everything else falls through to the shared
   * resolver, so the sample numbers and dates stay consistent with every other
   * preview in the folder and only the two picked fields differ. */
  const TEMPLATE = DEFAULT_EMAILS.find((e) => e.key === 'compliance-reminder')
  const withSelections = (text) => {
    const picked = String(text)
      .split(OPEN + 'event_name' + CLOSE).join(testEvent.value || (OPEN + 'event_name' + CLOSE))
      .split(OPEN + 'entity_name' + CLOSE).join(testTeam.value || (OPEN + 'entity_name' + CLOSE))
    const resolved = resolveMergeFields(picked)
    /* A second pass over the resolved text, because some fixture values have the
     * default team's name baked INTO them — team_group_block_info is the literal
     * string "Southern United 05B — Marriott Riverwalk". Substituting only the
     * tokens produced an email addressed to the team you picked that then talked
     * about a different team's room block, which is exactly what a preview
     * exists to stop you shipping. */
    return testTeam.value ? resolved.split(TEAM.name).join(testTeam.value) : resolved
  }
  const previewSubject = computed(() => withSelections(TEMPLATE.subject))
  const previewBody = computed(() => renderBody(TEMPLATE.body).map(withSelections))
  /* The To line is the tester's address, not the team's. The team decides what
   * the email SAYS, not where it goes — showing the team's address would
   * contradict the warning sitting directly under it. */
  const previewTo = computed(() => testSendTo.value)
  const previewFrom = 'Event Manager — resolved per event when the email sends'

  const sendTest = () => {
    if (!testCanSend.value) return
    testOpen.value = false
    if (failNext.value) {
      $q.notify({
        message: 'Test email could not be sent',
        caption: 'The send failed before it reached ' + testSendTo.value
          + '. Nothing was delivered — try again.',
        icon: 'error',
        color: 'negative',
        position: 'bottom-right',
        timeout: 5000,
        actions: [{ label: 'Retry', color: 'white', handler: () => openTestSend() }],
      })
      return
    }
    $q.notify({
      message: 'Test email sent to ' + testSendTo.value,
      caption: testTeam.value + ' · ' + testEvent.value
        + ' — not recorded in any team Communications Log',
      icon: 'check_circle',
      color: 'positive',
      position: 'bottom-right',
      timeout: 4000,
    })
  }

  return {
    testOpen, testEvent, testTeam, testSendTo, failNext, testTemplateTitle,
    testEventOptions, testTeamOptions, filterTestEvents, filterTestTeams, onTestEvent,
    testCanSend, openTestSend, sendTest,
    previewSubject, previewBody, previewTo, previewFrom,
    TEST_SEND_WARNING,
    testCompany: COMPANY,
  }
}

/* ---- Fragments ---- */

export const eventField = `
  <ds-field label="Event Name" required>
    <q-select :model-value="testEvent" @update:model-value="onTestEvent" :options="testEventOptions"
      outlined dense clearable use-input fill-input hide-selected input-debounce="200"
      @filter="filterTestEvents" placeholder="Select or search events…" hide-bottom-space
      behavior="menu">
      <template #no-option>
        <q-item><q-item-section class="text-grey-7">No events match that search.</q-item-section></q-item>
      </template>
    </q-select>
  </ds-field>`

export const teamField = `
  <!-- Combo box, same shape as the event field above it: open it to see the
       teams at this event, or type to narrow them. Disabled until an event
       exists, and the hint carries the reason — a control that is simply dead
       teaches nothing about what would revive it. -->
  <ds-field label="Team Name" required
    :hint="testEvent ? 'Select a team or type to search.' : 'Select an event first.'">
    <q-select v-model="testTeam" :options="testTeamOptions" :disable="!testEvent"
      outlined dense clearable use-input fill-input hide-selected input-debounce="200"
      @filter="filterTestTeams"
      :placeholder="testEvent ? 'Select or search teams at this event…' : ''"
      hide-bottom-space behavior="menu">
      <template #no-option>
        <q-item><q-item-section class="text-grey-7">No teams match that search.</q-item-section></q-item>
      </template>
    </q-select>
  </ds-field>`

export const sendToField = `
  <ds-field label="Send to" required hint="Defaults to the address you are signed in with.">
    <q-input v-model="testSendTo" outlined dense type="email" hide-bottom-space />
  </ds-field>`

/** Info-coloured, not a warning colour: nothing has gone wrong, it is telling
 *  you what will happen. */
export const warningNote = `
  <div class="row items-start no-wrap" style="gap:8px; padding:12px 14px; line-height:1.5;
              background:var(--ds-color-surface-sunken); border-radius:var(--ds-radius-md);">
    <q-icon name="info" size="18px" class="text-grey-7" style="margin-top:1px; flex:none;" />
    <div style="font-size:0.8125rem; color:var(--ds-color-text-subtle);">{{ TEST_SEND_WARNING }}</div>
  </div>`

/** The dialog itself. Mount it OUTSIDE any v-if that switches views — the same
 *  rule the other dialogs in this folder learned the hard way. */
export const testSendDialog = `
  <q-dialog v-model="testOpen">
    <q-card flat bordered style="width:480px; max-width:94vw; border-radius:var(--ds-radius-lg);">
      <q-card-section style="padding:26px 28px 6px;">
        <div class="text-h6" style="font-weight:700;">Send test email</div>
        <div class="text-grey-8" style="font-size:0.8125rem; margin-top:4px;">
          {{ testTemplateTitle }}
        </div>
      </q-card-section>

      <q-card-section style="padding:16px 28px 8px; display:flex; flex-direction:column; gap:18px;">
        ${eventField}
        ${teamField}
        ${sendToField}
      </q-card-section>

      <q-card-section style="padding:6px 28px 4px;">${warningNote}</q-card-section>

      <q-card-actions align="right" class="q-pa-md" style="padding:16px 20px 20px;">
        <!-- Closes by setting the model, never with v-close-popup. Quasar's
             ClosePopup directive is not registered on this Storybook's Vue app
             (the app has no directives at all), so v-close-popup silently
             resolves to nothing and the button does nothing. Same convention as
             every other dialog in this folder. -->
        <q-btn flat no-caps color="primary" label="Cancel" @click="testOpen = false" />
        <!-- Disabled until all three are answered rather than validating on
             submit: there is nothing to correct here, only something not chosen
             yet, and an error message would be telling you what the empty fields
             already say. -->
        <q-btn unelevated no-caps color="primary" icon="outgoing_mail"
          label="Send test email" :disable="!testCanSend" @click="sendTest" />
      </q-card-actions>
    </q-card>
  </q-dialog>`
