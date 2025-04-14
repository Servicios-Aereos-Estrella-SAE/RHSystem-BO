<template>
  <div v-if="isReady" class="box maintenance-shifts">

    <!-- <Calendar view="month" dateFormat="MM" /> -->
    <div class="head-maintenance">
      <div></div>
      <div></div>
      <div class="month-year">
        <span v-show="!displayInputCalendar" class="text">
          Maintenance Expense
        </span>
      </div>
    </div>
    <div class="form-container">
      <div class="input-box">
        <label for="maintenanceType">
          Expense Category
        </label>
        <Dropdown
          :options="maintenanceExpenseCategories"
          optionLabel="maintenanceExpenseCategoryName"
          optionValue="maintenanceExpenseCategoryId"
          placeholder="Select a expense category" filter
          class="w-full md:w-14rem" v-model="maintenanceExpense.maintenanceExpenseCategoryId"
          :invalid="submitted && !maintenanceExpense.maintenanceExpenseCategoryId" />
        <small class="p-error" v-if="submitted && !maintenanceExpense.maintenanceExpenseCategoryId">
          Maintenance Type is required.
        </small>
      </div>
      <div class="input-box">
        <label for="maintenanceType">
          Amount
        </label>
        <InputNumber v-model="maintenanceExpense.maintenanceExpenseAmount" mode="currency" currency="USD" :showButtons="true" />
        <small class="p-error" v-if="submitted && !maintenanceExpense.maintenanceExpenseAmount">
          Amount is required.
        </small>
      </div>

      <div class="input-box">
        <label for="maintenanceType">
          Tracking Number
        </label>
        <InputText v-model="maintenanceExpense.maintenanceExpenseTrackingNumber" />
        <small class="p-error" v-if="submitted && !maintenanceExpense.maintenanceExpenseTrackingNumber">
          Tracking Number is required.
        </small>
      </div>
      <div class="input-box">
        <div v-if="maintenanceExpense.maintenanceExpenseTicket" class="p-d-flex p-ai-center p-mb-2 image-pilot">
          <a class="text-decoration-none" :href="maintenanceExpense.maintenanceExpenseTicket" target="_blank">
            <Button class="btn-view-file" severity="primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-bar-graph" viewBox="0 0 16 16">
                <path d="M4.5 12a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5zm3 0a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm3 0a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5z"/>
                <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
              </svg>
                View File
            </Button>
          </a>
        </div>
          <FileUpload v-model="files" name="demo[]"
          :custom-upload="true" :showUploadButton="false" :maxFileSize="6000000" :fileLimit="1" @select="validateFiles">
          <template #content="{ files, removeFileCallback }">
            <div v-for="(file, index) in files" :key="index" class="p-d-flex p-ai-center p-mb-2">
              <img v-if="file && file.type.startsWith('image/')" role="presentation"
                class="p-fileupload-file-thumbnail" :alt="file.name" width="50" :src="getObjectURL(file)" />
              <span v-if="file">{{ file.name }}</span>
              <Button v-if="file" @click="removeFileCallback(index)"
                class="p-ml-auto p-button p-component p-button-text">
                <span class="p-button-icon pi pi-times"></span>
              </Button>
            </div>
          </template>
          <template #empty>
            <p>Drag and drop file to here to upload.</p>
          </template>
        </FileUpload>
      </div>
      <div class="input-box">
        <label for="maintenanceType">
          Internal Folio
        </label>
        <div class="hire-date-box-controller">
          <InputText v-model="maintenanceExpense.maintenanceExpenseInternalFolio" readonly disabled />
          <small class="p-error" v-if="submitted && !maintenanceExpense.maintenanceExpenseInternalFolio">
            Internal Folio is required.
          </small>
        </div>
      </div>
      <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
      </div>
      <!-- <div v-if="maintenanceExpense.maintenanceExpenseTicket" class="p-d-flex p-ai-center p-mb-2 iframe-expense">
          <iframe width="100%" height="500px" :src="maintenanceExpense.maintenanceExpenseTicket" frameborder="0"></iframe>
      </div> -->
    </div>
  </div>
  <div v-else class="loader">
    <ProgressSpinner />
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>

<style lang="scss">
  @import '/resources/styles/variables.scss';
</style>
