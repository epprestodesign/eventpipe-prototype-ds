/** Teams Mgmt Comms Phase 2 / First-Time Setup / Default Emails.
 *
 *  The three templates every customer is seeded with (DES-427 · P0-3), rendered
 *  as the team receives them. Each story shows the email itself plus the default
 *  configuration the spec assigns it.
 *
 *  Toggle "Show merge fields" to switch between the sent email and the template
 *  source, so the copy and the variables can be reviewed separately.
 */
import { ref, computed } from 'vue'
import { COMPANY, EVENT, DEFAULT_EMAILS, MERGE_VALUES, FROM_ADDRESS_RESOLVED } from './_tmc2fixtures'
import { emailPaper, mergeFieldToggle, renderBody, resolveMergeFields, OPEN, CLOSE } from './_tmc2email'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 2/First-Time Setup/Default Emails',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: `
**[DES-427 · P0-3](https://linear.app/eventpipe/issue/DES-427)** — the three
templates seeded into every account, shown as the team receives them.

Flip **Show merge fields** on any story to see the template source instead of the
rendered email, so wording and variables can be reviewed separately. Every
variable used is one defined in **[DES-430 · P0-6](https://linear.app/eventpipe/issue/DES-430)**.

| Story | Trigger | Recipients |
| --- | --- | --- |
| **Welcome Email** | Once, when a team first appears on the event | Team Housing Contact |
| **Compliance Reminder** | Weekly (Mon), 200 days out → event start | Team Housing Contact + Group Block Creators |
| **Previously Compliant Notice** | Once, when a compliant team drops below | Team Housing Contact + Group Block Creators |

## ⚠️ The copy is draft

The spec records all three bodies as *"Pending Default Template Body"*, and
**[DES-447](https://linear.app/eventpipe/issue/DES-447)** assigns the real wording
to Scott. What is written here is a **starting point for that conversation**, not
approved copy. It was drafted to be structurally correct — right variables, right
tone, right order of information — so the shape can be reviewed while the wording
is settled.

Two copy decisions worth a look:

- **\`{{team_group_block_info}}\` and \`{{noncompliance_policy}}\` sit on their own
  lines.** Both can return nothing (no open blocks; no policy entered), and both
  return multi-sentence text when populated. Giving them their own paragraph is
  what lets them vanish cleanly — inlining them mid-sentence would leave broken
  grammar when empty.
- **No greeting/sign-off block.** Adding "Best regards, the X team" would fight
  the From/Reply address setting (DES-429), which is where sender identity is
  meant to be expressed.
` } } },
}



const emailShell = `
  <div>
    <div class="row items-center q-gutter-md q-mb-md" style="max-width:680px; margin:0 auto 16px;">
      ${mergeFieldToggle}
      <q-chip dense outline color="warning" text-color="warning" icon="edit_note" label="Draft copy — pending DES-447" />
    </div>

    <div style="max-width:680px; margin:0 auto;">${emailPaper}</div>

    <q-card flat bordered style="max-width:680px; margin:20px auto 0;">
      <q-card-section style="padding:20px 26px;">
        <div class="text-primary text-weight-bold q-mb-sm">Default configuration</div>
        <div style="display:grid; grid-template-columns:minmax(180px,auto) 1fr; gap:8px 20px;">
          <template v-for="s in settings" :key="s.label">
            <span style="font-size:0.8125rem; color:var(--ds-color-text-subtle);">{{ s.label }}</span>
            <span style="font-size:0.875rem;">{{ s.value }}</span>
          </template>
        </div>
      </q-card-section>
    </q-card>
  </div>`

function emailStory(key) {
  const tpl = DEFAULT_EMAILS.find((e) => e.key === key)
  return {
    render: () => ({
      setup() {
        const showRaw = ref(false)
        const bodyLines = computed(() => renderBody(tpl.body, showRaw.value))
        const subjectLine = computed(() => (showRaw.value ? tpl.subject : resolveMergeFields(tpl.subject)))
        const toLine = computed(() =>
          showRaw.value ? OPEN + 'team_contact_email' + CLOSE : MERGE_VALUES.team_contact_email)
        return {
          // Seeded copy, never an edited draft, so emailPaper uses bodyLines.
          showRaw, bodyLines, bodyHtml: null, subjectLine, toLine,
          fromLine: FROM_ADDRESS_RESOLVED['Event Manager'],
          company: COMPANY,
          eventName: EVENT.name,
          settings: tpl.settings,
        }
      },
      template: emailShell,
    }),
  }
}

/** Sent once, when a team first appears on the event. */
export const WelcomeEmail = emailStory('welcome')

/** The recurring nudge — weekly on Monday, from 200 days out to event start. */
export const ComplianceReminder = emailStory('compliance-reminder')

/** Sent when a team that had met its requirement falls back below it. */
export const PreviouslyCompliantNotice = emailStory('previously-compliant')

/* A ComplianceAchieved story stood here until 2026-08-11. That template is out
 * of scope for this phase, so the copy and the story went with it. */
