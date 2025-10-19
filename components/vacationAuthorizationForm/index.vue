<template>
  <div class="vacation-authorization-form">
    <div v-if="isReady" class="vacation-authorization-form-content">
      <div class="form-container">
        <!-- Switch para alternar entre tipos de vacaciones -->
        <div class="input-box switch-container">
          <div class="switch-wrapper">
            <label class="switch-label">{{ $t('vacation_type') }}:</label>
            <div class="switch-options">
              <button
                :class="['switch-option', { active: vacationType === 'pending' }]"
                @click="setVacationType('pending')"
              >
                {{ $t('pending_vacations') }}
              </button>
              <button
                :class="['switch-option', { active: vacationType === 'authorized' }]"
                @click="setVacationType('authorized')"
              >
                {{ $t('authorized_vacations') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Selector de solicitudes pendientes -->
        <div v-if="vacationType === 'pending'" class="input-box">
          <vacationRequestSelector
            :employeeId="employeeId"
            v-model:selectedRequests="selectedRequests"
            @requestsLoaded="onRequestsLoaded"
          />
        </div>

        <!-- Selector de vacaciones autorizadas sin firma -->
        <div v-if="vacationType === 'authorized'" class="input-box">
          <vacationAuthorizedSelector
            :employeeId="employeeId"
            :vacationSettingId="vacationSettingId"
            v-model:selectedShiftExceptions="selectedShiftExceptions"
            @shiftExceptionsLoaded="onShiftExceptionsLoaded"
          />
        </div>

        <!-- Firma digital -->
        <div v-if="hasSelectedItems" class="input-box">
          <vacationSignaturePad
            ref="signaturePad"
            @signatureChanged="onSignatureChanged"
          />
        </div>

        <!-- Botones de acción -->
        <div v-if="hasSelectedItems" class="box-tools-footer">
          <Button
            :label="$t('authorize_requests')"
            severity="primary"
            :disabled="!canAuthorize"
            :loading="isAuthorizing"
            @click="showConfirmationDialog"
          />
          <Button
            :label="$t('cancel')"
            severity="secondary"
            @click="resetForm"
          />
        </div>
      </div>
    </div>

    <!-- Diálogo de confirmación -->
    <transition name="page">
      <confirmVacationAuthorization
        v-if="showConfirmation"
        @confirm="authorizeRequests"
        @cancel="showConfirmation = false"
      />
    </transition>
  </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';
</style>
