/** The renderer boundary.
 *
 *  This is the ONLY module in the chart family that imports Chart.js. Chart
 *  components talk to it through the renderer-agnostic prop API
 *  (labels / series / format / legend / height / states) — no Chart.js config
 *  object is part of any public prop. Swapping the renderer (e.g. to Unovis,
 *  see Components/Charts/Research/Renderer Comparison) means replacing this
 *  module and the two internal components that call it, not the public API.
 *
 *  Only the controllers/elements/scales we use are registered, so Chart.js
 *  tree-shakes to what the catalog needs.
 */
import {
  Chart,
  LineController, BarController, DoughnutController,
  LineElement, PointElement, BarElement, ArcElement,
  CategoryScale, LinearScale,
  Filler, Tooltip,
} from 'chart.js'

Chart.register(
  LineController, BarController, DoughnutController,
  LineElement, PointElement, BarElement, ArcElement,
  CategoryScale, LinearScale,
  Filler, Tooltip,
)

export { Chart }

/** Create a chart on `canvas`. Destroys any chart already bound to it. */
export function createChart(canvas, config) {
  const existing = Chart.getChart(canvas)
  if (existing) existing.destroy()
  return new Chart(canvas, config)
}

/** Programmatically activate every visible dataset at `index` and show the
 *  tooltip there — used for keyboard navigation. */
export function activateIndex(chart, index) {
  if (!chart) return
  const active = []
  chart.data.datasets.forEach((ds, datasetIndex) => {
    if (!chart.isDatasetVisible(datasetIndex)) return
    const v = ds.data[index]
    if (v === null || v === undefined) return
    active.push({ datasetIndex, index })
  })
  // Keep the tooltip open on a category where every value is missing: anchor
  // it on the first dataset's element so "No data" can still be announced.
  const anchor = active.length ? active : [{ datasetIndex: 0, index }]
  chart.setActiveElements(active)
  const meta = chart.getDatasetMeta(anchor[0].datasetIndex)
  const el = meta?.data?.[index]
  chart.tooltip.setActiveElements(anchor, { x: el?.x ?? 0, y: el?.y ?? 0 })
  chart.update('none')
}

export function clearActive(chart) {
  if (!chart) return
  chart.setActiveElements([])
  chart.tooltip.setActiveElements([], { x: 0, y: 0 })
  chart.update('none')
}
