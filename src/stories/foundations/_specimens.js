/* Specimen blocks for the Foundations docs pages. Storybook renders MDX with
 * React even in a Vue project, so these are React components, written with
 * createElement because this repo has no JSX build step outside MDX.
 *
 * Every value shown is read from the live CSS custom properties (or from
 * _tokens-data.js, which is generated from the SCSS), so a page can't drift
 * from the tokens it documents.
 */
import React, { useEffect, useRef, useState } from 'react'
import '../start-here/start-here.css'
import './foundations.css'

const h = React.createElement

/** Dark or light text, whichever reads on the given hex. */
export const inkOn = (hex) => {
  const n = parseInt(hex.slice(1, 7), 16)
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#1B2437' : '#FFFFFF'
}

/** The page header band: pattern on the right, title and one-line purpose. */
export function Band({ art, eyebrow = 'Foundations', title, children }) {
  return h('div', { className: 'sh-band', style: { '--sh-art': `url("${art}")` } },
    h('div', { className: 'sh-eyebrow' }, eyebrow),
    h('h1', { className: 'sh-h1' }, title),
    h('p', { className: 'sh-lede' }, children))
}

/** Click-to-copy wrapper: copies `text`, shows "Copied" for a moment. */
function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = (text) => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1200) }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, done)
    else done()
  }
  return [copied, copy]
}

/** One hue family as a single strip, 50 → 950. Click a step to copy its variable. */
export function Ramp({ ramp, big = false }) {
  const [copied, copy] = useCopy()
  const [last, setLast] = useState('')
  const slug = ramp.family.toLowerCase()
  return h('div', { className: `fd-ramp${big ? ' fd-ramp--big' : ''}` },
    h('div', { className: 'fd-ramp__head' },
      h('span', { className: 'fd-ramp__name' }, ramp.family),
      h('code', null, copied ? `Copied ${last}` : `--ds-palette-${slug}-*`)),
    h('div', { className: 'fd-ramp__strip' },
      ramp.steps.map((s) => h('button', {
        key: s.step, type: 'button', className: 'fd-ramp__cell',
        style: { background: s.hex, color: inkOn(s.hex) },
        title: `Copy var(${s.varName})`,
        onClick: () => { setLast(`${slug}-${s.step}`); copy(`var(${s.varName})`) },
      }, h('span', { className: 'fd-ramp__step' }, s.step), h('span', { className: 'fd-ramp__hex' }, s.hex)))))
}

/** A semantic colour token: swatch, name, what it's for, and what it maps to. */
export function Role({ token }) {
  const [copied, copy] = useCopy()
  // "color.text.brand" and "elevation.surface.sunken" both live under --ds-color-*
  const varName = `--ds-color-${token.name.split('.').slice(1).join('-')}`
  const transparent = token.hex.length === 9 && token.hex.endsWith('00')
  return h('button', { type: 'button', className: 'fd-role', title: `Copy var(${varName})`, onClick: () => copy(`var(${varName})`) },
    h('span', { className: `fd-role__chip${transparent ? ' fd-role__chip--none' : ''}`, style: transparent ? undefined : { background: token.hex } }),
    h('span', { className: 'fd-role__body' },
      h('code', null, copied ? 'Copied' : varName),
      h('span', { className: 'fd-role__desc' }, token.desc)),
    h('span', { className: 'fd-role__meta' },
      h('span', null, transparent ? 'Transparent' : token.hex),
      token.primitive && token.primitive !== token.hex && !transparent ? h('span', { className: 'fd-role__prim' }, token.primitive) : null))
}

/** The live value of a CSS custom property, e.g. "4px". */
export function TokenValue({ name }) {
  const [value, setValue] = useState('')
  useEffect(() => { setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim()) }, [name])
  return h('span', { className: 'fd-value' }, value || '…')
}

/** A type style shown at its real size, with its measured size, leading and weight. */
export function TypeRow({ cls, label, sample }) {
  const ref = useRef(null)
  const [meta, setMeta] = useState('')
  useEffect(() => {
    const cs = getComputedStyle(ref.current)
    const size = parseFloat(cs.fontSize)
    const lh = parseFloat(cs.lineHeight)
    const leading = Number.isFinite(lh) ? (lh / size).toFixed(2).replace(/\.?0+$/, '') : 'normal'
    setMeta(`${+size.toFixed(1)}px · ${leading} · ${cs.fontWeight}`)
  }, [cls])
  return h('div', { className: 'fd-type' },
    h('div', { className: 'fd-type__meta' },
      h('span', { className: 'fd-type__label' }, label),
      h('code', null, `.${cls}`),
      h('span', { className: 'fd-type__nums' }, meta)),
    h('div', { className: 'fd-type__sample' }, h('div', { ref, className: cls }, sample)))
}

/** Dots that travel a track on each token's duration or easing. */
export function MotionDemo({ rows, kind }) {
  const [on, setOn] = useState(false)
  return h('div', { className: 'fd-motion' },
    h('button', { type: 'button', className: 'sh-btn sh-btn--ghost fd-motion__play', onClick: () => setOn(!on) }, on ? 'Play back' : 'Play'),
    rows.map((r) => h('div', { key: r.token, className: 'fd-motion__row' },
      h('div', { className: 'fd-motion__meta' },
        h('span', { className: 'fd-type__label' }, r.label),
        h('code', null, r.token),
        h('span', { className: 'fd-type__nums' }, h(TokenValue, { name: r.token }))),
      h('div', { className: 'fd-motion__track' },
        h('span', {
          className: `fd-motion__dot${on ? ' is-on' : ''}`,
          style: kind === 'duration'
            ? { transitionDuration: `var(${r.token})`, transitionTimingFunction: 'var(--ds-ease-standard)' }
            : { transitionDuration: '900ms', transitionTimingFunction: `var(${r.token})` },
        })),
      h('div', { className: 'fd-motion__use' }, r.use))))
}
