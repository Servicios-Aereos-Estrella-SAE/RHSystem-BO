<template>
  <div class="box user-info-card">
    <div class="employee-head">
      <div class="avatar">
        <div class="username-initial">
          {{ assignmentInitial }}
        </div>
      </div>
      <div class="employee-head-info">
        <div class="name">
          {{ assignment?.employee?.person?.personName || t('loading') }}
        </div>
        <div class="employee-number">
          {{ `Emp. ID: ${assignment?.employee?.employeeCode || '...'}` }}
        </div>
        <div class="employee-email">
          {{ `${t('supply')}: ${assignment?.supply?.supplyName || t('not_assigned')}` }}
        </div>
      </div>
    </div>

    <div class="info">
      <div class="business-unit">
        {{ `${t('assignment_date')}: ${formatDate(assignment?.employeeSupplyCreatedAt)}` }}
      </div>
      <div class="department">
        {{ `${t('status')}: ${getStatusLabel(assignment?.employeeSupplyStatus)}` }}
      </div>
      <div class="position">
        {{ `${t('return_date')}: ${formatDate(assignment?.employeeSupplyReturnDate)}` }}
      </div>
    </div>

    <div v-if="isLoading" class="loading-stats">
      <i class="pi pi-spin pi-spinner"></i>
      <span>{{ t('loading') }}...</span>
    </div>

    <div v-else class="stats-section">
      <div class="stat-item">
        <div class="stat-value">{{ getStatusLabel(assignment?.employeeSupplyStatus) }}</div>
        <div class="stat-label">{{ t("status") }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ formatDate(assignment?.employeeSupplyCreatedAt) }}</div>
        <div class="stat-label">{{ t("assigned_date") }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ formatDate(assignment?.employeeSupplyReturnDate) }}</div>
        <div class="stat-label">{{ t("return_date") }}</div>
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
            class="fill-212121"
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
            class="fill-212121"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
