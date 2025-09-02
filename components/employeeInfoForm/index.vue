<template>
  <div class="user-info-form">
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="inputs-group group-2">
          <div class="input-box">
            <label for="personGender">{{ $t('work_business_unit') }}</label>
            <Dropdown v-model="employee.businessUnitId" :options="businessUnits" optionLabel="businessUnitName"
              optionValue="businessUnitId" :placeholder="`${$t('select')} ${$t('work_business_unit')}`"
              class="w-full md:w-14rem" :disabled="isDeleted || !canManageUserResponsible"
              :emptyMessage="$t('no_available_options')" :emptyFilterMessage="$t('no_results_found')" />
          </div>
          <div class="input-box">
            <label for="personGender">{{ $t('payroll_business_unit') }}</label>
            <Dropdown v-model="employee.payrollBusinessUnitId" :options="businessUnits" optionLabel="businessUnitName"
              optionValue="businessUnitId" :placeholder="`${$t('select')} ${$t('payroll_business_unit')}`"
              class="w-full md:w-14rem" :disabled="isDeleted || !canManageUserResponsible"
              :invalid="submitted && !employee.payrollBusinessUnitId" :emptyMessage="$t('no_available_options')"
              :emptyFilterMessage="$t('no_results_found')" />
            <small class="p-error" v-if="submitted && !employee.payrollBusinessUnitId">{{ $t('payroll_business_unit') }}
              {{ $t('is_required') }}</small>
          </div>
          <div class="input-box">
            <label for="employeeCode">{{ $t('employee_code') }}</label>
            <InputText v-model="employee.employeeCode" :placeholder="`${$t('enter')} ${$t('employee_code')}`"
              :disabled="isDeleted || !canManageUserResponsible" />
            <small class="p-error" v-if="submitted && !employee.employeeCode">{{ $t('employee_code') }} {{
              $t('is_required')
              }}</small>
          </div>
          <div v-if="displayEmployeeTypeFilter" class="input-box" v-show="!pilot && !flightAttendant">
            <label for="employee-type">
              {{ $t('employee_type') }}
            </label>
            <Dropdown v-model="employee.employeeTypeId" optionLabel="employeeTypeName" optionValue="employeeTypeId"
              :placeholder="`${$t('select')} ${$t('employee_type')}`" filter class="w-full md:w-14rem"
              :invalid="submitted && !employee.employeeTypeId" :disabled="isDeleted || !canManageUserResponsible"
              :options="employeeTypes" :emptyMessage="$t('no_available_options')"
              :emptyFilterMessage="$t('no_results_found')" />
            <small class="p-error" v-if="submitted && !employee.employeeTypeId">{{ $t('employee_type') }} {{
              $t('is_required')
              }}</small>
          </div>
          <div class="input-box">
            <label for="typeOfContract">{{ $t('contract_type') }}</label>
            <Dropdown v-model="employee.employeeTypeOfContract" :options="getTypesOfContract" optionLabel="label"
              optionValue="value" :placeholder="`${$t('select')} ${$t('contract_type')}`" class="w-full md:w-14rem"
              :disabled="isDeleted || !canManageUserResponsible" :emptyMessage="$t('no_available_options')"
              :emptyFilterMessage="$t('no_results_found')" />
          </div>
        </div>

        <div class="inputs-group">
          <div class="group-2">
            <div class="input-box">
              <label for="employeeFirstName">{{ $t('first_name') }}</label>
              <InputText v-model="employee.employeeFirstName" :placeholder="`${$t('enter')} ${$t('first_name')}`"
                :disabled="isDeleted || !canManageUserResponsible" />
              <small class="p-error" v-if="submitted && !employee.employeeFirstName">{{ $t('first_name') }} {{
                $t('is_required')
                }}</small>
            </div>
            <div class="input-box">
              <label for="employeeLastName">{{ $t('last_name') }}</label>
              <InputText v-model="employee.employeeLastName" :placeholder="`${$t('enter')} ${$t('last_name')}`"
                :disabled="isDeleted || !canManageUserResponsible" />
              <small class="p-error" v-if="submitted && !employee.employeeLastName">{{ $t('last_name') }} {{
                $t('is_required')
                }}</small>
            </div>
            <div class="input-box">
              <label for="employeeSecondLastName">{{ $t('second_last_name') }}</label>
              <InputText v-model="employee.employeeSecondLastName"
                :placeholder="`${$t('enter')} ${$t('second_last_name')}`"
                :disabled="isDeleted || !canManageUserResponsible" />
              <small class="p-error" v-if="submitted && !employee.employeeSecondLastName">{{ $t('second_last_name') }}
                {{ $t('is_required') }} </small>
            </div>
          </div>
          <div class="input-box">
            <label for="useremail">
              {{ $t('business_email') }}
            </label>
            <InputText id="useremail" v-model="employee.employeeBusinessEmail" type="email"
              :invalid="submitted && isEmailInvalid" :placeholder="`${$t('enter')} ${$t('business_email')}`"
              :disabled="isDeleted || !canManageUserResponsible" />
            <small class="p-error" v-if="submitted && isEmailInvalid">{{ $t('is_not_valid') }}</small>
          </div>
        </div>

        <div class="inputs-group">
          <div class="group-2">
            <div class="input-box">
              <label for="role">
                {{ $t('department') }}
              </label>
              <Dropdown v-model="employee.departmentId" :options="departments" optionLabel="departmentName"
                optionValue="departmentId" :placeholder="`${$t('select')} ${$t('department')}`" filter
                class="w-full md:w-14rem" :invalid="submitted && !employee.departmentId"
                :disabled="isDeleted || !canManageUserResponsible" :emptyMessage="$t('no_available_options')"
                :emptyFilterMessage="$t('no_results_found')" />
              <small class="p-error" v-if="submitted && !employee.departmentId">Department {{ $t('is_required')
                }}</small>
            </div>
            <div class="input-box">
              <label for="positionId">{{ $t('position') }}</label>
              <Dropdown v-model="employee.positionId" :options="positions" optionLabel="positionName"
                optionValue="positionId" :placeholder="`${$t('select')} ${$t('position')}`" filter
                class="w-full md:w-14rem" :invalid="submitted && !employee.positionId"
                :disabled="isDeleted || !canManageUserResponsible" :emptyMessage="$t('no_available_options')"
                :emptyFilterMessage="$t('no_results_found')" />
              <small class="p-error" v-if="submitted && !employee.positionId">Position {{ $t('is_required') }}</small>
            </div>
          </div>
          <div class="input-box">
            <div class="hire-date-box-container">
              <label for="employeeHireDate">{{ $t('hire_date') }}</label>
              <div v-if="!displayHireDateCalendar" class="hire-date-box">
                <InputText v-model="employeeHireDate" readonly class="capitalize"
                  :disabled="isDeleted || !canManageUserResponsible" />
                <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="handlerDisplayHireDate"
                  :disabled="isDeleted || !canManageUserResponsible">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </Button>
              </div>
              <div v-if="displayHireDateCalendar" class="hire-date-box-controller">
                <Calendar v-if="displayHireDateCalendar" v-model.lazy="employee.employeeHireDate"
                  :placeholder="`${$t('select')} ${$t('hire_date')}`"
                  :disabled="isDeleted || !canManageUserResponsible" />
                <Button type="button" class="btn btn-block" id="display-input-hiredate"
                  @click="displayHireDateCalendar = false">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <div class="input-box">
            <label for="daily-salary">
              ($) {{ $t('daily_salary') }}
            </label>
            <InputText id="daily-salary" v-model="employee.dailySalary" type="number"
              :disabled="isDeleted || !canManageUserResponsible" />
          </div>
        </div>

        <div class="inputs-group group-emp-fiscal">
          <div class="group-3">
            <div class="input-box">
              <label for="employeeCURP">CURP</label>
              <InputText v-model="employee.person.personCurp" :placeholder="`${$t('enter')} CURP`"
                :disabled="isDeleted || !canManageUserResponsible" />
              <small class="p-error" v-if="submitted && employee.person.personCurp && !isValidCURP">{{
                $t('personal_identification_is_not_valid') }}</small>
            </div>
            <div class="input-box">
              <label for="employeeRFC">RFC</label>
              <InputText v-model="employee.person.personRfc" :placeholder="`${$t('enter')} RFC`"
                :disabled="isDeleted || !canManageUserResponsible" />
              <small class="p-error" v-if="submitted && employee.person.personRfc && !isValidRFC">RFC {{
                $t('is_not_valid') }}</small>
            </div>
            <div class="input-box">
              <label for="employeeNSS">NSS</label>
              <InputText v-model="employee.person.personImssNss" :placeholder="`${$t('enter')} NSS`"
                :disabled="isDeleted || !canManageUserResponsible" />
            </div>
          </div>
        </div>

        <div class="inputs-group group-2">
          <div class="input-box">
            <label for="employeeLastName">
              {{ $t('work_modality') }}
            </label>
            <Dropdown v-model="activeSwicht" :options="getWorkModalityOptions" optionLabel="label" optionValue="value"
              :placeholder="`${$t('select')} ${$t('work_modality')}`" class="w-full md:w-14rem"
              :disabled="isDeleted || !canManageUserResponsible" :emptyMessage="$t('no_available_options')"
              :emptyFilterMessage="$t('no_results_found')" />
          </div>
          <div class="input-box">
            <label for="employeeLastName">
              {{ $t('discriminate_assistance') }}
            </label>
            <Dropdown v-model="employee.employeeAssistDiscriminator" :options="getAssistDiscriminatorOptions"
              optionLabel="label" optionValue="value" :placeholder="`${$t('select')} ${$t('discriminate_assistance')}`"
              class="w-full md:w-14rem" :disabled="isDeleted || !canManageUserResponsible"
              :emptyMessage="$t('no_available_options')" :emptyFilterMessage="$t('no_results_found')" />
          </div>
          <div class="input-box">
            <label for="ignoreConsecutiveAbsences">
              {{ $t('ignore_consecutive_absences') }}
            </label>
            <Dropdown v-model="employee.employeeIgnoreConsecutiveAbsences" :options="getIgnoreConsecutiveAbsenceOptions"
              optionLabel="label" optionValue="value"
              :placeholder="`${$t('select')} ${$t('ignore_consecutive_absences')}`" class="w-full md:w-14rem"
              :disabled="isDeleted || !canManageUserResponsible" :emptyMessage="$t('no_available_options')"
              :emptyFilterMessage="$t('no_results_found')" />
          </div>
        </div>

        <div v-if="employee.deletedAt" class="input-box">
          <div class="terminated-date-box-container">
            <label for="employeeTerminatedDate">{{ $t('terminated_date') }}</label>
            <div v-if="!displayTerminatedDateCalendar" class="terminated-date-box">
              <InputText v-model="employeeTerminatedDate" readonly class="capitalize"
                :disabled="isDeleted || !canManageUserResponsible" />
              <Button type="button" class="btn btn-block" id="display-input-terminateddate"
                @click="handlerDisplayTerminatedDate">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayTerminatedDateCalendar" class="terminated-date-box-controller">
              <Calendar v-if="displayTerminatedDateCalendar" v-model.lazy="employee.employeeTerminatedDate"
                :placeholder="`${$t('select')} ${$t('terminated_date')}`" dateFormat="yy-mm-dd" dataType="string" />
              <Button type="button" class="btn btn-block" id="display-input-terminateddate"
                @click="displayTerminatedDateCalendar = false">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <div class="input-box" v-if="pilot || flightAttendant">
          <div v-if="hasPhotoEmployee()" class="p-d-flex p-ai-center p-mb-2 image-pilot">
            <img role="presentation" class="p-fileupload-file-thumbnail" width="50" :src="getUrlPhoto()" />
          </div>
          <FileUpload v-model="files" name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"
            :custom-upload="true" :showUploadButton="false" :maxFileSize="6000000" :fileLimit="1"
            @select="validateFiles">
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
              <p>{{ $t('drag_and_drop_files_here_or_click_to_select') }}</p>
            </template>
          </FileUpload>
        </div>

        <div class="box-tools-footer">
          <button v-if="employee.deletedAt && canManageUserResponsible" type="button" class="btn btn-block"
            @click="onReactivate">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.45 2.15C14.992 4.057 17.587 5 20.25 5a.75.75 0 0 1 .75.75V11c0 5.001-2.958 8.676-8.725 10.948a.75.75 0 0 1-.55 0C5.958 19.676 3 16 3 11V5.75A.75.75 0 0 1 3.75 5c2.663 0 5.258-.943 7.8-2.85a.75.75 0 0 1 .9 0ZM12 16a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0-9.018a.75.75 0 0 0-.743.648l-.007.102v6.5l.007.102a.75.75 0 0 0 1.486 0l.007-.102v-6.5l-.007-.102A.75.75 0 0 0 12 6.982Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
            {{ $t('reactivate_employee') }}
          </button>
          <button v-if="canManageUserResponsible" type="button" class="btn btn-primary btn-block" @click="onSave">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                fill="#ffffff" class="fill-212121"></path>
            </svg>
            {{ $t('save') }}
          </button>
        </div>
        <transition name="page">
          <confirmReactivate v-if="drawerEmployeeReactivate" @confirmReactivate="confirmReactivate"
            @cancelReactivate="onCancelEmployeeReactivate" />
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

<style lang="scss" scoped>
  @import './style';
</style>