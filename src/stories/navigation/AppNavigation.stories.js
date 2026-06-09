/** NAVIGATION / App Navigation → custom (QDrawer + QList in QLayout) */
import { ref } from 'vue'
export default {
  title: 'Navigation/App Navigation',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
The primary, persistent navigation for an app's top-level destinations.
Composed from QDrawer + QList; wrap as \`PrestoAppNav\` with a route model.

## When to use
- Switching between major areas of the app (Explore, Trips, Saved, Account).

## When not to use
- In-context view switching → **Tabs**. Overflow actions → **Menu**.

## Quasar mapping
\`App Navigation → custom (QDrawer + QList + QItem)\` inside QLayout.
` } } },
}
export const SideNav = {
  render: () => ({
    setup: () => ({ drawer: ref(true), active: ref('explore') , items: [
      { key: 'explore', label: 'Explore', icon: 'search' },
      { key: 'trips', label: 'My Trips', icon: 'luggage' },
      { key: 'saved', label: 'Saved', icon: 'favorite' },
      { key: 'account', label: 'Account', icon: 'account_circle' },
      { key: 'help', label: 'Help', icon: 'support_agent' },
    ] }),
    template: `
      <q-layout view="lHh Lpr lFf" container style="height:420px" class="shadow-2 rounded-borders">
        <q-header class="bg-primary text-white"><q-toolbar>
          <q-btn flat round dense icon="menu" @click="drawer = !drawer" />
          <q-toolbar-title>Presto Stays</q-toolbar-title>
        </q-toolbar></q-header>
        <q-drawer v-model="drawer" show-if-above :width="240" bordered>
          <q-list padding>
            <q-item v-for="it in items" :key="it.key" clickable v-ripple
              :active="active === it.key" active-class="bg-primary text-white"
              @click="active = it.key">
              <q-item-section avatar><q-icon :name="it.icon" /></q-item-section>
              <q-item-section>{{ it.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-drawer>
        <q-page-container><q-page padding><div class="text-h6 text-capitalize">{{ active }}</div><p class="text-grey-7">Primary destination content.</p></q-page></q-page-container>
      </q-layout>` }),
}
