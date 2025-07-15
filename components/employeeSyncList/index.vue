<template>
  <div v-if="isReady" class="employee-sync-list">
    <h4>Employee sync list</h4>
    <div v-if="employeesSync.length > 0" class="employee-sync-wrapper">
      <div v-for="(employee, index) in employeesSync" :key="`employee-${employee.employeeId}-${index}`">
        <employeeSyncInfoCard :employee="employee" />
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