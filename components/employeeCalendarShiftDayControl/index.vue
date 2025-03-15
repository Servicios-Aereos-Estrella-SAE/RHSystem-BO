<template>
  <div class="caledar-day">
    <div v-if="isReady">
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
        <span v-else-if="employeeCalendar.assist.dateShift && employeeCalendar.assist.isWorkDisabilityDate" class="label-icon">
          <div class="icon">
            <svg viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M54.173 52.728c-.482.265-.997.39-1.528.39-1.296 0-2.606-.765-3.326-2.076l-6.51-11.901H25.994c-.093 0-.186 0-.28-.015h-.141a4.816 4.816 0 0 1-4.98-4.494l-1.108-16.908a4.822 4.822 0 0 1 4.498-5.121l.997-.061a4.808 4.808 0 0 1 5.123 4.479l.295 4.668h10.259c1.312 0 2.372 1.186 2.372 2.637 0 1.453-1.061 2.639-2.372 2.639H30.74l.25 3.763h12.274c.467 0 .905.078 1.326.218 1.076.188 2.092.891 2.702 1.999l8.086 14.785c.996 1.844.466 4.077-1.205 4.998z" fill="#88a4bf" class="fill-241f20"></path><circle cx="24.547" cy="5.627" fill="#88a4bf" r="5.594" class="fill-241f20"></circle><g fill="#88a4bf" class="fill-241f20"><path d="m28.006 30.869.009.134M40.076 43.046H23.262c-.095 0-.188 0-.281-.015h-.14a4.824 4.824 0 0 1-4.982-4.498l-.719-10.975c-5.425 3.534-9.018 9.643-9.018 16.601 0 10.94 8.869 19.808 19.809 19.808 7.716 0 14.383-4.419 17.655-10.855l-5.51-10.066z"></path></g></svg>
          </div>
          Disability day
        </span>
        <span v-else-if="employeeCalendar.assist.isHoliday && employeeCalendar.assist.holiday">
          {{ employeeCalendar.assist.holiday.holidayName }}
        </span>
        <span v-else>
          Work day
        </span>
      </div>
      <div class="tools">
        <Button v-if="displayButtonManageShift" id="btn-open-shift-form" class="btn btn-block" @click="handlerShiftForm(employeeCalendar)" :disabled="isDeleted || !canManagementShift">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121 fill-303e67"></path></svg>
        </Button>
        <Button v-if="displayButtonManageExceptions" id="btn-open-exceptions" class="btn btn-block" @click="handlerClickExceptions" :disabled="!employeeCalendarAssist.assist.dateShift">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 8.5v3.522A6.5 6.5 0 0 0 12.022 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18ZM17.75 3A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5ZM12 17.5a5.5 5.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0Zm8.5-3.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h1a2.496 2.496 0 0 0-2-1c-.833 0-1.572.407-2.027 1.036a.5.5 0 0 1-.81-.586A3.496 3.496 0 0 1 17.5 14c.98 0 1.865.403 2.5 1.05v-.55a.5.5 0 0 1 .5-.5ZM15 19.95v.55a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-1c.456.608 1.183 1 2 1 .766 0 1.452-.344 1.911-.888a.5.5 0 0 1 .764.645A3.493 3.493 0 0 1 17.5 21a3.49 3.49 0 0 1-2.5-1.05Z" :fill="employeeCalendar.assist.hasExceptions ? '#33D4AD' : '#88a4bf'" class="fill-212121"></path></svg>
        </Button>
        <Button v-if="displayAcceptEditShiftButton" id="btn-store-shift" class="btn btn-block" @click="onSave">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#88a4bf" class="fill-212121"></path></svg>
        </Button>
        <Button v-if="displayCancelEditShiftButton" id="btn-cancel-shift-form" class="btn btn-block" @click="handlerCancelEditShift">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#88a4bf" class="fill-212121"></path></svg>
        </Button>
      </div>
    </div>
    <div v-else class="skeleton">
      <div class="date">
        <Skeleton shape="circle" size="3rem"></Skeleton>
      </div>
      <div class="day">
        <br>
        <Skeleton width="5rem" borderRadius="16px"></Skeleton>
      </div>
      <div class="shift">
        <Skeleton height="3rem"></Skeleton>
      </div>
      <div class="status">
        <Skeleton width="5rem" borderRadius="16px"></Skeleton>
      </div>
      <div class="tools">
        <Skeleton height="3rem"></Skeleton>
        <Skeleton height="3rem"></Skeleton>
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
