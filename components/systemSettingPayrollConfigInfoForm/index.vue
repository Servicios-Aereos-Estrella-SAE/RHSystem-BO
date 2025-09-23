<template>
  <div class="box system-setting-payroll-config-info-form">

    <h4>
      {{ isNewSystemSettingPayrollConfig ? 'New system setting payroll config' : 'Update system setting payroll config'
      }}
    </h4>
    <div v-if="isReady" class="system-setting-payroll-config-form">
      <div class="form-container">
        <div class="input-box">
          <label>
            Payment Type
          </label>
          <Dropdown :disabled="!isNewSystemSettingPayrollConfig" placeholder="Select payment type"
            v-model="systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType" :options="paymentTypeOptions"
            optionLabel="label" optionValue="value" />
        </div>

        <div class="input-box">
          <label for="systemSettingPayrollConfigNumberOfDaysToBePaid">Config number of days to be paid</label>
          <InputNumber id="systemSettingPayrollConfigNumberOfDaysToBePaid"
            v-model="systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid"
            :invalid="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid"
            :disabled="!isNewSystemSettingPayrollConfig || systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'biweekly'" />
          <small class="p-error"
            v-if="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid">Config number
            of days to be paid is
            required.</small>
        </div>

        <div class="input-box">
          <label for="systemSettingPayrollConfigNumberOfOverdueDaysToOffset">Config number of overdue days to
            offset</label>
          <InputNumber id="systemSettingPayrollConfigNumberOfOverdueDaysToOffset"
            v-model="systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset"
            :invalid="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset"
            :disabled="!isNewSystemSettingPayrollConfig" />
          <small class="p-error"
            v-if="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfOverdueDaysToOffset">Config
            number of overdue days to offset is
            required.</small>
        </div>

        <div class="input-box">
          <label for="systemSettingPayrollConfigApplySince">Apply Since</label>
          <Calendar v-if="isNewSystemSettingPayrollConfig"
            v-model="systemSettingPayrollConfig.systemSettingPayrollConfigApplySince" dateFormat="yy-mm-dd"
            :showTime="false" :disabled="!isNewSystemSettingPayrollConfig" />
          <InputText v-else type="text" v-model="systemSettingPayrollConfigApplySince" readonly />
          <small class="p-error"
            v-if="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigApplySince ">Apply since date is
            required.</small>
        </div>

        <div v-if="isNewSystemSettingPayrollConfig" class="box-tools-footer">
          <Button label="Save" severity="primary" class="btn btn-primary btn-block" @click="onSave()" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';

  .shift-exception-sidebar {
    width: 100% !important;
    max-width: 70rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .shift-sidebar {
    width: 100% !important;
    max-width: 70rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .proceeding-file-sidebar {
    width: 100% !important;
    max-width: 90rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
<style scoped>
  :deep(.p-button)[aria-label="Upload"] {
    display: none;
  }

  :deep(.p-button)[aria-label="Cancel"] {
    display: none;
  }

  :deep(.p-button)[aria-label="Choose"] {
    display: block;
  }
</style>