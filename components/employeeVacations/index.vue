<template>
  <div v-if="isReady" class="employee-shift-vacations">
    <h1>
      Employee Vacations
    </h1>

    <div v-if="isReady">
      <div class="vacation-periods-wrapper">
        <vacationsPeriodCard
          v-for="(item , index) in 3"
          :key="`vacation-period-${index}`"
          @manageVacations="handlerClickManage"
        />
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