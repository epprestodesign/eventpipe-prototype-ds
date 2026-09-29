<script setup>
/* Av2ShaderGround — the animated background behind the auth card.
 *
 * Three concepts, from the shader compositions supplied on 09/28. Each keeps
 * the supplied composition's layers, ordering and motion; only the colour
 * stops have been retuned, from the sampled teal palette to the EventPipe
 * design system (Azure #2561FA brand, #01113E navy chrome, #15AEB3 accent).
 *
 * TWO THINGS TO KNOW BEFORE THIS SHIPS:
 *
 * 1. LICENCE. The `shaders` package is free for personal, non-commercial and
 *    evaluation use. Storybook is internal review, which is evaluation. It is
 *    deliberately NOT wired into the hosted /ep-pay/ prototype, because that is
 *    a public commercial deployment and would need a paid licence first.
 *
 * 2. WEBGPU. These render through WebGPU: Chrome and Edge yes, Safari partial,
 *    Firefox behind a flag. So every variant has a CSS fallback that paints the
 *    same colours as a static gradient, and the fallback is what renders when
 *    WebGPU is missing. An auth screen that renders nothing is a locked door —
 *    the fallback is not a nicety.
 *
 *    Detection asks for an ADAPTER, not just for `navigator.gpu`. Headless
 *    Chromium, VMs, remote desktops and machines with hardware acceleration
 *    turned off all expose the API and then hand back no adapter — the shader
 *    mounts, the canvas paints nothing, and the user gets an empty ground. The
 *    feature check has to be the thing that actually fails in that case.
 */
import { computed, defineAsyncComponent, h, markRaw, onMounted, ref } from 'vue'

/* The shader layers paint on a WebGPU canvas and cannot read CSS custom
 * properties, so the design-system colours have to be written out as literals.
 * They are collected here, once, with the token each one stands for — so a
 * token change is a one-line edit and nobody has to guess where #114F8E came
 * from. The same constants feed the CSS fallbacks below, which is what keeps
 * the fallback and the shader it stands in for looking like the same screen. */
const DS = {
  azure: '#2561FA', //        --ds-color-background-brand-bold
  azure400: '#4593E0', //     --ds-palette-azure-400
  azure200: '#A3C9F0', //     --ds-palette-azure-200
  azure50: '#E8F1FB', //      --ds-palette-azure-50
  azure800: '#114F8E', //     --ds-palette-azure-800
  navy: '#01113E', //         --ds-color-surface-sidebar
  navyHover: '#03164A', //    --ds-color-sidebar-hover
  navyDeep: '#00081F', //     the navy carried further down, for the far end of
  //                          the depth field; nothing in the flat UI is this
  //                          dark, and it exists only as a gradient terminus
  accentGreen: '#15AEB3', //  --ds-color-accent-green
}

const props = defineProps({
  /** 'depth' | 'liquid' | 'wave' — see the stories for what each one is. */
  variant: { type: String, default: 'depth' },
  /** Force the static fallback, to review it without a second browser. */
  forceFallback: { type: Boolean, default: false },
})

const supported = ref(false)
onMounted(async () => {
  try {
    if (typeof navigator === 'undefined' || !('gpu' in navigator)) return
    // requestAdapter resolves to null when the API exists but no usable GPU
    // does — which is most of the ways this fails in practice.
    supported.value = Boolean(await navigator.gpu.requestAdapter())
  } catch {
    supported.value = false
  }
})

const useShader = computed(() => supported.value && !props.forceFallback)

/* Fallbacks approximate each composition's colour field with a plain gradient,
   built from the same constants the shader uses. They are not meant to match it
   layer for layer — only to land on the same colour and the same weight, so the
   card is legible and a Safari visitor is looking at the same design. */
const FALLBACK = {
  depth: `radial-gradient(120% 90% at 20% 100%, ${DS.navy} 0%, ${DS.navyDeep} 70%)`,
  liquid: `linear-gradient(135deg, ${DS.azure} 0%, ${DS.azure800} 45%, ${DS.navy} 100%)`,
  wave: `linear-gradient(160deg, ${DS.azure50} 0%, ${DS.azure400} 100%)`,
}
const fallbackStyle = computed(() => ({ background: FALLBACK[props.variant] || FALLBACK.depth }))

