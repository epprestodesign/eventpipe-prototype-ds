/** Components / Event Registration Settings / Non-Compliance Policy Field.
 *
 *  NEW IN PHASE 2 — DES-438 · P1-3. The Compliance card had no free-text policy
 *  field; there was nowhere to state what happens to a team that misses its goal.
 */
import { ref } from 'vue'
import DsField from './components/DsField.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/Components/Event Registration Settings/Non-Compliance Policy',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**New in Phase 2** — [DES-438 · P1-3](https://linear.app/eventpipe/issue/DES-438).

A free-text policy at the bottom of the *Compliance* card, feeding the
\`{{noncompliance_policy}}\` merge field.

**Optional, and genuinely optional.** Left blank, the paragraph is omitted from
the email **entirely** — not rendered as an empty line, not rendered as a stray
heading. That is the behaviour worth checking in the two stories below: the same
template produces a different number of paragraphs depending on whether this
field has content.

**Per event, not per company.** Two events run by the same Hoco can carry
different consequences, which is the reason this lives on the event rather than
in Company Settings.

The hint names the merge field so it is obvious where the text ends up. It is
built in JavaScript rather than written inline — a literal mustache pair inside a
Vue template closes the interpolation early and fails the build.
` } } },
}

// Built by concatenation: a literal double brace in a Vue template would be
// parsed as an interpolation and break the compile.
const MERGE_FIELD = '{' + '{noncompliance_policy}' + '}'
const MERGE_HINT = 'Optional. When filled, this text is inserted into Teams Management emails as its own paragraph via the '
  + MERGE_FIELD + ' merge field. Leave it blank and that section is omitted from the email entirely.'

const field = (initial) => ({
  components: { DsField },
  setup: () => ({ noncompliancePolicy: ref(initial), mergeHint: MERGE_HINT }),
  template: `
    <div style="max-width:660px;">
      <ds-field label="Non-Compliance Policy" :hint="mergeHint">
        <q-input v-model="noncompliancePolicy" type="textarea" outlined autogrow
          hide-bottom-space input-style="min-height:96px;"
          placeholder="What happens to teams that do not meet their requirement by the cutoff." />
      </ds-field>
    </div>`,
})

/** The default. Nothing is written, so the paragraph never appears in any email. */
export const Empty = { render: () => field('') }

/** A written policy. This text becomes its own paragraph in every Teams
 *  Management email for this event. */
export const Written = {
  render: () => field(
    'Teams that have not met their room night requirement by the final hotel cutoff date will be '
    + 'invoiced the difference at the prevailing event rate. Contact your event manager before the '
    + 'cutoff if your travel plans change.',
  ),
}
