<template>
  <div class="page-loader" :style="`z-index: ${zIndexValue};`">
    <div>
      <img src="/public/isotipo-v1-loader.png" alt="">
      <div class="loader-text">
        Loading content....
      </div>
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