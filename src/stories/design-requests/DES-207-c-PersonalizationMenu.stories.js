/** DES-207 / Components / Personalization Menu → DsPersonalizationMenu.vue. */
import { ref } from 'vue'
import DsPersonalizationMenu from '../../components/DsPersonalizationMenu.vue'

export default {
  title: 'Design Requests/Teams Mgmt Comms Phase 1/Components/Personalization Menu',
  component: DsPersonalizationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: 'The searchable, grouped merge-token picker. Reused by the editor toolbar **Personalization** button and by the inline **`{{`** trigger (typing `{{` in the Text Formatter pops this at the caret). Emits `select` with the token name.' } } },
}

/* The merge-token braces are assembled here rather than written literally.
 * This story used to render the example inline as '{' + '{' … spelled out in
 * full inside the template, which closed the interpolation early — the template
 * never compiled and the story showed nothing at all. Keep the braces out of
 * the template string. */
const OPEN = '{' + '{'
const CLOSE = '}' + '}'

export const Menu = {
  render: () => ({
    components: { DsPersonalizationMenu },
    setup: () => ({ picked: ref(''), OPEN, CLOSE }),
    template: `
      <div class="column q-gutter-md items-center">
        <div style="border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-md); box-shadow:var(--ds-shadow-2);">
          <ds-personalization-menu @select="(n) => (picked = n)" />
        </div>
        <div class="text-grey-7">Inserts: <span class="text-weight-bold text-primary">{{ picked ? OPEN + ' ' + picked + ' ' + CLOSE : '—' }}</span></div>
      </div>`,
  }),
}
