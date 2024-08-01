<template>
  <div class="aside-menu">
    <div class="menu">
      <PanelMenu :model="menu">
        <template #item="{ item }">
            <nuxt-link v-if="item.path" :to="item.path" class="menu-link" :class="{ 'active': setLinkActive(item) }">
              <div class="icon" v-html="item.icon"></div>
              {{ item.label }}
            </nuxt-link>
            <div v-else class="menu-link" :class="{ 'active': setLinkActive(item) }">
              <div class="icon" v-html="item.icon"></div>
              {{ item.label }}
            </div>
        </template>
      </PanelMenu>
    </div>
    <div class="footer">
      <button class="btn-block" @click="handlerLogout">
        <svg data-name="Layer 2" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg"><path d="M17.54 34.75a17.25 17.25 0 0 1 0-34.5 1.25 1.25 0 0 1 0 2.5 14.75 14.75 0 0 0 0 29.5 1.25 1.25 0 0 1 0 2.5Z" fill="#ffffff" class="fill-000000"></path><path d="M32.927 18.75H15.25a1.25 1.25 0 0 1 0-2.5h17.677a1.25 1.25 0 0 1 0 2.5Z" fill="#ffffff" class="fill-000000"></path><path d="M26.536 26.438a1.25 1.25 0 0 1-.884-2.134l6.384-6.385a.6.6 0 0 0 0-.839l-6.384-6.38a1.25 1.25 0 1 1 1.768-1.771l6.38 6.384a3.1 3.1 0 0 1 0 4.374l-6.38 6.385a1.246 1.246 0 0 1-.884.366Z" fill="#ffffff" class="fill-000000"></path></svg>
        Log Out
      </button>
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
@import './style';
</style>