/** Shared email rendering for Teams Mgmt Comms Phase 2.
 *
 *  Used by two places that must never disagree about what an email looks like:
 *    · First-Time Setup › Default Emails  — the seeded templates
 *    · Screens › Notification Preferences — the preview modal (DES-436 · P1-1)
 *
 *  Mustache braces are assembled by concatenation throughout: a literal {{ in a
 *  Vue template closes the interpolation early and fails the build.
 */
import { MERGE_VALUES } from './_tmc2fixtures'

export const OPEN = '{' + '{'
export const CLOSE = '}' + '}'

/** Swap every {{token}} for its demo value; unknown tokens are left visible so
 *  a typo in a template is obvious rather than silently blank. */
export function resolveMergeFields(text) {
  return text.replace(/\{\{([a-z_]+)\}\}/g, (m, name) =>
    Object.prototype.hasOwnProperty.call(MERGE_VALUES, name) ? MERGE_VALUES[name] : m)
}

/** Turn a template's paragraph array into what actually sends: resolved values,
 *  with paragraphs that resolved to nothing dropped entirely — which is how an
 *  empty {{noncompliance_policy}} or {{team_group_block_info}} disappears. */
export function renderBody(paragraphs, showRaw = false) {
  return paragraphs
    .map((p) => (showRaw ? p : resolveMergeFields(p)))
    .filter((p) => p.trim().length > 0)
}

export const PAPER = 'background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg); box-shadow:var(--ds-shadow-card); overflow:hidden;'
const META = 'font-size:0.8125rem; color:var(--ds-color-text-subtle);'

/** The email itself — envelope + branded body. The consuming setup must supply
 *  `fromLine`, `toLine`, `subjectLine`, `bodyLines`, `company` and `eventName`. */
export const emailPaper = `
  <div style="${PAPER}">
    <div style="padding:18px 24px; border-bottom:1px solid var(--ds-color-border-container); background:var(--ds-color-surface-sunken);">
      <div style="display:grid; grid-template-columns:64px 1fr; gap:6px 12px; ${META}">
        <span>From</span><span style="color:var(--ds-color-text);">{{ fromLine }}</span>
        <span>To</span><span style="color:var(--ds-color-text);">{{ toLine }}</span>
        <span>Subject</span><span style="color:var(--ds-color-text); font-weight:700;">{{ subjectLine }}</span>
      </div>
    </div>
    <div style="padding:28px 32px 32px;">
      <img :src="company.logo" :alt="company.name" style="height:30px; width:auto; margin-bottom:22px;" />
      <p v-for="(para, i) in bodyLines" :key="i"
        style="margin:0 0 14px; line-height:1.6; color:var(--ds-color-text); white-space:pre-wrap;">{{ para }}</p>
      <div style="margin-top:26px; padding-top:16px; border-top:1px solid var(--ds-color-border-container); ${META}">
        Sent by {{ company.name }} for {{ eventName }}.
      </div>
    </div>
  </div>`

/** The merge-field switch that sits above the email in both surfaces. */
export const mergeFieldToggle = `
  <q-toggle v-model="showRaw" color="primary" label="Show merge fields" dense />`
