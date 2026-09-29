<script setup>
// DsDateRangePicker — an outlined trigger showing the applied range
// ("Sep 22, 2026 – Sep 29, 2026") that opens a popover with a preset rail, two
// months side by side, typed start/end inputs and Cancel / Apply.
//
// The popover edits a *draft*. Nothing is emitted until Apply, so a report
// filtered by this control never re-queries on every click; Cancel, Escape or
// a click outside throw the draft away and the next open starts from the
// applied value again.
//
// v-model: { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD', preset: key | null }.
// All date maths lives in dateRangeMath.js (unit-tested); this file is layout,
// state and keyboard handling.
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { QMenu } from 'quasar'
import {
  DEFAULT_PRESETS, WEEKDAYS_SHORT, presetRange, clampRange, todayISO, addDays, addMonths,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, weekday, monthGrid, formatRange,
  formatFull, formatMonth, formatTyped, parseTyped, parseISO,
} from './dateRangeMath.js'

const props = defineProps({
  /** { start, end, preset? } as ISO strings; null = nothing applied yet. */
  modelValue: { type: Object, default: null },
  /** What "today" is. Defaults to the real date; stories pin it. */
  today: { type: String, default: () => todayISO() },
  /** Earliest / latest selectable day. `min` is also the floor of "All time". */
  min: { type: String, default: null },
  max: { type: String, default: null },
  /** Preset rail. Keys from DEFAULT_PRESETS ('thisMonth'…), or objects
   *  { key, label, range? } where `range` is { start, end } or (today) => range. */
  presets: { type: Array, default: null },
  /** Accessible name for the dialog and the prefix of the trigger's name. */
  label: { type: String, default: 'Date range' },
  placeholder: { type: String, default: 'Select dates' },
  /** Which trigger edge the popover lines up with. */
  align: { type: String, default: 'left' }, // left | right
  /** Open on mount (stories, screenshots). */
  defaultOpen: { type: Boolean, default: false },
  /** Render the panel in place, always visible, with no trigger. */
  inline: { type: Boolean, default: false },
  disable: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'apply', 'cancel'])

const uid = `dsdr-${Math.random().toString(36).slice(2, 8)}`

/* ---------------------------------------------------------------- presets */

const presetList = computed(() => {
  const src = props.presets || DEFAULT_PRESETS
  return src
    .map((p) => (typeof p === 'string' ? DEFAULT_PRESETS.find((d) => d.key === p) : p))
    .filter(Boolean)
    .map((p) => ({ ...p, value: rangeFor(p) }))
    .filter((p) => p.value) // 'All time' drops out when there is no floor
})

function rangeFor(p) {
  let r
  if (typeof p.range === 'function') r = p.range(props.today)
  else if (p.range) r = p.range
  else r = presetRange(p.key, props.today, { min: props.min })
  return r ? clampRange(r, { min: props.min, max: props.max }) : null
}

function matchPresetKey(r) {
  if (!r || !r.start || !r.end) return null
  const hit = presetList.value.find((p) => p.value.start === r.start && p.value.end === r.end)
  return hit ? hit.key : null
}

/* ------------------------------------------------------------ draft state */

const open = ref(false)
const draft = ref({ start: null, end: null })
const preset = ref(null)
const hover = ref(null)
const view = ref(startOfMonth(props.today)) // first of the LEFT month
const focusIso = ref(props.today)
const typedStart = ref('')
const typedEnd = ref('')
const touched = ref({ start: false, end: false })

/* Two months side by side; one on a phone, where two do not fit. */
const narrow = ref(false)
let mq = null
const onMq = () => { narrow.value = !!(mq && mq.matches) }
onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  mq = window.matchMedia('(max-width: 760px)')
  onMq()
  mq.addEventListener('change', onMq)
})
onBeforeUnmount(() => { if (mq) mq.removeEventListener('change', onMq) })
const monthCount = computed(() => (narrow.value ? 1 : 2))
/** Last day on screen. */
const lastShown = computed(() => endOfMonth(addMonths(view.value, monthCount.value - 1)))

