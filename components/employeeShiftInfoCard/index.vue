<template>
  <div class="box employee-shift-info-card" :class="{ active: employeeShift.isActive }">
    <div class="shift-name">
      {{ `${employeeShift.shift.shiftName}` }}
    </div>
    <div class="shift-time">
      {{ `Day to Start: ${getRestDaysNames(employeeShift.shift.shiftDayStart)}` }}
    </div>
    <div class="shift-time">
      {{ `Start: ${employeeShift.shift.shiftTimeStart}` }}
    </div>
    <div class="shift-hours">
      {{ `Hours active: ${employeeShift.shift.shiftActiveHours}` }}
    </div>
    <div class="shift-days">
      {{ `Rest Days: ${getRestDaysNames(employeeShift.shift.shiftRestDays)}` }}
    </div>
    <div class="shift-days">
      {{ `Apply Since: ${calendarDay} at ${chekInTime}` }}
    </div>

    <div class="box-tools-footer">
      <Button icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()"/>
      <Button icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()"/>
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
@import '/resources/styles/variables.scss';

@import './style';

</style>