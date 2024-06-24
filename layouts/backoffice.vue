<template>
  <div>
    <dashboardHeader />
    <div class="default-layout-wrapper" :class="{ 'hide-aside': !asideVisibilityStatus }">
      <div class="aside-menu-wrapper">
        <aside-menu />
      </div>
      <div></div>
      <div class="modules-wrapper">
        <div class="modules-content-wrepper">
          <!-- <div class="box">
            <h1>Color mode: {{ $colorMode.value }}</h1>
            <select v-model="$colorMode.preference" @change="setcolor">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sepia">Sepia</option>
            </select>
          </div> -->
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