/** Components / Notification Preferences / From-Reply Section Config.
 *
 *  NEW IN PHASE 2 — DES-429 · P0-5. Nothing like this existed on the screen
 *  before: the From/Reply address was not configurable at all.
 *
 *  Renders the real fragment (`fromAddressSectionStrip` in _tmc2.js), the same
 *  one both Notification Preferences screens use, so this story cannot drift
 *  from what ships.
 */
import { ref, computed } from 'vue'
import { FROM_ADDRESS_OPTIONS, FROM_ADDRESS_RESOLVED } from './_tmc2fixtures'
import { fromAddressSectionStrip } from './_tmc2'
import DsSelect from './components/DsSelect.vue'
import DsInput from './components/DsInput.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Notification Preferences/From-Reply Section Config',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-429 · P0-5](https://linear.app/eventpipe/issue/DES-429).

A single row that sets the From/Reply address for **every** template in the
section it sits inside. Not per template, and with no event-level override.

It is deliberately built as a **generic per-section config slot**, not a one-off
for From/Reply: it renders inside the section it configures, so when *Guests* and
*Hotels* sections arrive with their own parameters they fill the same place
rather than each adding another free-floating card to the top of the page.

### It never names a mailbox

*Event Manager* and *Event Customer Support Contact* are **per-event roles** —
the Event Manager for one event is not the Event Manager for another. So there
is no single address this could truthfully display, and it does not try. The
template editor and the email preview report the role and when it resolves:

> *Event Manager — resolved per event when the email sends*

*Other* is the exception: a literal address you typed, so it resolves normally.

An earlier version put this in its own card above every section, with a heading,
a Required chip, a badge, a four-line explainer and a resolved-address footer.
Review on 2026-08-07 called it bloated, called the resolved address wrong, and
asked for it to be tied to its section.
` } } },
}

const wrap = (slot) => `
  <q-card flat bordered style="max-width:900px; overflow:hidden;">
    <q-expansion-item default-opened label="Teams Management" header-class="text-primary text-weight-bold">
      <q-separator />
      ${slot}
      <div class="text-grey-6" style="padding:18px 28px; font-size:0.8125rem;">
        …the section's templates would follow here.
      </div>
    </q-expansion-item>
  </q-card>`

const make = (initial) => ({
  components: { DsSelect, DsInput },
  setup: () => {
    const fromAddress = ref(initial)
    const fromAddressCustom = ref('')
    const resolvedFrom = computed(() => (fromAddress.value === 'Other'
      ? (fromAddressCustom.value || 'Custom address not set yet')
      : (FROM_ADDRESS_RESOLVED[fromAddress.value] || fromAddress.value)))
    return { fromAddress, fromAddressCustom, resolvedFrom, fromOptions: FROM_ADDRESS_OPTIONS }
  },
  template: wrap(fromAddressSectionStrip),
})

/** The default: a per-event role, so no concrete address is shown anywhere. */
export const EventManager = { render: () => make('Event Manager') }

/** The other per-event role. Resolves from Customer Service Details on Company
 *  Settings — see *Components › Company Settings › From-Reply Address Sources*. */
export const SupportContact = { render: () => make('Event Customer Support Contact') }

/** `Other` reveals a second field. This is the one case where the address IS
 *  knowable, so the editor and preview show it literally. */
export const CustomAddress = { render: () => make('Other') }
