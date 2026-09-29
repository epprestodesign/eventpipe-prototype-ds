/** EP Pay / Screens / 07 · Merchant Application.
 *
 *  The onboarding wizard a merchant completes before EventPipe will pay them
 *  out — four steps (DBA → Legal → Owner/Officer → Banking) and a confirmation.
 *  It is the thing the dashboard banner in Screens › 02 points at.
 *
 *  Three decisions worth explaining:
 *
 *  1. It is a full-screen surface here, not a panel. In the captures the wizard
 *     slides over the dashboard as a right-hand overlay, but every pixel of
 *     design intent lives inside the card — the dashboard behind it is inert and
 *     half-covered. Showing it full-screen makes the steps reviewable at the
 *     size they were drawn; the overlay is a presentation detail of the host
 *     page, not of this screen.
 *
 *  2. There is no app shell — no sidebar, no AppBar. Every other EP Pay screen
 *     wears it; a wizard is a focused task surface, and the merchant filling
 *     this in has nowhere else to be until it is submitted. The only way out is
 *     the close button above the card, which is why it is there.
 *
 *  3. `epAuthPage` is not reused. It puts the card on the DS app-chrome navy,
 *     and this surface sits on the light canvas — a form this long needs the
 *     page to recede, not to frame it. The local wrapper below carries the same
 *     `.eppay` scope and the same setup() guard — without the guard a typo in a
 *     template string renders as a silently blank story.
 *
 *  4. The step header is data-driven (`steps(current)`) rather than written out
 *     per story. Four steps drawn five different ways by hand is four chances
 *     for the completed/current/upcoming rules to drift apart.
 *
 *  Field copy, placeholders and the filler values ("sdfsd", "dfds sdsdf") are
 *  transcribed from the captures rather than tidied up — they are what the
 *  source prototype shows, and inventing nicer sample data would quietly change
 *  what is being reviewed. Colour is the exception: the captures are structure
 *  only, and every colour, radius and control size here is the design system's.
 */
import { ref, isRef, onMounted, onBeforeUnmount } from 'vue'
import { EP_CAPTION, EP_CARD_BODY, EP_H2 } from './_eppay'
import DsInput from '../../components/DsInput.vue'
import DsSelect from '../../components/DsSelect.vue'
import logo from '../../assets/logo/eventpipe-logo.svg'

export default {
  title: 'EP Pay/Screens/07 · Merchant Application',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The EP Pay merchant onboarding wizard. Four steps — Doing Business As, Legal, Owner/Officer, Banking — then a submission confirmation. The 09/28 captures set the structure; the fields, colour and control sizes are the design system\'s.',
      },
    },
  },
}

/* ---------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */

/** Abbreviations only, as the captures show them in the State select. */
const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL',
  'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT',
  'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

const STRUCTURES = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company (LLC)',
  'C Corporation',
  'S Corporation',
  'Non-Profit',
]

const ROLES = ['Owner', 'Officer', 'Director', 'Executive']

/** The captures use native selects, whose "Select state" / "Select role" prompt
 *  is a real first option rather than a placeholder — and QSelect only paints a
 *  placeholder in its searchable mode, so modelling it as an option is both
 *  closer to the reference and the only thing that shows up at all. */
const prompted = (prompt, list) => [prompt, ...list]

const STEP_LABELS = ['DBA', 'Legal', 'Owner/Officer', 'Banking']

/** Resolve the stepper's three states into the values the template binds, so
 *  the rules live in one place instead of in five hand-drawn headers. */
