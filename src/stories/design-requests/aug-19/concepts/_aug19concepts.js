/* ---- Test send concepts (2026-08-19) ----
 *
 * Concept A was chosen and is now the shipping dialog, so the model, the fields
 * and the dialog markup moved to ../_aug19testsend.js and are re-exported here.
 * The concept stories therefore render exactly what the screens render — if the
 * shipped dialog changes, the concept that describes it changes with it, rather
 * than quietly becoming a picture of something that no longer exists.
 *
 * Only the prototype scaffolding is local to the concepts.
 */
export {
  EVENTS,
  TEAMS_BY_EVENT,
  TEST_SEND_WARNING,
  useTestSend,
  eventField,
  teamField,
  sendToField,
  warningNote,
  testSendDialog,
} from '../_aug19testsend'

/** The failure toggle both concept stories put above the trigger.
 *
 *  Concept-only: the screens never surface it. Scott asked for a failure
 *  notification, and a failure you cannot trigger is one nobody reviews. */
export const failToggle = `
  <div class="row items-center q-gutter-sm q-mt-lg" style="opacity:0.75;">
    <q-toggle v-model="failNext" color="negative" dense />
    <span style="font-size:0.8125rem; color:var(--ds-color-text-subtle);">
      Simulate a send failure (prototype only — shows the error notification)
    </span>
  </div>`
