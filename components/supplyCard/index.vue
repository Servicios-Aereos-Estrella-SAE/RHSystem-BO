<template>
  <div class="box user-info-card">
    <div class="employee-head">
      <div class="avatar">
        <div class="username-initial">
          {{ supplyInitial }}
        </div>
      </div>
      <div class="employee-head-info">
        <div class="name">
          {{ supply?.supplyName || t('loading') }}
        </div>
        <div class="employee-number">
          {{ `ID #: ${supply?.supplyFileNumber || '...'}` }}
        </div>
        <div class="employee-email">
          {{ `${t('description')}: ${supply?.supplyDescription || t('not_assigned')}` }}
        </div>
      </div>
    </div>

    <div class="info">
      <div class="business-unit">
        {{ `${t('status')}: ${getStatusLabel(supply?.supplyStatus)}` }}
        <span
          class="p-tag p-component font-medium"
          :class="getStatusClass(supply?.supplyStatus)"
        >
          {{ getStatusLabel(supply?.supplyStatus) }}
        </span>
      </div>

      <div
        v-if="isAssigned"
        class="assignment-status assigned"
      >
        <i class="pi pi-user"></i>
        <span>{{ t('assigned_to_employee') }}</span>
      </div>

      <div
        v-else-if="supply?.supplyStatus === 'active'"
        class="assignment-status available"
      >
        <i class="pi pi-check-circle"></i>
        <span>{{ t('available_for_assignment') }}</span>
      </div>

      <div
        v-if="supply?.supplyStatus === 'inactive' || supply?.supplyStatus === 'lost' || supply?.supplyStatus === 'damaged'"
        class="assignment-status unavailable"
      >
        <i class="pi pi-times-circle"></i>
        <span>{{ t('unavailable_for_assignment') }}</span>
      </div>
    </div>

    <div v-if="isLoading" class="loading-stats">
      <i class="pi pi-spin pi-spinner"></i>
      <span>{{ t('loading') }}...</span>
    </div>

    <!-- ✅ Características -->
    <div
      v-if="supply?.characteristics && supply.characteristics.length > 0"
      class="characteristics-section"
    >
      <h4 class="section-title">{{ t('characteristics') }}</h4>
      <div class="characteristics-list">
        <div
          v-for="characteristicValue in supply.characteristics"
          :key="characteristicValue.supplieCaracteristicValueId"
          class="characteristic-item"
        >
          <div class="characteristic-info">
            <span class="characteristic-name">
              {{ characteristicValue.supplieCaracteristic?.supplieCaracteristicName || 'N/A' }}
            </span>
            <span class="characteristic-value">
              {{ characteristicValue.supplieCaracteristicValueValue || 'N/A' }}
            </span>
          </div>
          <span class="characteristic-type">
            {{ getTypeLabel(characteristicValue.supplieCaracteristic?.supplieCaracteristicType || 'text') }}
          </span>
        </div>
      </div>
    </div>

    <!-- ✅ Nueva sección: Desactivación -->
    <div
      v-if="supply?.supplyStatus !== 'active'"
      class="deactivation-section"
    >
      <h4 class="section-title">{{ t('deactivation_info') }}</h4>
      <div class="deactivation-info">
        <p>
          <strong>{{ t('deactivation_reason') }}:</strong>
          {{ supply?.supplyDeactivationReason || t('not_available') }}
        </p>
        <p>
          <strong>{{ t('deactivation_date') }}:</strong>
          {{ formatDate(supply?.supplyDeactivationDate) }}
        </p>
      </div>
    </div>

    <div class="box-tools-footer">
      <button
        v-if="canUpdate"
        class="btn btn-block"
        :disabled="isLoading"
        @click="handlerClickOnEdit"
      >
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z"
            fill="#88a4bf"
          ></path>
        </svg>
      </button>
      <button
        class="btn btn-block"
        :disabled="isLoading || supply?.supplyStatus !== 'active'"
        @click="handlerClickOnAssign"
      >
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="#88a4bf"
          ></path>
        </svg>
      </button>
      <button
        v-if="canDelete"
        class="btn btn-block"
        :disabled="isLoading"
        @click="handlerClickOnDelete"
      >
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
            fill="#88a4bf"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
