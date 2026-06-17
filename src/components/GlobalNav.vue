<script setup>
// GlobalNav — the app's top-level dark nav bar: brand logo on the left, a
// "Manage Booking" pill, a bookmark icon, and a cart icon (each with a live
// count badge) on the right. The bookmark opens the Saved Hotels fly-out; the
// cart opens the CartFlyout order summary. Both fly-outs stay closed until their
// icon is clicked.
import { ref } from 'vue'
import CartFlyout from './CartFlyout.vue'
import SavedFlyout from './yourtrips/SavedFlyout.vue'

const props = defineProps({
  brand: { type: String, default: 'Soccer League' },
  manageLabel: { type: String, default: 'Manage Booking' },
  cartMode: { type: String, default: 'reserve' }, // reserve | hold
  cart: { type: Object, default: () => ({}) },
  saved: { type: Array, default: () => [] },       // parent-owned saved hotels list
})
const emit = defineEmits(['manage', 'remove'])

// Cart fly-out.
const cartOpen = ref(false)
const count = ref(0)

// Saved Hotels fly-out — opens on bookmark click; the parent owns the list, so
// the badge/fly-out stay in sync with whatever is saved elsewhere. Exposed so a
// parent can pop it open (e.g. when a hotel card is bookmarked).
const savedOpen = ref(false)
defineExpose({ openSaved: () => { savedOpen.value = true }, closeSaved: () => { savedOpen.value = false } })
</script>

<template>
  <div class="gnav-wrap">
    <header class="gnav">
      <a class="gnav__brand" href="#" @click.prevent>{{ brand }}</a>

      <div class="gnav__actions">
        <button class="gnav__manage" @click="emit('manage')">{{ manageLabel }}</button>
        <button class="gnav__iconbtn" aria-label="Saved hotels" @click="savedOpen = true">
          <q-icon name="bookmark_border" size="22px" />
          <span v-if="saved.length" class="gnav__badge">{{ saved.length }}</span>
        </button>
        <button class="gnav__iconbtn" aria-label="Open cart" @click="cartOpen = true">
          <q-icon name="shopping_cart" size="22px" />
          <span class="gnav__badge">{{ count }}</span>
        </button>
      </div>
    </header>

    <cart-flyout v-model="cartOpen" :mode="cartMode" :cart="cart" @update:count="count = $event" />
    <saved-flyout v-model="savedOpen" :items="saved" @remove="emit('remove', $event)" />
  </div>
</template>

<style scoped>
.gnav { display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 72px; padding: 0 28px; background: #0a0a0b; color: #fff; }
.gnav__brand { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.01em; color: #fff; text-decoration: none; }

.gnav__actions { display: flex; align-items: center; gap: 16px; }
.gnav__manage { height: 48px; padding: 0 24px; border-radius: var(--ds-radius-pill); border: 1px solid rgba(255, 255, 255, 0.35); background: transparent; color: #fff; font-weight: 600; font-size: 0.9375rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.gnav__manage:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.6); }

.gnav__iconbtn { position: relative; width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.35); background: transparent; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.gnav__iconbtn:hover { background: rgba(255, 255, 255, 0.08); }
.gnav__badge { position: absolute; top: -2px; right: -2px; min-width: 22px; height: 22px; padding: 0 5px; border-radius: var(--ds-radius-pill); background: var(--ds-palette-cyan-300); color: var(--ds-palette-zinc-900); font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
</style>
