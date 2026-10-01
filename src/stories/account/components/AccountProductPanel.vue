<script setup>
import { computed, ref } from 'vue'
import DsCard from '../../../components/DsCard.vue'
import DsText from '../../../components/DsText.vue'
import DsLink from '../../../components/DsLink.vue'
import { productPosts, releaseHighlights } from '../_product-updates'

const props = defineProps({
  concept: { type: String, default: 'featured' },
  showLink: { type: Boolean, default: true },
  imageUnavailable: { type: Boolean, default: false },
})
const current = ref(0)
const post = computed(() => productPosts[props.concept === 'tip' ? 1 : props.concept === 'releases' ? 2 : props.concept === 'spotlight' ? current.value : 0])
const valuePoints = [
  'Spin up a custom booking site in under 10 minutes',
  'Manage inventory, RFPs & hotel negotiations in one place',
  'Monitor Stay-to-Play compliance with ease',
]
function advance(direction) { current.value = (current.value + direction + productPosts.length) % productPosts.length }
</script>

<template>
  <section class="acct-product-panel" aria-label="EventPipe product updates">
    <!-- The original Account log in / sign up panel: a headline and three value
         points, directly on the navy panel. Static marketing, no article. -->
    <div v-if="concept === 'value-props'" class="acct-product-panel__editorial">
      <ds-text as="h2" variant="display" tone="inverse">Event hotel bookings, made a breeze.</ds-text>
      <div class="q-mt-md"><ds-text as="p" variant="body-lg" tone="inverse">Manage and monetize lodging for your next event — the platform behind $1B+ in hotel bookings.</ds-text></div>
      <ul class="acct-product-panel__points">
        <li v-for="point in valuePoints" :key="point"><q-icon name="check_circle" size="20px" />{{ point }}</li>
      </ul>
    </div>

    <!-- A quiet editorial treatment, directly on the existing navy panel. -->
    <div v-else-if="concept === 'featured'" class="acct-product-panel__editorial">
      <ds-text as="p" variant="overline" tone="inverse">From the EventPipe blog</ds-text>
      <div class="q-mt-lg"><ds-text as="h2" variant="display" tone="inverse">{{ post.title }}</ds-text></div>
      <div class="q-mt-lg"><ds-text as="p" variant="body-lg" tone="inverse">{{ post.body }}</ds-text></div>
      <p class="acct-product-panel__date"><time :datetime="post.datetime">{{ post.date }}</time></p>
      <q-btn v-if="showLink" outline no-caps color="white" :href="post.href" target="_blank" rel="noopener noreferrer" label="Read the article" icon-right="open_in_new" aria-label="Read the article (opens in a new tab)" />
    </div>

    <ds-card v-else-if="concept === 'releases'" padding="lg">
      <ds-text as="p" variant="overline" tone="subtle">Product highlights · Q3 2024</ds-text>
      <div class="q-mt-sm"><ds-text as="h2" variant="h2">A few improvements worth a look</ds-text></div>
      <q-list class="q-mt-md">
        <q-item v-for="item in releaseHighlights" :key="item.title" class="q-px-none">
          <q-item-section avatar><q-icon :name="item.icon" color="primary" size="24px" /></q-item-section>
          <q-item-section><q-item-label class="text-weight-bold">{{ item.title }}</q-item-label><q-item-label caption>{{ item.body }}</q-item-label></q-item-section>
        </q-item>
      </q-list>
      <q-separator class="q-my-md" />
      <ds-text as="p" variant="caption" tone="subtle">From the {{ post.date }} product roundup</ds-text>
      <div v-if="showLink" class="q-mt-md"><ds-link :href="post.href" external>Read the full roundup</ds-link></div>
    </ds-card>

    <ds-card v-else-if="concept === 'spotlight'" padding="lg">
      <div class="row items-center justify-between q-mb-lg"><ds-text variant="overline" tone="subtle">Discover EventPipe</ds-text><q-icon :name="post.icon" color="primary" size="28px" /></div>
      <div class="acct-product-panel__slide" aria-live="polite" aria-atomic="true">
        <ds-text as="h2" variant="h2">{{ post.title }}</ds-text>
        <div class="q-mt-md"><ds-text as="p">{{ post.body }}</ds-text></div>
        <div class="q-mt-md"><ds-text as="p" variant="caption" tone="subtle"><time :datetime="post.datetime">{{ post.date }}</time></ds-text></div>
        <div v-if="showLink" class="q-mt-lg"><ds-link :href="post.href" external>Read the article</ds-link></div>
      </div>
      <q-separator class="q-my-lg" />
      <div class="row items-center justify-between">
        <ds-text variant="caption" tone="subtle">{{ current + 1 }} of {{ productPosts.length }}</ds-text>
        <div class="row q-gutter-sm"><q-btn outline round dense color="primary" icon="chevron_left" aria-label="Previous product update" @click="advance(-1)" /><q-btn outline round dense color="primary" icon="chevron_right" aria-label="Next product update" @click="advance(1)" /></div>
      </div>
    </ds-card>

    <q-banner v-else-if="concept === 'tip'" rounded class="q-pa-lg bg-ds-brand-subtlest">
      <template #avatar><q-icon name="lightbulb_outline" color="primary" size="28px" /></template>
      <ds-text as="p" variant="overline" tone="brand">A tip for your next event</ds-text>
      <div class="q-mt-sm"><ds-text as="h2" variant="h2">Put markup in view before hotels quote.</ds-text></div>
      <div class="q-mt-md"><ds-text as="p">Upfront Markup’s RFP guidance helps hotels account for your markup and their available rate when responding.</ds-text></div>
      <div class="q-mt-md"><ds-text as="p" variant="caption" tone="subtle">From the blog · {{ post.date }}</ds-text></div>
      <div v-if="showLink" class="q-mt-lg"><ds-link :href="post.href" external>Explore Upfront Markup</ds-link></div>
    </q-banner>

    <ds-card v-else padding="none" class="acct-product-panel__image-card">
      <q-img v-if="!imageUnavailable" :src="post.image" :alt="post.imageAlt" :ratio="16 / 9" fit="cover">
        <template #error><div class="absolute-full flex flex-center bg-ds-neutral-subtle text-ds-subtle"><q-icon name="article" size="40px" aria-label="Article artwork unavailable" /></div></template>
      </q-img>
      <div v-else class="acct-product-panel__image-fallback bg-ds-neutral-subtle"><q-icon name="article" size="40px" color="primary" aria-label="Article artwork unavailable" /></div>
      <div class="q-pa-lg">
        <ds-text as="p" variant="overline" tone="subtle">Product spotlight · From the blog</ds-text>
        <div class="q-mt-sm"><ds-text as="h2" variant="h2">Live hotel inventory, on your terms.</ds-text></div>
        <div class="q-mt-md"><ds-text as="p">{{ post.body }}</ds-text></div>
        <div class="q-mt-md"><ds-text as="p" variant="caption" tone="subtle">{{ post.date }} · EventPipe</ds-text></div>
        <div v-if="showLink" class="q-mt-lg"><ds-link :href="post.href" external>Read about Presto</ds-link></div>
      </div>
    </ds-card>
  </section>
</template>

<style scoped>
.acct-product-panel { width: 100%; max-width: 480px; text-align: left; }
.acct-product-panel__editorial { padding: var(--ds-space-2) 0; }
.acct-product-panel__date { color: var(--ds-color-text-inverse); margin: var(--ds-space-5) 0; font-size: var(--ds-font-size-sm); }
.acct-product-panel__points { list-style: none; margin: var(--ds-space-6) 0 0; padding: 0; display: flex; flex-direction: column; gap: var(--ds-space-3); color: var(--ds-color-text-inverse); }
.acct-product-panel__points li { display: flex; align-items: flex-start; gap: var(--ds-space-3); }
.acct-product-panel__points .q-icon { flex: none; margin-top: 1px; color: var(--ds-color-icon-inverse); }
.acct-product-panel__slide { min-height: 210px; }
.acct-product-panel__image-card { overflow: hidden; }
.acct-product-panel__image-fallback { aspect-ratio: 16 / 9; display: flex; align-items: center; justify-content: center; }
@media (max-width: 600px) { .acct-product-panel__slide { min-height: 250px; } }
</style>
