<template>
  <div class="assignment-form">
    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">{{ t('assignment_information') }}</h3>

        <div class="form-grid">
          <div class="form-field">
            <label class="field-label required">{{ t('employee') }}</label>
            <Dropdown
              v-model="assignmentData.employeeId"
              :options="employees"
              option-label="displayName"
              option-value="employeeId"
              :placeholder="t('select_employee')"
              class="form-dropdown"
              :class="{ 'p-invalid': submitted && !assignmentData.employeeId }"
            />
            <small v-if="submitted && !assignmentData.employeeId" class="p-error">
              {{ t('employee_required') }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{ t('supply') }}</label>
            <Dropdown
              v-model="assignmentData.supplyId"
              :options="supplies"
              option-label="supplyName"
              option-value="supplyId"
              :placeholder="t('select_supply')"
              class="form-dropdown"
              :class="{ 'p-invalid': submitted && !assignmentData.supplyId }"
            />
            <small v-if="submitted && !assignmentData.supplyId" class="p-error">
              {{ t('supply_required') }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{ t('assignment_status') }}</label>
            <Dropdown
              v-model="assignmentData.employeeSupplyStatus"
              :options="assignmentStatusOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('select_assignment_status')"
              class="form-dropdown"
              :class="{ 'p-invalid': submitted && !assignmentData.employeeSupplyStatus }"
            />
            <small v-if="submitted && !assignmentData.employeeSupplyStatus" class="p-error">
              {{ t('assignment_status_required') }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <Button
        :label="t('cancel')"
        icon="pi pi-times"
        class="p-button-text"
        @click="handlerClickOnClose"
      />
      <Button
        :label="assignmentData.employeeSupplyId ? t('update') : t('create')"
        icon="pi pi-check"
        class="p-button-primary"
        :loading="isLoading"
        @click="onSave"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
