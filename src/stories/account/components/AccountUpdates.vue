<script setup>
import DsText from '../../../components/DsText.vue'
import DsLink from '../../../components/DsLink.vue'
defineProps({ title: { type: String, default: '' }, body: { type: String, default: '' }, href: { type: String, default: '' } })
</script>

<template>
  <q-card v-if="title && body" flat bordered class="q-pa-lg">
    <ds-text as="p" variant="overline" tone="subtle">What’s new in EventPipe</ds-text>
    <div class="q-mt-sm"><ds-text as="h2" variant="h2">{{ title }}</ds-text></div>
    <div class="q-mt-md"><ds-text as="p">{{ body }}</ds-text></div>
    <ds-link v-if="href" :href="href" class="q-mt-md inline-block">Read the update</ds-link>
  </q-card>
</template>
