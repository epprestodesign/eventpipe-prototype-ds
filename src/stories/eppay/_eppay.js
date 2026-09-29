/** EP Pay — shared scaffold.
 *
 *  EventPipe Pay is the payments product: a merchant-facing dashboard for
 *  balances, transactions, disputes and payouts.
 *
 *  The 09/28 captures (references/092826) are a reference for STRUCTURE only —
 *  what is on each screen and how it is arranged. Everything else comes from
 *  the design system, by way of **Teams Mgmt Comms Phase 2**, which is the
 *  reference implementation for what an EventPipe product screen looks like.
 *  EP Pay is built on the same three pieces that folder is built on:
 *
 *    1. `AppShell` for the chrome — the real EventPipe logo, the navy sidebar,
 *       the AppBar with its org switcher, search and user menu.
 *    2. `DsPageHeader` for the title row.
 *    3. `q-card flat bordered` + the EP_CARD/EP_H2 constants for the body.
 *
 *  EP Pay had its own sidebar and topbar and its own wordmark until 2026-09-29.
 *  All three are gone. A payments product that draws its own chrome stops
 *  looking like the platform it is part of, and every fix to the shell after
 *  that has to be made twice.
 */

import { computed, inject } from 'vue'
import AppShell from '../../components/AppShell.vue'
import DsPageHeader from '../../components/DsPageHeader.vue'
import DsPagination from '../../components/DsPagination.vue'
import DsActionMenu from '../../components/DsActionMenu.vue'
import { Notify } from 'quasar'

export const ORG = 'Team Travel Source'
export const USER = 'Mike Addesa'

/** Every place the signed-in user can be — the same list, in the same order,
 *  as the sign-in "Where to?" picker (Account V2 › Concepts › Passwordless ·
 *  Choose view), so the top-bar switcher and the picker never disagree. */
export const EP_ORGS = ['Team Travel Source', 'Summit Events Co.', 'Global Sports Group', 'EventPipe view']

/** Product nav, in the order the captures show it. */
export const EP_NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'balances', label: 'Balances', icon: 'attach_money' },
  { key: 'transactions', label: 'Transactions', icon: 'credit_card' },
  { key: 'disputes', label: 'Disputes', icon: 'warning_amber' },
  { key: 'customers', label: 'Customers', icon: 'group' },
  { key: 'payment-links', label: 'Payment Links', icon: 'link' },
  { key: 'products', label: 'Products', icon: 'inventory_2' },
  { key: 'subscriptions', label: 'Subscriptions', icon: 'autorenew' },
  { key: 'invoicing', label: 'Invoicing', icon: 'description' },
  { key: 'developer', label: 'Developer', icon: 'code' },
]

/** Pinned below the nav, same slot Company Settings occupies on the admin side. */
export const EP_FOOTER_ITEM = { key: 'settings', label: 'Account Settings', icon: 'settings' }

/* ---------------------------------------------------------------------------
 * Body constants — the same four Teams Mgmt Comms Phase 2 uses, with the same
 * values. Shared from here rather than redeclared per screen so a padding or
 * heading change lands on all eight screens at once.
 * ------------------------------------------------------------------------- */

/** Gap below a card in a stack of cards. */
export const EP_CARD = 'margin-bottom:20px;'
/** Card interior padding. */
export const EP_CARD_BODY = 'padding:26px 30px;'
/** Heading inside a card. */
export const EP_H2 = 'font-size:1.0625rem; font-weight:700; color:var(--ds-color-text); margin-bottom:16px;'
/** Muted supporting text — labels, hints, secondary cell lines. */
export const EP_CAPTION = 'font-size:0.8125rem; color:var(--ds-color-text-subtle);'
/** Padding on the page itself, inside the shell's bleed content area. */
export const EP_PAGE = 'padding:26px 30px 48px;'

/** The page title row, as its own white card on the canvas.
 *
 *  This is the shape Teams Mgmt Comms Phase 2 uses: a bordered white card
 *  holding the title (and any tabs) sitting on the grey canvas, with the body
 *  cards below it. EP Pay used to set its titles bare on the canvas at
 *  1.5rem — smaller than every other page in the platform and on a surface no
 *  other page puts a title on.
 *
 *  `actions` is markup for the right-hand controls; `tabs` is markup rendered
 *  under the title, for the screens that have a tab bar. `badge` puts a
 *  DsPageHeader badge beside the title — used to label concept screens so a
 *  screenshot can never be mistaken for specified product.
 *
 *  The title is interpolated into an HTML attribute, so a double quote in it
 *  would end the attribute and silently break the whole template — these are
 *  runtime-compiled strings, so the result is a blank screen with no error.
 *  No caller does that today; escaping it costs nothing and removes the trap.
 */
