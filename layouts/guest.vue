<template>
  <div>
    <div v-if="guest" class="guest-layout-wrapper">
      <div class="form-wrapper">
        <slot />
      </div>
      <div class="banner-wrapper">
        <img src="https://sae-assets.sfo3.cdn.digitaloceanspaces.com/rh-system/images/100bcbbc-cea7-4c6b-9584-154bdc2144ba.jpg" alt="SAE">
      </div>
    </div>
  </div>
</template>

<script>
  import Script from './assets/guest/script.ts'
  export default Script
</script>

<style lang="scss">
@import './assets/guest/style';
</style>