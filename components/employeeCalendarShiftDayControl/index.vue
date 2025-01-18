<template>
  <div class="caledar-day">
    <div class="date">
      <div class="number" :class="{ active: isNow(employeeCalendar.day) }">
        {{ getCalendarDayNumber(employeeCalendar.day) }}
      </div>
    </div>
    <div class="day">
      {{ getCalendarDayName(employeeCalendar.day) }}
    </div>
    <div class="shift">
      <Dropdown v-if="drawerEmployeeShiftForm && employeeShift && shiftEditSelected && (shiftEditSelected.day === employeeCalendar.day)" v-model="employeeShift.shiftId" :options="shiftsList" optionLabel="shiftName" optionValue="shiftId" filter />
      <div v-else>
        <span v-if="!employeeCalendar.assist.dateShift || employeeCalendar.assist.isRestDay || employeeCalendar.assist.isVacationDate || employeeCalendar.assist.isWorkDisabilityDate" class="off">
          ---- -- ----
        </span>
        <span v-else :class="{ off: employeeCalendar.assist.isHoliday }">
          {{ getShiftName(employeeCalendar.assist.dateShift.shiftName) }}
        </span>
      </div>
    </div>
    <div class="status">
      <span v-if="!employeeCalendar.assist.dateShift" class="no-shift">
        Shift not assigned
      </span>
      <span v-else-if="employeeCalendar.assist.dateShift && employeeCalendar.assist.isRestDay">
        Rest day
      </span>
      <span v-else-if="employeeCalendar.assist.dateShift && employeeCalendar.assist.isVacationDate">
        Vacation day
      </span>
      <span v-else-if="employeeCalendar.assist.dateShift && employeeCalendar.assist.isWorkDisabilityDate">
        Work disability day
      </span>
      <span v-else-if="employeeCalendar.assist.isHoliday && employeeCalendar.assist.holiday">
        {{ employeeCalendar.assist.holiday.holidayName }}
      </span>
      <span v-else>
        Work day
      </span>
    </div>
    <div class="tools">
      <Button v-if="drawerEmployeeShiftForm && shiftEditSelected && (shiftEditSelected.day === employeeCalendar.day)" id="btn-store-shift" class="btn btn-block" @click="onSave">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button v-else-if="canUpdateShift && canManagementShift" id="btn-open-shift-form" class="btn btn-block" @click="handlerShiftForm(employeeCalendar)" :disabled="isDeleted || !canManagementShift">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121 fill-303e67"></path></svg>
      </Button>
      <Button v-if="drawerEmployeeShiftForm && shiftEditSelected && (shiftEditSelected.day === employeeCalendar.day)" id="btn-cancel-shift-form" class="btn btn-block" @click="handlerCancelEditShift">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button v-else id="btn-open-exceptions" class="btn btn-block" @click="handlerClickExceptions" :disabled="!employeeCalendarAssist.assist.dateShift">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 8.5v3.522A6.5 6.5 0 0 0 12.022 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18ZM17.75 3A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5ZM12 17.5a5.5 5.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0Zm8.5-3.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h1a2.496 2.496 0 0 0-2-1c-.833 0-1.572.407-2.027 1.036a.5.5 0 0 1-.81-.586A3.496 3.496 0 0 1 17.5 14c.98 0 1.865.403 2.5 1.05v-.55a.5.5 0 0 1 .5-.5ZM15 19.95v.55a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-1c.456.608 1.183 1 2 1 .766 0 1.452-.344 1.911-.888a.5.5 0 0 1 .764.645A3.493 3.493 0 0 1 17.5 21a3.49 3.49 0 0 1-2.5-1.05Z" :fill="employeeCalendar.assist.hasExceptions ? '#33D4AD' : '#88a4bf'" class="fill-212121"></path></svg>
      </Button>
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