<template>
  <div class="box employee-sync-info-card">
    <div class="employee-head">
      <div class="avatar">
        <div class="username-initial">
          {{ employeeInitial }}
        </div>
      </div>
      <div class="employee-head-info">
        <div class="name">
          {{ employeeName }}
        </div>
        <div class="employee-number">
          {{ `Emp. ID: ${employee.employeeCode}` }}
        </div>
        <div v-if="employee.canSelect" class="checkbox-label-wrapper">
          <Checkbox v-model="employee.checked" binary />
          <label for="checked"> Select </label>
        </div>
      </div>
    </div>

    <div v-if="employee.message" class="info">
      <div class="message">
        {{ `${employee.message}` }}
      </div>
    </div>

    <div v-if="employee.canSelect" class="box-tools-footer">


    </div>

  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>