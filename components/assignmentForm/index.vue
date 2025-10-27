<template>
  <div class="assignment-form">
    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">{{ t("assignment_information") }}</h3>

        <!-- Warning if supply is already assigned -->
        <div v-if="isSupplyAlreadyAssigned" class="assignment-warning">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ t("supply_already_assigned_warning") }}</span>
        </div>

        <div class="form-grid">
          <div class="form-field full-width">
            <label class="field-label required">{{ t("employee") }}</label>
            <Dropdown
              v-model="selectedEmployeeId"
              :options="employeeOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('select_employee')"
              class="form-dropdown"
              :class="{ 'p-invalid': submitted && !selectedEmployeeId }"
              :loading="isLoadingEmployees"
              filter
              @filter="onFilterEmployees"
            />
            <small v-if="submitted && !selectedEmployeeId" class="p-error">
              {{ t("employee_required") }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{ t("assignment_status") }}</label>
            <Dropdown
              v-model="assignment.employeeSupplyStatus"
              :options="assignmentStatusOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('select_assignment_status')"
              class="form-dropdown"
              :class="{ 'p-invalid': submitted && !assignment.employeeSupplyStatus }"
            />
            <small v-if="submitted && !assignment.employeeSupplyStatus" class="p-error">
              {{ t("assignment_status_required") }}
            </small>
          </div>
        </div>
      </div>

      <div
        v-if="assignment.employeeSupplyStatus === 'retired'"
        class="form-section"
      >
        <h3 class="section-title">{{ t("retirement_information") }}</h3>

        <div class="form-grid">
          <div class="form-field full-width">
            <label class="field-label required">{{ t("retirement_reason") }}</label>
            <Textarea
              v-model="assignment.employeeSupplyRetirementReason"
              :placeholder="t('enter_retirement_reason')"
              class="form-textarea"
              :class="{ 'p-invalid': submitted && !assignment.employeeSupplyRetirementReason }"
              rows="3"
            />
            <small v-if="submitted && !assignment.employeeSupplyRetirementReason" class="p-error">
              {{ t("retirement_reason_required") }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{ t("retirement_date") }}</label>
            <Calendar
              v-model="assignment.employeeSupplyRetirementDate"
              :placeholder="t('select_retirement_date')"
              class="form-calendar"
              :class="{ 'p-invalid': submitted && !assignment.employeeSupplyRetirementDate }"
              date-format="yy-mm-dd"
              show-icon
            />
            <small v-if="submitted && !assignment.employeeSupplyRetirementDate" class="p-error">
              {{ t("retirement_date_required") }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button
      v-if="assignment && canUpdate"
        :label="assignment.employeeSupplyId ? t('update') : t('create')"
        icon="pi pi-check"
        class="btn btn-primary btn-block"
        :loading="isLoading"
        @click="onSave">


        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
            fill="#ffffff" class="fill-212121"></path>
        </svg>
        {{ $t('save') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