const applied = computed(() => (props.modelValue && props.modelValue.start ? props.modelValue : null))
const triggerLabel = computed(() => (applied.value ? formatRange(applied.value) : props.placeholder))
const appliedPreset = computed(() => (applied.value ? applied.value.preset || matchPresetKey(applied.value) : null))

function syncTyped() {
  typedStart.value = draft.value.start ? formatTyped(draft.value.start) : ''
  typedEnd.value = draft.value.end ? formatTyped(draft.value.end) : ''
  touched.value = { start: false, end: false }
}

/** Show `start` in the left month — unless the range runs past the right
 *  month, in which case show where it ends. */
function showRange(start, end) {
  if (!start) { view.value = addMonths(props.today, -1); return }
  const e = end || start
  const span = monthCount.value - 1
  view.value = e > endOfMonth(addMonths(start, span)) ? addMonths(e, -span) : startOfMonth(start)
}

function initDraft() {
  const a = applied.value
  draft.value = a ? { start: a.start, end: a.end } : { start: null, end: null }
  preset.value = a ? appliedPreset.value : null
  hover.value = null
  showRange(draft.value.start, draft.value.end)
  focusIso.value = draft.value.start || props.today
  syncTyped()
}

watch(() => props.modelValue, () => { if (props.inline || !open.value) initDraft() }, { deep: true })
initDraft()

/* ------------------------------------------------------------ calendar */

const months = computed(() => Array.from({ length: monthCount.value }, (_, i) => addMonths(view.value, i)).map((first) => {
  const rows = monthGrid(first)
  while (rows.length < 6) rows.push(new Array(7).fill(null)) // equal heights side by side
  return { first, title: formatMonth(first), rows }
}))

const prevDisabled = computed(() => !!props.min && view.value <= startOfMonth(props.min))
const nextDisabled = computed(() => !!props.max && addMonths(view.value, monthCount.value) > props.max)

const isDisabled = (iso) => (props.min && iso < props.min) || (props.max && iso > props.max)

/** The range being drawn: the draft, or start → hovered day while picking the end. */
const shown = computed(() => {
  const { start, end } = draft.value
  if (start && !end && hover.value && hover.value >= start) return { start, end: hover.value, preview: true }
  return { start, end, preview: false }
})

function cellClass(iso) {
  const { start, end, preview } = shown.value
  if (!iso) return 'is-empty'
  const cls = []
  const isStart = iso === start
  const isEnd = !!end && iso === end
  const inRange = !!start && !!end && iso >= start && iso <= end && start !== end
  if (inRange) {
    // Band ends round off at the range ends, at row wraps and at month edges.
    const roundL = isStart || weekday(iso) === 0 || iso === startOfMonth(iso)
    const roundR = isEnd || weekday(iso) === 6 || iso === endOfMonth(iso)
    const alone = (isStart && roundR) || (isEnd && roundL) // a start on a Saturday has no band to draw
    if (!alone) {
      cls.push('has-band')
      if (roundL) cls.push('band-l')
      if (roundR) cls.push('band-r')
      if (isStart) cls.push('band-from-mid')
      if (isEnd) cls.push('band-to-mid')
      if (preview) cls.push('is-preview')
    }
  }
  return cls
}

function dayClass(iso) {
  const { start, end, preview } = shown.value
  return {
    'is-start': iso === start,
    'is-end': !!end && iso === end && !(preview && iso !== start),
    'is-preview-end': preview && iso === end && iso !== start,
    'is-inside': !!start && !!end && iso > start && iso < end,
    'is-today': iso === props.today,
    'is-disabled': isDisabled(iso),
  }
}

function dayLabel(iso) {
  const bits = [formatFull(iso)]
  if (iso === props.today) bits.push('today')
  if (iso === draft.value.start) bits.push('start date')
  if (draft.value.end && iso === draft.value.end) bits.push('end date')
  if (isDisabled(iso)) bits.push('unavailable')
  return bits.join(', ')
}

const isSelected = (iso) => {
  const { start, end } = draft.value
  return !!start && (end ? iso >= start && iso <= end : iso === start)
}

