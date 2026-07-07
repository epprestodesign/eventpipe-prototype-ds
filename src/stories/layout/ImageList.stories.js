/** LAYOUT / Image List → custom DsImageList (QImg-based) */
import DsImageList from '../../components/DsImageList.vue'
// Self-hosted hotel imagery (Unsplash, see src/assets/hotel/CREDITS.md).
import lobby from '../../assets/hotel/lobby.jpg'
import deluxeKing from '../../assets/hotel/deluxe-king.jpg'
import pool from '../../assets/hotel/pool.jpg'
import oceanSuite from '../../assets/hotel/ocean-suite.jpg'
import spa from '../../assets/hotel/spa.jpg'
import restaurant from '../../assets/hotel/restaurant.jpg'

const items = [
  { src: lobby, title: 'Lobby' },
  { src: deluxeKing, title: 'Deluxe King' },
  { src: pool, title: 'Pool' },
  { src: oceanSuite, title: 'Ocean Suite' },
  { src: spa, title: 'Spa' },
  { src: restaurant, title: 'Restaurant' },
]
export default {
  title: 'Components/Media & Visuals/Image List',
  component: DsImageList,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
A responsive grid of images with optional captions (hotel photo galleries: rooms, pool, dining).
No Quasar equivalent → custom \`DsImageList\` built on QImg.

## When to use
- Visual browsing of many images of equal importance.

## Quasar mapping
\`Image List → custom (DsImageList)\` over \`QImg\`.
` } } },
  argTypes: { cols: { control: { type: 'range', min: 2, max: 5 } } },
  args: { cols: 3 },
}
export const Basic = {
  render: (args) => ({ components: { DsImageList }, setup: () => ({ args, items }), template: `<ds-image-list :items="items" :cols="args.cols" style="max-width:520px" />` }),
}
