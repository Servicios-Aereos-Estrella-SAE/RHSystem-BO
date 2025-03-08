<template>
  <div class="employee-bank-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewEmployeeBank ? 'Add employee account bank' : 'Update employee account bank' }}
    </h1>

    <div v-if="isReady" class="employee-bank-form">
      <div class="form-container">
        <div class="input-box">
          <label for="bank">
            Bank
          </label>
          <Dropdown v-model="employeeBank.bankId" :options="banksList" optionLabel="bankName" optionValue="bankId"
            placeholder="Select bank" filter class="w-full md:w-14rem" />
          <small class="p-error" v-if="submitted && !employeeBank.bankId">Bank is
            required.</small>
        </div>
        <div class="input-box">
          <label for="account-clabe">
            Account clabe
          </label>
          <InputText v-model="employeeBank.employeeBankAccountClabe" placeholder="Enter CLABE account" maxlength="18" />
          <small class="p-error" v-if="submitted && !employeeBank.employeeBankAccountClabe">Account clabe
            is required.
          </small>
          <small class="p-error"
            v-if="submitted && employeeBank.employeeBankAccountClabe && !isValidAccountClabe">Account clabe
            not is valid.
          </small>
        </div>
        <div class="input-box">
          <label for="account-number">
            Account number
          </label>
          <InputText v-model="employeeBank.employeeBankAccountNumber" placeholder="Enter Account Number"
            maxlength="11" />
          <small class="p-error" v-if="submitted && !employeeBank.employeeBankAccountNumber">Account number
            is required.
          </small>
          <small class="p-error"
            v-if="submitted && employeeBank.employeeBankAccountNumber && !isValidAccountNumber">Account number
            not is valid.
          </small>
        </div>
        <div class="input-box">
          <label for="status">
            Account currency type
          </label>
          <Dropdown v-model="employeeBank.employeeBankAccountCurrencyType" :options="currencyOptions"
            optionLabel="label" optionValue="value" placeholder="Select currency type" class="w-full md:w-14rem" />
          <small class="p-error" v-if="submitted && !employeeBank.employeeBankAccountCurrencyType">Account currency type
            is
            required.</small>
        </div>
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save employee bank
          </Button>
        </div>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
</style>