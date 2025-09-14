<template>
  <div class="box customer-info-form">
    <h4>
      {{ isNewCustomer ? $t('add_customer') : $t('update_customer') }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <label for="firstName">{{ $t('first_name') }}</label>
          <InputText v-model="customer.person.personFirstname" :placeholder="`${$t('enter')} ${$t('first_name')}`" />
          <small class="p-error" v-if="submitted && !customer.person.personFirstname">{{ $t('first_name') }} {{
            $t('is_required')
            }}</small>
        </div>
        <div class="input-box">
          <label for="lastName">{{ $t('last_name') }}</label>
          <InputText v-model="customer.person.personLastname" :placeholder="`${$t('enter')} ${$t('last_name')}`" />
          <small class="p-error" v-if="submitted && !customer.person.personLastname">{{ $t('last_name') }} {{
            $t('is_required') }}</small>
        </div>
        <div class="input-box">
          <label for="lastName">{{ $t('second_last_name') }}</label>
          <InputText v-model="customer.person.personSecondLastname"
            :placeholder="`${$t('enter')} ${$t('second_last_name')}`" />
          <small class="p-error" v-if="submitted && !customer.person.personSecondLastname">{{ $t('second_last_name') }}
            {{ $t('is_required') }}</small>
        </div>
        <div class="input-box">
          <label for="customerHireDate">{{ $t('birthday') }}</label>
          <Calendar v-model="customer.person.personBirthday" dateFormat="yy-mm-dd"
            :placeholder="`${$t('select')} ${$t('birthday')}`" @update:model-value="formatDate('birthday')" />
        </div>
        <div class="input-box">
          <label for="customerLastName">{{ $t('phone') }}</label>
          <InputText v-model="customer.person.personPhone" :placeholder="`${$t('enter')} ${$t('phone')}`" />
          <small class="p-error" v-if="submitted && customer.person.personPhone && !isValidPhone">{{ $t('phone') }} {{
            $t('is_not_valid') }}</small>
        </div>
        <div class="input-box">
          <label for="personGender">{{ $t('gender') }}</label>
          <Dropdown v-model="customer.person.personGender" :options="getGenders" optionLabel="label" optionValue="value"
            :placeholder="`${$t('select')} ${$t('gender')}`" class=" w-full md:w-14rem" />
        </div>
        <div class="input-box">
          <label for="customerLastName">CURP</label>
          <InputText v-model="customer.person.personCurp" :placeholder="`${$t('enter')} CURP`" />
          <small class="p-error" v-if="submitted && customer.person.personCurp && !isValidCURP">{{
            $t('personal_identification_is_not_valid') }}</small>
        </div>
        <div class="input-box">
          <label for="customerLastName">RFC</label>
          <InputText v-model="customer.person.personRfc" :placeholder="`${$t('enter')} RFC`" />
          <small class="p-error" v-if="submitted && customer.person.personRfc && !isValidRFC">RFC {{ $t('is_not_valid')
            }}</small>
        </div>
        <div class="input-box">
          <label for="customerLastName">NSS</label>
          <InputText v-model="customer.person.personImssNss" :placeholder="`${$t('enter')} NSS`" />
        </div>
        <div class="input-box">
          <label for="customerUuid">UUID</label>
          <InputText v-model="customer.customerUuid" :placeholder="`${$t('enter')} UUID`" />
        </div>
        <div class="box-tools-footer">
          <Button :label="$t('proceeding_files')" severity="primary" @click="getProceedingFiles()" />
          <Button :label="$t('save')" severity="primary" @click="onSave()" />
        </div>
      </div>
    </div>
    <div class="card flex justify-content-center">
      <Sidebar v-model:visible="drawerProceedingFiles" :header="`${$t('customer')} ${$t('proceeding_files')}`"
        position="right" class="proceeding-file-sidebar" :showCloseIcon="true">
        <customerProceedingFile :customer="customer" />
      </Sidebar>
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