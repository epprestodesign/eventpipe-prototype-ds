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
          'Getting Started', ['Introduction', 'Architecture & Conventions', 'Story Template'],
          'Foundations', [
            'Palette', 'Colors', 'Typography', 'Icons', 'Imagery', 'Hero Banner', 'Elevation',
            'Spacing', 'Border Radius', 'Breakpoints', 'Motion',
          ],
          'Inputs', [
            'Button', 'Checkbox', 'Checkbox Tree', 'Radio Group', 'Choice Chips', 'Switch',
            'Text Field', 'Text Area', 'Phone Field', 'Select', 'Autocomplete',
            'Date Picker', 'Time Picker', 'Slider', 'Range',
            'Rating', 'Quantity Stepper', 'Transfer List',
          ],
          'Data Display', [
            'Amenity', 'Avatar', 'Badge', 'Chip', 'Divider', 'Icon',
            'List', 'List Item', 'Accordion', 'Rating', 'Table', 'Tooltip', 'Typography',
          ],
          'Feedback', [
            'Alert', 'Banner', 'Dialog', 'Snackbar', 'Toast',
            'Progress', 'Skeleton', 'Backdrop',
          ],
          'Layout', [
            'Box', 'Card', 'Container', 'Grid', 'Stack', 'Image List', 'Section Header', 'Side Panel',
          ],
          'Navigation', [
            'Global Nav', 'Tabs', 'Menu', 'Breadcrumbs', 'Pagination', 'Stepper', 'App Navigation',
          ],
          'Browse Hotels', [
            'Booking Widget', 'Hotel Listing Card', 'Availability Dialog', 'Hotel Map', 'Search & Filters', 'Forms', 'Empty States', 'Loading States',
          ],
          'Hotel Details', [
            'Hotel Detail Page', 'Photo Gallery', 'Detail Tabs', 'Hotel Summary Header',
            'Rooms', 'Room Card', 'Room Booking Dialog', 'Amenities', 'Policies & Property',
          ],
          'Your Trips', [
            'Saved Items',
          ],
          'Checkout Experience', [
            'Checkout Page',
            'Steps', ['Review Order', 'Contact Info', 'Payment', 'Review Reservation'],
            'Payment Dialogs',
          ],
          'Confirmation', [
            'Confirmation Page',
          ],
          '*',
          'Manage Booking', [
            'Account',
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
