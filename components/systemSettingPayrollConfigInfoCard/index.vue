<template>
  <div class="box system-setting-payroll-config-info-card">
    <div class="name capitalize">
      {{ getPaymentTypeName(systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType) }}
    </div>
    <div class="line">
    </div>
    <div class="info status">
      <label for="status">Number of days to be paid</label>
      <span> {{ systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid }}</span>
    </div>
    <div class="info status">
      <label for="status">Number of overdue days to offset</label>
      <span> {{ systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset }}</span>
    </div>
    <div class="info date">
      <label for="date" class="label-item">Apply since:</label>
      <label class="label-date"> {{ getFormattedDate(systemSettingPayrollConfig.systemSettingPayrollConfigApplySince)
        }}</label>

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