<script setup>
// STA-5 · ENG2-119 — Team Edit requires a note on every save; on the create
// save the note is written for the user instead: "Team added manually by
// [user]." This is production's Notes block, showing that note first.
import { ref, watch } from 'vue'

const props = defineProps({ notes: { type: Array, default: () => [] } })
const active = ref(0)
watch(() => props.notes.length, () => { active.value = 0 })
</script>

<template>
  <div class="stdn">
    <div v-if="notes.length" class="stdn__grid">
      <div class="stdn__list" role="list">
        <button v-for="(n, i) in notes" :key="i" type="button" role="listitem" class="stdn__item"
          :class="{ 'is-active': active === i }" @click="active = i">
          <span class="stdn__title">{{ n.title }}</span>
          <span class="stdn__meta"><q-icon name="event" size="13px" /> Added On: {{ n.added }}</span>
          <span class="stdn__preview">{{ n.body }}</span>
        </button>
      </div>
      <div class="stdn__detail">
        <div class="stdn__title">{{ notes[active].title }}</div>
        <div class="stdn__meta"><q-icon name="event" size="13px" /> Added on: {{ notes[active].added }} by {{ notes[active].author }}</div>
        <p class="stdn__body">{{ notes[active].body }}</p>
      </div>
    </div>
    <div v-else class="stdn__empty">No notes yet.</div>
    <q-btn outline no-caps color="primary" label="+ Add New Note" class="q-mt-md" />
  </div>
</template>

<style scoped>
.stdn__grid { display: grid; grid-template-columns: 260px 1fr; min-height: 200px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); overflow: hidden; }
.stdn__list { border-right: 1px solid var(--ds-color-border); background: var(--ds-color-surface); }
.stdn__item {
  display: flex; flex-direction: column; gap: 2px; width: 100%; padding: 12px 14px; text-align: left;
  background: none; border: 0; border-bottom: 1px solid var(--ds-color-border); cursor: pointer; font: inherit; color: var(--ds-color-text);
}
.stdn__item.is-active { background: var(--ds-color-surface-sunken); }
.stdn__title { font-weight: 700; font-size: 0.9375rem; }
.stdn__meta { font-size: 0.8125rem; color: var(--ds-color-text-subtle); display: inline-flex; align-items: center; gap: 4px; }
.stdn__preview { font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stdn__detail { padding: 16px 18px; }
.stdn__body { margin: 16px 0 0; }
.stdn__empty { padding: 16px; color: var(--ds-color-text-subtle); border: 1px dashed var(--ds-color-border); border-radius: var(--ds-radius-md); }
</style>
