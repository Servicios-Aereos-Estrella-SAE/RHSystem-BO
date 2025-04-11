<template>
  <div v-if="isReady" class="box employee-shifts">
    <!-- <Calendar view="month" dateFormat="MM" /> -->
    <div class="month-year-mobile">
      <span class="text">
        Aircraft Maintenance
        {{ monthName }}
      </span>
      <Calendar v-model="inputSelectedDate" view="month" dateFormat="MM" />
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
          Aircraft Maintenance
          {{ monthName }}
        </span>
        <Calendar v-show="displayInputCalendar" v-model="inputSelectedDate" view="month" dateFormat="MM"/>
      </div>
      <Button v-if="!displayInputCalendar" class="btn" @click="onClickAddMaintenance">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
        Add Maintenance
      </Button>
    </div>
    <div v-if="aircraftMaintenances.length > 0" class="calendar-wrapper">
      <AircraftMaintenanceInfoCard
        v-for="(aircraftMaintenance, index) in aircraftMaintenances"
        :key="`aircraft-maintenance-${aircraftMaintenance.aircraftMaintenanceId}-${index}`"
        :aircraft-maintenance="aircraftMaintenance"
        :can-update="true"
        :can-delete="true"
        @clickOnEdit="onEdit"
        @clickOnDelete="onDelete"
      />
    </div>
  </div>
  <div v-else class="loader">
    <ProgressSpinner />
  </div>
  <transition name="page">
        <confirmDelete
          v-if="drawerAircraftDelete"
          @confirmDelete="deleteMaintenance"
          @cancelDelete="drawerAircraftDelete = false"
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

  .work-disabilities-sidebar {
    width: 100% !important;
    max-width: 33rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
