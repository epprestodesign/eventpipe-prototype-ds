<script setup>
// DsRichTextEditor — the Email Template "Content" editor (DES-207). A WYSIWYG on
// Quasar QEditor with a DS toolbar (bold/italic/underline, lists, align, link,
// undo/redo, Formatting) + Restore to Default + a Personalization menu. Merge
// tokens insert as plain `{{ Token }}` — via the toolbar button OR by typing
// `{{`, which pops the same menu inline at the caret.
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DsField from './DsField.vue'
import DsPersonalizationMenu from './DsPersonalizationMenu.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Content' },
  required: { type: Boolean, default: false },
  minHeight: { type: String, default: '360px' },
  tokens: { type: Array, default: () => [] },
  defaultContent: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'restore'])

const editorRef = ref(null)
let contentEl = null
let savedRange = null

const FORMATS = [
  { label: 'Normal text', block: 'DIV' },
  { label: 'Heading 1', block: 'H1' },
  { label: 'Heading 2', block: 'H2' },
  { label: 'Heading 3', block: 'H3' },
]

// --- inline {{ trigger ---
const inlineOpen = ref(false)
const inlinePos = ref({ left: 0, top: 0 })
const inlineMenuRef = ref(null)
let triggerNode = null
let triggerOffset = 0

function saveSel() {
  const sel = window.getSelection()
  if (sel && sel.rangeCount && contentEl && contentEl.contains(sel.anchorNode)) savedRange = sel.getRangeAt(0).cloneRange()
}
function restoreSel() {
  const sel = window.getSelection()
  if (savedRange) { sel.removeAllRanges(); sel.addRange(savedRange) }
  else contentEl?.focus()
}
function cmd(name, param) { editorRef.value?.runCmd(name, param); saveSel() }
function addLink() { const url = window.prompt('Link URL', 'https://'); if (url) cmd('createLink', url) }
function insertToken(name) {
  restoreSel()
  editorRef.value?.runCmd('insertText', `{{ ${name} }}`)
  saveSel()
}
function restoreDefault() { emit('update:modelValue', props.defaultContent); emit('restore') }

function checkTrigger() {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return
  const range = sel.getRangeAt(0)
  const node = range.startContainer
  const offset = range.startOffset
  if (node.nodeType === 3 && node.textContent.slice(0, offset).endsWith('{{')) {
    // Measure the '{{' so we get a real caret rect even for a collapsed range.
    const measure = document.createRange()
    measure.setStart(node, Math.max(0, offset - 2))
    measure.setEnd(node, offset)
    const rect = measure.getBoundingClientRect()
    inlinePos.value = { left: rect.left, top: rect.bottom + 6 }
    triggerNode = node
    triggerOffset = offset
    inlineOpen.value = true
    nextTick(() => { inlineMenuRef.value?.reset?.(); inlineMenuRef.value?.focus?.() })
  }
}
function insertInlineToken(name) {
  try {
    const sel = window.getSelection()
    const r = document.createRange()
    r.setStart(triggerNode, Math.max(0, triggerOffset - 2)) // select the '{{'
    r.setEnd(triggerNode, triggerOffset)
    sel.removeAllRanges(); sel.addRange(r)
  } catch (e) { /* fall back to caret */ }
  editorRef.value?.runCmd('insertText', `{{ ${name} }}`)
  inlineOpen.value = false
  saveSel()
}
function closeInline() { inlineOpen.value = false }
function onKeydown(e) { if (e.key === 'Escape' && inlineOpen.value) closeInline() }
function onDocMousedown(e) { if (inlineOpen.value && !e.target.closest('.dsrte__inline')) closeInline() }

onMounted(() => {
  contentEl = editorRef.value?.getContentEl?.()
  if (contentEl) {
    ['keyup', 'mouseup', 'focus'].forEach((ev) => contentEl.addEventListener(ev, saveSel))
    contentEl.addEventListener('input', checkTrigger)
    contentEl.addEventListener('keydown', onKeydown)
  }
  document.addEventListener('mousedown', onDocMousedown)
})
onBeforeUnmount(() => { document.removeEventListener('mousedown', onDocMousedown) })
</script>

