<script setup>
// SavedItems — the "Saved Hotels" list (a.k.a. your travel plans). Header shows
// a live count + an ⓘ info popover; each row has a thumbnail, name, rating,
// hotel class, and a filled bookmark button that removes the item. Controlled:
// it renders `items` and emits `remove` so a parent (e.g. SavedFlyout) owns the
// list. Thumbnails resolve from the imagery library (or an explicit item.image).
import { ref, onMounted } from 'vue'
import { loadImagery } from '../../lib/imagery'

defineProps({
  title: { type: String, default: 'Saved Hotels' },
  items: { type: Array, default: () => [] }, // [{ name, rating, reviews, hotelClass, image | imageCategories, seed }]
})
const emit = defineEmits(['remove'])

const lib = ref({})
onMounted(async () => { lib.value = await loadImagery() })

const thumb = (it) => {
  if (it.image) return it.image
  for (const c of it.imageCategories || ['exterior', 'lobby', 'rooms']) {
    const arr = lib.value[c]
    if (arr && arr.length) return arr[(it.seed || 0) % arr.length].url
  }
  return ''
}
</script>

<template>
  <div class="sv">
    <header class="sv__head">
      <h2 class="sv__title">{{ title }} ({{ items.length }})</h2>
      <button type="button" class="sv__info" aria-label="About saved hotels">
        <q-icon name="info" size="22px" />
        <q-menu anchor="bottom right" self="top right" :offset="[0, 8]" class="sv__menu">
          <div class="sv__pop">
            <p>These are travel items from your browsing activity and recent searches on Presto. This result may include updates to your travel items, such as price changes.</p>
            <p>Learn more about managing your activity in <a href="#" @click.prevent class="sv__link">Privacy settings</a></p>
          </div>
        </q-menu>
      </button>
    </header>

    <div class="sv__saved"><q-icon name="bookmarks" size="20px" /> Saved items</div>

    <ul v-if="items.length" class="sv__list">
      <li v-for="(it, i) in items" :key="it.id ?? i" class="sv__row">
        <span class="sv__thumb">
          <img v-if="thumb(it)" :src="thumb(it)" :alt="it.name" />
          <q-icon v-else name="image" size="22px" />
        </span>
        <div class="sv__info-col">
          <h3 class="sv__name">{{ it.name }}</h3>
          <p v-if="it.rating != null" class="sv__rating">
            {{ it.rating }}/5 <q-icon name="star" size="15px" class="sv__star" />
            <span v-if="it.reviews"> ({{ it.reviews.toLocaleString() }})</span>
          </p>
          <p v-if="it.hotelClass" class="sv__class">{{ it.hotelClass }}</p>
        </div>
        <button type="button" class="sv__bookmark" aria-label="Remove from saved hotels" @click="emit('remove', it)">
          <q-icon name="bookmark" size="20px" />
        </button>
      </li>
    </ul>

    <div v-else class="sv__empty">
      <q-icon name="bookmark_border" size="32px" />
      <p>No saved hotels yet. Tap the bookmark on a hotel to save it here.</p>
    </div>
  </div>
</template>

<style scoped>
.sv { max-width: 440px; }
.sv__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.sv__title { margin: 0; font-size: 1.75rem; font-weight: 800; color: var(--ds-color-text); }
.sv__info { width: 40px; height: 40px; flex: none; border: 0; border-radius: 50%; background: none; color: var(--ds-color-text-subtle); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.sv__info:hover { background: var(--ds-palette-zinc-100); color: var(--ds-color-text); }

.sv__saved { display: flex; align-items: center; gap: 10px; margin: 18px 0 14px; font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text); }
.sv__saved .q-icon { color: var(--ds-color-text-subtle); }

.sv__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.sv__row { display: flex; align-items: center; gap: 14px; padding: 12px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); }
.sv__thumb { width: 64px; height: 64px; flex: none; border-radius: var(--ds-radius-md); overflow: hidden; background: var(--ds-palette-zinc-100); display: flex; align-items: center; justify-content: center; color: var(--ds-color-text-subtle); }
.sv__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sv__info-col { flex: 1; min-width: 0; }
.sv__name { margin: 0; font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text); line-height: 1.25; }
.sv__rating { display: flex; align-items: center; gap: 4px; margin: 4px 0 0; font-size: 0.875rem; color: var(--ds-color-text); }
.sv__rating span { color: var(--ds-color-text-subtle); }
.sv__star { color: #f59e0b; }
.sv__class { margin: 2px 0 0; font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.sv__bookmark { width: 40px; height: 40px; flex: none; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-background-brand-bold); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.sv__bookmark:hover { background: var(--ds-palette-zinc-200); }

.sv__empty { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 40px 20px; color: var(--ds-color-text-subtle); }
.sv__empty p { margin: 0; font-size: 0.9375rem; max-width: 280px; }
</style>

<!-- Unscoped: q-menu popover is teleported outside this component. -->
<style>
.sv__menu .sv__pop { max-width: 320px; padding: 16px 18px; }
.sv__menu .sv__pop p { margin: 0 0 12px; font-size: 0.9375rem; line-height: 1.5; color: var(--ds-color-text-subtle); }
.sv__menu .sv__pop p:last-child { margin-bottom: 0; }
.sv__menu .sv__link { color: var(--ds-color-text-link, #2563eb); font-weight: 600; text-decoration: none; }
.sv__menu .sv__link:hover { text-decoration: underline; }
</style>