const ShaderScene = defineAsyncComponent(async () => {
  const s = await import('shaders/vue')
  return {
    props: { variant: { type: String, default: 'depth' } },
    render() {
      if (this.variant === 'liquid') {
        // Azure into navy, with the accent green as the blob's highlight — the
        // one place in these three where the accent appears, and it appears as
        // a moving specular edge rather than as a field of colour.
        return h(s.Shader, null, () => [
          h(s.LinearGradient, {
            colorA: DS.azure, colorB: DS.navy, colorSpace: 'oklch', edges: 'mirror',
            end: { x: 0.67, y: 0.28 }, start: { x: 0.23, y: 0.7 }, visible: true,
          }),
          h(s.Blob, {
            blendMode: 'normal-oklch', center: { x: 0.42, y: 0.55 },
            colorA: DS.azure400, colorB: DS.azure800, colorSpace: 'oklch',
            deformation: 0.7, highlightColor: DS.accentGreen, size: 0.7, softness: 1.4, speed: 1,
          }),
          h(s.DotGrid, { blendMode: 'linearDodge', density: 60, dotSize: 0.08, opacity: 0.15 }),
          h(s.Liquify, { decay: 2.2, edges: 'mirror', intensity: 1.2, radius: 2 }),
          h(s.FilmGrain, { strength: 0.18 }),
        ])
      }
      if (this.variant === 'wave') {
        // The one light ground: an Azure tint washing into a mid Azure. The
        // deep end stops at azure-400 rather than the full brand blue so the
        // dark helper line under the card stays readable where it lands.
        return h(s.Shader, null, () => [
          h(s.LinearGradient, {
            colorA: DS.azure50, colorB: DS.azure400, colorSpace: 'oklch', edges: 'mirror',
            end: { x: 0.2, y: 0.9 }, start: { x: 0, y: 0.3 },
          }),
          h(s.WaveDistortion, { angle: 119, frequency: 0.6, strength: 0.33 }),
          h(s.DotGrid, { blendMode: 'linearDodge', color: '#fff', dotSize: 0.04, twinkle: 1 }),
        ])
      }
      // depth: the navy app chrome taken to its darkest, with the dot field a
      // light Azure tint so the starfield reads as brand rather than as noise.
      return h(s.Shader, null, () => [
        h(s.Perspective, {
          center: { x: 0.48, y: 1 }, edges: 'mirror', fov: 96,
          offset: { x: 0.58, y: 0.57 }, pan: -38, tilt: 15, zoom: 2.28,
        }, () => [
          h(s.RadialGradient, {
            center: { x: 0.2, y: 1 }, colorA: DS.navy, colorB: DS.navyDeep,
            colorSpace: 'oklab', radius: 0.66,
          }),
          h(s.Grid, { cells: 6, color: DS.navyHover, thickness: 0 }),
          h(s.DotGrid, { color: DS.azure200, density: 60, dotSize: 0.06, twinkle: 1 }),
        ]),
        h(s.ProgressiveBlur, { center: { x: 0.25, y: 0.5 }, falloff: 0.68, intensity: 76 }),
        h(s.FilmGrain, { strength: 0.02, visible: true }),
      ])
    },
  }
})

// markRaw: this is a component definition, not state. Without it Vue makes the
// whole definition reactive and warns about it on every render.
const Scene = markRaw(ShaderScene)
</script>

<template>
  <div class="av2sg">
    <!-- The shader components are loaded lazily and only when WebGPU is there,
         so a browser that cannot run them never downloads them either. -->
    <component :is="Scene" v-if="useShader" :variant="variant" />
    <div v-else class="av2sg__fallback" :style="fallbackStyle" />
  </div>
</template>


<style scoped>
.av2sg, .av2sg__fallback { position: absolute; inset: 0; }
/* The package renders <div class="shader"><canvas style="height:100%">, and
   that wrapper div has no height of its own — so the canvas's height:100%
   resolved to auto and it fell back to a canvas's intrinsic 300×150, i.e. a
   fixed 2:1 shape. On any ground taller than half its width the shader painted
   a 2:1 band across the top and left flat colour below. Pinning the wrapper to
   the ground makes the canvas take the ground's real aspect ratio, and the
   package's own ResizeObserver then sizes the backing store to match. */
.av2sg :deep(.shader) { position: absolute; inset: 0; }
.av2sg :deep(canvas) { width: 100% !important; height: 100% !important; display: block; }
</style>
