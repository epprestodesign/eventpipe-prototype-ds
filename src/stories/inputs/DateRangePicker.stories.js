/** INPUTS / Date Range Picker → DsDateRangePicker (QBtn + QMenu + custom calendar) */
import { ref, computed } from 'vue'
import DsDateRangePicker from '../../components/DsDateRangePicker.vue'
import { DEFAULT_PRESETS, formatRange } from '../../components/dateRangeMath.js'

/* Every story pins "today" so the calendar, the presets and the screenshots
   are identical on every run, whatever the real date is. */
const TODAY = '2026-09-29'

export default {
  title: 'Components/Forms/Date Range Picker',
  component: DsDateRangePicker,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
**Date Range Picker** picks a reporting period. An outlined trigger shows the
applied range ("Sep 22, 2026 – Sep 29, 2026"); it opens a popover with a
**preset rail**, **two months side by side**, **typed start / end inputs** and
**Cancel / Apply**.

The popover edits a draft. Nothing is emitted until **Apply**, so a screen
filtered by it recalculates once per decision, not once per click. **Cancel**,
Escape or a click outside discard the draft; the next open starts from the
applied range again.

\`\`\`html
<ds-date-range-picker v-model="range" today="2026-09-29" min="2026-01-01" max="2026-09-29" />
<!-- range = { start: '2026-09-01', end: '2026-09-29', preset: 'thisMonth' } -->
\`\`\`

## When to use
- Filtering a report, ledger or chart by a period — Transactions, Payouts, Dashboard.

## When not to use
- A single date (a due date, a birthday) → **Input Date**.
- Stay dates in a booking search → **Date Picker** (QDate range in a field).

## Behaviour
- **Selecting:** click a start day, then an end day. A click before the start
  starts again. Hovering previews the pending range. A single day is a valid
  range (Apply with only a start picks that one day).
- **Presets:** Today · Yesterday · This week · Last week · This month · Last
  month · This year · Last year · All time. Weeks start on **Sunday**.
  "This …" runs from the start of the period **to today** (nothing in a ledger
  is in the future); "Last …" is the whole previous period. **All time** runs
  from \`min\` to today and is left out when there is no \`min\`. A hand-picked
  range that equals a preset lights that preset up.
- **Typed dates:** "M / D / YYYY", synced both ways with the calendar. A date
  applies to the calendar as soon as it parses; an invalid or out-of-bounds
  date is flagged on blur and never applied.
- **Bounds:** days outside \`min\`/\`max\` are drawn disabled and cannot be
  picked, typed or reached by a preset.

## API
| Prop | Type | Default | |
| --- | --- | --- | --- |
| \`v-model\` | \`{ start, end, preset? }\` | \`null\` | ISO \`YYYY-MM-DD\` strings; emitted on Apply only |
| \`today\` | ISO string | real today | pin it in stories and tests |
| \`min\` / \`max\` | ISO string | \`null\` | selectable bounds; \`min\` is the floor of All time |
| \`presets\` | array | all nine | keys (\`'thisMonth'\`) or \`{ key, label, range }\` |
| \`label\` | string | \`'Date range'\` | the dialog's accessible name |
| \`placeholder\` | string | \`'Select dates'\` | trigger text with nothing applied |
| \`align\` | \`left\` \\| \`right\` | \`left\` | which trigger edge the popover lines up with |
| \`inline\` | boolean | \`false\` | render the panel in place, no trigger |
| \`default-open\` | boolean | \`false\` | open on mount |

Events: \`update:modelValue\`, \`apply(value)\`, \`cancel\`.

## Accessibility
- The popover is a **dialog** named by \`label\`; the trigger has
  \`aria-haspopup="dialog"\` and \`aria-expanded\`, and focus returns to it on close.
- Each month is a **grid**; day cells are buttons named with the full date
  ("Tuesday, September 29, 2026, today, end date"). One day is tabbable:
  **arrow keys** move by day / week, **Home / End** to the week's ends,
  **Page Up / Down** by month — crossing into a month off screen scrolls the
  calendar. Enter or Space picks the day.
- Presets are toggle buttons (\`aria-pressed\`); typed inputs have labels,
  \`aria-invalid\` and a live error message.

## Quasar mapping
Trigger = \`QBtn outline\`, popover = \`QMenu\`, inputs = \`QInput outlined dense\`.
The calendar is custom: QDate draws one month and cannot draw a band that
spans a row. Date maths lives in \`dateRangeMath.js\` (unit-tested).
` } } },
  argTypes: {
    today: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    align: { control: 'inline-radio', options: ['left', 'right'] },
    inline: { control: 'boolean' },
    disable: { control: 'boolean' },
    defaultOpen: { table: { disable: true } },
    presets: { table: { disable: true } },
    modelValue: { table: { disable: true } },
  },
  args: { today: TODAY },
}

