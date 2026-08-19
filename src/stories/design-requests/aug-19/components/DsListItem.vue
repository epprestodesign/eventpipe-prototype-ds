<script setup>
// DsListItem — the standard row: a leading icon/avatar/thumbnail, a title +
// optional subtitle, and a trailing area (chevron, action, toggle). Used across
// the account menu, saved items, payment methods, help rows, etc. Render it as
// a bordered "card" row (default) or a flush list row.
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },         // leading material icon (in a soft circle)
  image: { type: String, default: '' },         // leading thumbnail (wins over icon)
  chevron: { type: Boolean, default: false },    // trailing chevron
  bordered: { type: Boolean, default: true },    // card row vs flush row
  clickable: { type: Boolean, default: false },
  iconTone: { type: String, default: 'neutral' }, // neutral | brand
})
const emit = defineEmits(['click'])
const tag = computed(() => (props.clickable ? 'button' : 'div'))
</script>

<template>
  <component
    :is="tag" class="ds-li"
    :class="{ 'ds-li--bordered': bordered, 'ds-li--clickable': clickable }"
    :type="clickable ? 'button' : undefined"
    @click="clickable && emit('click')"
  >
    <span v-if="image" class="ds-li__thumb"><img :src="image" :alt="title" /></span>
    <span v-else-if="icon" class="ds-li__icon" :class="`ds-li__icon--${iconTone}`"><q-icon :name="icon" size="20px" /></span>
    <span v-else-if="$slots.leading" class="ds-li__lead"><slot name="leading" /></span>

    <span class="ds-li__body">
      <slot name="title"><strong v-if="title" class="ds-li__title">{{ title }}</strong></slot>
      <slot name="subtitle"><span v-if="subtitle" class="ds-li__sub">{{ subtitle }}</span></slot>
      <slot />
    </span>

    <span v-if="$slots.trailing" class="ds-li__trail"><slot name="trailing" /></span>
    <q-icon v-if="chevron" name="chevron_right" size="20px" class="ds-li__chev" />
  </component>
</template>

<style scoped>
.ds-li { display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; background: var(--ds-color-surface); border: 0; }
.ds-li--bordered { padding: 14px 16px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); }
.ds-li:not(.ds-li--bordered) { padding: 12px 0; }
.ds-li--clickable { cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.ds-li--clickable:hover { background: var(--ds-palette-graphite-100); }

.ds-li__thumb { width: 56px; height: 56px; flex: none; border-radius: var(--ds-radius-md); overflow: hidden; background: var(--ds-palette-graphite-100); display: flex; align-items: center; justify-content: center; }
.ds-li__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ds-li__icon { width: 40px; height: 40px; flex: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.ds-li__icon--neutral { background: var(--ds-palette-graphite-100); color: var(--ds-color-text); }
.ds-li__icon--brand { background: var(--ds-color-background-brand-bold); color: #fff; }
.ds-li__lead { flex: none; display: flex; }

.ds-li__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ds-li__title { font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); line-height: 1.3; }
.ds-li__sub { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }

.ds-li__trail { flex: none; display: flex; align-items: center; }
.ds-li__chev { flex: none; color: var(--ds-color-text-subtle); }
</style>
