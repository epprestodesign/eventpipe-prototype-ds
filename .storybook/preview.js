import { setup } from '@storybook/vue3-vite'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import * as QComponents from 'quasar'

// Icon + font extras
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'

// Quasar core styles — imported from SASS source so our brand
// variables (src/css/quasar.variables.scss) are applied.
import 'quasar/src/css/index.sass'

// Our global styles + component-level overrides.
import '../src/css/app.scss'

// Register Quasar as a Vue plugin for every story, then globally
// register every Q* component so any story template can use <q-*>
// tags directly without per-file imports.
setup((app) => {
  // App-level providers (Quasar plugins). These power the imperative
  // patterns used by the design system: Snackbar (Notify), programmatic
  // Dialog, and Backdrop/Loading overlays.
  app.use(Quasar, { plugins: { Notify, Dialog, Loading } })

  for (const [name, component] of Object.entries(QComponents)) {
    if (
      /^Q[A-Z]/.test(name) &&
      component &&
      (component.render || component.setup || component.__name || component.name)
    ) {
      app.component(name, component)
    }
  }
})

/** @type { import('@storybook/vue3-vite').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        grey: { name: 'grey', value: '#f5f5f7' },
        dark: { name: 'dark', value: '#141218' }
      }
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Design-system information architecture: order the sidebar the way
    // designers/product think, not alphabetically. Raw Quasar lives under
    // "Catalog" at the bottom for reference during migration.
    options: {
      storySort: {
        order: [
          'Getting Started',
          'Foundations',
          'Components', [
            'Overview',
            'Actions', 'Navigation', 'Forms', 'Feedback & Status',
            'Layout & Structure', 'Media & Visuals', 'Typography & Content',
          ],
          'App Chrome',
          'Account',
          'Pages', [
            '01 Users', '02 Events', '03 Pickup Reports', '04 Reports', '05 Hotels',
            '06 Hotel Brands', '07 Amenities', '08 Room Types', '09 Venues', '10 Event Companies',
            '11 Companies', '12 Requests', '14 Admin Tools', '15 Pipe Tools', '16 Webhooks',
            '17 Company Settings', 'Drafts',
          ],
          'Design Requests', [
            // Phase 1 (formerly "DES-207 Communications | Email Template
            // Editor") sits above Phase 2 so the two read in the order the work
            // happened.
            'Teams Mgmt Comms Phase 1', [
              'V1 · Notifications Preferences',
              'V2 · Configured Template',
              'Components',
            ],
            'Teams Mgmt Comms Phase 2', [
              'Requirements Coverage',
              'First-Time Setup', [
                'Notification Preferences',
                'Default Emails',
              ],
              'Screens', [
                'Notification Preferences',
                'Company Settings',
                'Event Registration Settings',
                'Team Detail',
              ],
              // Components are grouped by the screen they belong to, in the same
              // order as Screens above, so the two halves of the sidebar read
              // against each other.
              'Components', [
                'Notification Preferences',
                'Company Settings',
                'Event Registration Settings',
                'Team Detail',
              ],
            ],
            'DES-95 Customized Page Revamp', [
              'Customized Event Site Edits 072426',
              'References', [
                '01 · Live Event Edit',
                '02 · Customize (Edit)',
                '03 · Customize (View)',
              ],
              'Archive', [
                'Customize Event Site',
                'Rob Concept #1',
              ],
            ],
          ],
          '*',
          // Experimental workspaces — pinned to the very bottom (after the wildcard).
          'Event Producer Portal',
          'Eventpipe Labs',
        ],
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
}

export default preview
