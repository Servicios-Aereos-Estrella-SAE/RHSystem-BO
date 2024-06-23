<template>
  <div class="guest-layout-wrapper">
    <div class="form-wrapper">
      <slot />
    </div>
    <div class="banner-wrapper">
      <img src="/public/121637889_168888608205831_6859140430215543392_n.png" alt="SAE">
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