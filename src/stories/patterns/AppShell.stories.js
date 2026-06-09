/** PATTERNS / App Shell → QLayout + Header + Drawer + Page + Footer (composition) */
import { ref } from 'vue'
export default {
  title: 'Patterns/App Shell',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
The outer frame the booking app shares: header with search, collapsible primary
nav drawer, page container, and footer. Combine with **App Navigation** and
**Side Panels**.
` } } },
}
export const FullShell = {
  render: () => ({ setup: () => ({ drawer: ref(true) }), template: `
    <q-layout view="lHh Lpr lFf" container style="height:460px" class="shadow-2 rounded-borders">
      <q-header class="bg-primary text-white"><q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>Presto Stays</q-toolbar-title>
        <q-btn flat dense round icon="favorite" />
        <q-btn flat dense round icon="account_circle" />
      </q-toolbar></q-header>
      <q-drawer v-model="drawer" show-if-above :width="220" bordered>
        <q-list padding>
          <q-item clickable v-ripple active active-class="bg-primary text-white"><q-item-section avatar><q-icon name="search" /></q-item-section><q-item-section>Explore</q-item-section></q-item>
          <q-item clickable v-ripple><q-item-section avatar><q-icon name="luggage" /></q-item-section><q-item-section>My Trips</q-item-section></q-item>
          <q-item clickable v-ripple><q-item-section avatar><q-icon name="favorite" /></q-item-section><q-item-section>Saved</q-item-section></q-item>
        </q-list>
      </q-drawer>
      <q-page-container><q-page padding>
        <div class="text-h6">Explore stays</div>
        <p class="text-grey-8 text-body2">Search hotels by destination, dates, and guests.</p>
        <q-btn color="primary" icon="search" label="Start a search" />
      </q-page></q-page-container>
      <q-footer class="bg-grey-2 text-grey-8"><q-toolbar><q-toolbar-title class="text-caption">© 2026 Presto Stays</q-toolbar-title></q-toolbar></q-footer>
    </q-layout>` }),
}
