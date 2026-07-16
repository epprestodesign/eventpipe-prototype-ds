/** DES-207 / Components / Personalization Menu → DsPersonalizationMenu.vue. */
import { ref } from 'vue'
import DsPersonalizationMenu from '../../components/DsPersonalizationMenu.vue'

export default {
  title: 'Design Requests/DES-207 Communications | Email Template Editor/Components/Personalization Menu',
  component: DsPersonalizationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered', docs: { description: { component: 'The searchable, grouped merge-token picker. Reused by the editor toolbar **Personalization** button and by the inline **`{{`** trigger (typing `{{` in the Text Formatter pops this at the caret). Emits `select` with the token name.' } } },
}

export const Menu = {
  render: () => ({
    components: { DsPersonalizationMenu },
    setup: () => ({ picked: ref('') }),
    template: `
      <div class="column q-gutter-md items-center">
        <div style="border:1px solid var(--ds-color-border); border-radius:var(--ds-radius-md); box-shadow:var(--ds-shadow-2);">
          <ds-personalization-menu @select="(n) => (picked = n)" />
        </div>
        <div class="text-grey-7">Inserts: <span class="text-weight-bold text-primary">{{ picked ? '{{ ' + picked + ' }}' : '—' }}</span></div>
      </div>`,
  }),
}
