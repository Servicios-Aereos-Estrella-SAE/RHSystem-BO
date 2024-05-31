<template>
  <div>
    <dashboardHeader @onAsideVisibilityChange="handlerAsideVisibilityChange" />
    <div class="default-layout-wrapper" :class="{ 'hide-aside': !asideVisibilityStatus }">
      <div class="aside-menu-wrapper">
        <aside-menu :asideVisibilityStatus="asideVisibilityStatus" />
      </div>
      <div></div>
      <div class="modules-wrapper">
        <div class="modules-content-wrepper">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Script from './assets/backoffice/script.ts'
  export default Script
</script>

<style lang="scss">
@import './assets/backoffice/style';
</style>