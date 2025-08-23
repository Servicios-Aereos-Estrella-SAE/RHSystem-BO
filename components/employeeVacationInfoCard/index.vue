<template>
  <div class="box employee-vacation-info-card">
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
    <div v-if="employee.shift_exceptions.length > 0 && showDays" class="info">
      {{ $t('days') }}:
      <div v-for="(shiftException, index) in employee.shift_exceptions" :key="`exception-${index}`">
        <span>{{ getFormattedDate(shiftException.shiftExceptionsDate) }}</span>
      </div>
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