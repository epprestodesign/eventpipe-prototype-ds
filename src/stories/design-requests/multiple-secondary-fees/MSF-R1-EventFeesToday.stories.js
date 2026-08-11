/** Reference · Event › Fees (today).
 *
 *  The current-state baseline for DES-451, recreated in the design system from
 *  the 08/11 capture: the Fees section carries exactly ONE Secondary Custom Fee
 *  — one toggle, a charge type, a dollar amount, a display label and a
 *  description. Open this next to the proposal to see precisely what changes.
 */
import { reactive } from 'vue'
import { msfPage, makeFee, CURRENT_EVENT_FEE, CHARGE_TYPES } from './_msf'
import { makeEventForm, makeSectionState, eventEditPage } from './_msfEventEdit'
import DsField from '../../../components/DsField.vue'
import DsInput from '../../../components/DsInput.vue'
import DsSelect from '../../../components/DsSelect.vue'
import DsLink from '../../../components/DsLink.vue'
import DsSectionHeader from '../../../components/DsSectionHeader.vue'
import DsRichTextEditor from '../../../components/DsRichTextEditor.vue'

export default {
  title: 'Design Requests/Multiple Secondary Fees/References/R1 · Event Fees (Today)',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Current state — **Event › Fees** supports a single Secondary Custom Fee. Baseline for DES-451.' } },
  },
}

/* Today's Fees section: one toggle, one fee. */
const SINGLE_FEE = `
  <div>
    <q-toggle v-model="fee.enabled" color="primary" dense>
      <span style="font-size:0.9375rem;">Secondary Custom Fee <span class="text-negative" style="font-weight:700;">*</span></span>
    </q-toggle>
    <div v-if="fee.enabled" class="column q-gutter-y-md" style="margin-top:14px; max-width:720px;">
      <div class="row items-start no-wrap q-gutter-sm">
        <ds-select v-model="fee.chargeType" :options="chargeTypes" style="width:250px; flex:none;" />
        <ds-input v-model="fee.amount" type="currency" style="width:190px; flex:none;" />
      </div>
      <ds-input label="Display Label" required v-model="fee.label" />
      <ds-field label="Description" required>
        <q-input v-model="fee.description" type="textarea" outlined dense hide-bottom-space rows="4" :input-style="{ minHeight: '92px' }" />
      </ds-field>
    </div>
  </div>`

export const Default = msfPage({
  active: 'events',
  components: { DsField, DsInput, DsSelect, DsLink, DsSectionHeader, DsRichTextEditor },
  setup: () => ({
    form: makeEventForm(),
    fee: reactive(makeFee(CURRENT_EVENT_FEE)),
    chargeTypes: CHARGE_TYPES,
    ...makeSectionState(),
  }),
  slot: eventEditPage(SINGLE_FEE),
})
Default.storyName = 'Event Fees (today)'
