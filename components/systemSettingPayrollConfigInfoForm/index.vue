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
            Payment type
          </label>
          <Dropdown :disabled="!isNewSystemSettingPayrollConfig" placeholder="Select payment type"
            v-model="systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType" :options="paymentTypeOptions"
            optionLabel="label" optionValue="value"
            :invalid="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType" />
          <small class="p-error"
            v-if="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType">Payment type is
            required.</small>
        </div>
        <div v-if="systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'fixed_day_every_n_weeks'"
          class="input-box">
          <label>
            Fixed day
          </label>
          <Dropdown :disabled="!isNewSystemSettingPayrollConfig" placeholder="Select fixed day"
            v-model="systemSettingPayrollConfig.systemSettingPayrollConfigFixedDay" :options="daysOfWeeks"
            optionLabel="label" optionValue="value"
            :invalid="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigFixedDay" />
          <small class="p-error"
            v-if="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigFixedDay">Fixed day is
            required.</small>
        </div>

        <div v-if="systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'fixed_day_every_n_weeks'"
          class="input-box">
          <label for="systemSettingPayrollConfigFixedEveryNWeeks">Fixed every n weeks</label>
          <InputNumber id="systemSettingPayrollConfigFixedEveryNWeeks"
            v-model="systemSettingPayrollConfig.systemSettingPayrollConfigFixedEveryNWeeks"
            :invalid="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigFixedEveryNWeeks"
            :disabled="!isNewSystemSettingPayrollConfig" />
          <small class="p-error"
            v-if="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigFixedEveryNWeeks">Fixed every n
            weeks is
            required.</small>
        </div>

        <div v-if="systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'specific_day_of_month'"
          class="input-box">
          <label for="systemSettingPayrollConfigNumberOfDaysToBePaid">Config number of days to be paid</label>
          <InputNumber id="systemSettingPayrollConfigNumberOfDaysToBePaid"
            v-model="systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid"
            :invalid="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid" :min="1"
            :max="31"
            :disabled="!isNewSystemSettingPayrollConfig || systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'biweekly'" />
          <small class="p-error"
            v-if="submitted && !systemSettingPayrollConfig.systemSettingPayrollConfigNumberOfDaysToBePaid">Config number
            of days to be paid is
            required.</small>
        </div>

        <div v-if="systemSettingPayrollConfig.systemSettingPayrollConfigPaymentType === 'fixed_day_every_n_weeks'"
          class="input-box">
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