export const epHeader = (title, { actions = '', tabs = '', badge = '', badgeColor = 'grey-7' } = {}) => `
  <q-card flat bordered style="${EP_CARD}">
    <q-card-section style="padding:${tabs ? '22px 30px 0' : '22px 30px'};">
      <ds-page-header title="${String(title).replace(/"/g, '&quot;')}"${badge ? ` badge="${String(badge).replace(/"/g, '&quot;')}" badge-color="${badgeColor}"` : ''}>
        ${actions ? `<template #actions>${actions}</template>` : ''}
      </ds-page-header>
      ${tabs}
    </q-card-section>
  </q-card>`

/** A body card. `body` is the markup inside it; `style` appends to the card. */
export const epCard = (body, style = '') => `
  <q-card flat bordered style="${EP_CARD} ${style}">
    <q-card-section style="${EP_CARD_BODY}">
      ${body}
    </q-card-section>
  </q-card>`

/* Screens here are runtime-compiled template strings; when one fails Vue
 * renders nothing and logs to the console, which reads as a blank story. The
 * shell renders the error instead. Same guard as the design-request folders. */
const fatalTemplate = `
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

/** Wrap `slot` in the EP Pay chrome. `active` is an EP_NAV key.
 *
 *  Same contract and same shape as Teams Mgmt Comms' `tmc2Page()` — `bleed`,
 *  because these are full pages that fill the content area rather than sitting
 *  on the elevated panel. */
export function epPage({ active = 'dashboard', org = ORG, user = USER, components = {}, setup = () => ({}), slot = '' }) {
  const pageTemplate = `
    <div class="eppay" style="height:100vh" @ds-action-select="onActionSelect">
      <app-shell :items="nav" :footer-item="footerItem" active="${active}"
        :org="shellOrg" :user="shellUser" :orgs="orgs" @update:org="onOrgChange"
        bleed @navigate="onNavigate">
        ${slot}
      </app-shell>
    </div>`
  return {
    render: (args) => ({
      // DsPagination is registered for every EP Pay screen: all paged tables
      // use the one design-system pager (Components › Navigation › Pagination).
      components: { AppShell, DsPageHeader, DsPagination, DsActionMenu, ...components },
      setup: () => {
        try {
          /* An app can provide('eppaySession', { org: Ref, user: Ref }) — the
             standalone prototype does, so the org picked at sign-in shows in
             every screen's top bar and switching it there sticks. Storybook
             provides nothing, so each story keeps its fixed org and user. */
          const session = inject('eppaySession', null)
          const shellOrg = computed(() => session?.org?.value || org)
          const shellUser = computed(() => session?.user?.value || user)
          const onOrgChange = (v) => { if (session?.org) session.org.value = v }
          /* Every DsActionMenu on the page reports here. An item with `to`
             opens that screen (in the prototype; in Storybook each screen
             stands alone, so it says where it would go). Copy and confirmed
             items were already handled by the menu; the rest have no screen
             yet and say so briefly. */
          const onActionSelect = (e) => {
            const item = e.detail || {}
            if (item.handled === 'copy') return
            if (item.to && session) return onNavigate(item.to)
            const message = item.to ? `Opens ${item.label.toLowerCase()}`
              : item.handled === 'confirm' ? `${item.label} — done (prototype)` : `Prototype: ${item.label}`
            Notify.create({ message, timeout: 1600 })
          }
          return { fatal: '', nav: EP_NAV, footerItem: EP_FOOTER_ITEM, onNavigate, orgs: EP_ORGS, shellOrg, shellUser, onOrgChange, onActionSelect, ...setup(args) }
        } catch (err) {
          return { fatal: 'setup() threw:\n\n' + (err && err.stack ? err.stack : String(err)) }
        }
      },
      template: `
        <template v-if="fatal">${fatalTemplate}</template>
        <template v-else>${pageTemplate}</template>`,
    }),
  }
}

/** Sidebar clicks. A Vue `emit` does not bubble as a DOM event, so the
 *  standalone prototype could never have heard one by delegation — it re-emits
 *  as a real bubbling CustomEvent, which the prototype listens for. In
 *  Storybook nothing is listening and each screen stands alone, which is the
 *  behaviour a story wants anyway. */
function onNavigate(key) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('eppay:navigate', { detail: key }))
}

/** A login/onboarding surface: centred card, no chrome, on the dark ground.
 *  The ground is the design system's own app-chrome navy — the same surface the
 *  sidebar is painted in — so signing in and being signed in are visibly the
 *  same product. The card on it is white, so the screens using this ground
 *  carry the full-colour wordmark rather than the reversed one. */