function steps(current) {
  return STEP_LABELS.map((label, i) => {
    const state = i < current ? 'done' : i === current ? 'current' : 'todo'
    const todo = state === 'todo'
    return {
      key: label,
      label,
      n: String(i + 1),
      done: state === 'done',
      // Reached steps are brand-filled, unreached ones are plain neutral — the
      // same selected/unselected pair the rest of the product uses.
      bg: todo ? 'var(--ds-color-background-neutral)' : 'var(--ds-color-background-brand-bold)',
      fg: todo ? 'var(--ds-color-text-subtlest)' : 'var(--ds-color-text-inverse)',
      // The current step gets a soft halo — it is the only way to tell
      // "step 3 of 4, here" from "step 3, finished".
      ring: state === 'current' ? '0 0 0 5px var(--ds-palette-azure-100)' : 'none',
      labelColor: todo ? 'var(--ds-color-text-subtle)' : 'var(--ds-color-text-brand)',
      labelWeight: todo ? '400' : '700',
      line: todo ? 'var(--ds-color-border)' : 'var(--ds-color-background-brand-bold)',
    }
  })
}

/* ---------------------------------------------------------------------------
 * Chrome
 * ------------------------------------------------------------------------- */

const WORDMARK = `
  <!-- The real wordmark. An applicant is handing over a bank account and a tax
       ID on this screen, so the mark that tells them whose form it is has to be
       the one they already know. -->
  <div class="row items-center justify-center" style="margin-bottom:34px;">
    <img :src="logo" alt="EventPipe" style="width:190px; height:auto;" />
  </div>`

/* The connectors run circle-edge to circle-edge, so each step column is exactly
   the width of its circle and the label is absolutely centred beneath it. Laying
   the label out in flow instead pads the column out to the label's width, which
   leaves a gap between every line and the circle it should be touching. */
const STEPPER = `
  <div style="display:flex; align-items:flex-start; justify-content:center; max-width:820px;
              margin:0 auto 32px; padding:0 70px 34px;">
    <template v-for="(s, i) in steps" :key="s.key">
      <div v-if="i" :style="{ flex:'1', height:'2px', marginTop:'22px', background:s.line }"></div>
      <div style="position:relative; flex:none; width:46px;">
        <div :style="{ width:'46px', height:'46px', borderRadius:'50%', display:'flex',
                       alignItems:'center', justifyContent:'center', fontWeight:'700',
                       fontSize:'1rem', background:s.bg, color:s.fg, boxShadow:s.ring }">
          <q-icon v-if="s.done" name="check" size="24px" />
          <span v-else>{{ s.n }}</span>
        </div>
        <div :style="{ position:'absolute', top:'57px', left:'50%', transform:'translateX(-50%)',
                       whiteSpace:'nowrap', fontSize:'0.9375rem',
                       color:s.labelColor, fontWeight:s.labelWeight }">
          {{ s.label }}
        </div>
      </div>
    </template>
  </div>`

/** A form section title, in the platform's card heading (`EP_H2`). `right`
 *  takes the "Same as DBA Details" style control that sits opposite it on the
 *  Legal step.
 *
 *  It was an uppercase brand caption over a 3px brand underline until
 *  2026-09-29 — a heading treatment nothing else in the product uses, and one
 *  that made a form section look like a selected tab. The hairline under the
 *  row stays: the whole wizard step is one card, so this rule is what separates
 *  one section of the form from the next.
 */
const sectionHeader = (title, right = '') => `
  <div class="row items-end no-wrap" style="gap:16px; border-bottom:1px solid var(--ds-color-border-container); margin:30px 0 22px;">
    <div style="${EP_H2} margin-bottom:10px;">${title}</div>
    <q-space />
    <div style="padding-bottom:8px;">${right}</div>
  </div>`

/** The bordered note at the top of each step. A brand edge by default; the
 *  Banking step asks for the warning edge because its content is a warning, not
 *  an explanation — the colour is carrying that difference, so it is the DS
 *  warning token rather than a second accent. */
const callout = (body, tone = 'brand') => `
  <q-card flat bordered
    style="border-left:4px solid ${tone === 'warning' ? 'var(--ds-color-background-warning-bold)' : 'var(--ds-color-background-brand-bold)'};">
    <q-card-section style="padding:18px 22px; color:var(--ds-color-text); line-height:1.6;">
      ${body}
    </q-card-section>
  </q-card>`

