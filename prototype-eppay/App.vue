<script setup>
/* EP Pay prototype — one clickable app over the Storybook screens.
 *
 * The screens are not duplicated here. Each Storybook story is a
 * `{ render(args) }` object returning a Vue component definition, so this app
 * imports the same story modules and renders their output directly. One source
 * of truth: edit a story and this app changes with it, with no second copy to
 * keep in sync.
 *
 * Navigation is the one thing stories cannot do — in Storybook each screen
 * stands alone, so the sidebar's links are inert. Here they route, via the
 * `navigate` event the sidebar emits.
 */
import { computed, inject, markRaw, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EP_NAV, EP_ORGS } from '../src/stories/eppay/_eppay'

// Sign-in is the Account V2 passwordless concept (email → code → Where to?),
// chosen by the user 2026-09-29; it replaces EP Pay's old Merchant/EP View login.
import * as SignIn from '../src/stories/account-v2/AV2-x-ChooseView.stories'
import * as Dashboard from '../src/stories/eppay/EP-02-Dashboard.stories'
import * as Balances from '../src/stories/eppay/EP-03-Balances.stories'
import * as Transactions from '../src/stories/eppay/EP-04-Transactions.stories'
import * as Disputes from '../src/stories/eppay/EP-05-Disputes.stories'
import * as Developer from '../src/stories/eppay/EP-06-Developer.stories'
import * as Application from '../src/stories/eppay/EP-07-Application.stories'
// The five unbuilt areas are concepts (no requirements exist), one file each.
import * as Customers from '../src/stories/eppay/EP-08-Customers.stories'
import * as PaymentLinks from '../src/stories/eppay/EP-08-PaymentLinks.stories'
import * as Products from '../src/stories/eppay/EP-08-Products.stories'
import * as Subscriptions from '../src/stories/eppay/EP-08-Subscriptions.stories'
import * as Invoicing from '../src/stories/eppay/EP-08-Invoicing.stories'

/** Pick the first export that looks like a story, so this keeps working if an
 *  agent renames `Default` to something more descriptive. */
function firstStory(mod, preferred) {
  const pick = (preferred && mod[preferred]) ||
    Object.entries(mod).find(([k, v]) => k !== 'default' && v && typeof v.render === 'function')?.[1]
  return pick ? markRaw(pick.render({})) : null
}

/** Route key → screen. Keys match EP_NAV so the sidebar can drive it. */
const SCREENS = {
  // Sign-in steps. The email and code steps open pre-filled so a walkthrough
  // is two clicks; typing still works.
  login: () => firstStory(SignIn, 'EmailEntered'),
  'login/2': () => firstStory(SignIn, 'CodeEntered'),
  'login/3': () => firstStory(SignIn, 'WhereToStaff'),
  /* Chart choices for the prototype (the chart concepts are Storybook-only
     proposals; only these three earn a place in the product walkthrough):
     - Dashboard → the Insights layout: trends and breakdowns are the
       dashboard's whole job.
     - Subscriptions → installments by month: "what's coming in, what's late"
       is that page's primary question.
     - Invoicing → past-due aging: the first thing anyone chasing invoices asks.
     Everywhere else the table IS the answer (Transactions, Customers, Payment
     Links, Products, Developer), or the screen already has its chart
     (Balances' share bar, Disputes' volume and breakdown charts). */
  dashboard: () => firstStory(Dashboard, 'InsightsLayout'),
  balances: () => firstStory(Balances, 'Default'),
  transactions: () => firstStory(Transactions, 'Default'),
  disputes: () => firstStory(Disputes, 'Default'),
  developer: () => firstStory(Developer),
  application: () => firstStory(Application),
  customers: () => firstStory(Customers, 'List'),
  'payment-links': () => firstStory(PaymentLinks, 'List'),
  products: () => firstStory(Products, 'List'),
  // Detail screens, opened from the ⋮ action menus ("View customer", "View
  // link", "View plan", "View invoice").
  'customers/detail': () => firstStory(Customers, 'Detail'),
  'payment-links/detail': () => firstStory(PaymentLinks, 'Detail'),
  'subscriptions/detail': () => firstStory(Subscriptions, 'Detail'),
  'invoicing/detail': () => firstStory(Invoicing, 'Detail'),
  subscriptions: () => firstStory(Subscriptions, 'ChartConceptCollection'),
  invoicing: () => firstStory(Invoicing, 'ChartConceptAging'),
}

/* Route in the hash so a deep link survives a refresh on GitHub Pages, which
   serves static files and cannot rewrite unknown paths to index.html. */
