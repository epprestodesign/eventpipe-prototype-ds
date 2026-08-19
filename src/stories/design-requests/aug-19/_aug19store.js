/** Teams Mgmt Comms Phase 2 — shared session store for user-added templates.
 *
 *  WHY THIS EXISTS
 *  Compliance reminders are created at COMPANY level (DES-428 · P0-4) but each
 *  one then has to appear as its own on/off row at EVENT level (DES-425 · P0-1).
 *  Those are three different stories in Storybook, and a story-local `ref` cannot
 *  show that relationship — add a reminder on one screen and the others know
 *  nothing about it, which is exactly the wrong impression to leave in a review.
 *
 *  So the added-template list lives here, at module scope, and every screen
 *  imports the same array. Add a reminder in First-Time Setup or on the
 *  configured Notification Preferences screen, navigate to Event Registration
 *  Settings, and the new row is there waiting to be toggled on for that event.
 *
 *  SCOPE AND LIMITS — worth knowing before demoing this:
 *  · Session-only. Storybook keeps one preview iframe while you move between
 *    stories, so the state survives navigation. A hard reload, or an HMR edit to
 *    this file, resets it to empty. That is correct for a prototype: it is a
 *    stand-in for the server, not a fake database.
 *  · Seeded templates are NOT in here. They come from aug19-content.json and the
 *    TM_TEMPLATES fixture. This holds only what a user made during the session,
 *    which is also why `reset()` can safely empty it.
 *  · Event-level on/off is stored per template here (`eventOn`) because that is
 *    the value P0-1 asks about. It starts FALSE: a newly created template is off
 *    for every event until someone turns it on, matching how seeded templates
 *    behave for a new event.
 */
import { ref } from 'vue'

/** Every compliance reminder created during this session, oldest first. */
export const addedTemplates = ref([])

let seq = 0

/** Append a reminder and hand back the stored object.
 *  `title` is required; everything else has a sensible default so the three
 *  screens do not each have to remember the full shape. */
export function addTemplate({ title, desc = '', baseTitle = '' }) {
  seq += 1
  const template = {
    // Prefixed so a user-added id can never collide with a seeded `s{n}i{n}`.
    id: 'tm-added-' + seq,
    key: 'tm-added-' + seq,
    title,
    desc,
    type: 'compliance-reminder',
    recurring: true,
    // Company level: on as soon as it is created — you made it to use it.
    send: true,
    companyOn: true,
    // Event level: off until someone opts this event in (DES-425 · P0-1).
    eventOn: false,
    // Never required. Only the seeded Compliance Reminder is forced on.
    forced: false,
    // Marked Custom so it badges like any edited template, and userAdded so it
    // is the only kind that can be deleted rather than reverted (DES-428).
    custom: true,
    userAdded: true,
    // What it was copied from, for the "starts as a copy of X" copy.
    baseTitle,
  }
  addedTemplates.value.push(template)
  return template
}

/** Remove one, by identity. Returns whether anything was removed. */
export function removeTemplate(template) {
  const i = addedTemplates.value.indexOf(template)
  if (i === -1) return false
  addedTemplates.value.splice(i, 1)
  return true
}

/** Empty the store — used by the reset affordance on Event Registration
 *  Settings so a reviewer can get back to a clean slate without reloading. */
export function resetTemplates() {
  addedTemplates.value.splice(0, addedTemplates.value.length)
}
