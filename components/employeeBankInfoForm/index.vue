<template>
  <div class="employee-bank-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewEmployeeBank ? $t('add_account_bank') : $t('update_account_bank')}}
    </h1>

    <div v-if="isReady" class="employee-bank-form">
      <div class="form-container">
        <div class="input-box">
          <label for="bank">
            {{ $t('bank') }}
          </label>
          <Dropdown v-model="employeeBank.bankId" :options="banksList" optionLabel="bankName" optionValue="bankId"
            :placeholder="`${$t('select')} ${$t('bank')}`" filter class="w-full md:w-14rem"
            :disabled="!canManageUserResponsible" />
          <small class="p-error" v-if="submitted && !employeeBank.bankId">{{ $t('bank') }} {{ $t('is_required')
            }}</small>
        </div>
        <div class="input-box">
          <label for="account-clabe">
            {{ $t('account_clabe') }}
          </label>
          <InputText v-model="employeeBank.employeeBankAccountClabe"
            :placeholder="`${$t('enter')} ${$t('account_clabe')}`" maxlength="18" @keydown="restrictInput"
            @input="validateAccountClabe" :disabled="!canManageUserResponsible" />
          <small class="p-error" v-if="submitted && !employeeBank.employeeBankAccountClabe">{{ $t('account_clabe') }} {{
            $t('is_required') }}
          </small>
          <small class="p-error" v-if="employeeBank.employeeBankAccountClabe && !isValidAccountClabe">{{
            $t('account_clabe') }} {{ $t('is_not_valid') }}
          </small>
        </div>
        <div class="input-box">
          <label for="account-number">
            {{ $t('account_number') }}
          </label>
          <InputText v-model="employeeBank.employeeBankAccountNumber"
            :placeholder="`${$t('enter')} ${$t('account_number')}`" maxlength="10" @keydown="restrictInput"
            :disabled="!canManageUserResponsible" />
          <small class="p-error" v-if="submitted && employeeBank.employeeBankAccountNumber && !isValidAccountNumber">{{
            $t('account_number_must_have_10_digits') }}
          </small>
        </div>
        <div class="input-box">
          <label for="account-number">
            {{ $t('account_card_number') }}
          </label>
          <InputText v-model="employeeBank.employeeBankAccountCardNumber"
            :placeholder="`${$t('enter')} ${$t('account_card_number')}`" maxlength="16" @keydown="restrictInput"
            @input="validateAccountCard" :disabled="!canManageUserResponsible" />
          <small class="p-error" v-if="employeeBank.employeeBankAccountCardNumber && !isValidAccountCardNumber">{{
            $t('account_card_number') }} {{ $t('is_not_valid') }}
          </small>
        </div>
        <div v-if="employeeBank.employeeBankAccountCardNumber" class="input-box">
          <label for="account-type">
            {{ $t('account_card_type') }}
          </label>
          <InputText v-model="employeeBank.employeeBankAccountType" disabled />
        </div>
        <div class="input-box">
          <label for="status">
            {{ $t('account_currency_type') }}
          </label>
          <Dropdown v-model="employeeBank.employeeBankAccountCurrencyType" :options="currencyOptions"
            optionLabel="label" optionValue="value" :placeholder="`${$t('select')} ${$t('account_currency_type')}`"
            class="w-full md:w-14rem" :disabled="!canManageUserResponsible" />
          <small class="p-error" v-if="submitted && !employeeBank.employeeBankAccountCurrencyType">{{
            $t('account_currency_type') }} {{ $t('is_required') }}</small>
        </div>
        <div class="box-tools-footer">
          <Button v-if="canManageUserResponsible" class="btn btn-block btn-primary" @click="onSave">
            {{ $t('save') }}
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