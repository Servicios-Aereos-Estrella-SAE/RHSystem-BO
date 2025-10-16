<template>
  <div class="employee-vacation-manager">
    <div class="vacation-period-header">
      <h3>{{ vacationPeriodTitle }}</h3>
      <div class="vacation-summary">
        <div class="summary-badges">
          <div class="badge">
            <span class="label">{{ $t('active_work_years') }}:</span>
            <span class="value">{{ activeWorkYears }}</span>
          </div>
          <div class="badge">
            <span class="label">{{ $t('corresponding_days') }}:</span>
            <span class="value">{{ correspondingDays }}</span>
          </div>
          <div class="badge">
            <span class="label">{{ $t('used_days') }}:</span>
            <span class="value">{{ usedDays }}</span>
          </div>
          <div class="badge">
            <span class="label">{{ $t('available_days') }}:</span>
            <span class="value">{{ availableDays }}</span>
          </div>
          <div class="badge">
            <span class="label">{{ $t('available_previous_days') }}:</span>
            <span class="value">{{ availablePreviousDays }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón para crear solicitud de vacaciones -->
    <div class="vacation-actions">
      <Button
        :label="$t('add_vacation_request')"
        icon="pi pi-plus"
        class="p-button-primary"
        @click="showVacationRequestForm"
      />
    </div>

    <!-- Vacaciones autorizadas -->
    <div v-if="authorizedVacations.length > 0" class="authorized-vacations">
      <h4>{{ $t('authorized_vacations') }}</h4>
      <div class="vacation-list">
        <div
          v-for="vacation in authorizedVacations"
          :key="vacation.id"
          class="vacation-item authorized"
        >
          <div class="vacation-date">
            <i class="pi pi-calendar"></i>
            <span>{{ formatDate(vacation.date) }}</span>
          </div>
          <div class="vacation-actions">
            <Button
              icon="pi pi-pencil"
              class="p-button-outlined p-button-sm"
              @click="editVacation(vacation)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-outlined p-button-sm p-button-danger"
              @click="deleteVacation(vacation)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Solicitudes pendientes -->
    <div v-if="pendingRequests.length > 0" class="pending-requests">
      <h4>{{ $t('pending_vacation_requests') }}</h4>
      <div class="vacation-list">
        <div
          v-for="request in pendingRequests"
          :key="request.exceptionRequestId"
          class="vacation-item pending"
        >
          <div class="vacation-date">
            <i class="pi pi-clock"></i>
            <span>{{ formatDate(request.requestedDate) }}</span>
          </div>
          <div class="vacation-description">
            <span>{{ request.exceptionRequestDescription || $t('vacation_request') }}</span>
          </div>
          <div class="vacation-status">
            <Tag :value="$t('pending')" severity="warning" />
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de autorización -->
    <Dialog
      v-model:visible="showAuthorizationForm"
      :header="$t('authorize_vacation_requests')"
      :modal="true"
      :closable="true"
      class="authorization-dialog"
      :style="{ width: '90vw', maxWidth: '1200px' }"
    >
      <vacationAuthoriszationForm
        :employeeId="employeeId"
        @authorizationCompleted="onAuthorizationCompleted"
        @authorizationError="onAuthorizationError"
      />
    </Dialog>

    <!-- Formulario de solicitud de vacaciones -->
    <Dialog
      v-model:visible="showRequestForm"
      :header="$t('create_vacation_request')"
      :modal="true"
      :closable="true"
      class="request-dialog"
      :style="{ width: '90vw', maxWidth: '800px' }"
    >
      <employeeExceptionRequestInfoForm
        :employee="employee"
        :date="new Date()"
        :exceptionRequest="newExceptionRequest"
        :canManageUserResponsible="true"
        :startDateLimit="new Date()"
        @onExceptionRequestSave="onVacationRequestCreated"
      />
    </Dialog>
  </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';
</style>
