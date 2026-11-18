// FOUNDATIONS / Imagery — hosted library (loaded at runtime) + local fallback.
import { ref } from 'vue'
import DsUnsplashImage from '../../components/DsUnsplashImage.vue'
import { loadImagery } from '../../lib/imagery.js'

export default {
  id: 'foundations-imagery', title: 'Design System/Foundations/Imagery',
  // The Docs page is the hand-written MDX beside this file, not autodocs.
  tags: [],
  parameters: { docs: { description: { component: `
## Overview
A **separately-hosted hotel image library**, loaded at **runtime** from the
imagery repo so new photos appear here **without rebuilding the design system**.

- Library + builder: **github.com/epprestodesign/presto-ds-imagery**
- Manifest: \`https://epprestodesign.github.io/presto-ds-imagery/manifest.json\`
- Configure the DS with \`VITE_IMAGERY_URL\` (the imagery Pages base). When unset
  or offline, it falls back to a small committed set in \`src/assets/hotel/\`.

## Use it in code
\`\`\`js
import { loadImagery, randomImage } from '@/lib/imagery.js'
const lib = await loadImagery()   // { rooms:[{url,credit,...}], ... } (remote or local)
randomImage('pool')?.url          // instant local-fallback pick for prototypes
\`\`\`

## Add more imagery (after the fact, no DS deploy)
In the imagery repo: \`node build.mjs 12\` → commit → push. Pages redeploys and
the DS shows the new images on next load.
` } } },
}

/** The hosted library, grouped by category (falls back to the local set offline). */
export const Library = {
  render: () => ({
    setup() {
      const data = ref({})
      const loading = ref(true)
      loadImagery().then((d) => { data.value = d; loading.value = false }).catch(() => { loading.value = false })
      return { data, loading }
    },
    template: `
      <div v-if="loading" class="text-grey-7">Loading imagery…</div>
      <div v-else style="display:flex;flex-direction:column;gap:12px">
        <div v-for="(imgs, cat) in data" :key="cat">
          <div class="text-subtitle2 text-capitalize" style="margin-bottom:6px">{{ cat }}
            <span class="text-caption text-grey-7">({{ imgs.length }})</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));grid-auto-rows:110px;gap:8px">
            <div v-for="(img,i) in imgs" :key="i" :title="img.credit"
                 :style="{ borderRadius:'8px', backgroundImage:'url('+img.url+')', backgroundSize:'cover', backgroundPosition:'center', position:'relative' }">
              <span style="position:absolute;left:6px;bottom:4px;color:#fff;font-size:10px;text-shadow:0 1px 2px rgba(0,0,0,.7)">{{ img.credit }}</span>
            </div>
          </div>
        </div>
      </div>`,
  }),
}

/** Live API image (for prototypes) — single request to stay within rate limits. */
export const Live = {
  parameters: { docs: { description: { story: 'Dynamic Unsplash fetch via DsUnsplashImage (needs an API key).' } } },
  render: () => ({
    components: { DsUnsplashImage },
    template: `<div style="max-width:480px"><ds-unsplash-image query="hotel suite" :ratio="16/9" /></div>`,
  }),
}
