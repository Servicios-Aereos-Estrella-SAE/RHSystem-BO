<template>
  <div class="shift-exception-info-form">

    <h1>

      <br /><br />
      {{ $t('add_shift_exception_general') }}

    </h1>

    <div v-if="isReady" class="shift-exception-form">
      <div class="form-container">
        <!--  <div v-if="!shiftException.shiftExceptionId && needPeriodDays" class="input-box">
          <label for="exception-type">
          </label>
          <div class="checkbox-item">
            <Checkbox v-model="applyToMoreThanOneDay" inputId="applyToMoreThanOneDay" name="applyToMoreThanOneDay"
              :binary="true" />
            <label for="applyToMoreThanOneDay" class="ml-2"> {{ $t('apply_to_more_than_one_day') }} </label>
          </div>
        </div> -->
        <!--  <div v-if="applyToMoreThanOneDay && needPeriodDays" class="input-box">
          <label for="description">
            {{ $t('days_to_apply') }}
          </label>
          <InputNumber v-model="shiftException.daysToApply" inputId="daysToApply" />
          <small class="p-error" v-if="submitted && !shiftException.daysToApply">
            {{ $t('days_to_apply') }} {{ $t('is_required') }}.
          </small>
        </div> -->
        <div class="input-box">
          <div class="date-box-container">
            <label>{{ $t('date') }}</label>
            <div v-if="!isNewShiftException" class="date-box">
              <InputText v-model="date" class="capitalize" :disabled="!isNewShiftException" />
            </div>
            <div v-if="!displayDateCalendar && isNewShiftException" class="date-box">
              <InputText :value="getDate(shiftException.shiftExceptionsDate)" readonly class="capitalize" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at" @click="handlerDisplayDate">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayDateCalendar && isNewShiftException" class="date-box-controller">
              <Calendar v-if="displayDateCalendar" dateFormat="yy-mm-dd"
                v-model.lazy="shiftException.shiftExceptionsDate" :placeholder="$t('select_date')"
                :invalid="submitted && !shiftException.shiftExceptionsDate" :minDate="startDateLimit" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="handlerDisplayCloseDate">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <small class="p-error" v-if="submitted && !shiftException.shiftExceptionsDate">{{ $t('date')
              }}
              {{ $t('is_required') }}
            </small>
          </div>
        </div>
        <div v-if="dropdownReady" class="input-box">
          <label for="exception-type">
            {{ $t('exception_type') }}
          </label>
          <Dropdown v-model="shiftException.exceptionTypeId" filter :options="getExceptionTypeList"
            optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId" class="w-full md:w-14rem"
            @update:model-value="handleTypeChange" appendTo="body" />
          <small class="p-error" v-if="submitted && !shiftException.exceptionTypeId">{{ $t('exception_type') }} {{
            $t('is_required') }}.</small>
        </div>
        <div class="input-box">
          <label for="description">
            {{ $t('reason') }}
          </label>
          <Textarea v-model="shiftException.shiftExceptionsDescription" rows="5" cols="30" />
          <small class="p-error" v-if="submitted && needReason && !shiftException.shiftExceptionsDescription">
            {{ $t('reason') }} {{ $t('is_required') }}.
          </small>
        </div>
        <div v-if="needCheckInTime || needPeriodHours" class="input-box">
          <label for="check-in-time">
            {{ needPeriodHours ? capitalizeFirstLetter($t('from')) : $t('check_in_time') }}
          </label>
          <Calendar v-model="shiftException.shiftExceptionCheckInTime" timeOnly />
          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionCheckInTime">
            {{ needPeriodHours ? capitalizeFirstLetter($t('from')) : $t('check_in_time') }} {{ $t('is_required') }}.
          </small>
        </div>
        <div v-if="needCheckOutTime || needPeriodHours" class="input-box">
          <label for="check-out-time">
            {{ needPeriodHours ? capitalizeFirstLetter($t('to')) : $t('check_out_time') }}
          </label>
          <Calendar v-model="shiftException.shiftExceptionCheckOutTime" timeOnly />
          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionCheckOutTime">
            {{ needPeriodHours ? capitalizeFirstLetter($t('to')) : $t('check_out_time') }} {{ $t('is_required') }}.
          </small>
        </div>
        <!--  <div v-if="needEnjoymentOfSalary" class="input-box">
          <label for="enjoyment-of-salary">
            {{ $t('salary_enjoyment') }}
          </label>
          <Dropdown v-model="shiftException.shiftExceptionEnjoymentOfSalary" :options="getOptions" optionLabel="label"
            optionValue="value" :placeholder="$t('select_a_option')" class="w-full md:w-14rem"
            :disabled="!canManageUserResponsible || !canManageToPreviousDays" />
          <small class="p-error" v-if="submitted && shiftException.shiftExceptionEnjoymentOfSalary === null">
            {{ $t('salary_enjoyment') }} {{ $t('is_required') }}.
          </small>
        </div> -->
        <!--  <div v-if="(needTimeByTime) && !isDisabilityLeave" class="input-box">
          <label for="timeByTime">
            {{ $t('time_by_time') }}</label>
          <InputSwitch v-model="activeSwichtTimeByTime"
            :disabled="!canManageUserResponsible || !canManageToPreviousDays" />
        </div> -->
        <!--  <div v-if="canManageUserResponsible && canManageToPreviousDays" class="input-box">
          <label for="evidence-file">
            {{ $t('evidence_files') }}
          </label>
          <FileUpload v-model="files" name="demo[]" url="/api/upload" :custom-upload="true" :maxFileSize="1000000"
            :chooseLabel="$t('click_to_select_files')" :multiple="true" :show-upload-button="false"
            @select="validateFiles" :showCancelButton="false"
            :disabled="!canManageUserResponsible || !canManageToPreviousDays">
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
              <p>{{ $t('drag_and_drop_files_here_or_click_to_select') }}</p>
            </template>
          </FileUpload>
        </div> -->
        <!--  <div v-if="!isNewShiftException">
          <div v-if="shiftExceptionEvidences.length > 0" class="input-box">
            <h3>{{ $t('evidences') }}</h3>
            <DataTable :value="shiftExceptionEvidences" :responsiveLayout="'scroll'" class="p-datatable-sm">
              <Column :header="$t('file')">
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

              <Column v-if="canManageUserResponsible && canManageToPreviousDays" :header="$t('action')"
                style="width: 100px;">
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
            {{ $t('empty_evidence_list') }}
          </div>
        </div> -->
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            {{ $t('save') }}
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