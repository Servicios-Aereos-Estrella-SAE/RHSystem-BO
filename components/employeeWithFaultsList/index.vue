<template>
  <div v-if="isReady" class="employee-with-fault-list">
    <h4>{{ $t('employees_with_consecutive_faults') }}</h4>
    <div v-if="employeesWithFaults.length > 0" class="with-fault-wrapper">
      <div v-for="(employee, index) in employeesWithFaults" :key="`employee-${employee.employeeId}-${index}`">
        <employeeWithFaultInfoCard :employee="employee" />
      </div>
    </div>
    <div v-else class="employee-card-wrapper">
      <div class="empty-data">
        {{ $t('there_are_no_employees') }}
      </div>
    </div>

  </div>
  <ProgressSpinner v-else />
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>