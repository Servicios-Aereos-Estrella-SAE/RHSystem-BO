<template>
  <div v-if="isReady" class="employee-without-shift-list">
    <h4>No assigned shift</h4>
    <div v-if="employeesWithOutShift.length > 0" class="without-shift-wrapper">
      <div v-for="(employee, index) in employeesWithOutShift" :key="`employee-${employee.employeeId}-${index}`">
        <employeeWithOutShiftInfoCard :employee="employee" />
      </div>
    </div>
    <div v-else class="employee-card-wrapper">
      <div class="empty-data">
        There are no employees
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
