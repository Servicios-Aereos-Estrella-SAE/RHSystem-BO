<template>
  <div class="box customer-info-form">
    <h4>
      {{ isNewCustomer ? 'New customer' : 'Update customer' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <label for="firstName">First Name</label>
          <InputText v-model="customer.person.personFirstname" placeholder="Enter First Name" />
          <small class="p-error" v-if="submitted && !customer.person.personFirstname">First Name is required.</small>
        </div>
        <div class="input-box">
          <label for="lastName">Last Name</label>
          <InputText v-model="customer.person.personLastname" placeholder="Enter Last Name" />
          <small class="p-error" v-if="submitted && !customer.person.personLastname">Last Name is required.</small>
        </div>
        <div class="input-box">
          <label for="lastName">Second Last Name</label>
          <InputText v-model="customer.person.personSecondLastname" placeholder="Enter Second Last Name" />
          <small class="p-error" v-if="submitted && !customer.person.personSecondLastname">Second Last Name is required.</small>
        </div>
        <div class="input-box">
          <label for="customerHireDate">Birthday</label>
          <Calendar v-model="customer.person.personBirthday" dateFormat="yy-mm-dd" placeholder="Select birthday" @update:model-value="formatDate('birthday')"/>
        </div>
        <div class="input-box">
          <label for="customerLastName">Phone</label>
          <InputText v-model="customer.person.personPhone" placeholder="Enter customer phone" />
          <small class="p-error" v-if="submitted && customer.person.personPhone && !isValidPhone">Phone number is not valid.</small>
        </div>
        <div class="input-box">
          <label for="personGender">Gender</label>
          <Dropdown v-model="customer.person.personGender" :options="genders" optionLabel="label" optionValue="value"
            placeholder="Select Gender" class="w-full md:w-14rem" />
        </div>
        <div class="input-box">
          <label for="customerLastName">Personal identification code</label>
          <InputText v-model="customer.person.personCurp" placeholder="Enter customer CURP" />
          <small class="p-error" v-if="submitted && customer.person.personCurp && !isValidCURP">Personal identification is not valid.</small>
        </div>
        <div class="input-box">
          <label for="customerLastName">RFC</label>
          <InputText v-model="customer.person.personRfc" placeholder="Enter customer RFC" />
          <small class="p-error" v-if="submitted && customer.person.personRfc && !isValidRFC">RFC is not valid.</small>
        </div>
        <div class="input-box">
          <label for="customerLastName">NSS</label>
          <InputText v-model="customer.person.personImssNss" placeholder="Enter customer NSS" />
        </div>
        <div class="input-box">
          <label for="customerUuid">UUID</label>
          <InputText v-model="customer.customerUuid" placeholder="Enter customer UUID" />
        </div>
        <div class="box-tools-footer">
          <Button label="Proceeding files" severity="primary" @click="getProceedingFiles()" />
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
      </div>
    </div>
    <div class="card flex justify-content-center">
      <Sidebar v-model:visible="drawerProceedingFiles" header="Customer proceeding files" position="right" class="proceeding-file-sidebar"
        :showCloseIcon="true">
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