export function epAuthPage({ components = {}, setup = () => ({}), slot = '' }) {
  return {
    render: (args) => ({
      components,
      setup: () => ({ ...setup(args) }),
      template: `
        <div class="eppay" style="min-height:100vh; background:var(--ds-color-surface-sidebar);
                    display:flex; align-items:center; justify-content:center; padding:40px 20px;">
          ${slot}
        </div>`,
    }),
  }
}

/* ---------------------------------------------------------------------------
 * Fixtures — one merchant, one set of numbers, used by every screen so the
 * product reads as one account rather than a set of unrelated mockups.
 * ------------------------------------------------------------------------- */

/* `value`/`prev`/`delta`/`spark` are the original display strings; the numeric
   `amount`/`previousAmount`/`trend`/`trendPrevious` (10 buckets across the day,
   Aug 20, 2026 vs Aug 20, 2025) are what DsMetricCard formats and compares. */
export const DASHBOARD_STATS = [
  { key: 'gross', label: 'Gross Volume', value: '$2,089.00', unit: 'USD', prev: '$1,829.25 previous year', delta: '14.2%', spark: [0, 0, 0, 0, 3, 0, 9, 0, 0, 0],
    amount: 2089.00, previousAmount: 1829.25, trend: [0, 0, 0, 0, 489.00, 0, 1600.00, 0, 0, 0], trendPrevious: [0, 0, 0, 640.25, 0, 0, 0, 1189.00, 0, 0] },
  { key: 'success', label: 'Successful Transactions', value: '2', prev: '2 previous year', delta: '13.7%', spark: [0, 0, 0, 6, 0, 0, 8, 0, 0, 0],
    amount: 2, previousAmount: 2, trend: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0], trendPrevious: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0] },
  { key: 'payouts', label: 'Payouts', value: '$2,028.42', unit: 'USD', prev: '$1,798.24 previous year', delta: '12.8%', spark: [0, 0, 0, 0, 4, 0, 9, 0, 0, 0],
    amount: 2028.42, previousAmount: 1798.24, trend: [0, 0, 0, 0, 474.82, 0, 1553.60, 0, 0, 0], trendPrevious: [0, 0, 0, 622.70, 0, 0, 0, 1175.54, 0, 0] },
  { key: 'avgspend', label: 'Average Customer Spend', value: '$1,044.50', unit: 'USD', prev: '$1,038.27 previous year', delta: '0.6%', spark: [0, 0, 0, 0, 5, 0, 9, 0, 0, 0],
    // Running average: null until the first sale — no customers yet is "no average", not $0.
    amount: 1044.50, previousAmount: 1038.27, trend: [null, null, null, null, 489.00, 489.00, 1044.50, 1044.50, 1044.50, 1044.50], trendPrevious: [null, null, null, 1012.40, 1012.40, 1012.40, 1012.40, 1038.27, 1038.27, 1038.27] },
  { key: 'dispvol', label: 'Dispute Volume', value: '$0.00', unit: 'USD', prev: '$0.00 previous year', delta: '0.0%', spark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    amount: 0, previousAmount: 0, trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], trendPrevious: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { key: 'dispcount', label: 'Dispute Count', value: '0', prev: '0 previous year', delta: '0.0%', spark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    amount: 0, previousAmount: 0, trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], trendPrevious: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
]

export const BALANCE_SUMMARY = {
  total: '$2,389.12',
  totalAmount: 2389.12,
  items: 9,
  rows: [
    { key: 'available', label: 'Available', items: 4, amount: '$1,204.55', value: 1204.55, tone: 'positive', icon: 'check_circle' },
    { key: 'soon', label: 'Available Soon', items: 3, amount: '$842.30', value: 842.30, tone: 'warning', icon: 'schedule' },
    { key: 'held', label: 'Held', items: 2, amount: '$342.27', value: 342.27, tone: 'negative', icon: 'lock' },
  ],
}

