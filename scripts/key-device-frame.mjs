// Turns a generated device mock-up (solid green screen, transparent background)
// into a frame with a transparent screen, and prints where the screen sits as
// percentages of the frame. Those go into start-here.css so a screenshot can be
// placed behind the opening.
//
//   node scripts/key-device-frame.mjs <input.png> <output.webp> <width> <phone|laptop|tablet>
import { chromium } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'
const [, , input, output, outWidth, kind] = process.argv
const b64 = (await readFile(input)).toString('base64')
const browser = await chromium.launch()
const page = await browser.newPage()
const result = await page.evaluate(async ({ b64, outWidth, kind }) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
  const W = img.width, H = img.height
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0)
  const d = ctx.getImageData(0, 0, W, H); const p = d.data
  const green = new Uint8Array(W * H)
  for (let i = 0; i < W * H; i++) {
    const r = p[i * 4], g = p[i * 4 + 1], b = p[i * 4 + 2], a = p[i * 4 + 3]
    if (a > 40 && g > 70 && g > r * 1.6 + 20 && g > b * 1.6 + 20) green[i] = 1
  }
  // screen = everything enclosed by the green: per row and per column extents
  const xl = new Int32Array(H).fill(-1), xr = new Int32Array(H).fill(-1), yt = new Int32Array(W).fill(-1), yb = new Int32Array(W).fill(-1)
  let minX = W, maxX = 0, minY = H, maxY = 0
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (green[y * W + x]) {
    if (xl[y] < 0) xl[y] = x; xr[y] = x; if (yt[x] < 0) yt[x] = y; yb[x] = y
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y
  }
  const sw = maxX - minX, sh = maxY - minY
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    if (xl[y] < 0 || yt[x] < 0 || x < xl[y] || x > xr[y] || y < yt[x] || y > yb[x]) continue
    const i = (y * W + x) * 4
    // keep the phone's camera pill: opaque, dark, top-centre of the screen
    if (kind === 'phone' && y < minY + sh * 0.075 && x > minX + sw * 0.3 && x < minX + sw * 0.7 && p[i + 3] > 200 && Math.max(p[i], p[i + 1], p[i + 2]) < 70) continue
    p[i + 3] = 0
  }
  // despill: any leftover green tint on the bezel edge becomes neutral
  for (let i = 0; i < W * H; i++) { const j = i * 4; const m = Math.max(p[j], p[j + 2]); if (p[j + 3] && p[j + 1] > m + 8) p[j + 1] = m }
  ctx.putImageData(d, 0, 0)
  // crop to the opaque bounds, then scale
  let bx0 = W, bx1 = 0, by0 = H, by1 = 0
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (p[(y * W + x) * 4 + 3] > 20) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y }
  const cw = bx1 - bx0 + 1, ch = by1 - by0 + 1
  const o = document.createElement('canvas'); o.width = +outWidth; o.height = Math.round(ch * outWidth / cw)
  const octx = o.getContext('2d'); octx.imageSmoothingQuality = 'high'; octx.drawImage(c, bx0, by0, cw, ch, 0, 0, o.width, o.height)
  const pct = (v, t) => +(v / t * 100).toFixed(3)
  return { url: o.toDataURL('image/webp', 0.92), size: [o.width, o.height],
    screen: { left: pct(minX - bx0, cw), top: pct(minY - by0, ch), width: pct(sw + 1, cw), height: pct(sh + 1, ch) },
    cornerPx: (() => { let n = 0; while (!green[(minY + n) * W + minX + n] && n < sw) n++; return +(n / cw * 100).toFixed(3) })() }
}, { b64, outWidth, kind })
await writeFile(output, Buffer.from(result.url.split(',')[1], 'base64'))
console.log(kind, JSON.stringify({ size: result.size, screen: result.screen, corner: result.cornerPx }))
await browser.close()
