/** INPUTS / Transfer List → custom DsTransferList (no Quasar equivalent) */
import DsTransferList from '../../components/DsTransferList.vue'
export default {
  title: 'Components/Forms/Transfer List',
  component: DsTransferList,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Overview
Move items between two lists — e.g. add room **add-ons / amenities** to a booking,
or curate which facilities appear on a property listing. **No Quasar equivalent**,
so this is a custom component (\`DsTransferList.vue\`).

## When to use
- Building a subset from a pool (add-ons selected vs available, facilities shown vs hidden).

## When not to use
- Simple multi-select → **Select** (multiple) is lighter weight.

## Quasar mapping
\`Transfer List → custom (DsTransferList)\` built from two \`QList\` panels + move controls.
` } } },
}

export const RoomAddOns = {
  name: 'Room Add-ons',
  render: () => ({
    components: { DsTransferList },
    template: `<ds-transfer-list :left="['Breakfast','Airport transfer','Late checkout','Spa credit','Parking']" :right="['Extra bed']" />`,
  }),
}
