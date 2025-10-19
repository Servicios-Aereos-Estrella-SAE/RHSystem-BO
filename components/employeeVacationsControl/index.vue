<template>
  <div v-if="isReady" class="employee-shift-vacations">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ $t('manage_vacations') }}
    </h1>

    <vacationsPeriodCard :vacation-period="currentVacationPeriod" hideManager class="period-info"
      :can-manage-vacation="canManageVacation" />

    <div class="head">
      <!-- Botón para agregar vacación directamente -->
      <button v-if="displayAddButton && canManageUserResponsible" class="btn btn-block" @click="addNewVacation">
        <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
            fill="#88a4bf" class="fill-000000"></path>
        </svg>
        {{ $t('add_vacation_day') }}
      </button>

      <!-- Botón para autorizar vacaciones -->
      <button v-if="displayAddButton && canManageUserResponsible" class="btn btn-block btn-primary" @click="toggleAuthorizationForm">
        <i class="pi pi-check-circle"></i>
        {{ $t('authorize_vacation_requests') }}
      </button>

      <!-- Botón para crear solicitud de vacaciones -->
      <button v-if="displayAddButton && canManageUserResponsible" class="btn btn-block btn-secondary" @click="toggleVacationRequestForm">
        <i class="pi pi-calendar-plus"></i>
        {{ $t('create_vacation_request') }}
      </button>

    </div>

    <div v-if="isReady">
      <!-- Formulario de solicitud de vacaciones (desplegable) -->
      <div v-if="showVacationRequestForm" class="vacation-request-form-container">
        <shiftExceptionForm
          :employee="employee"
          :startDateLimit="startDateLimit"
          @exceptionRequestCreated="onVacationRequestCreated"
          @exceptionRequestError="onVacationRequestError"
        />
      </div>

      <!-- Sidebar para autorización de vacaciones -->
      <div class="card flex justify-content-center">
        <Sidebar
          v-model:visible="showAuthorizationDialog"
          :header="$t('authorize_vacation_requests')"
          position="right"
          class="vacation-authorization-sidebar"
          :showCloseIcon="true"
        >
          <vacationAuthorizationForm
            :employeeId="employee.employeeId"
            :currentVacationPeriod="currentVacationPeriod"
            :vacationSettingId="currentVacationPeriod.vacationSettingId"
            @authorizationCompleted="onVacationAuthorized"
            @authorizationError="onVacationAuthorizationError"
          />
        </Sidebar>
      </div>

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