export const PAYOUTS = [
  { status: 'In Transit', id: 'PO-2026-1264', amount: '$5,825.80', type: 'Deposit', account: 'Chase Bank', accountSub: '121000248 · ••••4321', accountIcon: 'account_balance', created: 'Created Aug 17, 2026', settled: 'Expected Aug 19, 2026' },
  { status: 'Paid', id: 'PO-2026-1257', amount: '$6,180.35', type: 'Deposit', account: 'Virtual Card', accountSub: 'Card ending in (8180)', accountIcon: 'credit_card', created: 'Created Aug 10, 2026', settled: 'Paid Aug 12, 2026' },
  { status: 'Paid', id: 'PO-2026-1250', amount: '$4,605.70', type: 'Deposit', account: 'Virtual Card', accountSub: 'Card ending in (5751)', accountIcon: 'credit_card', created: 'Created Aug 3, 2026', settled: 'Paid Aug 5, 2026' },
  { status: 'Failed', id: 'PO-2026-1243', amount: '$7,940.05', type: 'Deposit', account: 'Chase Bank', accountSub: '121000248 · ••••4321', accountIcon: 'account_balance', created: 'Created Jul 27, 2026', settled: 'Not paid' },
  { status: 'Paid', id: 'PO-2026-1236', amount: '−$310.25', type: 'Withdrawal', account: 'Chase Bank', accountSub: '121000248 · ••••4321', accountIcon: 'account_balance', created: 'Created Jul 20, 2026', settled: 'Paid Jul 22, 2026' },
  { status: 'Paid', id: 'PO-2026-1229', amount: '$6,875.90', type: 'Deposit', account: 'Chase Bank', accountSub: '121000248 · ••••4321', accountIcon: 'account_balance', created: 'Created Jul 13, 2026', settled: 'Paid Jul 15, 2026' },
  { status: 'Paid', id: 'PO-2026-1222', amount: '$4,130.45', type: 'Deposit', account: 'Virtual Card', accountSub: 'Card ending in (8180)', accountIcon: 'credit_card', created: 'Created Jul 6, 2026', settled: 'Paid Jul 8, 2026' },
  { status: 'Paid', id: 'PO-2026-1215', amount: '−$845.60', type: 'Withdrawal', account: 'Chase Bank', accountSub: '121000248 · ••••4321', accountIcon: 'account_balance', created: 'Created Jun 29, 2026', settled: 'Paid Jul 1, 2026' },
  { status: 'Paid', id: 'PO-2026-1208', amount: '$5,735.10', type: 'Deposit', account: 'Chase Bank', accountSub: '121000248 · ••••4321', accountIcon: 'account_balance', created: 'Created Jun 22, 2026', settled: 'Paid Jun 24, 2026' },
  { status: 'Paid', id: 'PO-2026-1201', amount: '$7,215.50', type: 'Deposit', account: 'Chase Bank', accountSub: '121000248 · ••••4321', accountIcon: 'account_balance', created: 'Created Jun 15, 2026', settled: 'Paid Jun 17, 2026' },
]

/** Status → chip tone. One mapping, so a status never reads two ways. */
export const STATUS_TONE = {
  Paid: 'positive', Success: 'positive', Won: 'positive', Succeeded: 'positive',
  'In Transit': 'warning', Pending: 'warning', Disputed: 'warning',
  Failed: 'negative', Lost: 'negative', 'Evidence Needed': 'negative',
  'Refunded: Partial': 'info', Refunded: 'info',
}

/** Tone → the DS status pair. A tone is always a background *and* the text
 *  colour the design system guarantees stays readable on it, so the two can
 *  never be picked apart. `neutral` is the fallback for a label that carries no
 *  status at all (the "All" filter), which is why it is a plain sunken grey. */
export const TONE_TINT = {
  positive: { bg: 'var(--ds-color-background-success)', fg: 'var(--ds-color-text-success)' },
  warning: { bg: 'var(--ds-color-background-warning)', fg: 'var(--ds-color-text-warning)' },
  negative: { bg: 'var(--ds-color-background-danger)', fg: 'var(--ds-color-text-danger)' },
  info: { bg: 'var(--ds-color-background-info)', fg: 'var(--ds-color-text-info)' },
  neutral: { bg: 'var(--ds-color-surface-sunken)', fg: 'var(--ds-color-text)' },
}

/** The tint a status wears, resolved through STATUS_TONE. Lives here rather
 *  than in each screen so "Disputed" cannot be amber on one page and red on
 *  the next. */
export const tintFor = (status) => TONE_TINT[STATUS_TONE[status] || 'neutral']

const CHIP_BASE = 'display:inline-block; padding:3px 10px; border-radius:var(--ds-radius-sm);'
  + ' font-size:0.8125rem; font-weight:700; white-space:nowrap;'

/** Inline style for a soft chip in a given tone. */
export const toneChip = (tone) => {
  const t = TONE_TINT[tone] || TONE_TINT.neutral
  return `${CHIP_BASE} background:${t.bg}; color:${t.fg};`
}

/** The same chip, addressed by status. Every EP Pay table renders its status
 *  column through this, so the ledger, the dispute queue and the webhook log
 *  all say "Failed" the same way. */
export const statusChip = (status) => toneChip(STATUS_TONE[status] || 'neutral')

/** Card networks and wallets are third-party brands, so their marks are drawn
 *  as neutral DS chips rather than in each brand's own colour: Klarna pink and
 *  Amex blue are not ours to spend, and in a status column they would compete
 *  with the tones that do carry meaning. */
export const BRAND_CHIP = 'display:inline-block; padding:2px 7px; border-radius:var(--ds-radius-sm);'
  + ' font-size:0.6875rem; font-weight:700; letter-spacing:0.03em;'
  + ' background:var(--ds-color-background-neutral); color:var(--ds-color-text);'
