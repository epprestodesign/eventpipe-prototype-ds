<script setup>
// Prototype shell: a hash-routed landing page that itemizes the available
// prototypes, and mounts the selected one full-screen. Add future prototypes to
// PROTOS and render them by hash below.
import { ref, onMounted, onUnmounted } from 'vue'
import BulkReservationFlow from '../src/components/BulkReservationFlow.vue'

const route = ref(window.location.hash || '#/')
const onHash = () => { route.value = window.location.hash || '#/' }
onMounted(() => window.addEventListener('hashchange', onHash))
onUnmounted(() => window.removeEventListener('hashchange', onHash))

const PROTOS = [
  {
    id: 'bulk-reservation-edit',
    hash: '#/bulk-reservation-edit',
    title: 'Bulk Reservation Edit',
    tag: 'Eventpipe Labs · V1',
    desc: 'Select reservations, bulk-edit their fields (names, emails, check-in dates, hotel, group, status), confirm, and review the results + activity log — end to end.',
    steps: ['Reservations List', 'Select Reservations', 'Edit Reservations', 'Results', 'Activity Logs'],
  },
]
</script>

<template>
  <!-- Home screen = the Bulk Reservation Edit flow (also at #/bulk-reservation-edit
       and its deep-linked stages: /select, /edit, /results, /activity).
       The itemized prototype index lives at #/prototypes. -->
  <bulk-reservation-flow v-if="route === '#/' || route.startsWith('#/bulk-reservation-edit')" deep-link />

  <!-- Landing / index (#/prototypes) -->
  <div v-else class="landing">
    <header class="landing__head">
      <div class="landing__brand">
        <span class="landing__logo">EP</span>
        <div>
          <div class="landing__title">EventPipe Labs · Prototypes</div>
          <div class="landing__sub">Interactive, pilotable prototypes built on the EventPipe design system.</div>
        </div>
      </div>
    </header>

    <main class="landing__grid">
      <a v-for="p in PROTOS" :key="p.id" :href="p.hash" class="card">
        <div class="card__tag">{{ p.tag }}</div>
        <div class="card__title">{{ p.title }}</div>
        <div class="card__desc">{{ p.desc }}</div>
        <div class="card__steps">
          <span v-for="(s, i) in p.steps" :key="s" class="card__step">
            {{ s }}<q-icon v-if="i < p.steps.length - 1" name="chevron_right" size="16px" class="card__chev" />
          </span>
        </div>
        <div class="card__cta">Launch prototype <q-icon name="arrow_forward" size="18px" /></div>
      </a>
    </main>

    <footer class="landing__foot">
      Fake data throughout · not connected to production.
    </footer>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  background: var(--ds-color-surface-sunken);
  color: var(--ds-color-text);
  padding: 48px 32px 64px;
}
.landing__head { max-width: 1000px; margin: 0 auto 32px; }
.landing__brand { display: flex; align-items: center; gap: 16px; }
.landing__logo {
  width: 48px; height: 48px; border-radius: 12px; flex: none;
  display: flex; align-items: center; justify-content: center;
  background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 800; font-size: 1.125rem;
}
.landing__title { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.01em; }
.landing__sub { color: var(--ds-color-text-subtle); margin-top: 2px; }
.landing__grid {
  max-width: 1000px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;
}
.card {
  display: block; text-decoration: none; color: inherit;
  background: var(--ds-color-surface);
  border: 1px solid var(--ds-color-border-container);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-card);
  padding: 24px;
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}
.card:hover { box-shadow: var(--ds-shadow-2); transform: translateY(-2px); border-color: var(--ds-color-border); }
.card__tag {
  display: inline-block; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.02em;
  color: var(--ds-color-text-brand); background: var(--ds-color-background-brand-subtlest);
  padding: 3px 10px; border-radius: 999px; margin-bottom: 12px;
}
.card__title { font-size: 1.25rem; font-weight: 700; }
.card__desc { color: var(--ds-color-text-subtle); font-size: 0.9375rem; line-height: 1.5; margin-top: 8px; }
.card__steps { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; margin-top: 16px; }
.card__step { display: inline-flex; align-items: center; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.card__chev { color: var(--ds-color-icon-subtle); margin: 0 2px; }
.card__cta {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 20px;
  font-weight: 700; color: var(--ds-color-text-brand);
}
.landing__foot { max-width: 1000px; margin: 40px auto 0; color: var(--ds-color-text-subtle); font-size: 0.8125rem; }
</style>