/* The DS status-panel recipe, same as Feedback › Banner: the tint, the bold
   token as a hairline edge, and the tone's own text colour. Deliberately not a
   q-card: a card is a white surface holding content, and this is a tinted
   message about the card it sits in. */
const ERROR_PANEL = `
  <div style="background:var(--ds-color-background-danger); border:1px solid var(--ds-color-background-danger-bold);
              border-radius:var(--ds-radius-md); padding:15px 20px; color:var(--ds-color-text-danger); margin:24px 0 4px;">
    Please complete the required fields marked with an asterisk.
  </div>`

/** Sample answers for each step — what Auto-fill writes. One merchant
 *  throughout (the org every other EP Pay screen belongs to), with obviously
 *  fake identifiers: the EIN, SSN, routing and account numbers are test
 *  values, never real ones. A value may be a function of the current value,
 *  which is how the agreements list gets every box ticked. */
const ADDRESS = (prefix) => ({
  [`${prefix}Addr1`]: '1200 Nicollet Mall', [`${prefix}Addr2`]: 'Suite 400',
  [`${prefix}City`]: 'Minneapolis', [`${prefix}State`]: 'MN', [`${prefix}Postal`]: '55403',
})
const FILL = {
  dba: {
    dbaName: 'Team Travel Source', ...ADDRESS('dba'),
    phone: '(612) 555-0142', website: 'https://www.teamtravelsource.com',
  },
  legal: {
    sameAsDba: false, legalName: 'Team Travel Source, LLC',
    structure: 'Limited Liability Company (LLC)', ein: '12-3456789', ...ADDRESS('legal'),
  },
  owner: {
    role: 'Owner', first: 'Jeffrey', last: 'Upp',
    ownerAddr1: '48 Linden Hills Blvd', ownerAddr2: '', ownerCity: 'Minneapolis',
    ownerState: 'MN', ownerPostal: '55410', ssn: '123-45-6789', ssnConfirm: '123-45-6789',
  },
  banking: {
    bankName: 'Chase Bank', routing: '121000248',
    account: '000123454321', accountConfirm: '000123454321',
    accountType: 'Checking', ownershipType: 'Business', payoutFrequency: 'Weekly',
    agreements: (list) => list.map((a) => ({ ...a, checked: true })),
  },
}

/** Back / forward footer. `back` is false on step 1 — there is nothing behind it.
 *  The buttons announce `eppay:wizard` (next / back) on window. In Storybook
 *  nothing listens and each step stays a standalone story; the standalone
 *  prototype listens and moves between steps. */
const footer = (next, back = true) => `
  <div class="row items-center no-wrap" style="margin-top:28px; padding-top:26px;
       border-top:1px solid var(--ds-color-border-container);">
    ${back ? '<q-btn unelevated no-caps label="Back" color="grey-3" text-color="grey-9" style="min-width:120px;" @click="wizardNav(\'back\')" />' : ''}
    <q-space />
    <q-btn unelevated no-caps color="primary" label="${next}" style="padding:0 22px; font-weight:700;" @click="wizardNav('next')" />
  </div>`

/* Same guard as _eppay.js: these screens are runtime-compiled template strings,
 * so a thrown setup() renders as an empty page rather than an error. */
const FATAL = `
  <div style="padding:32px; font-family:ui-monospace, SFMono-Regular, Menlo, monospace;">
    <div style="max-width:900px; border:2px solid var(--ds-color-background-danger-bold);
                border-radius:var(--ds-radius-lg); overflow:hidden;">
      <div style="background:var(--ds-color-background-danger-bold); color:var(--ds-color-text-inverse);
                  padding:12px 18px; font-weight:700;">
        This screen failed to render
      </div>
      <pre style="margin:0; padding:18px; white-space:pre-wrap; word-break:break-word;
                  font-size:0.8125rem; line-height:1.6;">{{ fatal }}</pre>
    </div>
  </div>`

