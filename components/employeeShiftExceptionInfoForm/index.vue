<template>
  <div class="shift-exception-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ selectedExceptionDate }}
      <br /><br />
      {{ isNewShiftException ? 'Add shift exception' : 'Update shift exception' }}

    </h1>

    <div v-if="isReady" class="shift-exception-form">
      <div class="form-container">
        <div v-if="!shiftException.shiftExceptionId && needPeriodDays" class="input-box">
          <label for="exception-type">
          </label>
          <div class="checkbox-item">
            <Checkbox v-model="applyToMoreThanOneDay" inputId="applyToMoreThanOneDay" name="applyToMoreThanOneDay"
              :binary="true" />
            <label for="applyToMoreThanOneDay" class="ml-2"> Apply to more than one day </label>
          </div>
        </div>
        <div v-if="applyToMoreThanOneDay && needPeriodDays" class="input-box">
          <label for="description">
            Days to apply
          </label>
          <InputNumber v-model="shiftException.daysToApply" inputId="daysToApply" />
          <small class="p-error" v-if="submitted && !shiftException.daysToApply">
            Days to apply is required.
          </small>
        </div>
        <div class="input-box">
          <label for="exception-type">
            Exception type
          </label>
          <Dropdown v-model="shiftException.exceptionTypeId" :options="exceptionTypeList"
            optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId" placeholder="" filter
            class="w-full md:w-14rem" @update:model-value="handleTypeChange"
            :disabled="!canManageUserResponsible || !canManageToPreviousDays" />
          <small class="p-error" v-if="submitted && !shiftException.exceptionTypeId">Exception type is required.</small>
        </div>
        <div class="input-box">
          <label for="description">
            Reason
          </label>
          <Textarea v-model="shiftException.shiftExceptionsDescription" rows="5" cols="30"
            :disabled="!canManageUserResponsible || !canManageToPreviousDays" />
          <small class="p-error" v-if="submitted && needReason && !shiftException.shiftExceptionsDescription">
            Reason is required.
          </small>
        </div>
        <div v-if="needCheckInTime || needPeriodHours" class="input-box">
          <label for="check-in-time">
            {{ needPeriodHours ? 'From' : 'Check in time' }}
          </label>
          <Calendar v-model="shiftException.shiftExceptionCheckInTime" timeOnly
            :disabled="!canManageUserResponsible || !canManageToPreviousDays" />
          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionCheckInTime">
            {{ needPeriodHours ? 'From' : 'Check in time' }} is required
          </small>
        </div>
        <div v-if="needCheckOutTime || needPeriodHours" class="input-box">
          <label for="check-out-time">
            {{ needPeriodHours ? 'To' : 'Check out time' }}
          </label>
          <Calendar v-model="shiftException.shiftExceptionCheckOutTime" timeOnly
            :disabled="!canManageUserResponsible || !canManageToPreviousDays" />
          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionCheckOutTime">
            {{ needPeriodHours ? 'To' : 'Check out time' }} is required
          </small>
        </div>
        <div v-if="needEnjoymentOfSalary" class="input-box">
          <label for="enjoyment-of-salary">
            Salary enjoyment
          </label>
          <Dropdown v-model="shiftException.shiftExceptionEnjoymentOfSalary" :options="options" optionLabel="label"
            optionValue="value" placeholder="Select a Option" class="w-full md:w-14rem"
            :disabled="!canManageUserResponsible || !canManageToPreviousDays" />
          <small class="p-error" v-if="submitted && shiftException.shiftExceptionEnjoymentOfSalary === null">
            Salary enjoyment is required.
          </small>
        </div>
        <div v-if="(needTimeByTime) && !isDisabilityLeave" class="input-box">
          <label for="timeByTime">
            Time by Time</label>
          <InputSwitch v-model="activeSwichtTimeByTime"
            :disabled="!canManageUserResponsible || !canManageToPreviousDays" />
        </div>
        <div v-if="canManageUserResponsible && canManageToPreviousDays" class="input-box">
          <label for="evidence-file">
            Evidence files
          </label>
          <FileUpload v-model="files" name="demo[]" url="/api/upload" :custom-upload="true" :maxFileSize="1000000"
            chooseLabel="Click to select files" :multiple="true" :show-upload-button="false" @select="validateFiles"
            :showCancelButton="false" :disabled="!canManageUserResponsible || !canManageToPreviousDays">
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
              <p>Drag and drop files here or click to select.</p>
            </template>
          </FileUpload>
        </div>
        <div v-if="!isNewShiftException">
          <div v-if="shiftExceptionEvidences.length > 0" class="input-box">
            <h3>Evidences</h3>
            <DataTable :value="shiftExceptionEvidences" :responsiveLayout="'scroll'" class="p-datatable-sm">
              <Column header="File">
                <template #body="slotProps">
                  <a :href="slotProps.data.shiftExceptionEvidenceFile" target="_blank" rel="noopener"
                    class="p-d-flex p-ai-center gap-2">
                    <img v-if="isImage(slotProps.data.shiftExceptionEvidenceFile)"
                      :src="slotProps.data.shiftExceptionEvidenceFile" alt="Preview" width="40" height="40"
                      style="object-fit: cover; border-radius: 4px;" />
                    <i v-else class="pi pi-file" style="font-size: 1.5rem; color: #6b7280;"></i>
                    {{ getFileName(slotProps.data.shiftExceptionEvidenceFile) }}
                  </a>
                </template>
              </Column>

              <Column v-if="canManageUserResponsible && canManageToPreviousDays" header="Actions" style="width: 100px;">
                <template #body="slotProps">
                  <Button class="p-ml-auto p-button-text p-button-rounded p-button-danger"
                    @click="deleteEvidence(slotProps.data)">
                    <template #default>
                      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                        <path
                          d="M16.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM12 1.5A3.5 3.5 0 0 1 15.5 5h5a1 1 0 1 1 0 2h-.845l-.451 4.587A6.5 6.5 0 0 0 11.81 22H8.312a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5A3.5 3.5 0 0 1 12 1.5Zm1.716 13.089-.07.057-.057.07a.5.5 0 0 0 0 .568l.057.07 2.147 2.146-2.147 2.146-.057.07a.5.5 0 0 0 0 .568l.057.07.07.057a.5.5 0 0 0 .568 0l.07-.057 2.146-2.147 2.146 2.147.07.057a.5.5 0 0 0 .568 0l.07-.057.057-.07a.5.5 0 0 0 0-.568l-.057-.07-2.147-2.146 2.147-2.146.057-.07a.5.5 0 0 0 0-.568l-.057-.07-.07-.057a.5.5 0 0 0-.568 0l-.07.057-2.146 2.147-2.146-2.147-.07-.057a.5.5 0 0 0-.492-.044l-.076.044ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
                          fill="#cd360c" />
                      </svg>
                    </template>
                  </Button>
                </template>
              </Column>
            </DataTable>
          </div>
          <div v-else class="empty">
            Empty evidence list.
          </div>
        </div>
        <div class="box-tools-footer">
          <Button v-if="canManageUserResponsible && canManageToPreviousDays" class="btn btn-block btn-primary"
            @click="onSave">
            Save exception
          </Button>
        </div>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
    </div>
    <transition name="page">
      <confirmDelete v-if="drawerShiftExceptionEvidenceDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerShiftExceptionEvidenceDelete = false" />
    </transition>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
</style>