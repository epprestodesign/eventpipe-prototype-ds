// HOTEL DETAILS / Room Card / Group Block — vertical room card for the group-
// block flow, with availability edge cases.
import RoomCardGroup from '../../components/details/RoomCardGroup.vue'

const features = [
  { label: 'Entertainment', value: '55" Smart TV, Netflix, Apple TV' },
  { label: 'Food & Drink', value: 'Coffee Maker, Mini Fridge' },
  { label: 'Need to know', value: 'Pet-friendly ($50/stay fee)' },
  { label: 'Non-smoking', value: 'Yes' },
]

export default {
  title: 'Hotel Details/Room Card/Group Block',
  component: RoomCardGroup,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Group Block room card
Vertical room card for the **Select Your Room** section (group-block flow): room
type · bed · occupancy · features · a **Rooms per Night** list with per-night
**quantity steppers** · starting price · **Add to Cart** CTA (muted until a room
is picked).

**Edge cases:** available (green) · only-N-left (orange) · sold out (dimmed card,
disabled CTA, zeroed steppers).
` } } },
}

const base = {
  roomType: 'Urban King', bedConfig: '1 King Bed', maxOccupancy: 2, features,
}
const render = (args) => ({ components: { RoomCardGroup }, setup: () => ({ args }), template: `<room-card-group v-bind="args" />` })

/** Available — pick rooms per night with the steppers to activate Add to Cart. */
export const Available = {
  render,
  args: { ...base, availability: 'available', nights: [
    { date: 'Thu, 7/9/2026', roomsLeft: 6, price: 179 }, { date: 'Fri, 7/10/2026', roomsLeft: 8, price: 179 }, { date: 'Sat, 7/11/2026', roomsLeft: 5, price: 179 },
  ] },
}

/** Only a few rooms left — orange urgency, steppers capped at the remaining count. */
export const OnlyAFewLeft = {
  name: 'Only a Few Left',
  render,
  args: { ...base, availability: 'limited', nights: [
    { date: 'Thu, 7/9/2026', roomsLeft: 2, price: 189 }, { date: 'Fri, 7/10/2026', roomsLeft: 1, price: 189 }, { date: 'Sat, 7/11/2026', roomsLeft: 3, price: 189 },
  ] },
}

/** Sold out — dimmed card, disabled CTA, zeroed steppers. */
export const SoldOut = {
  name: 'Sold Out',
  render,
  args: { ...base, availability: 'soldout', nights: [
    { date: 'Thu, 7/9/2026', roomsLeft: 0, price: 179 }, { date: 'Fri, 7/10/2026', roomsLeft: 0, price: 179 }, { date: 'Sat, 7/11/2026', roomsLeft: 0, price: 179 },
  ] },
}