<template>
  <DsField :label="label" :required="required">
    <div class="dsrte">
      <div class="dsrte__toolbar">
        <button type="button" class="dsrte__btn" title="Bold" @click="cmd('bold')"><q-icon name="format_bold" size="20px" /></button>
        <button type="button" class="dsrte__btn" title="Italic" @click="cmd('italic')"><q-icon name="format_italic" size="20px" /></button>
        <button type="button" class="dsrte__btn" title="Underline" @click="cmd('underline')"><q-icon name="format_underlined" size="20px" /></button>
        <span class="dsrte__sep"></span>
        <button type="button" class="dsrte__btn" title="Numbered list" @click="cmd('insertOrderedList')"><q-icon name="format_list_numbered" size="20px" /></button>
        <button type="button" class="dsrte__btn" title="Bulleted list" @click="cmd('insertUnorderedList')"><q-icon name="format_list_bulleted" size="20px" /></button>
        <span class="dsrte__sep"></span>
        <button type="button" class="dsrte__btn" title="Align left" @click="cmd('justifyLeft')"><q-icon name="format_align_left" size="20px" /></button>
        <button type="button" class="dsrte__btn" title="Align center" @click="cmd('justifyCenter')"><q-icon name="format_align_center" size="20px" /></button>
        <button type="button" class="dsrte__btn" title="Align right" @click="cmd('justifyRight')"><q-icon name="format_align_right" size="20px" /></button>
        <span class="dsrte__sep"></span>
        <button type="button" class="dsrte__btn" title="Insert link" @click="addLink"><q-icon name="link" size="20px" /></button>
        <span class="dsrte__sep"></span>
        <button type="button" class="dsrte__btn" title="Undo" @click="cmd('undo')"><q-icon name="undo" size="20px" /></button>
        <button type="button" class="dsrte__btn" title="Redo" @click="cmd('redo')"><q-icon name="redo" size="20px" /></button>
        <span class="dsrte__sep"></span>
        <button type="button" class="dsrte__btn dsrte__format">
          <q-icon name="format_color_text" size="18px" /> <span>Formatting</span> <q-icon name="expand_more" size="18px" />
          <q-menu anchor="bottom left" self="top left">
            <q-list style="min-width:160px">
              <q-item v-for="f in FORMATS" :key="f.block" clickable v-close-popup @click="cmd('formatBlock', f.block)">
                <q-item-section>{{ f.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </button>

        <span class="dsrte__spacer"></span>

        <q-btn outline no-caps color="primary" class="dsrte__action" label="Restore to Default" @click="restoreDefault" />
        <q-btn outline no-caps color="primary" class="dsrte__action" label="Personalization" icon-right="expand_more">
          <q-menu anchor="bottom right" self="top right" :offset="[0, 8]">
            <ds-personalization-menu :tokens="tokens" @select="insertToken" />
          </q-menu>
        </q-btn>
      </div>

      <q-editor
        ref="editorRef"
        :model-value="modelValue"
        @update:model-value="(v) => emit('update:modelValue', v)"
        :toolbar="[]"
        :min-height="minHeight"
        flat
        class="dsrte__editor"
        content-class="dsrte__content"
      />
    </div>

    <!-- Inline {{ menu, positioned at the caret -->
    <Teleport to="body">
      <div v-if="inlineOpen" class="dsrte__inline"
        :style="{ position: 'fixed', left: inlinePos.left + 'px', top: inlinePos.top + 'px', zIndex: 7000,
          border: '1px solid var(--ds-color-border)', borderRadius: 'var(--ds-radius-md)',
          boxShadow: 'var(--ds-shadow-3)', background: 'var(--ds-color-surface)' }">
        <ds-personalization-menu ref="inlineMenuRef" :tokens="tokens" @select="insertInlineToken" />
      </div>
    </Teleport>
  </DsField>
</template>

<style scoped>
.dsrte { border: 1px solid var(--ds-color-border-container); border-radius: var(--ds-radius-md); overflow: hidden; background: var(--ds-color-surface); }
.dsrte__toolbar {
  display: flex; align-items: center; gap: 2px; flex-wrap: wrap;
  padding: 8px 12px; border-bottom: 1px solid var(--ds-color-border-container);
}
.dsrte__btn {
  display: inline-flex; align-items: center; gap: 4px;
  height: 32px; min-width: 32px; padding: 0 6px;
  border: 0; background: transparent; color: var(--ds-color-text); cursor: pointer;
  border-radius: var(--ds-radius-sm);
}
.dsrte__btn:hover { background: var(--ds-color-surface-sunken); }
.dsrte__format { padding: 0 8px; font: inherit; font-size: 0.9375rem; }
.dsrte__format span { color: var(--ds-color-text-subtle); }
.dsrte__sep { width: 1px; height: 22px; background: var(--ds-color-border); margin: 0 6px; }
.dsrte__spacer { flex: 1 1 auto; }
.dsrte__action { margin-left: 8px; }
/* Editor body */
.dsrte__editor :deep(.q-editor__toolbar) { display: none; }
.dsrte__editor :deep(.dsrte__content) { padding: 20px 24px; font-size: 0.9375rem; line-height: 1.6; color: var(--ds-color-text); }
.dsrte__editor :deep(.q-editor__content a) { color: var(--ds-color-text-brand); }
</style>