function pickDay(iso) {
  if (isDisabled(iso)) return
  const { start, end } = draft.value
  if (!start || end || iso < start) {
    draft.value = { start: iso, end: null }
    preset.value = null
  } else {
    draft.value = { start, end: iso }
    preset.value = matchPresetKey(draft.value)
    hover.value = null
  }
  focusIso.value = iso
  syncTyped()
}

function pickPreset(p) {
  draft.value = { ...p.value }
  preset.value = p.key
  hover.value = null
  showRange(p.value.start, p.value.end)
  focusIso.value = p.value.start
  syncTyped()
}

function shiftView(n) { view.value = addMonths(view.value, n) }

/* Roving tabindex: one day in the two grids is tabbable. */
const tabbable = computed(() => (focusIso.value >= view.value && focusIso.value <= lastShown.value ? focusIso.value : view.value))

const root = ref(null)
function focusDay(iso) {
  nextTick(() => {
    const el = document.querySelector(`#${uid} [data-iso="${iso}"]`)
    if (el) el.focus()
  })
}

function onDayKey(e, iso) {
  const moves = {
    ArrowLeft: () => addDays(iso, -1),
    ArrowRight: () => addDays(iso, 1),
    ArrowUp: () => addDays(iso, -7),
    ArrowDown: () => addDays(iso, 7),
    Home: () => startOfWeek(iso),
    End: () => endOfWeek(iso),
    PageUp: () => sameDayInMonth(iso, -1),
    PageDown: () => sameDayInMonth(iso, 1),
  }
  const move = moves[e.key]
  if (!move) return
  e.preventDefault()
  const next = move()
  if (next < view.value) view.value = startOfMonth(next)
  else if (next > lastShown.value) view.value = addMonths(next, -(monthCount.value - 1))
  focusIso.value = next
  if (draft.value.start && !draft.value.end) hover.value = next
  focusDay(next)
}

function sameDayInMonth(iso, n) {
  const target = addMonths(iso, n)
  const day = Math.min(parseISO(iso).getUTCDate(), parseISO(endOfMonth(target)).getUTCDate())
  return `${target.slice(0, 8)}${String(day).padStart(2, '0')}`
}

/* ------------------------------------------------------------ typed inputs */

const typedStartIso = computed(() => parseTyped(typedStart.value))
const typedEndIso = computed(() => parseTyped(typedEnd.value))
const startInvalid = computed(() => touched.value.start && !!typedStart.value
  && (!typedStartIso.value || isDisabled(typedStartIso.value)))
const endInvalid = computed(() => touched.value.end && !!typedEnd.value
  && (!typedEndIso.value || isDisabled(typedEndIso.value) || (draft.value.start && typedEndIso.value < draft.value.start)))

/** Apply a typed date as soon as it parses; leave the draft alone while it does not. */
function onTyped(which, text) {
  if (which === 'start') typedStart.value = text
  else typedEnd.value = text
  const iso = parseTyped(text)
  if (!iso || isDisabled(iso)) return
  if (which === 'start') {
    const end = draft.value.end && draft.value.end < iso ? null : draft.value.end
    draft.value = { start: iso, end }
    if (!end) typedEnd.value = ''
  } else {
    if (!draft.value.start || iso < draft.value.start) return
    draft.value = { start: draft.value.start, end: iso }
  }
  preset.value = matchPresetKey(draft.value)
  showRange(draft.value.start, draft.value.end)
  focusIso.value = iso
}

/** On blur, tidy a valid entry into the canonical "M / D / YYYY". */
function onTypedBlur(which) {
  touched.value = { ...touched.value, [which]: true }
  const iso = which === 'start' ? typedStartIso.value : typedEndIso.value
  const current = which === 'start' ? draft.value.start : draft.value.end
  if (iso && iso === current) {
    if (which === 'start') typedStart.value = formatTyped(iso)
    else typedEnd.value = formatTyped(iso)
  }
}

/* ------------------------------------------------------------ apply / cancel */

const canApply = computed(() => !!draft.value.start && !startInvalid.value && !endInvalid.value)

function apply() {
  if (!canApply.value) return
  const value = { start: draft.value.start, end: draft.value.end || draft.value.start }
  value.preset = preset.value || matchPresetKey(value)
  emit('update:modelValue', value)
  emit('apply', value)
  open.value = false
}

