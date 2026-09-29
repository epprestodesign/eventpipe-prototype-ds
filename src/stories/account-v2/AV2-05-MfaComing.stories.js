/** Account V2 — Flow 05 · MFA is coming (ENG-3044).
 *
 *  The heads-up staff get before emailed sign-in codes switch on. One reusable
 *  component, Av2BannerAnnouncement, shown in the two places the ticket names:
 *  the in-app header ("this is the one that matters") and the login page.
 *  Staff app only — bookers never see it.
 *
 *  Config, not code: the text, the MFA date, the learn-more link and whether
 *  the banner shows at all come from configuration in the real build. The
 *  values below are the demo config; changing BANNER changes every story.
 */
import { ref } from 'vue'
import { page } from '../pages/_shell'
import { authStep, ACCOUNT, SPEC } from './_account'
import DsInput from '../../components/DsInput.vue'
import DsPageToolbar from '../../components/DsPageToolbar.vue'
import DsStatus from '../../components/DsStatus.vue'
import DsStat from '../../components/DsStat.vue'
import Av2BannerAnnouncement from './components/Av2BannerAnnouncement.vue'

/* The demo config. `enabled` is the on/off switch the ticket asks for; when it
   is false the consumer renders nothing. The date is a placeholder until the
   rollout date is set. */
const BANNER = {
  enabled: true,
  title: 'Sign-in codes are coming.',
  text: "Starting {date}, you'll confirm each sign-in with a 6-digit code we email you. Trusted devices skip it for 30 days.",
  date: '2026-11-02',
  learnMoreHref: '#learn-more',
  learnMoreLabel: 'Learn more',
}

export default {
  title: 'Account V2/Flows/05 · MFA is coming',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**[ENG-3044](${SPEC.mfaBanner})** — a reusable announcement banner telling staff
that emailed sign-in codes ([ENG-3037](${SPEC.mfaChallenge})) are coming, shown
in the in-app header and on the login page. Staff app only; bookers never see it.

**Config, not code.** Text, MFA date, learn-more link and on/off all come from
configuration. In the text, \`{date}\` is replaced with the configured date,
formatted long-form and set in bold — the date lives in one value. The copy here
is a draft; the date (November 2, 2026) is a placeholder.

**Component:** \`Av2BannerAnnouncement\` — props \`title\`, \`text\`, \`date\`,
\`learnMoreHref\`, \`learnMoreLabel\`, \`dismissible\`, \`icon\`, \`layout\`
(\`strip\` | \`inline\`); emits \`dismiss\`; \`aria-live="polite"\`. Built on
the DS **Banner** pattern (Components › Feedback & Status › Banner, Info
appearance) rather than **DsNotification**, which is a 440px floating card for
toasts and notification lists, not a header-width strip.

**Dismissal** is per user and persists across reload (ENG-3044). The component
only emits \`dismiss\`; the consumer stores it against the signed-in user. In
Storybook the × works but a reload brings the banner back.

**Deliberately left out:** the "Try the new login" link on the old login page
(ENG-3043 — the old page is not ours to design).
`,
      },
    },
  },
}

/* ---------------------------------------------------------------------------
 * In-app header. The Events list is the page behind it because it is the
 * first screen most staff land on; it is a trimmed copy of Pages › 02 Events.
 * ------------------------------------------------------------------------- */
const EVENTS = [
  { title: 'Bend Premier Cup | 2026', status: 'Active', location: 'Bend, OR', producer: '365 Sports Travel',
    dates: 'Fri, 07/10/2026 - Sun, 07/12/2026', stats: { res: 370, nights: 846, blocks: 64 } },
  { title: 'Knights | Show-Me State Games | 2026 | 1st weekend', status: 'Active', location: 'Columbia, MO', producer: '365 Sports Travel',
    dates: 'Fri, 07/17/2026 - Sun, 07/19/2026', stats: { res: 0, nights: 0, blocks: 0 } },
  { title: 'AT | Bend FC - Oregon Super Cup - 8/7-9', status: 'Cancelled', location: 'Bend, OR', producer: '365 Sports Travel',
    dates: 'Fri, 08/07/2026 - Sun, 08/09/2026', stats: { res: 0, nights: 0, blocks: 0 } },
]