/** The wizard surface: light canvas, Auto-fill + close above, one white card. */
function wizardPage({ components = {}, setup = () => ({}), body = '', autofill = true, fill = null }) {
  const page = `
    <div class="eppay" style="min-height:100vh; background:var(--ds-color-surface-canvas); padding:16px 22px 48px;">
      <div style="max-width:1180px; margin:0 auto;">
        <div class="row items-center justify-end no-wrap" style="gap:12px; margin-bottom:14px;">
          ${autofill ? '<q-btn outline no-caps color="primary" icon="bolt" label="Auto-fill" style="background:var(--ds-color-surface); font-weight:700;" @click="autofill" />' : ''}
          <q-btn round flat icon="close" color="grey-7" aria-label="Close"
            style="background:var(--ds-color-surface); border:1px solid var(--ds-color-border-container);" />
        </div>
        <q-card flat bordered>
          <q-card-section style="padding:38px 46px 46px;">
            ${WORDMARK}
            ${body}
          </q-card-section>
        </q-card>
      </div>
    </div>`
  return {
    render: (args) => ({
      components: { DsInput, DsSelect, ...components },
      setup: () => {
        try {
          // `logo` here rather than in each story's setup: every step of the
          // wizard renders WORDMARK, and none of them should have to remember it.
          const state = { fatal: '', logo, ...setup(args) }

          /* Auto-fill writes this step's FILL answers into its own refs. The
             button above the card calls it directly; the prototype's big
             fixed button reaches it through the `eppay:autofill` window event,
             since it lives outside the story and can't see these refs. */
          const autofill = () => {
            for (const [key, value] of Object.entries(fill || {})) {
              if (!isRef(state[key])) continue
              state[key].value = typeof value === 'function' ? value(state[key].value) : value
            }
          }
          const wizardNav = (dir) => {
            if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('eppay:wizard', { detail: dir }))
          }
          onMounted(() => window.addEventListener('eppay:autofill', autofill))
          onBeforeUnmount(() => window.removeEventListener('eppay:autofill', autofill))

          return { ...state, autofill, wizardNav }
        } catch (err) {
          return { fatal: 'setup() threw:\n\n' + (err && err.stack ? err.stack : String(err)) }
        }
      },
      template: `
        <template v-if="fatal">${FATAL}</template>
        <template v-else>${page}</template>`,
    }),
  }
}

/* ---------------------------------------------------------------------------
 * Shared form fragments — the address block repeats on three steps.
 * ------------------------------------------------------------------------- */

const GRID_2 = 'display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:20px 24px; margin-top:20px;'
/* City takes the whole left column while State and Postal Code split the right,
   so its edges must line up exactly with Address Line 1 / Address Line 2 above.
   That is four equal tracks with City spanning two — NOT 2fr 1fr 1fr, which
   looks equivalent but isn't: it has two column gaps where GRID_2 has one, so
   City came out 12px narrower than Address Line 1 and State started 12px left
   of Address Line 2. With four tracks and the same gap, span 2 = 2 tracks + 1
   gap = exactly one GRID_2 column. */
const GRID_3 = 'display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:20px 24px; margin-top:20px;'

const addressBlock = (prefix) => `
  <div style="${GRID_2}">
    <ds-input label="Address Line 1" required v-model="${prefix}Addr1" placeholder="Street address" />
    <ds-input label="Address Line 2" v-model="${prefix}Addr2" placeholder="Apt, suite, unit (optional)" />
  </div>
  <div style="${GRID_3}">
    <ds-input label="City" required v-model="${prefix}City" placeholder="City" style="grid-column:span 2;" />
    <ds-select label="State" required v-model="${prefix}State" :options="states" />
    <ds-input label="Postal Code" required v-model="${prefix}Postal" placeholder="Postal code" />
  </div>`

/* ---------------------------------------------------------------------------
 * Step 1 — Doing Business As
 * ------------------------------------------------------------------------- */

