/** NAVIGATION / App Bar → custom AppBar.vue (org switcher + search + user menu) */
import AppBar from '../../components/AppBar.vue'

export default {
  title: 'App Chrome/App Bar',
  component: AppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Overview
The application's top content bar. It pairs an **org / context switcher** on the
left with a **search field** and **user menu** on the right. White surface, a
hairline bottom border, and level-1 elevation (\`--ds-shadow-1\`).

## When to use
- The persistent header of an authenticated app screen (see **Layout / App Shell**).

## When not to use
- Marketing / logged-out headers, or in-page toolbars.

## Tokens
Brand accents (avatar, focus ring, active menu row) use the DS azure
(\`--ds-color-background-brand-bold\` = #1876D2); text/borders use Graphite.
` } },
  },
  argTypes: {
    org: { control: 'text' },
    user: { control: 'text' },
    searchPlaceholder: { control: 'text' },
  },
}

export const Default = {
  args: {
    org: 'Team Travel Source',
    user: 'Mike Addesa',
    searchPlaceholder: 'Search',
  },
}

export const LongOrgName = {
  args: {
    org: 'Global Sports & Entertainment Group',
    user: 'Alex Rivera',
  },
}
