<template>
  <div v-if="isReady" class="box employee-shifts">
    <Toast />
    <employeeModalInfoCard :employee="employee"/>
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
      <nuxt-link v-if="!displayInputCalendar" :to="`/employees-attendance-monitor/${this.employee.employeeCode}`" target="_blank" title="Assist report" class="btn btn-block">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 21a.75.75 0 0 1 0-1.5h18.5a.75.75 0 0 1 0 1.5H2.75ZM4 15.75A2.25 2.25 0 0 0 6.25 18h2.5A2.25 2.25 0 0 0 11 15.75V5.25A2.25 2.25 0 0 0 8.75 3h-2.5A2.25 2.25 0 0 0 4 5.25v10.5Zm9 0A2.25 2.25 0 0 0 15.25 18h2.5A2.25 2.25 0 0 0 20 15.75v-7a2.25 2.25 0 0 0-2.25-2.25h-2.5A2.25 2.25 0 0 0 13 8.75v7Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </nuxt-link>
      <Button v-if="displayInputCalendar" class="btn btn-block" @click="handlerCalendarChange">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
    </div>

    <div class="head-exception">
      <div></div>

      <div>
        <Button v-if="!displayInputCalendar && canManageExceptionRequest" title="Excepciones" class="btn btn-block" @click="onClickException">
          <svg data-v-ae6e64c4="" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path data-v-ae6e64c4="" d="M21 8.5v3.522A6.5 6.5 0 0 0 12.022 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18ZM17.75 3A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5ZM12 17.5a5.5 5.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0Zm8.5-3.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h1a2.496 2.496 0 0 0-2-1c-.833 0-1.572.407-2.027 1.036a.5.5 0 0 1-.81-.586A3.496 3.496 0 0 1 17.5 14c.98 0 1.865.403 2.5 1.05v-.55a.5.5 0 0 1 .5-.5ZM15 19.95v.55a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-1c.456.608 1.183 1 2 1 .766 0 1.452-.344 1.911-.888a.5.5 0 0 1 .764.645A3.493 3.493 0 0 1 17.5 21a3.49 3.49 0 0 1-2.5-1.05Z" fill="#88a4bf" class="fill-212121"></path></svg>
          Exception Requests
        </Button>
      </div>
      <Button v-if="!displayInputCalendar" title="Vacations" class="btn btn-block" @click="onClickVacations">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.25 3a.75.75 0 0 1 .75.75V7h1.75A3.25 3.25 0 0 1 21 10.25v6.5A3.25 3.25 0 0 1 17.75 20H6.25A3.25 3.25 0 0 1 3 16.75v-6.5A3.25 3.25 0 0 1 6.25 7H8V3.75a.75.75 0 0 1 .648-.743L8.75 3h6.5Zm-.75 1.5h-5V7h5V4.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
        Vacations
      </Button>
    </div>

    <div v-if="employeeCalendar.length > 0 && displayCalendar" class="calendar-wrapper">
      <EmployeeCalendarShiftDayControl
        v-for="(item, index) in employeeCalendar"
        :key="`shift-day-${index}`"
        :employee="employee"
        :employeeCalendarAssist="item"
        :shiftsList="shiftsList"
        :isDeleted="isDeleted"
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
        :shift="currentShift"
        @save="onSave"
      />
    </Sidebar>


    <Sidebar v-model:visible="drawerShiftException" :blockScroll="true" :dismissable="false"  :closeOnEscape="false" header="Employee exceptions" position="right" class="shift-exception-sidebar">
      <employeeExceptionRequest
        :employee="employee"
        :date="selectedExceptionDate"
        @saveExceptionRequest="onSaveExceptionRequest"
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
        :status-form="statusForm"
        :can-manage-vacation="canManageVacation"
      />
    </Sidebar>

    <Sidebar
      v-model:visible="displaySidebarVacationsManager"
      @hide="handlerSidebarVacationsClose(vacationPeriod)"
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
        :can-manage-vacation="canManageVacation"
        @save="onSave"
      />
    </Sidebar>
  </div>
  <div v-else class="loader">
    <ProgressSpinner />
  </div>
  <transition name="page">
    <shiftExceptionsError
      v-if="drawershiftExceptionsError"
      :shiftExceptions="shiftExceptionsError"
      @confirm="drawershiftExceptionsError = false"
      @cancel="drawershiftExceptionsError = false"
    />
  </transition>
  <transition name="page">
    <exceptionRequestsError
      v-if="drawerExceptionRequestsError"
      :exceptionRequests="exceptionRequestsError"
      @confirm="drawerExceptionRequestsError = false"
      @cancel="drawerExceptionRequestsError = false"
    />
  </transition>
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