function cancel() {
  emit('cancel')
  if (props.inline) initDraft()
  open.value = false
}

/* ------------------------------------------------------------ popover */

const trigger = ref(null)

function onShow() { focusDay(tabbable.value) }
function onHide() {
  // QMenu hands focus back to QBtn's internal focus-helper span, which is not
  // the button a screen reader announces — and after a programmatic open
  // (defaultOpen) nothing to return to at all. Put it on the trigger itself,
  // unless the person has already moved on to something outside the picker.
  const el = trigger.value && trigger.value.$el
  if (!el) return
  setTimeout(() => {
    const a = document.activeElement
    if (!a || a === document.body || el.contains(a)) el.focus()
  })
}

const menuBindings = computed(() => (props.inline
  ? { class: 'dsdr dsdr--inline' }
  : {
      class: 'dsdr dsdr--menu',
      modelValue: open.value,
      'onUpdate:modelValue': (v) => { open.value = v },
      // The trigger toggles `open` itself; without this QMenu would also
      // toggle on the same click and cancel it out.
      noParentEvent: true,
      anchor: props.align === 'right' ? 'bottom right' : 'bottom left',
      self: props.align === 'right' ? 'top right' : 'top left',
      offset: [0, 8],
      maxHeight: '92vh',
      maxWidth: '96vw',
      onBeforeShow: initDraft,
      onShow,
      onHide,
    }))

onMounted(() => {
  if (props.defaultOpen && !props.inline) nextTick(() => { open.value = true })
})

defineExpose({ open: () => { open.value = true }, close: () => { open.value = false } })
</script>

