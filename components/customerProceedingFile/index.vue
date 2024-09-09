<template>
  <div v-if="isReady" class="box customer-proceeding-files">
    <Toast />
    <h4>
      {{ `${customer.person.personFirstname || ''}` }} {{ `${customer.person.personLastname ||
        ''}`  }} {{ `${customer.person.personSecondLastname ||
          ''}`  }}
    </h4>
    <div v-if="isReady" class="customer">
      <div class="form-container">
        <div class="customer-proceeding-file-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <br />
              <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
        </div>
        <div class="customer-proceeding-file-wrapper">
          <div v-for="(customerProceedingFile, index) in customerProceedingFilesList" :key="`proceeding-file-${index}`">
            <customerProceedingFileInfoCard :customerProceedingFile="customerProceedingFile"
              :click-on-edit="() => { onEdit(customerProceedingFile) }"
              :click-on-delete="() => { onDelete(customerProceedingFile) }" />
          </div>
        </div>
        <!-- Rmployee Proceeding File form -->
        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerCustomerProceedingFileForm" position="right"
            class="customer-proceeding-file-form-sidebar" :showCloseIcon="true">
            <customerProceedingFileInfoForm :customerProceedingFile="customerProceedingFile"
              @onCustomerProceedingFileSave="onSave" />
          </Sidebar>
        </div>
      </div>
      <Dialog v-model:visible="drawerCustomerProceedingFileDelete" :style="{width: '450px'}" header="Confirm"
        :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="customerProceedingFile"> Are you sure you want to delete proceeding file at
            <b>{{`${selectedDateTimeDeleted || ''}`}}</b>
            ?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="drawerCustomerProceedingFileDelete = false" />
          <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
        </template>
      </Dialog>
    </div>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
  @import '/resources/styles/variables.scss';

  .customer-proceeding-file-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>