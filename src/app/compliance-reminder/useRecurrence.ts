import { ref, computed, type Ref } from 'vue'

export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export interface RecurrenceSeed {
  every?: number
  unit?: string
  days?: number[]
  ends?: string
  endsOn?: string
  endsAfter?: number
}

/**
 * Google-Calendar-style recurrence state + human-readable summary. In the real
 * app, map `summary`/state to an RRULE before persisting.
 */
export function useRecurrence(initial: RecurrenceSeed = {}) {
  const every: Ref<number> = ref(initial.every ?? 1)
  const unit: Ref<string> = ref(initial.unit ?? 'week')
  const days: Ref<number[]> = ref(initial.days ?? [1, 4, 6]) // Mon, Thu, Sat
  const ends: Ref<string> = ref(initial.ends ?? 'never')
  const endsOn: Ref<string> = ref(initial.endsOn ?? '2026-08-06')
  const endsAfter: Ref<number> = ref(initial.endsAfter ?? 13)

  const summary = computed<string>(() => {
    const picked = [...days.value].sort((a, b) => a - b).map((d) => DAY_NAMES[d]).join(', ')
    let s = unit.value === 'week' ? 'Weekly' : `Every ${every.value} ${unit.value}`
    if (picked) s += ` on ${picked}`
    if (ends.value === 'on') s += `, until ${endsOn.value}`
    if (ends.value === 'after') s += `, ${endsAfter.value} times`
    return s
  })

  const presets = computed<string[]>(() => [
    'Does not repeat', 'Daily', 'Every weekday (Mon–Fri)', summary.value, 'Custom…',
  ])

  function toggleDay(d: number): void {
    const i = days.value.indexOf(d)
    if (i === -1) days.value.push(d)
    else days.value.splice(i, 1)
  }

  return { every, unit, days, ends, endsOn, endsAfter, summary, presets, toggleDay, DAY_LABELS }
}
