/** Components / Notification Preferences / Unsaved Changes Bar.
 *
 *  NEW IN PHASE 2. The screen previously applied every change on click — a
 *  checkbox toggle took effect immediately and there was nothing to save.
 *
 *  Renders the real fragment (`unsavedChangesBar` in _tmc2.js).
 */
import { ref } from 'vue'
import { unsavedChangesBar } from './_tmc2'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Notification Preferences/Unsaved Changes Bar',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
**New in Phase 2.** Not tied to one requirement — it governs how every setting
on both Notification Preferences screens behaves.

**Nothing takes effect until Save.** The bar appears the moment anything differs
from the last save and is the only way to commit any of it.

| Change | Staged? |
| --- | --- |
| Send Email checkbox | Yes — held by row id, so a Controls edit rebuilding the list cannot lose it |
| From/Reply address | Yes |
| Adding a reminder | Yes. The row appears in the list, but does **not** reach Event Registration Settings as an event-level toggle until Save |
| Deleting a reminder | Yes. A never-saved reminder is dropped outright; a saved one leaves on Save |

**Discard** drops all staging and restores From/Reply to its last-saved value.

### Two deliberate choices

**Fixed to the viewport, not the end of the page.** The preferences list scrolls;
a save bar you have to scroll to find is worse than no save bar.

**Not rendered on the template editor.** That view has its own Cancel / Save in
the header, next to the field being edited. Two competing save affordances on one
screen would be worse than either alone.

### One known rough edge

It treats toggling a checkbox and toggling it straight back as *dirty*, because
it records that you touched the row rather than diffing values. That is the safer
default — Discard is right there — but it does mean the bar can persist after you
have manually undone your own change.
` } } },
}

const demo = (dirtyStart) => ({
  setup: () => {
    const dirty = ref(dirtyStart)
    return {
      dirty,
      saveChanges: () => { dirty.value = false },
      discardChanges: () => { dirty.value = false },
      touch: () => { dirty.value = true },
    }
  },
  template: `
    <div style="min-height:320px; padding:40px 32px; background:var(--ds-color-surface-sunken);">
      <div class="text-grey-8" style="max-width:560px; line-height:1.6;">
        <div class="text-weight-bold text-grey-9 q-mb-sm">Stand-in for the preferences list</div>
        <q-checkbox v-model="dirty" label="Change something" color="primary" />
        <div style="font-size:0.8125rem; margin-top:8px;">
          Tick the box to raise the bar. <b>Save</b> and <b>Discard</b> both clear it, which is
          the only difference this demo can show — on the real screen Discard also puts every
          staged change back.
        </div>
      </div>
      ${unsavedChangesBar}
    </div>`,
})

/** How the screen sits most of the time: no bar at all. */
export const Clean = { render: () => demo(false) }

/** Something has changed and is waiting to be committed. */
export const Unsaved = { render: () => demo(true) }
