/** APPLICATION COMPONENTS / Carousel → Quasar QCarousel. */
import { ref } from 'vue'

export default {
  title: 'Components/Media & Visuals/Carousel',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
A slideshow for stepping through a set of panels — onboarding, image galleries,
or feature highlights. Uses QCarousel with arrow + dot navigation.
` } } },
}

const slides = [
  { name: 1, color: 'var(--ds-palette-azure-600)', label: 'Welcome to EventPipe' },
  { name: 2, color: 'var(--ds-palette-azure-700)', label: 'Manage inventory requests' },
  { name: 3, color: 'var(--ds-palette-navy-900)', label: 'Move reservations with ease' },
]

export const Basic = {
  render: () => ({ setup: () => ({ slide: ref(1), slides }), template: `
    <q-carousel v-model="slide" animated arrows navigation infinite swipeable
      height="260px" style="max-width:520px; border-radius:var(--ds-radius-lg); overflow:hidden;">
      <q-carousel-slide v-for="s in slides" :key="s.name" :name="s.name"
        class="column flex-center text-white" :style="{ background: s.color }">
        <div class="text-h5">{{ s.label }}</div>
      </q-carousel-slide>
    </q-carousel>` }),
}

export const Autoplay = {
  parameters: { docs: { description: { story: 'Auto-advancing with bottom dot navigation.' } } },
  render: () => ({ setup: () => ({ slide: ref(1), slides }), template: `
    <q-carousel v-model="slide" animated arrows navigation infinite swipeable :autoplay="3000"
      height="260px" style="max-width:520px; border-radius:var(--ds-radius-lg); overflow:hidden;">
      <q-carousel-slide v-for="s in slides" :key="s.name" :name="s.name"
        class="column flex-center text-white" :style="{ background: s.color }">
        <div class="text-h6">Slide {{ s.name }}</div>
      </q-carousel-slide>
    </q-carousel>` }),
}
