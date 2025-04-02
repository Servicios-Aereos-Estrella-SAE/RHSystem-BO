<template>
  <div class="work-disability-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewWorkDisabilityPeriod ? 'Add work disability period' : 'Update work disability period' }}
    </h1>

    <div v-if="isReady" class="work-disability-period-form">
      <div class="form-container">
        <div class="input-box">
          <label for="work-disability-period-file">
            Work disability document
          </label>

          <FileUpload v-if="canManageWorkDisabilities && canManageCurrentPeriod" ref="fileUpload" v-model="files"
            name="demo[]" url="/api/upload" accept="image/*,application/pdf" chooseLabel="Click to select file"
            :showUploadButton="false" :showCancelButton="false" :custom-upload="true" :fileLimit="1"
            @select="validateFiles" @upload="onAdvancedUpload($event)">
            <template #content="{ files, removeFileCallback }">
              <div v-for="(file, index) in files" :key="index" class="p-d-flex p-ai-center p-mb-2">
                <div class="p-fileupload-file-thumbnail-wrapper">
                  <img v-if="file && file.type.startsWith('image/')" role="presentation"
                    class="p-fileupload-file-thumbnail" :alt="file.name" width="50" :src="getObjectURL(file)" />
                  <div v-else class="p-fileupload-file-thumbnail icon">
                    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M33 12v23c0 4.42-3.58 8-8 8s-8-3.58-8-8V10c0-2.76 2.24-5 5-5s5 2.24 5 5v21a2 2 0 1 1-4 0V12h-3v19c0 2.76 2.24 5 5 5s5-2.24 5-5V10c0-4.42-3.58-8-8-8s-8 3.58-8 8v25c0 6.08 4.93 11 11 11s11-4.92 11-11V12h-3z"
                        fill="#88a4bf" class="fill-000000"></path>
                      <path d="M0 0h48v48H0z" fill="none"></path>
                    </svg>
                  </div>
                  <span v-if="file">{{ file.name }}</span>
                  <Button v-if="file" @click="removeFileCallback(index)"
                    class="p-ml-auto p-button p-component p-button-text p-fileupload-file-close-thumbnail">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM12 1.5A3.5 3.5 0 0 1 15.5 5h5a1 1 0 1 1 0 2h-.845l-.451 4.587A6.5 6.5 0 0 0 11.81 22H8.312a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5A3.5 3.5 0 0 1 12 1.5Zm1.716 13.089-.07.057-.057.07a.5.5 0 0 0 0 .568l.057.07 2.147 2.146-2.147 2.146-.057.07a.5.5 0 0 0 0 .568l.057.07.07.057a.5.5 0 0 0 .568 0l.07-.057 2.146-2.147 2.146 2.147.07.057a.5.5 0 0 0 .568 0l.07-.057.057-.07a.5.5 0 0 0 0-.568l-.057-.07-2.147-2.146 2.147-2.146.057-.07a.5.5 0 0 0 0-.568l-.057-.07-.07-.057a.5.5 0 0 0-.568 0l-.07.057-2.146 2.147-2.146-2.147-.07-.057a.5.5 0 0 0-.492-.044l-.076.044ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
                        fill="#cd360c" class="fill-212121"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </template>
            <template #empty>
              <div class="empty-file-uploader">
                Drag and drop file to here to upload.
              </div>
            </template>
          </FileUpload>
        </div>
        <div class="input-box">
          <button v-if="workDisabilityPeriod.workDisabilityPeriodFile" type="button" class="btn btn-block"
            @click="openFile">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
            Open attached file
          </button>
        </div>
        <div class="input-box">
          <label for="folio">
            Document folio
          </label>
          <InputText v-model="workDisabilityPeriod.workDisabilityPeriodTicketFolio"
            :disabled="!canManageWorkDisabilities || !canManageCurrentPeriod" />
          <small class="p-error"
            v-if="submitted && !isInternalDisability && !workDisabilityPeriod.workDisabilityPeriodTicketFolio">Ticket
            folio
            is required.
          </small>
          <small class="p-error"
            v-if="submitted && workDisabilityPeriod.workDisabilityPeriodTicketFolio && !isValidTicketFolio">Required
            folio with the format of 2 uppercase letters and 6 numbers.
          </small>
        </div>
        <div class="input-box">
          <label for="work-disability-type">
            Work disability type
          </label>
          <Dropdown v-model="workDisabilityPeriod.workDisabilityTypeId" :options="workDisabilityTypeList"
            optionLabel="workDisabilityTypeName" optionValue="workDisabilityTypeId" placeholder="" filter
            class="w-full md:w-14rem" :disabled="!canManageWorkDisabilities || !canManageCurrentPeriod" />
          <small class="p-error" v-if="submitted && !workDisabilityPeriod.workDisabilityTypeId">Work disability type is
            required.</small>
        </div>
        <div class="input-box">
          <label for="requested-date">
            Date start
          </label>
          <Calendar v-if="isNewWorkDisabilityPeriod" v-model="workDisabilityPeriod.workDisabilityPeriodStartDate"
            dateFormat="yy-mm-dd" placeholder="Select date range" class="w-full md:w-14rem"
            :disabled="!isNewWorkDisabilityPeriod || !canManageCurrentPeriod" />
          <div v-else class="period-applied">
            <div class="period-applied-date">
              <div class="icon">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 8.5v9.25A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18ZM7.25 15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM12 15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-4.75-4.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4.75 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4.75 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm1-7.5A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </div>
              {{ getDate(workDisabilityPeriod.workDisabilityPeriodStartDate) }}
            </div>
            <div class="period-applied-date">
              <div class="icon">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 8.5v9.25A3.25 3.25 0 0 0 6.25 21h11.5A3.25 3.25 0 0 0 21 17.75V8.5H3ZM16.75 15a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 15a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm4.75-4.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm-4.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm-4.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm-1-7.5A3.25 3.25 0 0 0 3 6.25V7h18v-.75A3.25 3.25 0 0 0 17.75 3H6.25Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </div>
              {{ getDate(workDisabilityPeriod.workDisabilityPeriodEndDate) }}
            </div>
          </div>
          <small class="p-error"
            v-if="submitted && (!workDisabilityPeriod.workDisabilityPeriodStartDate || !workDisabilityPeriod.workDisabilityPeriodEndDate)">
            Date is required.
          </small>
        </div>
        <div v-if="isNewWorkDisabilityPeriod" class="input-box">
          <label for="description">
            Days to apply
          </label>
          <InputNumber v-model="daysToApply" inputId="daysToApply" />
          <small class="p-error" v-if="submitted && !daysToApply">
            Days to apply is required.
          </small>
        </div>
        <div class="box-tools-footer">
          <Button v-if="!isNewWorkDisabilityPeriod && canManageWorkDisabilities" class="btn btn-block"
            @click="addNewExpense">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 6.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0ZM7 7l.001 2.504a.5.5 0 0 1-1 0V7H3.496a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 1 0V6h2.503a.5.5 0 0 1 0 1H7.001Z"
                fill="#88a4bf" class="fill-212121"></path>
              <path
                d="M6.5 13a6.5 6.5 0 0 0 5.478-10h5.772A3.25 3.25 0 0 1 21 6.25V13h-4.75A3.25 3.25 0 0 0 13 16.25V21H6.25A3.25 3.25 0 0 1 3 17.75v-5.772A6.47 6.47 0 0 0 6.5 13Z"
                fill="#88a4bf" class="fill-212121"></path>
              <path d="m20.56 14.5-6.06 6.06v-4.31c0-.966.784-1.75 1.75-1.75h4.31Z" fill="#88a4bf" class="fill-212121">
              </path>
            </svg>
            Add expense
          </Button>
          <Button v-if="canManageWorkDisabilities && canManageCurrentPeriod" class="btn btn-block btn-primary"
            @click="onSave">
            Save work disability period
          </Button>
        </div>

        <div v-if="workDisabilityPeriodExpensesList.length > 0">
          <h2>
            Expenses
          </h2>
          <div class="work-disability-period-expenses-wrapper">
            <workDisabilityPeriodExpenseInfoCard
              v-for="(workDisabilityPeriodExpense, index) in workDisabilityPeriodExpensesList"
              :key="`work-disability-period-expense-${index}`" :isDeleted="isDeleted"
              :work-disability-period-expense="workDisabilityPeriodExpense"
              :click-on-edit="() => { onEditExpense(workDisabilityPeriodExpense) }"
              :click-on-delete="() => { onDeleteExpense(workDisabilityPeriodExpense) }"
              :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
              :canManageWorkDisabilities="canManageWorkDisabilities" />
          </div>
        </div>
        <div v-else class="work-disability-period-expenses-wrapper">
          <div class="empty-data">
            No expenses recorded yet
          </div>
        </div>
        <Sidebar v-model:visible="drawerWorkDisabilityPeriodExpenseForm" header="form" position="right"
          class="work-disability-period-form-sidebar" :showCloseIcon="true">
          <employeeWorkDisabilityPeriodExpenseInfoForm :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
            :canManageWorkDisabilities="canManageWorkDisabilities"
            :workDisabilityPeriodExpense="workDisabilityPeriodExpense" :workDisabilityPeriod="workDisabilityPeriod"
            :employee="employee" @onWorkDisabilityPeriodExpenseSave="onSaveExpense" />
        </Sidebar>
        <transition name="page">
          <confirmDelete v-if="drawerWorkDisabilityPeriodExpenseDelete" @confirmDelete="confirmDeleteExpense"
            @cancelDelete="drawerWorkDisabilityPeriodExpenseDelete = false" />
        </transition>
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