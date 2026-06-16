<script setup>
// CartFlyout — the right-side slide-over chrome (scrim, top bar / kebab, footer
// countdown + CTA, special-requests sub-flyout) wrapped around the recyclable
// <CartReview> body, which is shared with the Checkout "Review order" step.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import CartReview from './CartReview.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'reserve' }, // reserve | hold
  cart: { type: Object, default: () => ({}) },
  currency: { type: String, default: '$' },
})
const emit = defineEmits(['update:modelValue', 'update:count'])
const $q = useQuasar()

const close = () => emit('update:modelValue', false)
const money = (n) => props.currency + Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const isReserve = computed(() => props.mode === 'reserve')

// --- Live values surfaced from the shared CartReview body ---
const reviewRef = ref(null)
const count = ref(0)
const total = ref(0)
const onCount = (v) => { count.value = v; emit('update:count', v) }
const clearCart = () => reviewRef.value?.clear()

// --- Special requests sub-flyout ---
const requestsOpen = ref(false)
const requestText = ref('')
const saveRequest = () => {
  requestsOpen.value = false
  $q.notify({ message: 'Your message has been saved.', icon: 'check_circle', color: 'grey-9', position: 'bottom', timeout: 2500 })
}

// --- Reveal the "Your Cart" title once the body scrolls ---
const scrolled = ref(false)
const onScroll = (e) => { scrolled.value = e.target.scrollTop > 12 }

// --- Live "time left to book" countdown (mm:ss) + depleting progress line ---
const secs = ref(props.cart.heldSeconds ?? 895)
const initialSecs = props.cart.heldSeconds ?? 895
const clock = computed(() => `${Math.floor(secs.value / 60)}:${String(secs.value % 60).padStart(2, '0')}`)
const progressPct = computed(() => `${initialSecs ? Math.max(0, (secs.value / initialSecs) * 100) : 0}%`)
let timer = null
onMounted(() => { timer = setInterval(() => { if (props.modelValue && secs.value > 0) secs.value-- }, 1000) })
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="cf">
      <div class="cf__scrim" @click="close" />
      <aside class="cf__panel" role="dialog" aria-label="Cart">
        <!-- Hold: top bar — close, title (reveals on scroll), kebab menu -->
        <div v-if="!isReserve" class="cf__top" :class="{ 'is-scrolled': scrolled }">
          <button class="cf__top-close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
          <span class="cf__top-title" :class="{ 'is-visible': scrolled }">Your Cart</span>
          <q-btn flat round dense class="cf__top-kebab" aria-label="More options">
            <q-icon name="more_horiz" size="22px" />
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list style="min-width: 184px">
                <q-item clickable @click="clearCart">
                  <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                  <q-item-section class="text-negative">Clear Cart</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <!-- Reserve: close overlaid on the hero carousel -->
        <button v-else class="cf__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>

        <div class="cf__body" @scroll="onScroll">
          <cart-review
            ref="reviewRef" :mode="mode" :cart="cart" :currency="currency" :show-requests="isReserve"
            @update:count="onCount" @update:total="total = $event" @requests="requestsOpen = true"
          />
        </div>

        <!-- Footer — countdown progress bar above a rounded total CTA -->
        <div class="cf__foot">
          <div class="cf__timer">
            <div class="cf__timer-row">
              <span class="cf__timer-label"><q-icon name="timer" size="18px" /> Time left to book</span>
              <span class="cf__timer-clock">{{ clock }}</span>
            </div>
            <div class="cf__timer-track"><div class="cf__timer-fill" :style="{ width: progressPct }" /></div>
          </div>
          <div class="cf__actions">
            <q-btn unelevated no-caps class="cf__cta" :class="{ 'is-disabled': mode === 'hold' && count === 0 }" :tabindex="(mode === 'hold' && count === 0) ? -1 : 0">
              <span class="cf__cta-label">Go to checkout</span>
              <span class="cf__cta-total">{{ money(total) }}</span>
            </q-btn>
          </div>
        </div>
      </aside>

      <!-- Special requests — sub-flyout over the cart -->
      <aside v-if="requestsOpen" class="cf__sub" role="dialog" aria-label="Special requests">
        <div class="cf__sub-head">
          <button class="cf__sub-close" aria-label="Close" @click="requestsOpen = false"><q-icon name="close" size="22px" /></button>
          <h3 class="cf__sub-title">Special requests (optional)</h3>
        </div>
        <div class="cf__sub-body">
          <p class="cf__sub-desc">We'll send your requests to the property, but they cannot be guaranteed. Please follow up with the property directly to confirm.</p>
          <label class="cf__sub-label" for="cf-req">Message to property</label>
          <textarea id="cf-req" v-model="requestText" class="cf__sub-textarea" maxlength="250" rows="4" placeholder="Special requests" />
          <div class="cf__sub-count">{{ requestText.length }}/250</div>
        </div>
        <div class="cf__sub-foot">
          <q-btn unelevated no-caps class="cf__sub-save" label="Save" @click="saveRequest" />
        </div>
      </aside>
    </div>
  </teleport>
