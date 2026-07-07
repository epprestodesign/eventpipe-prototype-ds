/** Shared scaffold for the Pages — production sidebar nav + a page() helper that
 *  wraps page content in the App Shell so every screen reuses the same chrome. */
import AppShell from '../../components/AppShell.vue'

export const PAGES_NAV = [
  { key: 'users', label: 'Users', icon: 'groups' },
  { key: 'events', label: 'Events', icon: 'event' },
  { key: 'pickup', label: 'Pickup Reports', icon: 'receipt_long' },
  { key: 'reports', label: 'Reports', icon: 'bar_chart' },
  { key: 'hotels', label: 'Hotels', icon: 'apartment' },
  { key: 'brands', label: 'Hotel Brands', icon: 'domain' },
  { key: 'amenities', label: 'Amenities', icon: 'room_service' },
  { key: 'room-types', label: 'Room Types', icon: 'king_bed' },
  { key: 'venues', label: 'Venues', icon: 'explore' },
  { key: 'event-companies', label: 'Event Companies', icon: 'account_tree' },
  { key: 'companies', label: 'Companies', icon: 'business_center' },
  { key: 'requests', label: 'Requests', icon: 'assignment' },
  { key: 'inventory', label: 'Inventory Requests', icon: 'library_add' },
  { key: 'admin', label: 'Admin Tools', icon: 'manage_accounts' },
  { key: 'pipe', label: 'Pipe Tools', icon: 'build' },
  { key: 'webhooks', label: 'Webhooks', icon: 'link' },
]

// Build a Storybook story that renders `slot` inside the App Shell.
export function page({ active, org = '365 Sports Travel', user = 'Justin Girard', components = {}, setup = () => ({}), slot = '' }) {
  return {
    render: () => ({
      components: { AppShell, ...components },
      setup: () => ({ nav: PAGES_NAV, ...setup() }),
      template: `
        <div style="height:100vh">
          <app-shell :items="nav" active="${active}" org="${org}" user="${user}" bleed>
            ${slot}
          </app-shell>
        </div>`,
    }),
  }
}
