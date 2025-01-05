<template>
  <div class="box attendance-info-card">
    <div v-if="position && !hidePositionTitle" class="name">
      {{ position.positionAlias || position.positionName }}
    </div>
    <div v-else-if="department" class="name">
      {{ department.departmentAlias || department.departmentName }}
    </div>
    <div class="percentage assist">
      {{onTimePercentage}}%
      <small>
        On Time
      </small>
    </div>
    <div class="percentages">
      <div class="percentage tolerance">
        {{onToleracePercentage}}%
        <small>
          Tolerances
        </small>
      </div>
      <div class="percentage delay">
        {{onDelayPercentage}}%
        <small>
          Delays
        </small>
      </div>
      <div class="percentage fault">
        {{onFaultPercentage}}%
        <small>
          Faults
        </small>
      </div>
    </div>
    <div class="percentage early-out">
      {{onEarlyOutPercentage}}%
      <small>
        Early outs
      </small>
    </div>
    <div v-if="!hideLink" class="box-tools-footer">
      <nuxt-link v-if="department && position" :to="`/departments-attendance-monitor/${department.departmentId}/position/${position.positionId}`" class="box-button block">
        See details
        <svg class="feather feather-arrow-right" fill="none" stroke="#303e67" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
      </nuxt-link>
      <nuxt-link v-else-if="department" :to="`/departments-attendance-monitor/${department.departmentId}`" class="box-button block">
        See positions
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