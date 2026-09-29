/* Standalone EP Pay prototype — the same screens as Storybook, wired together
 * so the nav actually navigates. Mounted the same way as prototype/main.js. */
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

// Register every Q* component globally, as .storybook/preview.js does, because
// the screens are template strings that reference <q-*> tags directly.
for (const [name, component] of Object.entries(QComponents)) {
  if (/^Q[A-Z]/.test(name) && component &&
      (component.render || component.setup || component.__name || component.name)) {
    app.component(name, component)
  }
}

app.mount('#app')