const route = ref((location.hash.replace('#/', '') || 'login'))
const go = (key) => { route.value = key; location.hash = `#/${key}` }
window.addEventListener('hashchange', () => { route.value = location.hash.replace('#/', '') || 'login' })

/* The merchant application is a wizard: one story per step, so the route
   carries the step — #/application is step 1, #/application/2 … /5. Each step
   is a fresh component, so moving on never carries stale field state. */
const APP_STEPS = ['Step1Dba', 'Step2Legal', 'Step3Owner', 'Step4Banking', 'Submitted']
const appStep = computed(() => {
  if (!route.value.startsWith('application')) return -1
  const n = Number(route.value.split('/')[1] || 1)
  return Math.min(Math.max(n, 1), APP_STEPS.length) - 1
})
const goStep = (i) => go(i <= 0 ? 'application' : `application/${i + 1}`)

const current = computed(() => {
  if (appStep.value >= 0) return firstStory(Application, APP_STEPS[appStep.value])
  const make = SCREENS[route.value] || SCREENS.dashboard
  return make() || SCREENS.dashboard()
})

/* Sign-in walkthrough. The Account V2 stories are shared with Storybook, so
   rather than wiring routes into them, the prototype listens at the document
   (capture phase): a submitted form moves to the next step, a Where-to row
   opens its destination. Placeholder links (href="#") are neutralised
   everywhere — following them would clear the hash and bounce to sign-in. */
const session = inject('eppaySession', null)
const LOGIN_NEXT = { login: 'login/2', 'login/2': 'login/3' }
document.addEventListener('submit', (e) => {
  if (LOGIN_NEXT[route.value]) { e.preventDefault(); go(LOGIN_NEXT[route.value]) }
}, true)
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href="#"], button')
  if (!a) return
  const text = a.textContent.trim()
  if (a.matches('a[href="#"]')) e.preventDefault()
  if (route.value === 'login/3' && a.matches('a.av2vr')) {
    if (/Apply for a merchant account/.test(text)) return go('application')
    // Remember which merchant (or EventPipe view) was picked: every screen's
    // top-bar switcher shows it from here on.
    const picked = EP_ORGS.find((o) => text.includes(o)) // row text starts with its initials tile
    if (picked && session) session.org.value = picked
    go('dashboard')
  } else if (/^Sign out$|^Change$/.test(text) && route.value.startsWith('login')) {
    go('login')
  } else if (/^Complete Application$/.test(text)) {
    go('application')
  }
}, true)

/* The wizard's own Next / Back buttons announce themselves on window. */
window.addEventListener('eppay:wizard', (e) => {
  if (appStep.value < 0) return
  if (e?.detail === 'next') goStep(Math.min(appStep.value + 1, APP_STEPS.length - 1))
  if (e?.detail === 'back') goStep(Math.max(appStep.value - 1, 0))
})

/* The big fixed button: press once to fill the step, again to move on. It
   lives out here, outside the story, so it asks the step to fill itself via
   `eppay:autofill` rather than touching the form's state directly. `filled`
   resets on every step change, so each step starts at "Auto-fill". */
/* The prototype bar wraps to two or three rows on narrower windows, so a fixed
   offset collides with it. Measure the bar and sit the button 16px above it. */
const bar = ref(null)
const barTop = ref(56)
let barObserver
onMounted(() => {
  const measure = () => { if (bar.value) barTop.value = window.innerHeight - bar.value.getBoundingClientRect().top }
  barObserver = new ResizeObserver(measure)
  if (bar.value) barObserver.observe(bar.value)
  window.addEventListener('resize', measure)
  measure()
})
onBeforeUnmount(() => barObserver?.disconnect())

/* The prototype bar collapses to a small pill. It starts collapsed on the
   sign-in steps, where the full bar would sit over the showcase headline, and
   opens again once inside the product; the user can toggle it any time. */
const navOpen = ref(!route.value.startsWith('login'))
watch(route, (r, prev) => {
  const inLogin = r.startsWith('login'), wasLogin = (prev || '').startsWith('login')
  if (inLogin !== wasLogin) navOpen.value = !inLogin
})

const filled = ref(false)
watch(route, () => { filled.value = false })
const fillLabel = computed(() => {
  if (!filled.value) return `Auto-fill step ${appStep.value + 1} of 4`
  return appStep.value === 3 ? 'Submit application' : `Continue to step ${appStep.value + 2}`
})
function fillOrContinue() {
  if (!filled.value) {
    window.dispatchEvent(new CustomEvent('eppay:autofill'))
    filled.value = true
  } else {
    goStep(appStep.value + 1)
  }
}

