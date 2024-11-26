<template>
  <div v-if="isReady" class="employee-shift-vacations">
    <employeeModalInfoCard :employee="employee"/>

    <h1>
      Employee Vacations
    </h1>

    <div v-if="isReady">
      <div class="vacation-periods-wrapper">
        <div v-for="(vacationPeriod, index) in vacationPeriods" :key="`vacation-period-${index}`">
          <vacationsPeriodCard
            :vacation-period="vacationPeriod"
            @manageVacations="handlerClickManage(vacationPeriod)"
            :can-manage-vacation="canManageVacation" />
        </div>
      </div>
    </div>

    <ProgressSpinner v-else />
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>