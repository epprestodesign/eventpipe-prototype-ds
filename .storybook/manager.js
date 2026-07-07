/* DES-207 "Publish content" toolbar addon.
 * Adds a Storybook toolbar button (native chrome) with a GitHub token field +
 * Save / Discard. Save reads the current Controls (args), merges them into
 * des207-content.json, and commits to main via the GitHub API so the edited
 * copy sticks for everyone. Only shows on the V1 story (detected by its args). */
import React, { useState } from 'react'
import { addons, types, useArgs } from 'storybook/manager-api'
import { WithTooltip, IconButton } from 'storybook/internal/components'
import content from '../src/stories/design-requests/des207-content.json'

const ADDON_ID = 'des207-publish'
const TOOL_ID = `${ADDON_ID}/tool`
const TOKEN_KEY = 'ep_gh_token'

const GH = { owner: 'epprestodesign', repo: 'eventpipe-prototype-ds', branch: 'main', path: 'src/stories/design-requests/des207-content.json' }
const API = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${GH.path}`
const hdr = (token) => ({ Authorization: `token ${token}`, Accept: 'application/vnd.github+json' })

function readToken() { try { return localStorage.getItem(TOKEN_KEY) || '' } catch (e) { return '' } }

// Merge the current Controls (args) over the committed content.
function buildJson(args) {
  return {
    sections: content.sections.map((s, si) => ({
      ...s,
      items: s.items.map((it, ii) => ({
        ...it,
        title: args[`s${si}i${ii}_title`] ?? it.title,
        desc: args[`s${si}i${ii}_desc`] ?? it.desc,
      })),
    })),
  }
}

async function commit(token, args) {
  const cur = await fetch(`${API}?ref=${GH.branch}`, { headers: hdr(token) })
  if (!cur.ok) throw new Error(cur.status === 401 ? 'Token rejected (401) — needs Contents: write' : `Read failed (${cur.status})`)
  const sha = (await cur.json()).sha
  const text = JSON.stringify(buildJson(args), null, 2) + '\n'
  const b64 = btoa(unescape(encodeURIComponent(text))) // UTF-8-safe base64
  const res = await fetch(API, {
    method: 'PUT',
    headers: hdr(token),
    body: JSON.stringify({ message: 'content(des-207): update notification template copy', content: b64, sha, branch: GH.branch }),
  })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `Save failed (${res.status})`) }
  return res.json()
}

const h = React.createElement

function Panel() {
  const [args, updateArgs, resetArgs] = useArgs()
  const [token, setToken] = useState(readToken)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null) // { msg, ok }

  const onToken = (e) => { const v = e.target.value; setToken(v); try { localStorage.setItem(TOKEN_KEY, v) } catch (_) {} }
  const onDiscard = () => { if (typeof resetArgs === 'function') resetArgs(); setStatus({ msg: 'Reverted to the published copy.', ok: true }) }
  const onSave = async () => {
    if (!token) { setStatus({ msg: 'Enter a GitHub token with write access first.', ok: false }); return }
    setBusy(true); setStatus({ msg: 'Saving…', ok: true })
    try {
      const out = await commit(token, args)
      setStatus({ msg: `Saved ✓ commit ${out.commit.sha.slice(0, 7)} — redeploying (~1–2 min), then everyone sees it.`, ok: true })
    } catch (err) {
      setStatus({ msg: `Error: ${err.message}`, ok: false })
    } finally { setBusy(false) }
  }

  const inputStyle = { width: '100%', padding: '6px 8px', border: '1px solid #c9cdd3', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }
  const btn = (label, onClick, primary, disabled) => h('button', {
    onClick, disabled,
    style: {
      flex: 1, padding: '7px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: disabled ? 'default' : 'pointer',
      border: primary ? '0' : '1px solid #c9cdd3', color: primary ? '#fff' : '#2e3438',
      background: primary ? (disabled ? '#9db8e8' : '#1876D2') : '#fff',
    },
  }, label)

  return h('div', { style: { padding: '14px', width: '320px', display: 'flex', flexDirection: 'column', gap: '10px' } }, [
    h('div', { key: 'h', style: { fontWeight: 700, fontSize: '13px' } }, 'Publish content to GitHub'),
    h('div', { key: 'sub', style: { fontSize: '11px', color: '#73797e', marginTop: '-4px' } }, 'Edit the copy in the Controls panel, then Save.'),
    h('input', { key: 'tok', type: 'password', value: token, onChange: onToken, placeholder: 'GitHub token (Contents: write)', style: inputStyle }),
    h('div', { key: 'btns', style: { display: 'flex', gap: '8px' } }, [
      btn(busy ? 'Saving…' : 'Save to GitHub', onSave, true, busy),
      btn('Discard', onDiscard, false, busy),
    ]),
    status && h('div', { key: 'st', style: { fontSize: '12px', fontWeight: 600, color: status.ok ? '#2e7d32' : '#c62828' } }, status.msg),
    h('div', { key: 'note', style: { fontSize: '11px', color: '#9aa0a6' } }, 'Your token stays in this browser and is sent only to GitHub.'),
  ])
}

function Tool() {
  const [args] = useArgs()
  // Only appear on the story that has these content controls (V1 Notifications).
  if (!args || !Object.prototype.hasOwnProperty.call(args, 's0i0_title')) return null
  return h(WithTooltip, {
    placement: 'bottom',
    trigger: 'click',
    closeOnOutsideClick: true,
    tooltip: () => h(Panel),
  }, h(IconButton, { title: 'Publish content to GitHub' }, '✎ Publish content'))
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Publish content',
    match: ({ viewMode }) => viewMode === 'story',
    render: () => h(Tool),
  })
})
