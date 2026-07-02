<script setup>
// RoomsCarousel — the "Select Your Room" section of the hotel detail screen.
// Lays out room cards in a horizontal, scroll-snapping track so more than three
// rooms can be browsed when available (arrows + native touch/trackpad swipe).
// The `flow` prop picks the card: 'reserve' → RoomCardReserve (Book
// Reservations), 'group' → RoomCardGroup (Group Block). Sold-out rooms are
// rendered inline (the cards handle their own sold-out state), so availability
// never removes a room from the list — it just disables it.
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import RoomCardReserve from './RoomCardReserve.vue'
import RoomCardGroup from './RoomCardGroup.vue'

const props = defineProps({
  rooms: { type: Array, default: () => [] }, // array of room-card prop objects
  flow: { type: String, default: 'reserve' }, // 'reserve' | 'group'
  title: { type: String, default: 'Select Your Room' },
  subtitle: { type: String, default: '' },
})

const track = ref(null)
const scrollable = ref(false)
const atStart = ref(true)
const atEnd = ref(false)

// One card (340px) + track gap (20px). Scroll by ~1.5 cards so a partially
// visible "next" card pulls fully into view.
const STEP = (340 + 20) * 1.5

const update = () => {
  const el = track.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  scrollable.value = max > 1
  atStart.value = el.scrollLeft <= 1
  atEnd.value = el.scrollLeft >= max - 1
}

const scroll = (dir) => {
  track.value?.scrollBy({ left: dir * STEP, behavior: 'smooth' })
}

let ro
onMounted(async () => {
  await nextTick()
  update()
  if (window.ResizeObserver) {
    ro = new ResizeObserver(update)
    ro.observe(track.value)
  }
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <section class="rcar">
    <header v-if="title || subtitle || scrollable" class="rcar__head">
      <div class="rcar__heading">
        <h3 v-if="title" class="rcar__title">{{ title }}</h3>
        <p v-if="subtitle" class="rcar__sub">{{ subtitle }}</p>
      </div>
      <div v-if="scrollable" class="rcar__nav">
        <button type="button" class="rcar__arrow" :disabled="atStart" aria-label="Previous rooms" @click="scroll(-1)"><q-icon name="chevron_left" size="22px" /></button>
        <button type="button" class="rcar__arrow" :disabled="atEnd" aria-label="More rooms" @click="scroll(1)"><q-icon name="chevron_right" size="22px" /></button>
      </div>
    </header>

    <div ref="track" class="rcar__track" @scroll="update">
      <div v-for="(room, i) in rooms" :key="i" class="rcar__item">
        <room-card-group v-if="flow === 'group'" v-bind="room" />
        <room-card-reserve v-else v-bind="room" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.rcar { display: flex; flex-direction: column; gap: 16px; }
.rcar__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.rcar__title { font-size: 1.5rem; font-weight: 700; line-height: 1.2; margin: 0; color: var(--ds-color-text); }
.rcar__sub { margin: 4px 0 0; color: var(--ds-color-text-subtle); font-size: 0.9375rem; }

.rcar__nav { display: flex; gap: 8px; flex: 0 0 auto; }
.rcar__arrow { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--ds-color-border-bold); background: var(--ds-color-surface); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.rcar__arrow:hover:not(:disabled) { background: var(--ds-color-surface-sunken); }
.rcar__arrow:disabled { opacity: 0.4; cursor: default; }

/* Scroll-snapping horizontal track. Native overflow handles touch/trackpad
   swipe; arrows drive programmatic scroll. Cards keep their intrinsic width. */
.rcar__track { display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-left: 2px; padding: 4px 2px 8px; margin: -4px -2px -8px; scrollbar-width: thin; }
.rcar__item { scroll-snap-align: start; flex: 0 0 auto; }
.rcar__item > :deep(.rcr), .rcar__item > :deep(.rcg) { height: 100%; }
</style>