/* The screens render their own sidebar, so this app listens rather than owning
   a nav of its own. A Vue `emit` does not bubble as a DOM event and never
   reached a listener on this wrapper — the shell now re-broadcasts sidebar
   clicks as a real window CustomEvent, which is what this hears. */
window.addEventListener('eppay:navigate', (e) => {
  const key = e?.detail
  if (typeof key === 'string' && SCREENS[key]) go(key)
})

const navKeys = EP_NAV.map((n) => n.key)
</script>

<template>
  <div>
    <!-- Prototype-only chrome: a way back to the screens the product nav does
         not link to (login and the application wizard). -->
    <div ref="bar" class="epproto__bar" :class="{ 'is-collapsed': !navOpen }">
      <button type="button" class="epproto__toggle" :aria-expanded="String(navOpen)"
        aria-label="Prototype navigation" @click="navOpen = !navOpen">
        <span class="epproto__label">EP Pay prototype</span>
        <q-icon :name="navOpen ? 'expand_more' : 'expand_less'" size="16px" />
      </button>
      <template v-if="navOpen">
      <button v-for="k in ['login', 'application']" :key="k"
        class="epproto__btn" :class="{ 'is-on': route === k || (k === 'application' && appStep >= 0) || (k === 'login' && route.startsWith('login')) }" @click="go(k)">
        {{ k === 'login' ? 'Login' : 'Application' }}
      </button>
      <span class="epproto__sep" />
      <button v-for="k in navKeys" :key="k"
        class="epproto__btn" :class="{ 'is-on': route === k }" @click="go(k)">{{ k }}</button>
      </template>
    </div>

    <component :is="current" />

    <!-- Prototype-only: fill the current application step, then continue.
         Not shown on the Submitted step — there is nothing left to fill. -->
    <button v-if="appStep >= 0 && appStep < 4" type="button" class="epproto__fill"
      :style="{ bottom: `${barTop + 16}px` }"
      :class="{ 'is-filled': filled }" @click="fillOrContinue">
      <q-icon :name="filled ? 'arrow_forward' : 'bolt'" size="24px" />
      <span>{{ fillLabel }}</span>
    </button>
  </div>
</template>

<style>
body { margin: 0; }
.epproto__bar {
  position: fixed; bottom: 12px; left: 50%; transform: translateX(-50%);
  z-index: 9999; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  max-width: 94vw; background: var(--ds-color-surface-sidebar); color: #fff;
  padding: 8px 12px; border-radius: 10px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.28);
  font-size: 0.75rem;
}
.epproto__label { font-weight: 700; opacity: 0.7; margin-right: 4px; }
.epproto__toggle {
  display: inline-flex; align-items: center; gap: 2px; background: transparent; border: 0;
  color: #fff; font: inherit; cursor: pointer; padding: 2px 4px; border-radius: 6px;
}
.epproto__toggle:hover { background: rgba(255, 255, 255, 0.12); }
.epproto__toggle:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 2px; }
.epproto__bar.is-collapsed { left: 16px; transform: none; }
.epproto__sep { width: 1px; height: 16px; background: rgba(255, 255, 255, 0.25); margin: 0 4px; }
.epproto__btn {
  background: transparent; border: 1px solid rgba(255, 255, 255, 0.25); color: #fff;
  border-radius: 6px; padding: 3px 9px; cursor: pointer; font-size: 0.75rem;
}
.epproto__btn:hover { background: rgba(255, 255, 255, 0.12); }
.epproto__btn.is-on {
  background: var(--ds-color-background-brand-bold);
  border-color: var(--ds-color-background-brand-bold);
  font-weight: 700;
}

/* Big, fixed, bottom-right, and above the prototype bar. DS tokens only. */
.epproto__fill {
  position: fixed; right: 28px; bottom: 96px; z-index: 10000; /* bottom is set from the bar's measured height */
  display: inline-flex; align-items: center; gap: 10px;
  height: 60px; padding: 0 28px 0 22px;
  border: 0; border-radius: var(--ds-radius-lg);
  background: var(--ds-color-background-brand-bold); color: var(--ds-color-text-inverse);
  font: inherit; font-size: 1.0625rem; font-weight: 700; letter-spacing: 0.01em;
  box-shadow: var(--ds-shadow-4); cursor: pointer;
  transition: transform var(--ds-duration-fast) var(--ds-ease-standard),
    background var(--ds-duration-fast) var(--ds-ease-standard);
}
.epproto__fill:hover { transform: translateY(-2px); }
.epproto__fill:focus-visible { outline: 3px solid var(--ds-color-border-focused); outline-offset: 3px; }
/* Once filled it turns to the success colour, so "done — now continue" reads
   at a glance. */
.epproto__fill.is-filled { background: var(--ds-color-background-success-bold); }
</style>
