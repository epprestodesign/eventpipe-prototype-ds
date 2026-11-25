/* Building blocks for the hand-designed docs pages (Start Here, the Design
 * Requests and Labs overviews). Storybook renders MDX with React even in a Vue
 * project, so these are React components; they are written with
 * createElement because this repo has no JSX build step outside MDX.
 *
 *   Go       — a link to another Storybook page that navigates in place
 *   Browser  — a browser-window frame around a screenshot
 *
 * EventPipe is a desktop application, so screens are shown in browser windows,
 * never in a phone or tablet.
 *
 * The screenshots are live stories, captured by scripts/capture-start-here.mjs.
 */
import React from 'react'
import { addons } from 'storybook/preview-api'
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
