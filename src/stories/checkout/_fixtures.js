// Shared sample data for the Checkout Experience step stories (not a story file).
export const holdCart = {
  taxRate: 0.12, feePerNight: 30,
  hotels: [
    { name: 'Embassy Suites Chicago Downtown', imageCategories: ['suites', 'rooms'], seed: 0, rooms: [
      { type: 'Two-Room Suite King', summary: '1 King Bed · Sleeps 4', price: 269, nights: [{ date: 'Tue, Jun 23', qty: 4, roomsLeft: 6 }, { date: 'Wed, Jun 24', qty: 1, roomsLeft: 5 }] },
      { type: 'Two-Room Suite Double', summary: '2 Queen Beds · Sleeps 4', price: 289, nights: [{ date: 'Tue, Jun 23', qty: 1, roomsLeft: 5 }] },
    ] },
    { name: 'The Concord Hotel', imageCategories: ['lobby', 'rooms'], seed: 2, rooms: [
      { type: 'King Studio', summary: '1 King Bed · Sleeps 2', price: 165, nights: [{ date: 'Tue, Jun 23', qty: 1, roomsLeft: 6 }] },
    ] },
  ],
}

export const reserveCart = {
  hotel: { name: 'The Concord Hotel', address: '750 Tremont St, Boston, MA 02118' },
  imageCategories: ['suites', 'rooms', 'lobby', 'pool', 'dining'], seed: 1,
  checkIn: { date: '06/23/2026', time: '4:00pm' }, checkOut: { date: '06/24/2026', time: '11:00am' }, nights: 1,
  highlights: [{ icon: 'kitchen', label: 'Kitchen' }, { icon: 'ac_unit', label: 'Air conditioning' }, { icon: 'wifi', label: 'Free WiFi' }],
  roomType: 'Aparthotel', bedConfig: '1 King Bed and 1 Queen Sofa Bed', sleeps: 2, amenities: [{ icon: 'microwave', label: 'Microwave' }],
  priceDetails: { nights: 1, rooms: 1, rate: 164.78, subtotal: 164.78, program: 'OneKeyCash applied', discount: '$26.55 off', taxes: 47.53, propertyFee: 110, total: 322.31 },
  roomsLeft: 1,
}

export const methods = [
  { id: 'amex', logo: 'Amex', last4: '1009', label: 'Amex', sub: 'Default' },
  { id: 'gpay', logo: 'GooglePay', label: 'Google Pay' },
]
