<template>
  <div class="vacation-authorization-form">
    <div v-if="isReady" class="vacation-authorization-form-content">
      <div class="form-container">
        <!-- Selector de solicitudes pendientes -->
        <div class="input-box">
          <vacationRequestSelector
            :employeeId="employeeId"
            v-model:selectedRequests="selectedRequests"
            @requestsLoaded="onRequestsLoaded"
          />
        </div>

        <!-- Firma digital -->
        <div v-if="selectedRequests.length > 0" class="input-box">
          <vacationSignaturePad
            ref="signaturePad"
            @signatureChanged="onSignatureChanged"
          />
        </div>

        <!-- Botones de acción -->
        <div v-if="selectedRequests.length > 0" class="box-tools-footer">
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
