<template>
  <div class="employee-contract-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewEmployeeContract ? 'Add employee contract' : 'Update employee contract' }}
    </h1>

    <div v-if="isReady" class="employee-contract-form">
      <div class="form-container">
        <div class="input-box">

          <FileUpload ref="fileUpload" v-model="files" name="demo[]" url="/api/upload" accept="image/*,.doc,.docx"
            chooseLabel="Click to select file" :showUploadButton="false" :showCancelButton="false" :custom-upload="true"
            :fileLimit="1" @select="validateFiles" @upload="onAdvancedUpload($event)">
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
          <button v-if="employeeContract.employeeContractFile" type="button" class="btn btn-block" @click="openFile">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
            Open attached file
          </button>
        </div>
        <div v-if="!isNewEmployeeContract" class="input-box">
          <label for="uuid">
            Uuid
          </label>
          <InputText v-model="employeeContract.employeeContractUuid" disabled />
        </div>
        <div class="input-box">
          <label for="folio">
            Folio
          </label>
          <InputText v-model="employeeContract.employeeContractFolio"
            :invalid="submitted && !employeeContract.employeeContractFolio" />
          <small class="p-error" v-if="submitted && !employeeContract.employeeContractFolio">Folio
            is required.
          </small>
        </div>
        <div class="input-box">
          <label for="work-disability-type">
            Employee contract type
          </label>
          <Dropdown v-model="employeeContract.employeeContractTypeId" :options="employeeContractTypeList"
            optionLabel="employeeContractTypeName" optionValue="employeeContractTypeId" placeholder="" filter
            class="w-full md:w-14rem" @change="verifyContractPermanent"
            :invalid="submitted && !employeeContract.employeeContractTypeId" />
          <small class="p-error" v-if="submitted && !employeeContract.employeeContractTypeId">Employee contract type is
            required.</small>
        </div>
        <div class="input-box">
          <div class="date-box-container">
            <label>Start date</label>
            <div v-if="!displayStartDateCalendar" class="date-box">
              <InputText :value="getDate(employeeContract.employeeContractStartDate)" readonly class="capitalize" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="handlerDisplayStartDate">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayStartDateCalendar" class="date-box-controller">
              <Calendar v-if="displayStartDateCalendar" dateFormat="yy-mm-dd"
                v-model.lazy="employeeContract.employeeContractStartDate" placeholder="Select start date"
                :maxDate="maxDate" :invalid="submitted && !employeeContract.employeeContractStartDate" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="displayStartDateCalendar = false">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <small class="p-error" v-if="submitted && !employeeContract.employeeContractStartDate">Date start
              is required.
            </small>
          </div>
        </div>
        <div class="input-box">
          <div class="date-box-container">
            <label>End date</label>
            <div v-if="!displayEndDateCalendar" class="date-box">
              <InputText :value="getDate(employeeContract.employeeContractEndDate)" readonly class="capitalize" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="handlerDisplayEndDate">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayEndDateCalendar" class="date-box-controller">
              <Calendar v-if="displayEndDateCalendar" dateFormat="yy-mm-dd"
                v-model.lazy="employeeContract.employeeContractEndDate" placeholder="Select end date"
                :invalid="submitted && !isContractPermanent && !employeeContract.employeeContractEndDate" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="displayEndDateCalendar = false">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <small class="p-error"
              v-if="submitted && !isContractPermanent && !employeeContract.employeeContractEndDate">Date end
              is required.
            </small>
          </div>
        </div>
        <div class="input-box">
          <label for="status">
            Status
          </label>
          <Dropdown v-model="employeeContract.employeeContractStatus" :options="employeeContractStatusOptions"
            optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full md:w-14rem"
            :invalid="submitted && !employeeContract.employeeContractStatus" />
          <small class="p-error" v-if="submitted && !employeeContract.employeeContractStatus">Status is
            required.</small>
        </div>
        <div class="input-box">
          <label for="monthlNetSalary">Monthly net salary</label>
          <InputNumber v-model="employeeContract.employeeContractMonthlyNetSalary" fluid mode="currency" currency="MXN"
            locale="es-MX" :invalid="submitted && !employeeContract.employeeContractMonthlyNetSalary" />
          <small class="p-error" v-if="submitted && !employeeContract.employeeContractMonthlyNetSalary">Monthly net
            salary is
            required.</small>
        </div>
        <div class="input-box">
          <label for="role">
            Department
          </label>
          <Dropdown v-model="employeeContract.departmentId" :options="departments" optionLabel="departmentName"
            optionValue="departmentId" placeholder="Select a Department" filter class="w-full md:w-14rem"
            :invalid="submitted && !employeeContract.departmentId" />
          <small class="p-error" v-if="submitted && !employeeContract.departmentId">Department is required.</small>
        </div>
        <div class="input-box">
          <label for="positionId">Position</label>
          <Dropdown v-model="employeeContract.positionId" :options="positions" optionLabel="positionName"
            optionValue="positionId" placeholder="Select a Position" filter class="w-full md:w-14rem"
            :invalid="submitted && !employeeContract.positionId" />
          <small class="p-error" v-if="submitted && !employeeContract.positionId">Position is required.</small>
        </div>
        <div class="input-box">
          <label for="personGender">Payroll Business Unit</label>
          <Dropdown v-model="employeeContract.payrollBusinessUnitId" :options="businessUnits"
            optionLabel="businessUnitName" optionValue="businessUnitId" placeholder="Select a Payroll Business Unit"
            class="w-full md:w-14rem" :disabled="isDeleted"
            :invalid="submitted && !employeeContract.payrollBusinessUnitId" />
          <small class="p-error" v-if="submitted && !employeeContract.payrollBusinessUnitId">Payroll business unit is
            required.</small>
        </div>
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save employee contract
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
