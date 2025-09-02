<template>
  <div class="work-disability-info-form">
    <employeeModalInfoCard :employee="employee" />
    <workDisabilityPeriodInfoCard :isDeleted="true" :work-disability-period="workDisabilityPeriod"
      :click-on-edit="() => { }" :click-on-delete="() => { }" :canReadOnlyWorkDisabilities="false"
      :canManageWorkDisabilities="false" :onlySeeInfo="true" :employee="employee"
      :canManageUserResponsible="canManageUserResponsible" :startDateLimit="startDateLimit" />
    <h1>
      {{ isNewWorkDisabilityPeriodExpense ?
      $t('add_work_disability_period_expense')
      : $t('update_work_disability_period_expense') }}
    </h1>

    <div v-if="isReady" class="work-disability-period-expense-form">
      <div class="form-container">
        <div class="input-box">
          <label for="work-disability-period-expense-file">
            {{ $t('expense_document') }}
          </label>

          <FileUpload v-if="canManageWorkDisabilities && canManageCurrentPeriod" ref="fileUpload" v-model="files"
            name="demo[]" url="/api/upload" accept="image/*,application/pdf" :chooseLabel="$t('click_to_select_files')"
            :showUploadButton="false" :showCancelButton="false" :custom-upload="true" :fileLimit="1"
            @select="validateFiles" @upload="onAdvancedUpload($event)" :disabled="!canManageUserResponsible">
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
                {{ $t('drag_and_drop_files_here_or_click_to_select') }}
              </div>
            </template>
          </FileUpload>
          <small class="p-error"
            v-if="submitted && !workDisabilityPeriodExpense.workDisabilityPeriodExpenseId && files.length === 0">{{
            $t('file') }} {{ $t('is_required') }}
          </small>
        </div>
        <div class="input-box">
          <button v-if="workDisabilityPeriodExpense.workDisabilityPeriodExpenseFile" type="button" class="btn btn-block"
            @click="openFile">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
            {{ $t('open_attached_file') }}
          </button>
        </div>
        <div class="input-box">
          <label for="folio">
            {{ $t('amount') }}
          </label>
          <InputNumber v-model="workDisabilityPeriodExpense.workDisabilityPeriodExpenseAmount"
            :disabled="!canManageWorkDisabilities || !canManageCurrentPeriod || !canManageUserResponsible"
            mode="currency" currency="MXN" fluid />
          <small class="p-error" v-if="submitted && !workDisabilityPeriodExpense.workDisabilityPeriodExpenseAmount">{{
            $t('amount') }} {{ $t('is_required') }}
          </small>
        </div>
        <div class="box-tools-footer">
          <Button v-if="canManageWorkDisabilities && canManageCurrentPeriod && canManageUserResponsible"
            class="btn btn-block btn-primary" @click="onSave">
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