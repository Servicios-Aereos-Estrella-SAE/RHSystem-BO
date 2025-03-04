<template>
  <div :style="`--primary: ${getPrimaryColor};`">
    <div class="guest-layout-wrapper" :style="`background-image: url(${getBackgroundImageBanner});`">
      <div class="banner-wrapper">
        <img :src="getBackgroundImageBanner" alt="banner">
      </div>
      <div class="form-wrapper">
        <slot />
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
