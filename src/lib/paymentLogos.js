// Payment-method logos, sourced from the repo-root /creditCards SVG set.
// Keyed by file basename (e.g. 'Visa', 'Amex', 'GooglePay'). The base files
// (no -1/-2 suffix) are the default treatment we use.
const mods = import.meta.glob('/creditCards/*.svg', { eager: true, query: '?url', import: 'default' })

const logos = {}
for (const [path, url] of Object.entries(mods)) {
  const name = path.split('/').pop().replace('.svg', '')
  logos[name] = url
}

export const paymentLogo = (name) => logos[name] || null
export default logos