<template>
  <span class="dsdr-root" :class="{ 'dsdr-root--inline': inline }" ref="root">
    <q-btn
      v-if="!inline"
      ref="trigger"
      outline
      no-caps
      color="grey-8"
      icon="calendar_today"
      class="dsdr__trigger"
      :disable="disable"
      :label="triggerLabel"
      aria-haspopup="dialog"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-label="`${label}: ${triggerLabel}`"
      @click="open = !open"
    />

    <component :is="inline ? 'div' : QMenu" v-bind="menuBindings">
      <div :id="uid" class="dsdr__panel" role="dialog" :aria-label="label" @keydown.esc.stop="cancel">
        <div class="dsdr__body">
          <!-- Preset rail -->
          <div class="dsdr__presets" role="group" aria-label="Preset ranges">
            <button
              v-for="p in presetList"
              :key="p.key"
              type="button"
              class="dsdr__preset"
              :class="{ 'is-active': preset === p.key }"
              :aria-pressed="preset === p.key ? 'true' : 'false'"
              @click="pickPreset(p)"
            >{{ p.label }}</button>
          </div>

          <!-- Two months -->
          <div class="dsdr__months" @mouseleave="hover = null">
            <div v-for="(m, mi) in months" :key="m.first" class="dsdr__month">
              <div class="dsdr__month-head">
                <q-btn
                  v-if="mi === 0" flat round dense icon="chevron_left" size="sm" class="dsdr__nav"
                  :disable="prevDisabled" aria-label="Previous month" @click="shiftView(-1)"
                />
                <span v-else class="dsdr__nav-spacer" />
                <div class="dsdr__month-title" :id="`${uid}-m${mi}`" aria-live="polite">{{ m.title }}</div>
                <q-btn
                  v-if="mi === months.length - 1" flat round dense icon="chevron_right" size="sm" class="dsdr__nav"
                  :disable="nextDisabled" aria-label="Next month" @click="shiftView(1)"
                />
                <span v-else class="dsdr__nav-spacer" />
              </div>

              <table class="dsdr__grid" role="grid" :aria-labelledby="`${uid}-m${mi}`">
                <thead>
                  <tr>
                    <th v-for="w in WEEKDAYS_SHORT" :key="w" scope="col" class="dsdr__wd">{{ w }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in m.rows" :key="ri">
                    <td v-for="(iso, ci) in row" :key="iso || `${ri}-${ci}`" class="dsdr__cell" :class="cellClass(iso)">
                      <button
                        v-if="iso"
                        type="button"
                        class="dsdr__day"
                        :class="dayClass(iso)"
                        :data-iso="iso"
                        :tabindex="iso === tabbable ? 0 : -1"
                        :aria-label="dayLabel(iso)"
                        :aria-selected="isSelected(iso) ? 'true' : 'false'"
                        :aria-disabled="isDisabled(iso) ? 'true' : undefined"
                        :aria-current="iso === today ? 'date' : undefined"
                        @click="pickDay(iso)"
                        @mouseenter="hover = iso"
                        @focus="focusIso = iso"
                        @keydown="onDayKey($event, iso)"
                      >{{ Number(iso.slice(8)) }}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer: typed dates + actions -->
        <div class="dsdr__footer">
          <div class="dsdr__typed">
            <q-input
              :model-value="typedStart"
              outlined dense hide-bottom-space no-error-icon
              class="dsdr__input"
              placeholder="M / D / YYYY"
              aria-label="Start date (M / D / YYYY)"
              :error="startInvalid"
              :aria-invalid="startInvalid ? 'true' : 'false'"
              :aria-describedby="`${uid}-err`"
              @update:model-value="onTyped('start', $event)"
              @blur="onTypedBlur('start')"
              @keydown.enter.prevent="onTypedBlur('start')"
            />
            <span class="dsdr__dash" aria-hidden="true">–</span>
            <q-input
              :model-value="typedEnd"
              outlined dense hide-bottom-space no-error-icon
              class="dsdr__input"
              placeholder="M / D / YYYY"
              aria-label="End date (M / D / YYYY)"
              :error="endInvalid"
              :aria-invalid="endInvalid ? 'true' : 'false'"
              :aria-describedby="`${uid}-err`"
              @update:model-value="onTyped('end', $event)"
              @blur="onTypedBlur('end')"
              @keydown.enter.prevent="onTypedBlur('end')"
            />
          </div>
          <span class="dsdr__spacer" />
          <div class="dsdr__actions">
            <q-btn unelevated no-caps class="ds-btn--secondary" label="Cancel" @click="cancel" />
            <q-btn unelevated no-caps color="primary" label="Apply" :disable="!canApply" @click="apply" />
          </div>
        </div>
        <div :id="`${uid}-err`" class="dsdr__error" aria-live="polite">
          <template v-if="startInvalid || endInvalid">
            Enter a date as M / D / YYYY{{ min || max ? ' within the available range' : '' }}, with the end on or after the start.
          </template>
        </div>
      </div>
    </component>
  </span>
</template>

<style scoped>
.dsdr-root { display: inline-block; }
.dsdr-root--inline { display: block; }

.dsdr__trigger { height: 40px; padding: 0 16px; font-weight: var(--ds-font-weight-regular); }
.dsdr__trigger :deep(.q-icon) { font-size: 20px; }

/* ------------------------------------------------ panel */
.dsdr--inline {
  display: inline-block;
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  box-shadow: var(--ds-shadow-2);
}
.dsdr__panel { background: var(--ds-color-surface); color: var(--ds-color-text); }
.dsdr__body { display: flex; }

/* ------------------------------------------------ preset rail */
.dsdr__presets {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 160px;
  flex: none;
  padding: var(--ds-space-3);
  border-right: 1px solid var(--ds-color-border);
}
.dsdr__preset {
  height: 36px;
  padding: 0 var(--ds-space-3);
  border: 0;
  border-radius: var(--ds-radius-sm);
  background: transparent;
  color: var(--ds-color-text);
  font: inherit;
  font-size: var(--ds-font-size-md);
  text-align: left;
  cursor: pointer;
}
.dsdr__preset:hover { background: var(--ds-color-surface-sunken); }
.dsdr__preset.is-active {
  background: var(--ds-color-background-brand-subtlest);
  color: var(--ds-color-text-brand);
  font-weight: var(--ds-font-weight-medium);
}
.dsdr__preset:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: -2px; }

/* ------------------------------------------------ months */
.dsdr__months { display: flex; gap: var(--ds-space-6); padding: var(--ds-space-4) var(--ds-space-5) var(--ds-space-3); }
.dsdr__month-head { display: flex; align-items: center; height: 36px; margin-bottom: var(--ds-space-2); }
.dsdr__month-title { flex: 1; text-align: center; font-weight: var(--ds-font-weight-bold); font-size: var(--ds-font-size-md); }
.dsdr__nav { color: var(--ds-color-icon-subtle); }
.dsdr__nav-spacer { width: 32px; flex: none; }

