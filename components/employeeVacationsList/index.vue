<template>
  <div v-if="isReady" class="employee-vacations-list">
    <h4>Vacation {{ currentVacation }}</h4>
    <div v-if="filteredEmployees.length > 0" class="vacations-wrapper">
      <div v-for="(employee, index) in filteredEmployees" :key="`employee-${employee.employeeId}-${index}`">
        <EmployeeVacationInfoCard :employee="employee" :showDays="true" />
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