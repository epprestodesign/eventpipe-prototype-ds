<script setup>
// DsCheckboxTree — a two-level checkbox tree. Checking a parent selects all its
// children (indeterminate dash when partial); a chevron expands/collapses.
// Extracted from the browse "Brands" filter. v-model is the list of selected
// child (leaf) names.
import { reactive } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  nodes: { type: Array, default: () => [] }, // [{ name, children: [string] }]
  defaultExpanded: { type: Array, default: () => [] }, // parent names open initially
})
const emit = defineEmits(['update:modelValue'])

const expanded = reactive(Object.fromEntries(props.nodes.map((n) => [n.name, props.defaultExpanded.includes(n.name)])))
const toggleExpand = (name) => { expanded[name] = !expanded[name] }

const toggleIn = (item) => {
  const sel = props.modelValue || []
  emit('update:modelValue', sel.includes(item) ? sel.filter((x) => x !== item) : [...sel, item])
}
const state = (node) => {
  const sel = props.modelValue || []
  const ch = node.children || []
  if (!ch.length) return sel.includes(node.name) ? 'all' : 'none'
  const n = ch.filter((c) => sel.includes(c)).length
  return n === 0 ? 'none' : n === ch.length ? 'all' : 'some'
}
const toggleParent = (node) => {
  const sel = props.modelValue || []
  const ch = node.children || []
  if (!ch.length) { toggleIn(node.name); return }
  emit('update:modelValue', state(node) === 'all' ? sel.filter((c) => !ch.includes(c)) : Array.from(new Set([...sel, ...ch])))
}
const isOn = (name) => (props.modelValue || []).includes(name)
</script>

<template>
  <div class="dst">
    <div v-for="node in nodes" :key="node.name" class="dst__node">
      <div class="dst__head">
        <button type="button" class="dst__check" :class="{ 'is-on': state(node) === 'all' }" @click="toggleParent(node)">
          <span class="dst__box" :class="{ 'is-indet': state(node) === 'some' }">
            <q-icon v-if="state(node) === 'all'" name="check" size="15px" />
            <span v-else-if="state(node) === 'some'" class="dst__dash" />
          </span>
          <span class="dst__label">{{ node.name }}</span>
        </button>
        <button v-if="(node.children || []).length" type="button" class="dst__chev" :aria-label="expanded[node.name] ? 'Collapse' : 'Expand'" @click="toggleExpand(node.name)">
          <q-icon :name="expanded[node.name] ? 'expand_less' : 'expand_more'" size="22px" />
        </button>
      </div>
      <div v-show="expanded[node.name]" class="dst__children">
        <button v-for="c in node.children" :key="c" type="button" class="dst__check dst__check--child" :class="{ 'is-on': isOn(c) }" @click="toggleIn(c)">
          <span class="dst__box"><q-icon v-if="isOn(c)" name="check" size="15px" /></span>
          <span class="dst__label">{{ c }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dst { display: flex; flex-direction: column; }
.dst__head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.dst__check { display: flex; align-items: center; gap: 14px; width: 100%; padding: 6px 0; background: none; border: 0; text-align: left; cursor: pointer; }
.dst__box { width: 24px; height: 24px; flex: none; border: 2px solid var(--ds-color-border-bold); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: #fff; transition: background var(--ds-duration-fast) var(--ds-ease-standard), border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.dst__check.is-on .dst__box, .dst__box.is-indet { background: var(--ds-color-background-brand-bold); border-color: var(--ds-color-background-brand-bold); }
.dst__dash { width: 11px; height: 2px; border-radius: 1px; background: #fff; }
.dst__label { font-size: 1rem; font-weight: 600; color: var(--ds-color-text); }
.dst__check--child .dst__label { font-weight: 500; }
.dst__check:hover .dst__box { border-color: var(--ds-color-text); }
.dst__chev { background: none; border: 0; padding: 6px; color: var(--ds-color-text-subtle); cursor: pointer; display: flex; }
.dst__children { display: flex; flex-direction: column; padding-left: 36px; }
</style>
