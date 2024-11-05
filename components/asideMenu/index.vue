<template>
  <Sidebar v-model:visible="visible" dismissable>
    <template #container>
      <div v-if="isReady" class="aside-menu">
        <div class="header-menu-box">
          <Button type="button" class="btn btn-block" @click="closeCallback">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 6a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1ZM9 18a1 1 0 0 1 1-1h11a1 1 0 1 1 0 2H10a1 1 0 0 1-1-1ZM3 11a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3Z" fill="#88a4bf" class="fill-212121"></path></svg>
          </Button>
          <div class="sidebar-logo-container">
            <img :src="getBackgroundImage" alt="SAE" class="sidebar-logo">
          </div>
        </div>
        <div class="menu" :style="{ backgroundColor: getBackgroundColor }">
          <PanelMenu :model="menu">
            <template #item="{ item }">
                <nuxt-link
                  v-if="item.path"
                  :to="item.path"
                  class="menu-link"
                  :class="{ 'active': setLinkActive(item) }"
                  :style="{ backgroundColor: getBackgroundColorDark }"
                  @click="closeCallback"
                >
                  <div class="icon" v-html="item.icon"></div>
                  {{ item.label }}
                </nuxt-link>
                <div v-else class="menu-link" :class="{ 'active': setLinkActive(item) }" :style="{ backgroundColor: getBackgroundColor }">
                  <div class="icon" v-html="item.icon"></div>
                  {{ item.label }}
                </div>
            </template>
          </PanelMenu>
        </div>
      </div>
    </template>
  </Sidebar>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>

<style lang="scss">
  .aside-menu {

    .p-panelmenu .p-panelmenu-header .p-panelmenu-header-content {
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .p-panelmenu .p-panelmenu-content {
      background: transparent;
      border: none;

      .menu-link {
        padding-left: 2rem;
      }
    }

    .p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled) > .p-menuitem-content {
      background: transparent !important;
      border: none !important;
    }

    .p-toggleable-content {
      padding-left: 1rem;
    }
    .p-panelmenu-content {
      margin-left: -1rem;
    }
  }
</style>