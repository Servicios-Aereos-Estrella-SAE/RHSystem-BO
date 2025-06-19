<template>
  <div>
    <div v-if="employee && employee?.employee" class="box attendance-employee-info-card">
      <div>
        <employeeModalInfoCard :employee="employee.employee" />
      </div>
      <div class="percentage assist">
        {{employee.assistStatistics.onTimePercentage || 0}}%
        <small>
          On Time
          <br>
          <span>
            ( {{ `${employee.assistStatistics.assists || 0}`.padStart(2, '0') }} Arrivals )
          </span>
        </small>
      </div>
      <div class="percentages">
        <div class="percentage tolerance">
          {{employee.assistStatistics.onTolerancePercentage || 0}}%
          <small>
            Tolerances
            <br>
            <span>
              ( {{ `${employee.assistStatistics.tolerances || 0}`.padStart(2, '0') }} Arrivals )
            </span>
          </small>
        </div>
        <div class="percentage delay">
          {{employee.assistStatistics.onDelayPercentage || 0}}%
          <small>
            Delays
            <br>
            <span>
              ( {{ `${employee.assistStatistics.delays || 0}`.padStart(2, '0') }} Arrivals )
            </span>
          </small>
        </div>
        <div class="percentage fault">
          {{employee.assistStatistics.onFaultPercentage || 0}}%
          <small>
            Faults
            <br>
            <span>
              ( {{ `${employee.assistStatistics.faults || 0}`.padStart(2, '0') }} Absences )
            </span>
          </small>
        </div>
      </div>
      <div class="percentage early-out">
        {{employee.assistStatistics.onEarlyOutPercentage || 0}}%
        <small>
          Early outs
        </small>
      </div>
      <div class="box-tools-footer">
        <nuxt-link :to="`/employees-attendance-monitor/${employee.employee.employeeCode}`" class="box-button block">
          See details
          <svg class="feather feather-arrow-right" fill="none" stroke="#303e67" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
        </nuxt-link>
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