/** A value readout under the picker, so a story shows what Apply emitted. */
const readout = `
  <div style="margin-top:16px; font-size:0.8125rem; color:var(--ds-color-text-subtle);">
    v-model: <code data-testid="dsdr-value">{{ JSON.stringify(range) }}</code>
  </div>`

const make = (initial, { props = '', open = false } = {}) => ({
  render: (args, context) => ({
    components: { DsDateRangePicker },
    setup: () => {
      const range = ref(initial)
      // Docs pages render every story at once; there an "open" story shows the
      // panel in place instead of stacking popovers over the page.
      const inDocs = context && context.viewMode === 'docs'
      return { range, args, openOnMount: open && !inDocs, inlineInDocs: open && inDocs }
    },
    template: `
      <div style="padding:24px; min-height:${open ? '620px' : '120px'};">
        <ds-date-range-picker v-model="range" v-bind="args" ${props}
          :default-open="openOnMount" :inline="inlineInDocs || args.inline" />
        ${readout}
      </div>`,
  }),
})

/** Closed, with a range applied — the trigger as it sits in a page header. */
export const Default = make({ start: '2026-09-22', end: '2026-09-29', preset: null })

/** Open on Sep 22 – 29, 2026: start and end are filled Azure circles, the days
 *  between are the band, today (Sep 29) carries the dot. October's days are
 *  disabled because `max` is today — a ledger has no future. */
export const Open = make({ start: '2026-09-22', end: '2026-09-29', preset: null },
  { props: 'min="2026-01-01" max="2026-09-29"', open: true })

/** "Last month" applied: the preset is highlighted in the rail, and the
 *  calendar shows August through September. */
export const PresetSelected = make({ start: '2026-08-01', end: '2026-08-31', preset: 'lastMonth' },
  { props: 'min="2026-01-01" max="2026-09-29"', open: true })
PresetSelected.storyName = 'Preset selected'

/** A range that crosses a month boundary, entered with the typed inputs.
 *  Try typing "2 / 30 / 2026" — it is flagged and never applied. */
export const TypedDates = make({ start: '2026-08-24', end: '2026-09-11', preset: null },
  { props: 'min="2026-01-01" max="2026-09-29"', open: true })
TypedDates.storyName = 'Typed dates'

/** A trimmed rail: presets can be listed by key, or defined as
 *  `{ key, label, range }` — here a "Last 30 days" the default rail omits. */
export const CustomPresets = {
  render: () => ({
    components: { DsDateRangePicker },
    setup: () => {
      const presets = [
        'today',
        { key: 'last7', label: 'Last 7 days', range: (t) => ({ start: shift(t, -6), end: t }) },
        { key: 'last30', label: 'Last 30 days', range: (t) => ({ start: shift(t, -29), end: t }) },
        'thisMonth',
        'lastMonth',
      ]
      return { range: ref({ start: '2026-08-31', end: '2026-09-29', preset: 'last30' }), presets, today: TODAY }
    },
    template: `
      <div style="padding:24px; min-height:120px;">
        <ds-date-range-picker v-model="range" :today="today" :presets="presets" max="2026-09-29" />
        ${readout}
      </div>`,
  }),
}
CustomPresets.storyName = 'Custom presets'

function shift(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Every prop on the controls panel. The readout shows the applied value and
 *  the trigger text a consumer would print. */
export const Playground = {
  args: { today: TODAY, min: '2026-01-01', max: '2026-09-29', label: 'Date range', placeholder: 'Select dates', align: 'left', inline: false, disable: false },
  render: (args) => ({
    components: { DsDateRangePicker },
    setup: () => {
      const range = ref(null)
      const text = computed(() => (range.value ? formatRange(range.value) : '—'))
      return { args, range, text, presetKeys: DEFAULT_PRESETS.map((p) => p.key).join(', ') }
    },
    template: `
      <div style="padding:24px; min-height:560px;">
        <ds-date-range-picker v-model="range" v-bind="args" />
        ${readout}
        <div style="margin-top:4px; font-size:0.8125rem; color:var(--ds-color-text-subtle);">Label: {{ text }}</div>
        <div style="margin-top:4px; font-size:0.8125rem; color:var(--ds-color-text-subtle);">Preset keys: {{ presetKeys }}</div>
      </div>`,
  }),
}
