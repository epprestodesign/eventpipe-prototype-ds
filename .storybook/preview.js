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

// Theme toolbar → Quasar Dark (see withQuasarTheme.js). The CSS makes the
// preview canvas follow the dark surface when Dark is on.
import { withQuasarTheme } from './withQuasarTheme.js'
import './preview-theme.css'

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
  decorators: [withQuasarTheme],
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
            // Charts: ordered by chart type, then shared building blocks, then
            // the renderer research (experimental) last.
            'Charts', [
              'Overview', 'Line', 'Area', 'Bar', 'Bar List', 'Stacked Bar', 'Donut', 'Sparkline', 'Metric Card',
              'Shared Elements', ['Chart Card', 'Header', 'Legend', 'Tooltip', 'States', 'Data Table'],
              'Research', ['Renderer Comparison'],
            ],
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
            // Aug 19 · full duplicate of Phase 2, taken at 55e7672, kept as a
            // separate sandbox so edits there cannot disturb the delivered
            // Phase 2 screens. Same internal ordering as Phase 2 above.
            'Aug 19', [
              'Requirements Coverage',
              // Concepts sit above the built screens: they are the open
              // questions, and burying them under the settled work is how they
              // stop getting looked at.
              'Concepts',
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
              'Components', [
                // Shared first: it holds the reusable pieces the screen-specific
                // groups below all draw on.
                'Shared',
                'Notification Preferences',
                'Company Settings',
                'Event Registration Settings',
                'Team Detail',
              ],
            ],
            'Multiple Secondary Fees', [
              'Requirements Coverage',
              // Screens first (the proposal), then the current-state baseline
              // they're read against.
              'Screens', [
                '01 · Event Fees',
                '02 · Hotel Sync Settings',
                '03 · Housing Company Policies',
                '04 · Reservation Summary',
              ],
              'References',
            ],
            'GB Reminder Controls', [
              'Introduction',
              'Requirements Coverage',
              // Concepts sit above the built screens — they are the open
              // questions, and burying them under settled work is how they stop
              // getting looked at. Same reasoning as Aug 19.
              'Concepts',
              'Screens', [
                '01 · Edit Event — Email Settings',
                '02 · Registration Settings',
              ],
              // Components in the order of the screens they belong to.
              'Components', [
                'Email Settings',
                'Registration Settings',
              ],
              'References',
              // Sept 10 · full duplicate of the folder above, taken at b430c96
              // and holding Scott's 09/09 review edits, so the version he
              // reviewed stays browsable and the links already in PP-42/43/44
              // keep resolving. Same internal ordering as the parent.
              'Sept 10', [
                'Introduction',
                'Requirements Coverage',
                'Concepts',
                'Screens', [
                  '01 · Edit Event — Email Settings',
                  '02 · Registration Settings',
                ],
                'Components', [
                  'Email Settings',
                  'Registration Settings',
                ],
                'References',
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
          // Account V2 — the platform staff sign-in and account security from
          // Linear P-ENG-228 (Auth: Login Refactor to Blitz + MFA). Flows are
          // launch scope, one per ticket; authenticator apps are scheduled for
          // later (ENG-3033) and kept in their own group so they never read as
          // launch scope. The admin platform's older Account section is untouched.
          'Account V2', [
            'Flows', [
              '01 · Sign in',
              '02 · Email code',
              '03 · Forgot & set password',
              '04 · Account security',
              '05 · MFA is coming',
            ],
            'Emails',
            'Later · Authenticator app (ENG-3033)', [
              'Challenge',
              'Setup',
              'Recovery codes',
            ],
            'Concepts',
          ],
          // EP Pay — a separate product rather than a Labs experiment, so it
          // gets its own section, below Labs.
          'EP Pay', [
            'Screens', [
              '01 · Login',
              '02 · Dashboard',
              '03 · Balances',
              '04 · Transactions',
              '05 · Disputes',
              '06 · Developer',
              '07 · Merchant Application',
              // Concepts, not specified product — no requirements exist for
              // these five areas anywhere in Linear (checked 2026-09-29).
              '08 · Unbuilt Areas', [
                'Customers',
                'Payment Links',
                'Products',
                'Subscriptions',
                'Invoicing',
              ],
            ],
            'Components',
          ],
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