const DBA_BODY = `
  ${STEPPER}
  ${callout(`This is the information your customers know you by and would easily recognize.
             Make sure everything is accurate, including your customer service number and website.`)}
  ${sectionHeader('Doing Business As Details')}
  <ds-input label="DBA Name" required v-model="dbaName" placeholder="Enter DBA name" />
  ${addressBlock('dba')}
  <div style="margin-top:20px;">
    <ds-input label="Customer Service Phone" required v-model="phone" placeholder="(555)-555-5555" />
  </div>
  <div style="margin-top:20px;">
    <ds-input label="Website" required v-model="website" placeholder="https://example.com" />
  </div>
  ${footer('Enter Legal Details', false)}`

export const Step1Dba = wizardPage({
  fill: FILL.dba,
  setup: () => ({
    steps: steps(0),
    states: prompted('Select state', STATES),
    dbaName: ref(''),
    dbaAddr1: ref(''), dbaAddr2: ref(''), dbaCity: ref(''), dbaState: ref('Select state'), dbaPostal: ref(''),
    phone: ref(''), website: ref(''),
  }),
  body: DBA_BODY,
})
Step1Dba.storyName = 'Step 1 · DBA'

/* ---------------------------------------------------------------------------
 * Step 2 — Legal
 * ------------------------------------------------------------------------- */

const SAME_AS_DBA = `
  <q-checkbox v-model="sameAsDba" label="Same as DBA Details" color="primary" dense />`

/** The Business Structure cell, optionally wearing its open menu. The capture
 *  shows the OS-native select popup — which no component can reproduce, since
 *  the browser draws it outside the page — so this is a faithful stand-in
 *  anchored to the field, including the check beside the current value. */
const STRUCTURE_FIELD = `
  <div style="position:relative;">
    <ds-select label="Business Structure" required v-model="structure" :options="structures" />
    <div v-if="menuOpen" role="listbox"
      style="position:absolute; z-index:10; left:-10px; top:-96px; width:calc(100% + 20px);
             background:var(--ds-color-surface); border-radius:var(--ds-radius-md); padding:10px 0;
             border:1px solid var(--ds-color-border); box-shadow:var(--ds-shadow-3);">
      <div v-for="o in structureMenu" :key="o.label" class="row items-center no-wrap"
        style="padding:7px 20px; font-size:1.0625rem; gap:10px; color:var(--ds-color-text);">
        <span style="width:18px; display:inline-flex; justify-content:center;">
          <q-icon v-if="o.checked" name="check" size="18px" />
        </span>
        <span>{{ o.label }}</span>
      </div>
    </div>
  </div>`

