// Standalone prototype app entry — mirrors the Storybook preview.js Quasar setup
// so the DS components render identically outside Storybook.
import { createApp } from 'vue'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import * as QComponents from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import 'quasar/src/css/index.sass'
import '../src/css/app.scss'

import App from './App.vue'

const app = createApp(App)
app.use(Quasar, { plugins: { Notify, Dialog, Loading } })

// Globally register every Q* component (same as .storybook/preview.js).
for (const [name, component] of Object.entries(QComponents)) {
  if (
    /^Q[A-Z]/.test(name) &&
    component &&
    (component.render || component.setup || component.__name || component.name)
  ) {
    app.component(name, component)
  }
}

app.mount('#app')