</template>

<style scoped>
.cf { position: fixed; inset: 0; z-index: 3000; }
.cf__scrim { position: absolute; inset: 0; background: rgba(9, 9, 11, 0.5); animation: cf-fade 0.18s ease; }
.cf__panel { position: absolute; top: 0; right: 0; height: 100%; width: 500px; max-width: 92vw; background: var(--ds-color-surface); display: flex; flex-direction: column; box-shadow: var(--ds-shadow-4); animation: cf-slide 0.22s var(--ds-ease-standard); }
@keyframes cf-fade { from { opacity: 0; } }
@keyframes cf-slide { from { transform: translateX(100%); } }

.cf__close { position: absolute; top: 14px; left: 14px; width: 34px; height: 34px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; }
.cf__close:hover { background: var(--ds-palette-zinc-200); }

.cf__top { display: flex; align-items: center; gap: 12px; padding: 12px 16px; flex: none; background: var(--ds-color-surface); border-bottom: 1px solid transparent; position: relative; z-index: 3; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard), box-shadow var(--ds-duration-fast) var(--ds-ease-standard); }
.cf__top.is-scrolled { border-bottom-color: var(--ds-color-border); box-shadow: var(--ds-shadow-1); }
.cf__top-close { width: 36px; height: 36px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; flex: none; }
.cf__top-close:hover { background: var(--ds-palette-zinc-200); }
.cf__top-title { flex: 1; text-align: center; font-weight: 700; font-size: 1.0625rem; color: var(--ds-color-text); opacity: 0; transition: opacity var(--ds-duration-fast) var(--ds-ease-standard); }
.cf__top-title.is-visible { opacity: 1; }
.cf__top-kebab { color: var(--ds-color-text); flex: none; }

.cf__body { flex: 1; overflow-y: auto; }

/* Footer — countdown progress bar (Instacart-style layout) above a rounded CTA */
.cf__foot { flex: none; border-top: 1px solid var(--ds-color-border); padding: 0; display: flex; flex-direction: column; background: var(--ds-color-surface); }
.cf__timer { background: var(--ds-palette-blue-100); }
.cf__timer-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; color: var(--ds-palette-blue-800); }
.cf__timer-label { display: inline-flex; align-items: center; gap: 8px; font-size: 0.9375rem; font-weight: 600; }
.cf__timer-clock { font-weight: 700; font-variant-numeric: tabular-nums; font-size: 1rem; }
.cf__timer-track { height: 4px; background: rgba(37, 99, 235, 0.15); }
.cf__timer-fill { height: 100%; background: var(--ds-palette-blue-600); transition: width 1s linear; }
.cf__actions { padding: 16px 24px; }
.cf__cta { width: 100%; height: 54px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 1rem; }
.cf__cta.is-disabled { background: var(--ds-palette-slate-400); pointer-events: none; }
.cf__cta :deep(.q-btn__content) { width: 100%; justify-content: space-between; flex-wrap: nowrap; padding: 0 10px; }

/* Special requests sub-flyout */
.cf__sub { position: absolute; top: 0; right: 0; height: 100%; width: 500px; max-width: 92vw; background: var(--ds-color-surface); display: flex; flex-direction: column; box-shadow: var(--ds-shadow-4); z-index: 10; animation: cf-slide 0.22s var(--ds-ease-standard); }
.cf__sub-head { display: flex; align-items: center; gap: 12px; padding: 18px 20px; flex: none; }
.cf__sub-close { width: 32px; height: 32px; border: 0; background: none; color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; flex: none; }
.cf__sub-title { font-size: 1.25rem; font-weight: 700; margin: 0; color: var(--ds-color-text); }
.cf__sub-body { flex: 1; overflow-y: auto; padding: 6px 24px 24px; }
.cf__sub-desc { color: var(--ds-color-text-subtle); font-size: 0.9375rem; line-height: 1.5; margin: 0 0 22px; }
.cf__sub-label { display: block; font-weight: 700; font-size: 0.9375rem; color: var(--ds-color-text); margin-bottom: 8px; }
.cf__sub-textarea { width: 100%; min-height: 110px; resize: vertical; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 12px 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.cf__sub-textarea:focus { border-color: var(--ds-color-border-focused); }
.cf__sub-textarea::placeholder { color: var(--ds-color-text-subtlest); }
.cf__sub-count { text-align: right; color: var(--ds-color-text-subtle); font-size: 0.8125rem; margin-top: 6px; }
.cf__sub-foot { flex: none; padding: 16px 24px 24px; }
.cf__sub-save { width: 100%; height: 52px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 1rem; }

@media (max-width: 520px) { .cf__panel, .cf__sub { width: 100vw; } }
</style>
