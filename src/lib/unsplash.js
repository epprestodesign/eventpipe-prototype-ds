// Runtime Unsplash client for Storybook + prototypes.
// Uses the Unsplash REST API directly from the browser. The access key is read
// from a Vite env var so it is never hardcoded:
//   .env  ->  VITE_UNSPLASH_ACCESS_KEY=your_key
//
// IMPORTANT:
// - A browser-exposed key is a "demo" key (50 req/hr). Do NOT ship the key in a
//   public build (e.g. GitHub Pages) — the component degrades gracefully when no
//   key is present.
// - Unsplash API Guidelines require attribution + triggering the download
//   endpoint when an image is actually used (handled below).

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const API = 'https://api.unsplash.com'
const UTM = '?utm_source=eventpipe_ds&utm_medium=referral'

export const hasUnsplashKey = () => Boolean(ACCESS_KEY)

function mapPhoto(p) {
  const authorUrl = (p.user?.links?.html || 'https://unsplash.com') + UTM
  return {
    id: p.id,
    urls: p.urls, // { raw, full, regular, small, thumb }
    alt: p.alt_description || p.description || 'Unsplash photo',
    color: p.color,
    author: p.user?.name || 'Unsplash',
    authorUrl,
    downloadLocation: p.links?.download_location,
    attributionHtml:
      `Photo by <a href="${authorUrl}" target="_blank" rel="noopener">${p.user?.name || 'Unsplash'}</a>` +
      ` on <a href="https://unsplash.com${UTM}" target="_blank" rel="noopener">Unsplash</a>`,
  }
}

async function api(pathOrUrl) {
  if (!ACCESS_KEY) throw new Error('Missing VITE_UNSPLASH_ACCESS_KEY')
  const base = pathOrUrl.startsWith('http') ? pathOrUrl : API + pathOrUrl
  const sep = base.includes('?') ? '&' : '?'
  const res = await fetch(`${base}${sep}client_id=${ACCESS_KEY}`)
  if (!res.ok) throw new Error(`Unsplash ${res.status}`)
  return res.json()
}

export async function searchPhotos(query, { perPage = 10, orientation } = {}) {
  const q = new URLSearchParams({ query, per_page: String(perPage) })
  if (orientation) q.set('orientation', orientation)
  const data = await api(`/search/photos?${q.toString()}`)
  return (data.results || []).map(mapPhoto)
}

export async function randomPhoto(query, { orientation } = {}) {
  const q = new URLSearchParams()
  if (query) q.set('query', query)
  if (orientation) q.set('orientation', orientation)
  const data = await api(`/photos/random?${q.toString()}`)
  return mapPhoto(Array.isArray(data) ? data[0] : data)
}

// Unsplash guideline: register a download when an image is actually used.
export async function triggerDownload(downloadLocation) {
  if (!ACCESS_KEY || !downloadLocation) return
  try { await api(downloadLocation) } catch { /* non-blocking */ }
}