.dsdr__grid { border-collapse: collapse; border-spacing: 0; }
.dsdr__wd {
  width: 40px;
  height: 32px;
  padding: 0;
  font-size: var(--ds-font-size-sm);
  font-weight: var(--ds-font-weight-medium);
  color: var(--ds-color-text-subtle);
  text-align: center;
}
.dsdr__cell { position: relative; width: 40px; height: 40px; padding: 0; text-align: center; }

/* The in-range band sits behind the day circles and spans the whole cell, so
   adjacent cells join into one strip across the row. */
.dsdr__cell.has-band::before {
  content: '';
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  right: 0;
  background: var(--ds-color-background-selected);
}
.dsdr__cell.band-from-mid::before { left: 50%; }
.dsdr__cell.band-to-mid::before { right: 50%; }
.dsdr__cell.band-l::before { border-top-left-radius: var(--ds-radius-pill); border-bottom-left-radius: var(--ds-radius-pill); }
.dsdr__cell.band-r::before { border-top-right-radius: var(--ds-radius-pill); border-bottom-right-radius: var(--ds-radius-pill); }
.dsdr__cell.band-from-mid.band-l::before, .dsdr__cell.band-to-mid.band-r::before { border-radius: 0; }
.dsdr__cell.is-preview::before { background: var(--ds-color-background-brand-subtlest); }

.dsdr__day {
  position: relative;
  z-index: 1;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ds-color-text);
  font: inherit;
  font-size: var(--ds-font-size-md);
  cursor: pointer;
}
.dsdr__day:hover:not(.is-start):not(.is-end):not(.is-disabled) { background: var(--ds-color-surface-sunken); }
.dsdr__day.is-inside:hover:not(.is-disabled) { background: var(--ds-color-background-brand-subtlest); }
.dsdr__day:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 1px; }
.dsdr__day.is-start,
.dsdr__day.is-end {
  background: var(--ds-color-background-brand-bold);
  color: var(--ds-color-text-inverse);
  font-weight: var(--ds-font-weight-bold);
}
.dsdr__day.is-preview-end { box-shadow: inset 0 0 0 1px var(--ds-color-border-brand); }
.dsdr__day.is-disabled { color: var(--ds-color-text-disabled); cursor: not-allowed; }

/* Today: a small dot under the number — inverse on a filled circle. */
.dsdr__day.is-today::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 4px;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 50%;
  background: var(--ds-color-background-brand-bold);
}
.dsdr__day.is-today.is-start::after,
.dsdr__day.is-today.is-end::after { background: var(--ds-color-text-inverse); }

/* ------------------------------------------------ footer */
.dsdr__footer {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) var(--ds-space-5);
  border-top: 1px solid var(--ds-color-border);
}
.dsdr__typed { display: flex; align-items: center; gap: var(--ds-space-2); }
.dsdr__input { width: 150px; }
.dsdr__dash { color: var(--ds-color-text-subtle); }
.dsdr__spacer { flex: 1; }
.dsdr__actions { display: flex; gap: var(--ds-space-2); }
.dsdr__error {
  padding: 0 var(--ds-space-5);
  font-size: var(--ds-font-size-sm);
  color: var(--ds-color-text-danger);
}
.dsdr__error:not(:empty) { padding-bottom: var(--ds-space-3); }

/* ------------------------------------------------ narrow screens */
@media (max-width: 760px) {
  .dsdr__panel { max-width: calc(100vw - 32px); }
  .dsdr__body { flex-direction: column; min-width: 0; }
  .dsdr__presets {
    flex-direction: row;
    width: auto;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid var(--ds-color-border);
  }
  .dsdr__preset { flex: none; }
  .dsdr__months { flex-direction: column; gap: var(--ds-space-4); padding: var(--ds-space-3); }
  .dsdr__footer { flex-wrap: wrap; padding: var(--ds-space-3); }
  .dsdr__input { width: 130px; }
}
</style>
