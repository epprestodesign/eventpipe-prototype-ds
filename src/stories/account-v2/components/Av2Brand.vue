<script setup>
/* Av2Brand — the EventPipe wordmark at the top of every auth step. It is the
 * first thing that tells a user they are on the right site, so it appears on
 * every step rather than only the first. Since 2026-09-29 it lives once, in
 * the split shell's top bar (Av2TopBar), rather than in each step's markup.
 *
 * This is the real EventPipe wordmark from `src/assets/logo/`, not a mark drawn
 * here. It used to be a hand-drawn hexagon with a "Pay" suffix — an invented
 * lockup, which is the one thing an anti-phishing signal cannot be. The users
 * of these screens are meant to recognise this mark from everywhere else in the
 * platform, and they can only do that if it is the same mark.
 *
 * Full-colour variant, because the shell's left panel is a white surface and
 * that is the variant Foundations › Logos specifies for light grounds.
 */
import logo from '../../../assets/logo/eventpipe-logo.svg'
</script>

<template>
  <div class="av2__brand">
    <img :src="logo" alt="EventPipe" width="150" />
  </div>
</template>

<style scoped>
/* Width only — the asset is 128×33, so height follows to keep the aspect. */
.av2__brand img { width: 150px; height: auto; display: block; }
</style>