const legalBody = (error) => `
  ${STEPPER}
  ${callout(`This is the information found on your tax and legal documents. It's critical that this
             data matches exactly what's on file, so have your documents handy to confirm.`)}
  ${sectionHeader('Legal Details', SAME_AS_DBA)}
  <ds-input label="Legal Name" required v-model="legalName" placeholder="Enter legal name" />
  <div style="${GRID_2}">
    ${STRUCTURE_FIELD}
    <ds-input label="Tax ID (EIN)" required v-model="ein" placeholder="XX-XXXXXXX" />
  </div>
  ${addressBlock('legal')}
  ${error ? ERROR_PANEL : ''}
  ${footer('Enter Owner/Officer Details')}`

/** "Select structure" leads the list as the empty choice, exactly as the native
 *  popup shows it — it is a real row a merchant can pick, not just a label. */
const structureMenu = (selected) =>
  ['Select structure', ...STRUCTURES].map((label) => ({ label, checked: label === selected }))

const legalState = ({ error = false, menuOpen = false } = {}) => () => ({
  steps: steps(1),
  states: prompted('Select state', STATES),
  structures: prompted('Select structure', STRUCTURES),
  structureMenu: structureMenu('Partnership'),
  menuOpen,
  sameAsDba: ref(false),
  legalName: ref('sdfsd'),
  structure: ref('Partnership'),
  ein: ref(error ? '00-0000000' : ''),
  legalAddr1: ref('SDF'), legalAddr2: ref('SDF'),
  legalCity: ref('SDF'), legalState: ref('SD'), legalPostal: ref('SDF'),
})

export const Step2Legal = wizardPage({
  fill: FILL.legal,
  setup: legalState(),
  body: legalBody(false),
})
Step2Legal.storyName = 'Step 2 · Legal'

export const Step2StructureOpen = wizardPage({
  fill: FILL.legal,
  setup: legalState({ menuOpen: true }),
  body: legalBody(false),
})
Step2StructureOpen.storyName = 'Step 2 · Legal structure open'

/** The wizard validates on advance, not on blur, so the message is a panel
 *  above the footer rather than per-field errors — that is what the capture
 *  shows, and it is why the asterisks are the only field-level cue. */
export const ValidationError = wizardPage({
  fill: FILL.legal,
  setup: legalState({ error: true }),
  body: legalBody(true),
})
ValidationError.storyName = 'Validation error'

/* ---------------------------------------------------------------------------
 * Step 3 — Owner/Officer
 * ------------------------------------------------------------------------- */

/** DsInput's password type already carries the show/hide eye. The lock caption
 *  is drawn here rather than passed as `hint` because the reference pairs it
 *  with an icon, which the field's plain-text hint slot cannot hold. */
const ssnField = (label, model) => `
  <div>
    <ds-input label="${label}" required type="password" v-model="${model}" placeholder="XXX-XX-XXXX" />
    <div class="row items-center no-wrap" style="gap:6px; margin-top:7px; ${EP_CAPTION}">
      <q-icon name="lock_outline" size="15px" />
      <span>This is encrypted and safely stored.</span>
    </div>
  </div>`

const OWNER_BODY = `
  ${STEPPER}
  ${callout(`We're required to verify the identity of anyone with 25% or greater ownership or control
             of the business. Have a government-issued ID handy — your information must match it exactly.
             <a href="#" class="eppay-link" style="font-weight:700;">Why do I need to provide this?</a>`)}
  ${sectionHeader('Owner/Officer Details')}
  <ds-select label="Role" required v-model="role" :options="roles" />
  <div style="${GRID_2}">
    <ds-input label="First Name" required v-model="first" placeholder="First name" />
    <ds-input label="Last Name" required v-model="last" placeholder="Last name" />
  </div>
  ${addressBlock('owner')}
  <div style="${GRID_2}">
    ${ssnField('Social Security Number', 'ssn')}
    ${ssnField('Confirm Social Security Number', 'ssnConfirm')}
  </div>
  <div class="row justify-end" style="margin-top:22px;">
    <q-btn unelevated no-caps color="primary" label="Save Person" style="padding:0 22px; font-weight:700;" />
  </div>
  ${footer('Enter Banking Details')}`

export const Step3Owner = wizardPage({
  fill: FILL.owner,
  setup: () => ({
    steps: steps(2),
    states: prompted('Select state', STATES),
    roles: prompted('Select role', ROLES),
    role: ref('Select role'),
    first: ref(''), last: ref(''),
    ownerAddr1: ref(''), ownerAddr2: ref(''),
    ownerCity: ref(''), ownerState: ref('Select state'), ownerPostal: ref(''),
    ssn: ref(''), ssnConfirm: ref(''),
  }),
  body: OWNER_BODY,
})
Step3Owner.storyName = 'Step 3 · Owner/Officer'

/* ---------------------------------------------------------------------------
 * Step 4 — Banking
 * ------------------------------------------------------------------------- */

/** The two blocks a merchant is agreeing to money terms in, lifted out of the
 *  plain form flow. The lift is all they need, so it is a neutral sunken panel:
 *  a tint in a status or brand colour would claim these terms are good news or
 *  an action, and they are neither. */
const tinted = (body, style = '') => `
  <q-card flat bordered style="background:var(--ds-color-surface-sunken); ${style}">
    <q-card-section style="${EP_CARD_BODY}">
      ${body}
    </q-card-section>
  </q-card>`

const BANKING_BODY = `
  ${STEPPER}
  ${callout(`
    <div class="row items-start no-wrap" style="gap:12px;">
      <q-icon name="warning_amber" size="22px" style="color:var(--ds-color-text-warning); margin-top:2px;" />
      <div>
        <div>To avoid possible issues with your payout please ensure the following:</div>
        <ul style="margin:10px 0 0; padding-left:20px; display:flex; flex-direction:column; gap:8px;">
          <li>The routing and account number are accurate.</li>
          <li>Your DBA or Legal name of <b>sdF</b> or <b>sdfsd</b> must be listed on your account.
              Personal bank accounts cannot be accepted for accounts that are businesses or non-profits.</li>
          <li>This account must allow for both deposits and withdrawals. If your bank account has a debit
              blocker please provide your bank with ACH Company ID <b>XXXXXXXXX</b>. This will allow EventPipe
              to withdrawal funds in the event you have a negative balance while still blocking other
              debit attempts.</li>
        </ul>
      </div>
    </div>`, 'warning')}
  ${sectionHeader('Banking Details')}
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px 24px;">
    <ds-input label="Bank Name" required v-model="bankName" placeholder="Bank name" />
    <ds-input label="Routing Number" required v-model="routing" placeholder="9-digit routing number" />
    <ds-input label="Account Number" required type="password" v-model="account" placeholder="Account number" />
    <ds-input label="Confirm Account Number" required type="password" v-model="accountConfirm" placeholder="Re-enter account number" />
    <ds-select label="Account Type" required v-model="accountType" :options="accountTypes" />
    <ds-select label="Ownership Type" required v-model="ownershipType" :options="ownershipTypes" />
  </div>

  ${tinted(`
    <div style="${EP_H2}">Payout Schedule</div>
    <div style="max-width:380px;">
      <ds-select v-model="payoutFrequency" :options="frequencies" />
    </div>
    <q-separator style="margin:18px 0 14px;" />
    <div style="color:var(--ds-color-text); margin-bottom:12px;">Choose a payout frequency to see when your funds will be paid out.</div>
    <div style="color:var(--ds-color-text-subtle); font-size:0.875rem; line-height:1.6;">
      <b>*Available funds</b> are settled payments that have finished processing and cleared any applicable
      hold or reserve period. Payments still processing, under dispute, or held in reserve are not included
      and will be released in a later payout.
    </div>`, 'margin-top:24px;')}

  ${tinted(`
    <div style="${EP_H2}">Agreements</div>
    <div style="display:flex; flex-direction:column; gap:4px;">
      <q-checkbox v-for="a in agreements" :key="a.id" v-model="a.checked" color="primary" dense>
        <span v-html="a.html" style="margin-left:6px; line-height:1.6;"></span>
      </q-checkbox>
    </div>`, 'margin-top:22px;')}

  ${footer('Submit Application')}`

const AGREEMENTS = [
  { id: 'pricing', html: 'I agree to the pricing of <b>3.00%</b> and <b>$0.25</b> per reservation booked and a <b>$25.00</b> fee for any returned bank payout.' },
  { id: 'reserve', html: 'I agree to a reserve amount of <b>$1,000.00</b>, to be collected before any payout is issued.' },
  { id: 'terms', html: 'I agree to EventPipe <a href="#" class="eppay-link">Terms of Use</a> &amp; <a href="#" class="eppay-link">Terms of Service</a>.' },
  { id: 'docs', html: 'I understand and agree additional documentation may be requested (Government Issued Identification, Business or Tax Documents, Voided Checks, Bank Statements).' },
]

export const Step4Banking = wizardPage({
  fill: FILL.banking,
  setup: () => ({
    steps: steps(3),
    bankName: ref(''), routing: ref(''),
    account: ref(''), accountConfirm: ref(''),
    accountType: ref('Select account type'), ownershipType: ref('Select ownership type'),
    payoutFrequency: ref('Select payout frequency'),
    accountTypes: prompted('Select account type', ['Checking', 'Savings']),
    ownershipTypes: prompted('Select ownership type', ['Business', 'Personal', 'Non-Profit']),
    frequencies: prompted('Select payout frequency', ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly']),
    agreements: ref(AGREEMENTS.map((a) => ({ ...a, checked: false }))),
  }),
  body: BANKING_BODY,
})
Step4Banking.storyName = 'Step 4 · Banking'

/* ---------------------------------------------------------------------------
 * Submitted
 * ------------------------------------------------------------------------- */

/** Four neutral facts and one warning. The warning is the DS warning tone
 *  rather than danger because nothing has gone wrong — payouts are simply not
 *  open yet — and the first row is success because it is the good news the
 *  merchant came for. The three remaining rows are plain neutral: they are
 *  information, and tinting them would make five rows all shout. */
const SUBMIT_ROWS = [
  { id: 'accept', icon: 'credit_card', tone: 'success', html: 'You can <b>start accepting payments right away</b> while verification is pending.' },
  { id: 'hours', icon: 'schedule', tone: 'plain', html: 'Verification can take up to <b>48 business hours</b>.' },
  { id: 'docs', icon: 'description', tone: 'plain', html: "If we're unable to verify your information, additional documentation may be requested." },
  { id: 'notify', icon: 'notifications_none', tone: 'plain', html: "You'll be notified once verification is complete or if additional documentation is needed." },
  { id: 'payouts', icon: 'warning_amber', tone: 'warning', html: 'Please note that payouts cannot occur until your information has been successfully verified.' },
]

/* Tint plus the tone's own icon colour; the edge stays a neutral hairline on
   every row so the tint alone carries which row means what.
   These stay divs: they are five rows of one list, and five q-cards would put
   five card shadows on what is a single block of text. */
const TONES = {
  success: { bg: 'var(--ds-color-background-success)', border: '1px solid var(--ds-color-border)', icon: 'var(--ds-color-text-success)', text: 'var(--ds-color-text)' },
  plain: { bg: 'var(--ds-color-surface-sunken)', border: '1px solid var(--ds-color-border)', icon: 'var(--ds-color-icon-subtle)', text: 'var(--ds-color-text)' },
  warning: { bg: 'var(--ds-color-background-warning)', border: '1px solid var(--ds-color-border)', icon: 'var(--ds-color-text-warning)', text: 'var(--ds-color-text)' },
}

const SUBMITTED_BODY = `
  <div style="max-width:880px; margin:0 auto;">
    <div class="row justify-center" style="margin:26px 0 22px;">
      <div style="width:112px; height:112px; border-radius:50%; background:var(--ds-color-background-success);
                  display:flex; align-items:center; justify-content:center;">
        <q-icon name="check" size="58px" style="color:var(--ds-color-text-success);" />
      </div>
    </div>

    <h1 style="font-size:2rem; font-weight:700; text-align:center; margin:0 0 26px; color:var(--ds-color-text);">
      Thank you for submitting your application!
    </h1>

    <div style="display:flex; flex-direction:column; gap:12px;">
      <div v-for="r in rows" :key="r.id" class="row items-center no-wrap"
        :style="{ gap:'14px', padding:'18px 20px', borderRadius:'var(--ds-radius-md)',
                  background:r.style.bg, border:r.style.border, color:r.style.text }">
        <q-icon :name="r.icon" size="22px" :style="{ color:r.style.icon }" />
        <span v-html="r.html" style="line-height:1.55;"></span>
      </div>
    </div>

    <div class="row justify-center" style="margin-top:30px;">
      <q-btn unelevated no-caps color="primary" label="Close" style="padding:0 30px; font-weight:700;" />
    </div>
  </div>`

/** No Auto-fill here — there is nothing left to fill in. */
export const Submitted = wizardPage({
  autofill: false,
  setup: () => ({ rows: SUBMIT_ROWS.map((r) => ({ ...r, style: TONES[r.tone] })) }),
  body: SUBMITTED_BODY,
})
Submitted.storyName = 'Submitted'
