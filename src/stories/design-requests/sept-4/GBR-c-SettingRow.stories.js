/** Components / Email Settings / Setting Row.
 *
 *  NOT new. The anatomy the four existing Email Settings rows already use,
 *  extracted so the group block control can be built from it rather than
 *  resembling it.
 */
import { ref } from 'vue'
import GbrSettingRow from './components/GbrSettingRow.vue'
import { EXISTING_EMAIL_ROWS } from './_gbr'

export default {
  title: 'Design Requests/Sept 4/Components/Email Settings/Setting Row',
  component: GbrSettingRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Existing pattern — nothing new here.** A small grey label with an ⓘ, a number
field with a unit suffix, a toggle on the right, an optional caption underneath.

It is extracted as a component for one reason: the new group block control
(**PP-42** / **PP-43**) has to be built from *exactly* this. A fifth row that
invented its own layout would read as bolted on, and having one implementation
means the new row cannot quietly drift from the four beside it.

### The off state keeps its field

The field greys out; it does not disappear. *Pre Arrival* sits switched off on
this screen in production with its field still visible — hiding it would make
rows jump as they are toggled, and hide the value the user is about to come back
to. See **Off**.

### Errors reserve their own space

When a row carries an inline error the toggle shifts down with the field rather
than staying pinned to the top, so the two never separate. See **With error**.
` } } },
}

const row = (props) => ({
  components: { GbrSettingRow },
  setup: () => ({ v: ref(props.modelValue ?? 3), on: ref(props.enabled ?? true), props }),
  template: `
    <div style="max-width:520px;">
      <gbr-setting-row v-bind="props" v-model="v" v-model:enabled="on" />
    </div>`,
})

/** The four rows exactly as production has them today. */
export const ProductionRows = {
  render: () => ({
    components: { GbrSettingRow },
    setup: () => ({ rows: EXISTING_EMAIL_ROWS.map((r) => ({ ...r })) }),
    template: `
      <div style="max-width:520px;">
        <gbr-setting-row v-for="r in rows" :key="r.key"
          :label="r.label" :tooltip="r.tooltip" :caption="r.caption || ''"
          v-model="r.value" v-model:enabled="r.enabled" />
      </div>`,
  }),
}
ProductionRows.storyName = 'The four rows today'

/** A single row, on. Hover the ⓘ for the tooltip. */
export const On = { render: () => row({ label: 'Deposit Reminder', modelValue: 5, enabled: true, tooltip: 'When enabled, a reminder is sent the number of days before the deposit is due.' }) }

/** Switched off — the field stays, greyed, holding its value. */
export const Off = { render: () => row({ label: 'Pre Arrival', modelValue: 0, enabled: false, tooltip: 'When enabled, a pre-arrival email is sent to guests the number of days prior to check-in specified.' }) }

/** With the caption line some rows carry. */
export const WithCaption = { render: () => row({ label: 'Hotel User Verification', modelValue: 45, enabled: true, caption: 'Prior to the first hotel cutoff date', tooltip: 'When enabled, a verification email will be sent to hotel users the number of days prior to the first hotel cutoff specified.' }) }
WithCaption.storyName = 'With caption'

/** Inline error — the toggle moves with the field so the pair stays together. */
export const WithError = { render: () => row({ label: 'Group Block Reminders', modelValue: 0, enabled: true, error: 'Must be at least 1 day', caption: 'Interval between each reminder' }) }
WithError.storyName = 'With error'
