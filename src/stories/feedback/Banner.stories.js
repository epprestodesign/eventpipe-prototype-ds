/** FEEDBACK / Banner → Quasar: QBanner, styled after the Atlassian Flag pattern */
export default {
  title: 'Components/Feedback & Status/Banner',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Prominent, page-level message that persists until acted on. Styled after the
**Atlassian Flag** pattern — an icon, a bold **title**, a **description**, optional
**action links**, and a **dismiss (×)**.

## Appearances (Atlassian Flag structure, DS Alert colors)
Each appearance uses the **same hue convention as Alert** — a soft \`background.*\`
surface, a matching \`background.*-bold\` border, and a \`text.*\` accent on the
icon, title, and action links:
- **Default** — neutral surface + border. **Info** — blue. **Success** — green.
  **Warning** — amber. **Error** — rose/danger (body text also danger).

## When to use
- App-wide announcements, booking-status notices, required actions.

## When not to use
- Section-scoped messages → **Alert**. Transient feedback → **Snackbar / Toast**.
` } } },
}

// Appearance → token map — the same hue convention as Alert: a soft
// `background.*` surface, a matching `background.*-bold` border, and a `text.*`
// accent on the icon, title, and action links. Body stays subtle (error: danger).
const APP = {
  default: { bg: 'var(--ds-color-surface)',                border: 'var(--ds-color-border)',                 accent: 'var(--ds-color-text)',         body: 'var(--ds-color-text-subtle)', icon: 'campaign' },
  info:    { bg: 'var(--ds-color-background-info)',         border: 'var(--ds-color-background-info-bold)',    accent: 'var(--ds-color-text-info)',    body: 'var(--ds-color-text-subtle)', icon: 'info' },
  success: { bg: 'var(--ds-color-background-success)',      border: 'var(--ds-color-background-success-bold)', accent: 'var(--ds-color-text-success)', body: 'var(--ds-color-text-subtle)', icon: 'check_circle' },
  warning: { bg: 'var(--ds-color-background-warning)',      border: 'var(--ds-color-background-warning-bold)', accent: 'var(--ds-color-text-warning)', body: 'var(--ds-color-text-subtle)', icon: 'warning' },
  error:   { bg: 'var(--ds-color-background-danger)',       border: 'var(--ds-color-background-danger-bold)',  accent: 'var(--ds-color-text-danger)',  body: 'var(--ds-color-text-danger)', icon: 'error' },
}

const banner = (appearance, title, desc, { actions = [], dismissible = true } = {}) => {
  const a = APP[appearance]
  const links = actions
    .map((label) => `<button class="ds-banner__link" style="background:none;border:0;padding:0;cursor:pointer;color:${a.accent};font-weight:700;font-size:14px">${label}</button>`)
    .join(`<span style="opacity:.4;color:${a.body}">·</span>`)
  const dismiss = dismissible
    ? `<button aria-label="Dismiss" style="background:none;border:0;cursor:pointer;color:${a.accent};opacity:.7;flex:none;display:flex;align-items:center;padding:2px"><q-icon name="close" size="18px" /></button>`
    : ''
  return `
    <div style="display:flex;align-items:flex-start;gap:12px;max-width:660px;padding:16px;background:${a.bg};border:1px solid ${a.border};border-radius:12px;margin-bottom:14px">
      <q-icon name="${a.icon}" size="22px" style="color:${a.accent};flex:none;margin-top:1px" />
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:15px;line-height:1.3;color:${a.accent}">${title}</div>
        <div style="font-size:14px;line-height:1.45;color:${a.body};margin-top:3px">${desc}</div>
        ${actions.length ? `<div style="display:flex;align-items:center;gap:14px;margin-top:12px">${links}</div>` : ''}
      </div>
      ${dismiss}
    </div>`
}

/** All appearances, with realistic hotel-booking edge cases. */
export const Appearances = {
  render: () => ({ template: `
    <div>
      ${banner('success', 'Reservation confirmed', 'Deluxe King at The Grand Plaza is booked for Jun 2–6 (4 nights). A confirmation was sent to youraccount@eventpipe.com.', { actions: ['View itinerary', 'Add to calendar'] })}
      ${banner('info', 'Check-in is tomorrow', 'Your stay at The Grand Plaza begins tomorrow at 3:00pm. The front desk is open 24/7 for early arrivals.', { actions: ['View booking'] })}
      ${banner('warning', 'Your held rooms release soon', '12 rooms in your group block are held until 4:00pm today. Confirm now to keep your rate.', { actions: ['Confirm block', 'Extend hold'] })}
      ${banner('error', 'Payment couldn’t be processed', 'We couldn’t complete your booking and your dates aren’t secured yet. Update your payment method to try again.', { actions: ['Update payment', 'Try again'] })}
      ${banner('default', 'Travel advisory', 'Severe weather may affect arrivals into Boston Logan (BOS) this weekend. Check with your airline for delays.', { actions: ['View advisory', 'Dismiss'] })}
    </div>` }),
}

/** A single high-priority error, non-dismissible (must be acted on). */
export const RequiredAction = {
  name: 'Required action',
  render: () => ({ template: `
    <div>
      ${banner('error', 'This property is now sold out for your dates', 'The Grand Plaza has no availability for Jun 2–6. Choose new dates or a nearby hotel to continue.', { actions: ['Find similar hotels', 'Change dates'], dismissible: false })}
    </div>` }),
}
