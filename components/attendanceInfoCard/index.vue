<template>
  <div class="box attendance-info-card">
    <div class="name">
      Posicion
    </div>
    <div class="percentage assist">
      70%
      <small>
        Assists
      </small>
    </div>
    <div class="percentages">
      <div class="percentage tolerance">
        20%
        <small>
          Tolerances
        </small>
      </div>
      <div class="percentage delay">
        7%
        <small>
          Delays
        </small>
      </div>
      <div class="percentage fault">
        3%
        <small>
          Faults
        </small>
      </div>
    </div>
    <div class="box-tools-footer">
      <nuxt-link :to="`/attendance-monitor/slug--department`" class="box-button block">
        See details
        <svg class="feather feather-arrow-right" fill="none" stroke="#303e67" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
      </nuxt-link>
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