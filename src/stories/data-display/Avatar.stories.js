/** DATA DISPLAY / Avatar → Quasar: QAvatar (native) */
import guestPortrait from '../../assets/hotel/guest-portrait.jpg'
export default {
  title: 'Components/Media & Visuals/Avatar',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Represents a guest, host, or entity with initials, an icon, or an image.

## When to use
- Guest profiles, review authors, account menus, host/property contacts.

## Quasar mapping
\`Avatar → QAvatar\` (native).
` } } },
}
export const Basic = {
  render: () => ({ template: `<q-avatar color="primary" text-color="white">JG</q-avatar>` }),
}
export const Variants = {
  render: () => ({ setup: () => ({ guestPortrait }), template: `
    <div class="q-gutter-md row items-center">
      <q-avatar color="primary" text-color="white">JG</q-avatar>
      <q-avatar color="accent" text-color="white" icon="person" />
      <q-avatar rounded color="secondary" text-color="white" icon="star" />
      <q-avatar size="56px"><img :src="guestPortrait" /></q-avatar>
    </div>` }),
}
export const Sizes = {
  render: () => ({ setup: () => ({ sizes: ['sm','md','lg','xl'] }), template: `
    <div class="q-gutter-md row items-center">
      <q-avatar v-for="s in sizes" :key="s" :size="s" color="primary" text-color="white">{{ s }}</q-avatar>
    </div>` }),
}
