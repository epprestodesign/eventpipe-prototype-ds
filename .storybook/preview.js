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
          'Getting Started', ['Introduction', 'Story Template'],
          'Foundations', [
            'Palette', 'Colors', 'Typography', 'Icons', 'Imagery', 'Hero Banner', 'Elevation',
            'Spacing', 'Border Radius', 'Breakpoints', 'Motion',
          ],
          'Inputs', [
            'Button', 'Button Group', 'Checkbox', 'Radio Group', 'Switch',
            'Text Field', 'Text Area', 'Select', 'Autocomplete',
            'Date Picker', 'Time Picker', 'Slider',
            'Rating', 'Quantity Stepper', 'Transfer List',
          ],
          'Data Display', [
            'Avatar', 'Badge', 'Chip', 'Divider', 'Icon',
            'List', 'Table', 'Tooltip', 'Typography',
          ],
          'Feedback', [
            'Alert', 'Banner', 'Dialog', 'Drawer', 'Snackbar',
            'Progress', 'Skeleton', 'Backdrop',
          ],
          'Layout', [
            'Box', 'Container', 'Grid', 'Stack', 'Image List', 'Section Header',
          ],
          'Navigation', [
            'Global Nav', 'Tabs', 'Menu', 'Breadcrumbs', 'Pagination', 'Stepper', 'App Navigation',
          ],
          'Patterns', [
            'Booking Widget', 'Hotel Listing Card', 'Room Booking Dialog', 'Hotel Map', 'Forms', 'Search & Filters', 'Empty States', 'Loading States',
            'Data Tables', 'Dashboards', 'App Shell', 'Side Panels', 'Confirmation Flows',
          ],
          'Checkout Experience', [
            'Checkout Page',
            'Steps', ['Review Order', 'Contact Info', 'Payment', 'Review Reservation'],
            'Payment Dialogs',
          ],
          '*',
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
