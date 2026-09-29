/** Chart theme — resolves the DS colour tokens into concrete values at runtime.
 *
 *  Canvas renderers cannot read `var(--token)`, so charts resolve every colour
 *  they draw with from the CSS custom properties on their OWN root element.
 *  That is what makes theming work: under Quasar's Dark plugin (body--dark) or
 *  a local .ds-theme-dark / .ds-theme-light scope, the same lookup returns the
 *  dark or light value. No hex literals live in chart components.
 *
 *  useChartTheme() re-resolves whenever Quasar's dark state changes.
 */
import { ref, watch, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'

const TOKENS = {
  'chart-1': '--ds-color-chart-1',
  'chart-2': '--ds-color-chart-2',
  'chart-3': '--ds-color-chart-3',
  'chart-4': '--ds-color-chart-4',
  'chart-5': '--ds-color-chart-5',
  comparison: '--ds-color-chart-comparison',
  grid: '--ds-color-chart-grid',
  axis: '--ds-color-chart-axis',
  track: '--ds-color-chart-track',
  text: '--ds-color-text',
  textSubtle: '--ds-color-text-subtle',
  surface: '--ds-color-surface',
}

/** Read every chart token off `el`. Returns plain strings. */
export function resolveChartTheme(el) {
  const cs = getComputedStyle(el || document.documentElement)
  const out = {}
  for (const [k, v] of Object.entries(TOKENS)) out[k] = cs.getPropertyValue(v).trim()
  out.fontFamily = cs.fontFamily || 'sans-serif'
  return out
}

/** CSS custom property for a colour slot: 'chart-1' → var(--ds-color-chart-1),
 *  'comparison' → var(--ds-color-chart-comparison). For HTML/SVG marks, which
 *  can use the token directly and so follow the theme with no JS. */
export function slotVar(slot) {
  const name = String(slot).startsWith('chart-') ? slot : `chart-${slot}`
  return `var(--ds-color-${name})`
}

/** `#RRGGBB` / `#RGB` / `rgb()` → rgba() with the given alpha. */
export function withAlpha(color, alpha) {
  const c = String(color).trim()
  if (c.startsWith('#')) {
    let h = c.slice(1)
    if (h.length === 3) h = h.split('').map((x) => x + x).join('')
    const n = parseInt(h.slice(0, 6), 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
  }
  const m = /rgba?\(([^)]+)\)/.exec(c)
  if (m) {
    const [r, g, b] = m[1].split(/[ ,/]+/).filter(Boolean)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return c
}

/**
 * Reactive theme for a chart root element.
 * @param {import('vue').Ref<HTMLElement|null>} rootRef
 */
export function useChartTheme(rootRef) {
  const $q = useQuasar()
  const theme = ref(null)
  const refresh = () => { if (rootRef.value) theme.value = resolveChartTheme(rootRef.value) }
  onMounted(refresh)
  // Dark.set() swaps the body class synchronously; resolve on the next tick so
  // the new custom-property values have applied.
  watch(() => $q.dark.isActive, () => nextTick(refresh))
  return { theme, refresh }
}
