<template>
  <div v-if="isReady" class="employee-shift-vacations">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      Manage vacations
    </h1>

    <vacationsPeriodCard :vacation-period="currentVacationPeriod" hideManager class="period-info"
      :can-manage-vacation="canManageVacation" />

    <div class="head">
      <button v-if="displayAddButton && canManageUserResponsible" class="btn btn-block" @click="addNewVacation">
        <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
            fill="#88a4bf" class="fill-000000"></path>
        </svg>
        Add vacation day
      </button>
    </div>

    <div v-if="isReady">
      <div class="vacations-wrapper">
        <div v-for="(shiftException, index) in shiftExceptions" :key="`employee-vacation-${index}`">
          <vacationsControl :shift-exception="shiftException"
            :click-on-delete="() => { onDelete(shiftException, index) }" :isDeleted="isDeleted"
            @onShiftExceptionSave="onSave" @onShiftExceptionSaveAll="onSaveAll"
            @onShiftExceptionCancel="onCancel(index)"
            :vacationPeriodAvailableDays="currentVacationPeriod.vacationPeriodAvailableDays"
            :can-manage-vacation="canManageVacation" :canManageException="canManageException" :employee="employee"
            :index-card="index" :canManageUserResponsible="canManageUserResponsible" :startDateLimit="startDateLimit" />
        </div>
      </div>
      <transition name="page">
        <confirmDelete v-if="drawerShiftExceptionDelete" @confirmDelete="confirmDelete"
          @cancelDelete="drawerShiftExceptionDelete = false" />
      </transition>
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