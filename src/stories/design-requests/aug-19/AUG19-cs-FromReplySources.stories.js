/** Components / Company Settings / From-Reply Address Sources.
 *
 *  Company Settings is a rebuild of the production read-view — Phase 2 added no
 *  new controls to it. What this story does is HIGHLIGHT the two places on that
 *  screen that the Teams Management From/Reply setting depends on, so the chain
 *  from "Event Customer Support Contact" back to a real field is visible.
 */
import { COMPANY, COMPANY_SECTIONS_TOP, COMPANY_SECTIONS_BOTTOM } from './_aug19fixtures'
import DsInfoGrid from './components/DsInfoGrid.vue'
import DsSectionHeader from './components/DsSectionHeader.vue'

export default {
  title: 'Design Requests/Aug 19/Components/Company Settings/From-Reply Address Sources',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**Company Settings contributed no new components to Phase 2.** It was rebuilt
from the production read-view so the Notifications tab has somewhere to live and
the navigation is real.

What it *does* contribute is **where addresses come from**. The Teams Management
From/Reply setting ([DES-429 · P0-5](https://linear.app/eventpipe/issue/DES-429))
offers three options, and this screen is the source for one of them.

| Option on Notification Preferences | Resolves from |
| --- | --- |
| **Event Customer Support Contact** | **Customer Service Details → Service Email**, here |
| **Event Manager** | The **event record**, not this screen — it differs event to event |
| **Other** | A literal address typed into the field itself |

That split is the whole reason the From/Reply setting cannot display one concrete
mailbox: two of its three options are per-event, and only one of those two is
even configured at company level.

### The existing From-address pattern

**Branding** already carries a company-level From address for four other areas —
Reservations, Group Blocks, Hotels and Accounting Processes. They are highlighted
below as the established pattern for how EventPipe configures sending addresses,
which is useful context for where a reader expects to find one.

Teams Management's address is set on the **Notifications** tab instead, inside
the section it configures.
` } } },
}

const SUPPORT_SECTION = COMPANY_SECTIONS_TOP.find((s) => s.title === 'Customer Service Details')
const BRANDING_SECTION = COMPANY_SECTIONS_BOTTOM.find((s) => s.title === 'Branding')

const HL = 'border:2px solid var(--ds-color-border-brand, var(--ds-color-text-brand));'
  + ' border-radius:var(--ds-radius-lg); padding:2px;'
const NOTE = 'display:flex; gap:8px; align-items:flex-start; margin:10px 2px 0;'
  + ' font-size:0.8125rem; line-height:1.5; color:var(--ds-color-text-subtle);'

const section = (data, note) => `
  <div style="margin-bottom:28px; max-width:900px;">
    <ds-section-header title="${data.title}" variant="accent" />
    <div style="${HL} margin-top:12px;">
      <q-card flat bordered>
        <q-card-section style="padding:20px 28px;">
          <ds-info-grid :items="${data.key}" layout="stacked" min-col-width="260px" />
        </q-card-section>
      </q-card>
    </div>
    <div style="${NOTE}">
      <q-icon name="arrow_upward" size="16px" color="primary" style="flex:none; margin-top:1px;" />
      <span>${note}</span>
    </div>
  </div>`

export const Sources = {
  render: () => ({
    components: { DsInfoGrid, DsSectionHeader },
    setup: () => ({
      supportItems: SUPPORT_SECTION.items,
      brandingItems: BRANDING_SECTION.items,
      company: COMPANY,
    }),
    template: `
      <div style="background:var(--ds-color-surface-sunken); padding:28px;">
        ${section({ title: 'Customer Service Details', key: 'supportItems' },
          '<b>Service Email</b> is what <i>Event Customer Support Contact</i> resolves to on '
          + 'Notification Preferences. Change it here and every Teams Management email using that '
          + 'option changes with it.')}

        ${section({ title: 'Branding', key: 'brandingItems' },
          'The established pattern: Reservations, Group Blocks, Hotels and Accounting Processes each '
          + 'carry a company-level From address here. Teams Management sets its own on the '
          + '<b>Notifications</b> tab, inside the section it configures.')}

        <div style="max-width:900px; padding:14px 18px; border-radius:var(--ds-radius-md);
                    background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container);
                    font-size:0.8125rem; line-height:1.5; color:var(--ds-color-text);">
          <q-icon name="info" size="16px" color="primary" class="q-mr-xs" style="vertical-align:-3px;" />
          <b>Event Manager is not on this screen.</b> It comes from the event record and differs from
          event to event — which is why the From/Reply setting reports the role rather than naming a
          mailbox it cannot know.
        </div>
      </div>`,
  }),
}
Sources.storyName = 'Where the addresses come from'
