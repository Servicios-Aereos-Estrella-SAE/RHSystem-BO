<template>
  <div v-if="isReady" class="box employee-shifts">
    <Toast />
    <div class="month-year-mobile">
      <span v-show="!displayInputCalendar" class="text">
        Shifts on
        {{ monthName }}
      </span>
      <Calendar v-show="displayInputCalendar" v-model="inputSelectedDate" view="month" dateFormat="MM" />
    </div>
    <div class="head-calendar">
      <Button class="btn btn-block" :disabled="displayInputCalendar" @click="handlerLastMonth">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15 17.898c0 1.074-1.265 1.648-2.073.941l-6.31-5.522a1.75 1.75 0 0 1 0-2.634l6.31-5.522c.808-.707 2.073-.133 2.073.941v11.796Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button class="btn btn-block" :disabled="displayInputCalendar" @click="handlerNextMonth">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 17.898c0 1.074 1.265 1.648 2.073.941l6.31-5.522a1.75 1.75 0 0 0 0-2.634l-6.31-5.522C10.265 4.454 9 5.028 9 6.102v11.796Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>

      <div class="month-year">
        <span v-show="!displayInputCalendar" class="text">
          Shifts on
          {{ monthName }}
        </span>
        <Calendar v-show="displayInputCalendar" v-model="inputSelectedDate" view="month" dateFormat="MM" />
      </div>

      <Button title="Select month" v-if="!displayInputCalendar" class="btn btn-block" @click="handlerDisplayInputDate">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 8.5v9.25A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18ZM7.25 15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM12 15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-4.75-4.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4.75 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4.75 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm1-7.5A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button v-if="displayInputCalendar" class="btn btn-block" @click="handlerCalendarCancel">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button v-if="displayInputCalendar" class="btn btn-block" @click="handlerCalendarChange">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button v-if="!displayInputCalendar" title="Vacations" class="btn btn-block" @click="onClickVacations">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.25 3a.75.75 0 0 1 .75.75V7h1.75A3.25 3.25 0 0 1 21 10.25v6.5A3.25 3.25 0 0 1 17.75 20H6.25A3.25 3.25 0 0 1 3 16.75v-6.5A3.25 3.25 0 0 1 6.25 7H8V3.75a.75.75 0 0 1 .648-.743L8.75 3h6.5Zm-.75 1.5h-5V7h5V4.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
    </div>

    <div v-if="employeeCalendar.length > 0 && displayCalendar" class="calendar-wrapper">
      <EmployeeCalendarShiftDayControl
        v-for="(item, index) in employeeCalendar"
        :key="`shift-day-${index}`"
        :employee="employee"
        :employeeCalendarAssist="item"
        :shiftsList="shiftsList"
        @successShiftAssigned="onSuccessShiftAssigned"
        @clickExceptions="onClickExceptions"
      />
    </div>
    <div v-else class="no-shifts">
      This employee has no shifts assigned to this month
    </div>

    <Sidebar v-model:visible="drawerShiftExceptions" :blockScroll="true" :dismissable="false"  :closeOnEscape="false" header="Employee shift exceptions" position="right" class="shift-exception-sidebar">
      <employeeShiftException
        :employee="employee"
        :date="selectedExceptionDate"
      />
    </Sidebar>

    <Sidebar
      v-model:visible="displaySidebarVacations"
      :blockScroll="true"
      :dismissable="false"
      :closeOnEscape="false"
      header="vacations"
      position="right"
      class="shift-vacations-sidebar"
      >
      <employeeVacations
        :employee="employee"
        @manageVacations="handlerVacationsManager"
      />
    </Sidebar>

    <Sidebar
      v-model:visible="displaySidebarVacationsManager"
      :blockScroll="true"
      :dismissable="false"
      :closeOnEscape="false"
      header="vacations"
      position="right"
      class="shift-vacations-manage-sidebar"
    >
      <employeeVacationsControl
        :employee="employee"
        :vacation-period="vacationPeriod"
      />
    </Sidebar>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>

<style lang="scss">
  @import '/resources/styles/variables.scss';

  .employee-shift-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .shift-exception-sidebar {
    width: 100% !important;
    max-width: 33rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .shift-vacations-sidebar {
    width: 100% !important;
    max-width: 27rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .shift-vacations-manage-sidebar {
    width: 100% !important;
    max-width: 27rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>