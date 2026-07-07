<script setup>
// AppShell — the primary application scaffold: a fixed dark navy sidebar
// (--ds-color-surface-sidebar, #00123D) with the EventPipe logo, the primary
// nav, and a pinned Company Settings footer; alongside a main column made of the
// AppBar (top) and a content canvas (--ds-color-surface-canvas, #F8F9FA) holding
// an elevated white panel (--ds-shadow-2, level 2). Default slot = page content.
//
// The logo SVG is inlined (?raw) so the dark "event" wordmark can be recolored to
// white for the navy sidebar while the teal mark/​"pipe" stay on-brand.
import logoSvg from '../assets/logo/eventpipe-logo.svg?raw'
import AppBar from './AppBar.vue'

const props = defineProps({
  // Nav items: { key, label, icon (Material Icons name) }
  items: {
    type: Array,
    default: () => ([
      { key: 'users', label: 'Users', icon: 'groups' },
      { key: 'events', label: 'Events', icon: 'event' },
      { key: 'reports', label: 'Reports', icon: 'bar_chart' },
      { key: 'hotels', label: 'Hotels', icon: 'apartment' },
      { key: 'brands', label: 'Hotel Brands', icon: 'domain' },
      { key: 'amenities', label: 'Amenities', icon: 'restaurant' },
      { key: 'room-types', label: 'Room Types', icon: 'king_bed' },
      { key: 'venues', label: 'Venues', icon: 'hub' },
      { key: 'event-companies', label: 'Event Companies', icon: 'account_tree' },
      { key: 'companies', label: 'Companies', icon: 'business_center' },
      { key: 'requests', label: 'Requests', icon: 'description' },
      { key: 'inventory', label: 'Inventory Requests', icon: 'hotel' },
      { key: 'admin', label: 'Admin Tools', icon: 'build' },
      { key: 'pipe', label: 'Pipe Tools', icon: 'warning' },
      { key: 'api', label: 'API', icon: 'swap_horiz' },
    ]),
  },
  footerItem: { type: Object, default: () => ({ key: 'settings', label: 'Company Settings', icon: 'settings' }) },
  active: { type: String, default: 'inventory' },
  org: { type: String, default: 'Team Travel Source' },
  user: { type: String, default: 'Mike Addesa' },
  // Full-bleed content (no elevated panel / canvas padding) — for full pages
  // that fill the content area edge-to-edge (the production screens).
  bleed: { type: Boolean, default: false },
})
const emit = defineEmits(['navigate'])
</script>

<template>
  <div class="appshell">
    <!-- Sidebar -->
    <aside class="appshell__side">
      <div class="appshell__brand">
        <span class="appshell__logo" v-html="logoSvg" aria-label="EventPipe" role="img" />
      </div>

      <nav class="appshell__nav">
        <button
          v-for="it in items"
          :key="it.key"
          type="button"
          class="appshell__item"
          :class="{ 'is-active': it.key === active }"
          @click="emit('navigate', it.key)"
        >
          <q-icon :name="it.icon" size="20px" class="appshell__item-icon" />
          <span class="appshell__item-label">{{ it.label }}</span>
        </button>
      </nav>

      <div class="appshell__foot">
        <button
          type="button"
          class="appshell__item"
          :class="{ 'is-active': footerItem.key === active }"
          @click="emit('navigate', footerItem.key)"
        >
          <q-icon :name="footerItem.icon" size="20px" class="appshell__item-icon" />
          <span class="appshell__item-label">{{ footerItem.label }}</span>
        </button>
      </div>
    </aside>

    <!-- Main column -->
    <div class="appshell__main">
      <AppBar :org="org" :user="user" />
      <div class="appshell__content" :class="{ 'appshell__content--bleed': bleed }">
        <div v-if="!bleed" class="appshell__panel"><slot /></div>
        <slot v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.appshell {
  display: flex;
  height: 100%;
  min-height: 640px;
  background: var(--ds-color-surface-canvas);
  color: var(--ds-color-text);
}

/* ---- Sidebar ---- */
.appshell__side {
  flex: none;
  width: 240px;
  display: flex;
  flex-direction: column;
  background: var(--ds-color-surface-sidebar);
  color: var(--ds-color-sidebar-text);
}
/* White logo cell atop the navy sidebar (matches mock) — full-color logo on
   white, with a hairline bottom + right divider aligning to the App Bar. */
.appshell__brand {
  display: flex;
  align-items: center;
  height: 64px;
  flex: none;
  box-sizing: border-box;
  padding: 0 20px;
  background: var(--ds-color-surface);
  border-bottom: 1px solid var(--ds-color-border);
  border-right: 1px solid var(--ds-color-border);
}
.appshell__logo :deep(svg) { display: block; width: 132px; height: auto; }

.appshell__nav {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.appshell__foot {
  flex: none;
  padding: 12px 12px;
  border-top: 1px solid var(--ds-color-sidebar-border);
}

.appshell__item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--ds-radius-md);
  background: transparent;
  color: var(--ds-color-sidebar-text);
  font: inherit;
  font-size: 0.9375rem;
  text-align: left;
  cursor: pointer;
  transition: background var(--ds-duration-fast) var(--ds-ease-standard),
    color var(--ds-duration-fast) var(--ds-ease-standard);
}
.appshell__item:hover { background: var(--ds-color-sidebar-hover); color: var(--ds-color-sidebar-text-active); }
.appshell__item-icon { flex: none; color: var(--ds-color-sidebar-icon); }
.appshell__item:hover .appshell__item-icon,
.appshell__item.is-active .appshell__item-icon { color: var(--ds-color-sidebar-text-active); }
.appshell__item-label { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.appshell__item.is-active {
  color: var(--ds-color-sidebar-text-active);
  font-weight: 700;
  background: var(--ds-color-sidebar-hover);
}

/* ---- Main ---- */
.appshell__main { flex: 1 1 auto; display: flex; flex-direction: column; min-width: 0; }
.appshell__content { flex: 1 1 auto; padding: 20px; overflow: auto; }
.appshell__content--bleed { padding: 0; }
.appshell__panel {
  min-height: 100%;
  background: var(--ds-color-surface);
  border-radius: var(--ds-radius-lg);
  border: 1px solid var(--ds-color-border-container);
  box-shadow: var(--ds-shadow-2);
}
</style>
