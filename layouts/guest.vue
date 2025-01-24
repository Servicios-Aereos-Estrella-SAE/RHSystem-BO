<template>
  <div>
    <div class="guest-layout-wrapper">
      <div class="form-wrapper">
        <slot />
      </div>
      <div class="banner-wrapper">
        <img :src="getBackgroundImageBanner" alt="SAE">
      </div>
    </div>
  </div>
</template>

<script>
  import Script from './assets/guest/script.ts'
  export default Script
</script>

<style lang="scss">
@import './assets/backoffice/style';
</style>