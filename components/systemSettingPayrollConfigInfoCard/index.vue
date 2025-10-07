<template>
  <div class="box system-setting-payroll-config-info-card">
    <div class="info-box">
      <div class="name capitalize">
        {{ getPaymentTypeName(systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType) }}
      </div>
      <div class="line">
      </div>
      <div class="info date">
        <label for="date" class="label-item">Apply since:</label>
        <label class="label-date"> {{ getFormattedDate(systemSettingPayrollConfig.systemSettingPayrollConfigApplySince)
          }}</label>
      </div>
      <div v-if="systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'fixed_day_every_n_weeks'"
        class="info status">
        <label for="status">Fixed day</label>
        <span class="capitalize"> {{ systemSettingPayrollConfig.systemSettingPayrollConfigFixedDay }}</span>
      </div>
      <div v-if="systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'fixed_day_every_n_weeks'"
        class="info status">
        <label for="status">Fixed every n weeks</label>
        <span> {{ systemSettingPayrollConfig.systemSettingPayrollConfigFixedEveryNWeeks }}</span>
      </div>
      <div
        v-if="['biweekly', 'fourteenth', 'specific_day_of_month'].includes(systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType)"
        class="info status">
        <label for="status">Number of days to be paid</label>
        <span> {{ systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid }}</span>
      </div>
      <div v-if="['fourteenth'].includes(systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType)"
        class="info status">
        <label for="status">Number of days end to be paid</label>
        <span> {{ systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysEndToBePaid }}</span>
      </div>
      <div
        v-if="['fixed_day_every_n_weeks', 'fourteenth'].includes(systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType)"
        class="info status">
        <label for="status">
          {{ systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'fixed_day_every_n_weeks'
          ? 'Number of overdue days to offset'
          : 'Number of overdue periods to offset' }}
        </label>
        <span>{{ systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset }}</span>
      </div>
    </div>

    <div class="box-tools-footer">
      <Button icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()" />
      <Button icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()" />
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>