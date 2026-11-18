/* Building blocks for the hand-designed docs pages (Start Here, the Design
 * Requests and Labs overviews). Storybook renders MDX with React even in a Vue
 * project, so these are React components; they are written with
 * createElement because this repo has no JSX build step outside MDX.
 *
 *   Go       — a link to another Storybook page that navigates in place
 *   Browser  — a browser-window frame around a screenshot
 *   Laptop   — a photoreal laptop frame with a screenshot in its screen
 *
 * EventPipe is a desktop application, so there is no phone or tablet frame.
 *
 * The screenshots are live stories, captured by scripts/capture-start-here.mjs.
 * The laptop frame (devices/laptop-silver.webp) is a generated product shot
 * with the screen cut out; the screenshot is placed behind that opening.
 */
import React from 'react'
import { addons } from 'storybook/preview-api'
import laptopFrame from './devices/laptop-silver.webp'
import './start-here.css'

const h = React.createElement

/** A link to a docs page (or, with `story`, a canvas). `to` is the story id. */
export function Go({ to, story = false, className, children }) {
  const path = `?path=/${story ? 'story' : 'docs'}/${to}`
  const onClick = (event) => {
    // Let cmd/ctrl/shift/middle-click open a new tab the normal way.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return
    event.preventDefault()
    addons.getChannel().emit('navigateUrl', path)
  }
  return h('a', { href: `./${path}`, target: '_top', className, onClick }, children)
}

const shot = (src, alt) => h('img', { src, alt, loading: 'lazy', className: 'sh-shot' })

export function Browser({ src, alt, className = '' }) {
  return h('div', { className: `sh-browser ${className}` },
    h('div', { className: 'sh-browser__bar', 'aria-hidden': true }, h('i'), h('i'), h('i')),
    shot(src, alt))
}

/* The frame image, its shape, and where its cut-out screen sits, as percentages
 * of the frame (printed by scripts/key-device-frame.mjs). */
const LAPTOP = { img: laptopFrame, ratio: '1600 / 1039', screen: [3.568, 3.969, 92.864, 88.55], radius: '0.4% / 0.7%' }

/** A photoreal laptop with a screenshot behind its cut-out screen. */
export function Laptop({ src, alt, className = '' }) {
  const [left, top, width, height] = LAPTOP.screen
  return h('div', { className: `sh-device sh-laptop ${className}`, style: { aspectRatio: LAPTOP.ratio } },
    h('img', { src, alt, className: 'sh-device__screen', style: { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, borderRadius: LAPTOP.radius } }),
    h('img', { src: LAPTOP.img, alt: '', 'aria-hidden': true, className: 'sh-device__frame' }))
}
