<template>
  <div class="box attendance-employee-info-card">
    <div class="avatar">
      <svg viewBox="0 0 500 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M415.762 346.214c-19.078-24.896-42.156-41.063-75.223-50.236l-30.983 108.475c0 9.992-8.181 18.172-18.172 18.172-9.988 0-18.169-8.18-18.169-18.172v-86.311c0-12.536-10.178-22.715-22.715-22.715-12.536 0-22.713 10.179-22.713 22.715v86.311c0 9.992-8.181 18.172-18.17 18.172-9.992 0-18.173-8.18-18.173-18.172l-30.983-108.475c-33.068 9.262-56.145 25.34-75.221 50.236-7.542 9.812-11.64 29.527-11.908 40.07.09 2.725 0 5.906 0 9.082v36.345c0 20.078 16.264 36.34 36.343 36.34h281.648c20.078 0 36.345-16.262 36.345-36.34v-36.345c0-3.176-.089-6.357 0-9.082-.275-10.543-4.368-30.259-11.906-40.07zm-260.66-218.141c0 53.059 33.078 131.013 95.398 131.013 61.237 0 95.396-77.954 95.396-131.013 0-53.057-42.702-96.124-95.396-96.124s-95.398 43.067-95.398 96.124z" fill="#87a4bf" fill-rule="evenodd" class="fill-010101"></path></svg>
    </div>
    <div class="name">
      {{ employee.employee_first_name }}
      {{ employee.employee_last_name }}
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
      <nuxt-link :to="`/attendance-monitor/employee-${employee.employee_code}`" class="box-button block">
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