/** Theme decorator — connects the Storybook "Theme" toolbar (from the already-
 *  installed @storybook/addon-themes) to Quasar's real Dark plugin.
 *
 *  Why not the `backgrounds` dark swatch: that only repaints the preview
 *  canvas. Components, charts, tooltips and cards stay light on a dark
 *  background. This decorator flips Quasar's actual theme state
 *  (Dark.set → body.body--dark), and the DS dark tokens in
 *  src/css/ds-theme-dark.scss hang off that class.
 *
 *  No leaking between stories: the decorator runs on every story render and
 *  sets Dark from (story override || toolbar) every time, so a story that
 *  forced dark cannot leave the next story dark.
 *
 *  Per-story override:  parameters: { themes: { themeOverride: 'dark' } }
 *  - Canvas view: applies it to Quasar Dark, the same as the toolbar.
 *  - Docs view: many stories share one page, and Quasar Dark is page-global,
 *    so the override is applied as a LOCAL scope (.ds-theme-dark wrapper)
 *    instead — the one story renders dark without flipping its neighbours.
 */
import { Dark } from 'quasar'
import { DecoratorHelpers } from '@storybook/addon-themes'

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers

export const THEMES = ['light', 'dark']
initializeThemeState(THEMES, 'light')

export const withQuasarTheme = (storyFn, context) => {
  const selected = pluckThemeFromContext(context) || 'light'
  const { themeOverride } = context.parameters.themes ?? {}
  const inDocs = context.viewMode === 'docs'

  const pageTheme = inDocs ? selected : (themeOverride || selected)
  Dark.set(pageTheme === 'dark')

  const localScope = inDocs && themeOverride && themeOverride !== selected ? themeOverride : null
  if (!localScope) return storyFn()
  return {
    components: { Story: storyFn() },
    template: `<div class="ds-theme-${localScope}" style="padding:16px; border-radius:4px;"><story /></div>`,
  }
}
