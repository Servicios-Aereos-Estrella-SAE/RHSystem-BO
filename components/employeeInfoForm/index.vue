<template>
  <div class="user-info-form">
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="inputs-group group-2">
          <div class="input-box">
            <label for="personGender">Work Business Unit</label>
            <Dropdown v-model="employee.businessUnitId" :options="businessUnits" optionLabel="businessUnitName"
              optionValue="businessUnitId" placeholder="Select" class="w-full md:w-14rem" :disabled="isDeleted" />
          </div>
          <div class="input-box">
            <label for="employeeCode">Employee Code</label>
            <InputText v-model="employee.employeeCode" placeholder="Enter Employee Code" :disabled="isDeleted" />
            <small class="p-error" v-if="submitted && !employee.employeeCode">Employee Code is required.</small>
          </div>
          <div v-if="displayEmployeeTypeFilter" class="input-box" v-show="!pilot && !flightAttendant">
            <label for="employee-type">
              Employee type
            </label>
            <Dropdown
              v-model="employee.employeeTypeId"
              optionLabel="employeeTypeName"
              optionValue="employeeTypeId"
              placeholder="Select a Employee Type"
              filter
              class="w-full md:w-14rem"
              :invalid="submitted && !employee.employeeTypeId" :disabled="isDeleted"
              :options="employeeTypes" />
            <small class="p-error" v-if="submitted && !employee.employeeTypeId">Employee type is required.</small>
          </div>
          <div class="input-box">
            <label for="typeOfContract">Contract Type</label>
            <Dropdown v-model="employee.employeeTypeOfContract" :options="typesOfContract" optionLabel="label"
              optionValue="value" placeholder="Select Type of Contract" class="w-full md:w-14rem"
              :disabled="isDeleted" />
          </div>
        </div>

        <div class="inputs-group">
          <div class="group-2">
            <div class="input-box">
              <label for="employeeFirstName">First Name</label>
              <InputText v-model="employee.employeeFirstName" placeholder="Enter First Name" :disabled="isDeleted" />
              <small class="p-error" v-if="submitted && !employee.employeeFirstName">First Name is required.</small>
            </div>
            <div class="input-box">
              <label for="employeeLastName">Last Name</label>
              <InputText v-model="employee.employeeLastName" placeholder="Enter Last Name" :disabled="isDeleted" />
              <small class="p-error" v-if="submitted && !employee.employeeLastName">Last Name is required.</small>
            </div>
          </div>
          <div class="input-box">
            <label for="useremail">
              Business Email
            </label>
            <InputText id="useremail" v-model="employee.employeeBusinessEmail" type="email"
              :invalid="submitted && isEmailInvalid" :disabled="isDeleted" />
            <small class="p-error" v-if="submitted && isEmailInvalid">Email is not
              valid.</small>
          </div>
        </div>

        <div class="inputs-group">
          <div class="group-2">
            <div class="input-box">
              <label for="role">
                Department
              </label>
              <Dropdown v-model="employee.departmentId" :options="departments" optionLabel="departmentName"
                optionValue="departmentId" placeholder="Select a Department" filter class="w-full md:w-14rem"
                :invalid="submitted && !employee.departmentId" :disabled="isDeleted" />
              <small class="p-error" v-if="submitted && !employee.departmentId">Department is required.</small>
            </div>
            <div class="input-box">
              <label for="positionId">Position</label>
              <Dropdown v-model="employee.positionId" :options="positions" optionLabel="positionName"
                optionValue="positionId" placeholder="Select a Position" filter class="w-full md:w-14rem"
                :invalid="submitted && !employee.positionId" :disabled="isDeleted" />
              <small class="p-error" v-if="submitted && !employee.positionId">Position is required.</small>
            </div>
          </div>
          <div class="input-box">
            <div class="hire-date-box-container">
              <label for="employeeHireDate">Hire Date</label>
              <div v-if="!displayHireDateCalendar" class="hire-date-box">
                <InputText v-model="employeeHireDate" readonly class="capitalize" :disabled="isDeleted" />
                <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="handlerDisplayHireDate"
                  :disabled="isDeleted">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </Button>
              </div>
              <div v-if="displayHireDateCalendar" class="hire-date-box-controller">
                <Calendar v-if="displayHireDateCalendar" v-model.lazy="employee.employeeHireDate"
                  placeholder="Select Hire Date" :disabled="isDeleted" />
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
        </div>

        <div class="inputs-group group-emp-fiscal">
          <div class="group-3">
            <div class="input-box">
              <label for="employeeLastName">CURP</label>
              <InputText v-model="employee.person.personCurp" placeholder="Enter employee CURP" :disabled="isDeleted" />
              <small class="p-error" v-if="submitted && employee.person.personCurp && !isValidCURP">Personal
                identification is not valid.</small>
            </div>
            <div class="input-box">
              <label for="employeeLastName">RFC</label>
              <InputText v-model="employee.person.personRfc" placeholder="Enter employee RFC" :disabled="isDeleted" />
              <small class="p-error" v-if="submitted && employee.person.personRfc && !isValidRFC">RFC is not
                valid.</small>
            </div>
            <div class="input-box">
              <label for="employeeLastName">Employee NSS</label>
              <InputText v-model="employee.person.personImssNss" placeholder="Enter employee NSS"
                :disabled="isDeleted" />
            </div>
          </div>
        </div>

        <div class="inputs-group group-2">
          <div class="input-box">
            <label for="employeeLastName">
              Work Modality
            </label>
            <Dropdown v-model="activeSwicht" :options="workModalityOptions" optionLabel="label" optionValue="value"
              placeholder="Select" class="w-full md:w-14rem" :disabled="isDeleted" />
          </div>
          <div class="input-box">
            <label for="employeeLastName">
              Discriminate assistance
            </label>
            <Dropdown v-model="employee.employeeAssistDiscriminator" :options="assistDiscriminatorOptions"
              optionLabel="label" optionValue="value" placeholder="Select" class="w-full md:w-14rem"
              :disabled="isDeleted" />
          </div>
        </div>

        <div v-if="employee.deletedAt" class="input-box">
          <div class="terminated-date-box-container">
            <label for="employeeTerminatedDate">Terminated Date</label>
            <div v-if="!displayTerminatedDateCalendar" class="terminated-date-box">
              <InputText v-model="employeeTerminatedDate" readonly class="capitalize" :disabled="isDeleted" />
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
                placeholder="Select Terminated Date" dateFormat="yy-mm-dd" dataType="string" />
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
              <p>Drag and drop file to here to upload.</p>
            </template>
          </FileUpload>
        </div>

        <div class="box-tools-footer">
          <button v-if="employee.deletedAt" type="button" class="btn btn-block" @click="onReactivate">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.45 2.15C14.992 4.057 17.587 5 20.25 5a.75.75 0 0 1 .75.75V11c0 5.001-2.958 8.676-8.725 10.948a.75.75 0 0 1-.55 0C5.958 19.676 3 16 3 11V5.75A.75.75 0 0 1 3.75 5c2.663 0 5.258-.943 7.8-2.85a.75.75 0 0 1 .9 0ZM12 16a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0-9.018a.75.75 0 0 0-.743.648l-.007.102v6.5l.007.102a.75.75 0 0 0 1.486 0l.007-.102v-6.5l-.007-.102A.75.75 0 0 0 12 6.982Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
            Reactivate Employee
          </button>
          <button type="button" class="btn btn-primary btn-block" @click="onSave">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                fill="#ffffff" class="fill-212121"></path>
            </svg>
            Save
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
