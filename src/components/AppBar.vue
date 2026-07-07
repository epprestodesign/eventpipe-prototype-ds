<script setup>
// AppBar — the application's top content bar (sits to the right of the sidebar
// in AppShell). Left: an org/context switcher. Right: a search field and a user
// menu. White surface with a hairline bottom border + level-1 elevation
// (--ds-shadow-1), matching the mock. Brand/focus accents use the DS azure.
import { ref } from 'vue'

const props = defineProps({
  org: { type: String, default: 'Team Travel Source' },
  orgs: { type: Array, default: () => ['Team Travel Source', 'Global Sports Group', 'Summit Events Co.'] },
  user: { type: String, default: 'Mike Addesa' },
  searchPlaceholder: { type: String, default: 'Search' },
})
const emit = defineEmits(['update:org', 'search', 'user-action'])

const query = ref('')

const userItems = ['Profile', 'Account settings', 'Sign out']
</script>

<template>
  <header class="appbar">
    <!-- Left · org / context switcher -->
    <button class="appbar__org" type="button">
      <span class="appbar__org-name">{{ org }}</span>
      <q-icon name="expand_more" size="22px" />
      <q-menu anchor="bottom left" self="top left" :offset="[0, 6]" class="appbar__menu">
        <q-list padding style="min-width: 220px">
          <q-item v-for="o in orgs" :key="o" clickable v-close-popup
            :active="o === org" active-class="appbar__menu-active"
            @click="emit('update:org', o)">
            <q-item-section>{{ o }}</q-item-section>
            <q-item-section side v-if="o === org"><q-icon name="check" size="18px" /></q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </button>

    <!-- Right · search + user -->
    <div class="appbar__right">
      <label class="appbar__search">
        <q-icon name="search" size="20px" class="appbar__search-icon" />
        <input
          v-model="query"
          class="appbar__search-input"
          :placeholder="searchPlaceholder"
          @keyup.enter="emit('search', query)"
        />
      </label>

      <button class="appbar__user" type="button">
        <span class="appbar__user-name">{{ user }}</span>
        <q-icon name="expand_more" size="22px" />
        <q-menu anchor="bottom right" self="top right" :offset="[0, 6]" class="appbar__menu">
          <q-list padding style="min-width: 200px">
            <q-item v-for="a in userItems" :key="a" clickable v-close-popup @click="emit('user-action', a)">
              <q-item-section>{{ a }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </button>
    </div>
  </header>
</template>

<style scoped>
.appbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 64px;
  flex: none;          /* never shrink below 64px inside the shell's flex column */
  box-sizing: border-box;
  padding: 0 24px;
  background: var(--ds-color-surface);
  border-bottom: 1px solid var(--ds-color-border);
}

/* Org switcher */
.appbar__org {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 0 8px 0 4px;
  border: 0;
  border-radius: var(--ds-radius-md);
  background: transparent;
  color: var(--ds-color-text);
  font: inherit;
  cursor: pointer;
  transition: background var(--ds-duration-fast) var(--ds-ease-standard);
}
.appbar__org:hover { background: var(--ds-color-surface-sunken); }
.appbar__org-name { font-size: 1.0625rem; font-weight: 700; letter-spacing: -0.01em; }

/* Right cluster */
.appbar__right { display: flex; align-items: center; gap: 16px; }

/* Search */
.appbar__search {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 300px;
  max-width: 40vw;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  transition: border-color var(--ds-duration-fast) var(--ds-ease-standard),
    box-shadow var(--ds-duration-fast) var(--ds-ease-standard);
}
.appbar__search:focus-within {
  border-color: var(--ds-color-border-focused);
  box-shadow: 0 0 0 3px var(--ds-palette-azure-100);
}
.appbar__search-icon { color: var(--ds-color-icon-subtle); flex: none; }
.appbar__search-input {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 0.9375rem;
  color: var(--ds-color-text);
}
.appbar__search-input::placeholder { color: var(--ds-color-text-subtlest); }

/* User menu */
.appbar__user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 8px 0 6px;
  border: 0;
  border-radius: var(--ds-radius-md);
  background: transparent;
  color: var(--ds-color-text);
  font: inherit;
  cursor: pointer;
  transition: background var(--ds-duration-fast) var(--ds-ease-standard);
}
.appbar__user:hover { background: var(--ds-color-surface-sunken); }
.appbar__user-name { font-size: 0.9375rem; font-weight: 600; }

.appbar__menu-active { color: var(--ds-color-text-brand); font-weight: 700; }
</style>
