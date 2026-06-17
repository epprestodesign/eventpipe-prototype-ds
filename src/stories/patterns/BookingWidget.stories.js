// PATTERNS / Booking Widget — interactive tabbed tournament booking search.
import BookingWidget from '../../components/BookingWidget.vue'

export default {
  title: 'Browse Hotels/Booking Widget',
  component: BookingWidget,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'inline-radio', options: ['reservations', 'group'] },
    tabs: { control: 'boolean' },
  },
  parameters: { docs: { description: { component: `
## Overview
The tournament **Booking Widget** — a tabbed search bar with two flows:
**Book Reservations** (single team + dates + travelers) and **Hold Rooms for Group
or Team** (multiple teams + travelers).

**Interactive:** working tabs · team search popover with **live filter** ·
**add-a-team modal** with duplicate-name error · **dual-month** date range
(consecutive months) + flexible-date pills · travelers steppers. Flat elevation,
DS tokens (Zinc/Poppins), Quasar core.
` } } },
}

/** Tab 1 — single team + dates + travelers. */
export const BookReservations = {
  render: () => ({ components: { BookingWidget }, template: `<div style="max-width:1000px"><booking-widget mode="reservations" /></div>` }),
}

/** Tab 2 — multiple teams + travelers (no dates). */
export const HoldRoomsForGroup = {
  name: 'Hold Rooms for Group/Team',
  render: () => ({ components: { BookingWidget }, template: `<div style="max-width:1000px"><booking-widget mode="group" /></div>` }),
}

/** No tabs — for the hotel listings / results page (team + dates + travelers). */
export const NoTabsListings = {
  name: 'No Tabs (Listings)',
  render: () => ({ components: { BookingWidget }, template: `<div style="max-width:1000px"><booking-widget mode="reservations" :tabs="false" /></div>` }),
}
