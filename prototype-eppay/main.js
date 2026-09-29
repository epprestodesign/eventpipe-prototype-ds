/* Standalone EP Pay prototype — the same screens as Storybook, wired together
 * so the nav actually navigates. Mounted the same way as prototype/main.js. */
import { createApp, ref, watch } from 'vue'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import * as QComponents from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import 'quasar/src/css/index.sass'
import '../src/css/app.scss'

import App from './App.vue'
import liquidPoster from '../src/assets/login-loops/b-liquid-showcase-poster.webp'
import liquidWebm from '../src/assets/login-loops/b-liquid-showcase-web-1080.webm'
import liquidMp4 from '../src/assets/login-loops/b-liquid-showcase-web-1080.mp4'

const app = createApp(App)
app.use(Quasar, { plugins: { Notify, Dialog, Loading } })

/* Sign-in background: video concept B (Liquid showcase) on every sign-in step,
   chosen by the user 2026-09-29 (replacing concept C, Venue journey). A pre-rendered video, so the evaluation-only
   `shaders` package is never used here (vite.eppay.config.js also stubs it out
   of the bundle). See Av2Showcase's `av2ShowcaseGround`. */
/* Who is signed in and where they chose to go. Set by the sign-in "Where to?"
   picker (App.vue), shown in every screen's top bar (epPage), switchable from
   there. Kept in sessionStorage so a refresh keeps the choice. */
const read = (k, d) => { try { return sessionStorage.getItem(k) || d } catch { return d } }
const session = { org: ref(read('eppay.org', 'Team Travel Source')), user: ref('Jeffrey Upp') }
watch(session.org, (v) => { try { sessionStorage.setItem('eppay.org', v) } catch { /* private mode */ } })
app.provide('eppaySession', session)

app.provide('av2ShowcaseGround', { poster: liquidPoster, webm: liquidWebm, mp4: liquidMp4 })

// Register every Q* component globally, as .storybook/preview.js does, because
// the screens are template strings that reference <q-*> tags directly.
for (const [name, component] of Object.entries(QComponents)) {
  if (/^Q[A-Z]/.test(name) && component &&
      (component.render || component.setup || component.__name || component.name)) {
    app.component(name, component)
  }
}

app.mount('#app')