const eventsBody = `
  <div style="padding:24px 28px 20px; background:var(--ds-color-surface);">
    <ds-page-toolbar title="Events" :count="106">
      <template #actions>
        <q-btn outline no-caps color="primary" label="Filter" />
        <q-btn unelevated no-caps color="primary" label="New Event" />
      </template>
    </ds-page-toolbar>
  </div>
  <div style="padding:20px 28px 28px; background:var(--ds-color-surface-sunken); min-height:100%;">
    <div class="column q-gutter-md">
      <div v-for="e in events" :key="e.title"
        style="display:flex; gap:24px; padding:24px 28px; background:var(--ds-color-surface);
               border:1px solid var(--ds-color-border-container); border-radius:var(--ds-radius-lg);">
        <div style="flex:1 1 50%; min-width:0;">
          <div class="row items-center q-gutter-sm">
            <a href="#" class="text-primary" style="text-decoration:none; font-size:1.25rem; font-weight:700;" @click.prevent>{{ e.title }}</a>
            <ds-status variant="pill" :label="e.status" />
          </div>
          <div style="color:var(--ds-color-text-subtle); margin:4px 0 8px;">{{ e.location }}</div>
          <div style="display:flex; gap:6px; font-size:0.9375rem;">
            <span style="font-weight:700;">Event Producer:</span>
            <span style="color:var(--ds-color-text-subtle);">{{ e.producer }}</span>
          </div>
          <div style="display:flex; gap:6px; font-size:0.9375rem; margin-top:2px;">
            <span style="font-weight:700;">Start/End Dates:</span>
            <span style="color:var(--ds-color-text-subtle);">{{ e.dates }}</span>
          </div>
        </div>
        <div style="flex:1 1 40%; display:grid; grid-template-columns:repeat(3,1fr); gap:16px 24px; align-content:start;">
          <ds-stat :value="e.stats.res" label="Total Reservations" />
          <ds-stat :value="e.stats.nights" label="Nights Booked" />
          <ds-stat :value="e.stats.blocks" label="Total Group Blocks" />
        </div>
      </div>
    </div>
  </div>`

/* The banner is composed at the top of the page slot, which in a bleed shell
   puts it directly under the AppBar and across the whole content column —
   AppShell and AppBar are untouched. In the real build it belongs in the
   shell itself, above the router view, so every staff page gets it once. */
const inAppPage = ({ dismissed = false } = {}) => page({
  active: 'events',
  user: ACCOUNT.name,
  components: { DsPageToolbar, DsStatus, DsStat, Av2BannerAnnouncement },
  setup: () => ({
    events: EVENTS,
    banner: BANNER,
    showBanner: ref(BANNER.enabled && !dismissed),
  }),
  slot: `
    <div style="display:flex; flex-direction:column; min-height:100%;">
      <av2-banner-announcement v-if="showBanner"
        layout="strip" icon="shield"
        :title="banner.title" :text="banner.text" :date="banner.date"
        :learn-more-href="banner.learnMoreHref" :learn-more-label="banner.learnMoreLabel"
        dismissible @dismiss="showBanner = false" />
      <div style="flex:1 1 auto; display:flex; flex-direction:column;">${eventsBody}</div>
    </div>`,
})

/** In-app header — the one that matters (ENG-3044). A full-width strip flush
 *  under the AppBar, above the page title, so it reads as part of the app
 *  chrome rather than as content of one page. Info tint, not warning: nothing
 *  is wrong yet, and a warning colour two months ahead teaches people to
 *  ignore the colour. Dismissible; the × works here. */
export const InAppHeader = inAppPage()
InAppHeader.storyName = 'In-app header'

/* ---------------------------------------------------------------------------
 * Login page. A minimal sign-in card reproduced here rather than imported from
 * Flow 01, which is being rewritten; it follows ENG-3019's fields.
 * ------------------------------------------------------------------------- */

/** On the login page. The banner sits INSIDE the content column, between the
 *  title and the email field — not above the title or across the shell.
 *
 *  Why inside: the shell is the anti-phishing signal and every auth step shares
 *  its position and edges (the scaffold's rule 1). A banner above the column
 *  would push the step down on this one page and make the sign-in step look
 *  different from the code step that follows. Why below the title rather than
 *  at the top of the panel: the wordmark in the top bar is the first thing a
 *  user should see — it is how they know they are on the real site — and the
 *  announcement is about the action they are about to take, so it goes next
 *  to that action. The right panel shows the 'security' showcase, since the
 *  page is announcing sign-in codes.
 *
 *  Not dismissible here. Nobody is signed in yet, so there is no user to
 *  remember the dismissal against, and the inline banner is small enough not
 *  to need it. The in-app banner is the dismissible one. */
export const OnLoginPage = authStep({
  showcase: 'security',
  components: { DsInput, Av2BannerAnnouncement },
  setup: () => ({
    banner: BANNER,
    email: ref(ACCOUNT.email),
    password: ref(''),
  }),
  slot: `
    <h1 class="av2__title">Sign in to EventPipe</h1>

    <av2-banner-announcement v-if="banner.enabled"
      class="q-mt-sm"
      layout="inline" icon="shield" :dismissible="false"
      :title="banner.title" :text="banner.text" :date="banner.date"
      :learn-more-href="banner.learnMoreHref" :learn-more-label="banner.learnMoreLabel" />

    <div class="column q-gutter-y-md q-mt-md">
      <ds-input label="Email" type="email" v-model="email" placeholder="you@company.com" />
      <div>
        <ds-input label="Password" type="password" v-model="password" />
        <div style="display:flex; justify-content:flex-end; margin-top:6px;">
          <a href="#" style="font-size:0.875rem; font-weight:500; color:var(--ds-color-link); text-decoration:none;">Forgot password?</a>
        </div>
      </div>
    </div>

    <div class="av2__actions">
      <q-btn unelevated no-caps color="primary" class="av2__primary" label="Sign in" />
    </div>`,
})
OnLoginPage.storyName = 'On the login page'

/** Dismissed — the in-app header after the × is pressed. The page content
 *  moves up into the strip's space; nothing else changes. Dismissal persists
 *  for that user across reloads in the real build. */
export const Dismissed = inAppPage({ dismissed: true })
Dismissed.storyName = 'Dismissed'
