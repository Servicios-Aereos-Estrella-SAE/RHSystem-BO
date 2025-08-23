<template>
  <div class="box employee-with-fault-info-card">
    <div class="employee-head">
      <div class="avatar">
        <img v-if="employee.employeePhoto" :src="employee.employeePhoto" alt="Employee Photo" class="employee-photo" />
        <div v-else class="username-initial">
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
        <div class="employee-email">
          {{ `${ $t('email') }: ${employee.employeeBusinessEmail || 'Not assigned'}` }}
        </div>
      </div>
    </div>

    <div class="info">
      <div class="business-unit">
        {{ `${ $t('business_unit') }: ${employee.businessUnit?.businessUnitName || 'Not assigned'}` }}
      </div>
      <div class="capitalize">
        {{ `${employee.department.departmentName || ''}`}}
      </div>
      <div class="">
        {{ `${employee.position.positionName}` }}
      </div>
    </div>
    <div class="info">
      <h5>{{ $t('faults') }}:</h5>
      <div v-for="(day, index) in employee.faultDays"
        :key="`employee-day-fault-${employee?.employeeCode || Math.random()}-${index}`">
        {{ day.day }}
      </div>
    </div>
    <div class="box-tools-footer">
      <button class="btn btn-block" @click="goCalendar()">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.75 21a.75.75 0 0 1 0-1.5h18.5a.75.75 0 0 1 0 1.5H2.75ZM4 15.75A2.25 2.25 0 0 0 6.25 18h2.5A2.25 2.25 0 0 0 11 15.75V5.25A2.25 2.25 0 0 0 8.75 3h-2.5A2.25 2.25 0 0 0 4 5.25v10.5Zm9 0A2.25 2.25 0 0 0 15.25 18h2.5A2.25 2.25 0 0 0 20 15.75v-7a2.25 2.25 0 0 0-2.25-2.25h-2.5A2.25 2.25 0 0 0 13 8.75v7Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </button>
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