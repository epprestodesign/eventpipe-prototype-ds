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
import { computed, markRaw, ref } from 'vue'
import { EP_NAV } from '../src/stories/eppay/_eppay'

import * as Login from '../src/stories/eppay/EP-01-Login.stories'
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
  login: () => firstStory(Login, 'Merchant'),
  dashboard: () => firstStory(Dashboard, 'Default'),
  balances: () => firstStory(Balances, 'Default'),
  transactions: () => firstStory(Transactions, 'Default'),
  disputes: () => firstStory(Disputes, 'Default'),
  developer: () => firstStory(Developer),
  application: () => firstStory(Application),
  customers: () => firstStory(Customers, 'List'),
  'payment-links': () => firstStory(PaymentLinks, 'List'),
  products: () => firstStory(Products, 'List'),
  subscriptions: () => firstStory(Subscriptions, 'List'),
  invoicing: () => firstStory(Invoicing, 'List'),
}

/* Route in the hash so a deep link survives a refresh on GitHub Pages, which
   serves static files and cannot rewrite unknown paths to index.html. */
const route = ref((location.hash.replace('#/', '') || 'login'))
const go = (key) => { route.value = key; location.hash = `#/${key}` }
window.addEventListener('hashchange', () => { route.value = location.hash.replace('#/', '') || 'login' })

const current = computed(() => {
  const make = SCREENS[route.value] || SCREENS.dashboard
  return make() || SCREENS.dashboard()
})

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
    <div class="epproto__bar">
      <span class="epproto__label">EP Pay prototype</span>
      <button v-for="k in ['login', 'application']" :key="k"
        class="epproto__btn" :class="{ 'is-on': route === k }" @click="go(k)">
        {{ k === 'login' ? 'Login' : 'Application' }}
      </button>
      <span class="epproto__sep" />
      <button v-for="k in navKeys" :key="k"
        class="epproto__btn" :class="{ 'is-on': route === k }" @click="go(k)">{{ k }}</button>
    </div>

    <component :is="current" />
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
</style>
