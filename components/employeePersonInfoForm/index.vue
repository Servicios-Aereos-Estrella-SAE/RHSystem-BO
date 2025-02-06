<template>
  <div class="box employee-person-info-form">
    <Toast />
    <div v-if="isReady" class="employee-person-form">
      Personal Information
      <div class="form-container">
        <Button class="btn" @click="handlerClickOnClose">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
        </Button>
       <!--  <div class="input-box">
          <label for="userActive">
            Work Modality
            ( {{ activeSwicht ? 'Onsite' : 'Home Office' }} )
          </label>
          <InputSwitch v-model="activeSwicht" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
          <label for="personGender">Business Unit</label>
          <Dropdown v-model="employee.businessUnitId" :options="businessUnits" optionLabel="businessUnitName" optionValue="businessUnitId"
            placeholder="Select" class="w-full md:w-14rem" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
          <label for="employeeCode">Employee Code</label>
          <InputText v-model="employee.employeeCode" placeholder="Enter Employee Code" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employee.employeeCode">Employee Code is required.</small>
        </div>
        <div class="input-box">
          <label for="employeeFirstName">First Name</label>
          <InputText v-model="employee.employeeFirstName" placeholder="Enter First Name" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employee.employeeFirstName">First Name is required.</small>
        </div>
        <div class="input-box">
          <label for="employeeLastName">Last Name</label>
          <InputText v-model="employee.employeeLastName" placeholder="Enter Last Name" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employee.employeeLastName">Last Name is required.</small>
        </div> -->
        <!-- <div class="input-box">
          <label for="role">
            Department
          </label>
          <Dropdown v-model="employee.departmentId" :options="departments" optionLabel="departmentName" optionValue="departmentId"
            placeholder="Select a Department" filter class="w-full md:w-14rem" :invalid="submitted && !employee.departmentId" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employee.departmentId">Department is required.</small>
        </div>
        <div class="input-box">
          <label for="positionId">Position</label>
          <Dropdown v-model="employee.positionId" :options="positions" optionLabel="positionName" optionValue="positionId"
            placeholder="Select a Position" filter class="w-full md:w-14rem" :invalid="submitted && !employee.positionId" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employee.positionId">Position is required.</small>
        </div>
        <div class="input-box">
          <div class="hire-date-box-container">
            <label for="employeeHireDate">Hire Date</label>
            <div v-if="!displayHireDateCalendar" class="hire-date-box">
              <InputText v-model="employeeHireDate" readonly class="capitalize" :disabled="isDeleted"/>
              <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="handlerDisplayHireDate" :disabled="isDeleted">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </Button>
            </div>
            <div v-if="displayHireDateCalendar" class="hire-date-box-controller">
              <Calendar v-if="displayHireDateCalendar" v-model.lazy="employee.employeeHireDate" placeholder="Select Hire Date" :disabled="isDeleted"/>
              <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="displayHireDateCalendar = false">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </Button>
            </div>
          </div>
        </div> -->
        <div class="input-box">
          <div class="hire-date-box-container">
            <label for="employeeBirthDate">Birthday</label>
            <div v-if="!displayBirthDateCalendar" class="hire-date-box">
              <InputText v-model="personBirthday" readonly class="capitalize" :disabled="isDeleted"/>
              <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="handlerDisplayBirthDate" :disabled="isDeleted">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </Button>
            </div>
            <div v-if="displayBirthDateCalendar" class="hire-date-box-controller">
              <Calendar v-model="employee.person.personBirthday" placeholder="Select birthday" :disabled="isDeleted"/>
              <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="displayBirthDateCalendar = false">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </Button>
            </div>
          </div>
        </div>
        <div class="input-box">
          <label for="age">Age</label>
          {{ getAge }}
        </div>
        <div class="input-box">
          <label for="personPhone">Phone</label>
          <InputMask v-model="employee.person.personPhone" mask="(999) 999 99 99" placeholder="Enter employee phone" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
          <label for="personPhoneSecondary">Phone secondary</label>
          <InputMask v-model="employee.person.personPhoneSecondary" mask="(999) 999 99 99" placeholder="Enter employee phone" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
          <label for="personMaritalStatus">Marital status</label>
          <Dropdown v-model="employee.person.personMaritalStatus" :options="maritalStatus" optionLabel="label" optionValue="value"
            placeholder="Select Marital Status" class="w-full md:w-14rem" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
          <label for="search">
            Place of birth country
          </label>
          <AutoComplete
          v-model="selectCountry"
          :suggestions="filteredCountries"
          :item-value="option => option.personPlaceOfBirthCountry"
          :optionLabel="option => option.personPlaceOfBirthCountry"
          @complete="handlerSearchCountries"
          @change="onCountrySelect"
        >
          <template #option="slotProps">  <!-- 'slotProps' es el nombre correcto para acceder a la opción -->
            <div>
              <div class="name">
                {{ slotProps.option.personPlaceOfBirthCountry }}  <!-- Aquí accedemos directamente a la opción -->
              </div>
            </div>
          </template>
        </AutoComplete>
        </div>
        <div class="input-box">
          <label for="search">
            Place of birth state
          </label>
          <AutoComplete
            v-model="selectState"
            :suggestions="filteredStates"
            :optionLabel="option => option.personPlaceOfBirthState"
            @complete="handlerSearchStates"
            @change="onStateSelect"
          >
            <template #option="state">
              <div>
                <div class="name">
                  {{ state.option.personPlaceOfBirthState }}
                </div>
              </div>
            </template>
          </AutoComplete>
        </div>
        <div class="input-box">
          <label for="search">
            Place of birth city
          </label>
          <AutoComplete
            v-model="selectCity"
            :suggestions="filteredCities"
            :optionLabel="option => option.personPlaceOfBirthCity"
            @complete="handlerSearchCities"
            @change="onCitySelect"
          >
            <template #option="city">
              <div>
                <div class="name">
                  {{ city.option.personPlaceOfBirthCity }}
                </div>
              </div>
            </template>
          </AutoComplete>
        </div>
       <!--  <div class="input-box">
          <label for="employeeLastName">CURP</label>
          <InputText v-model="employee.person.personCurp" placeholder="Enter employee CURP" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && employee.person.personCurp && !isValidCURP">Personal identification is not valid.</small>
        </div>
        <div class="input-box">
          <label for="employeeLastName">RFC</label>
          <InputText v-model="employee.person.personRfc" placeholder="Enter employee RFC" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && employee.person.personRfc && !isValidRFC">RFC is not valid.</small>
        </div>
        <div class="input-box">
          <label for="employeeLastName">Employee NSS</label>
          <InputText v-model="employee.person.personImssNss" placeholder="Enter employee NSS" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
          <label for="employeeLastName">
            Discriminate assistance
          </label>
          <Dropdown v-model="employee.employeeAssistDiscriminator" :options="assistDiscriminatorOptions" optionLabel="label" optionValue="value"
            placeholder="Select" class="w-full md:w-14rem" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
          <label for="typeOfContract">Contract Type</label>
          <Dropdown v-model="employee.employeeTypeOfContract" :options="typesOfContract" optionLabel="label" optionValue="value"
            placeholder="Select Type of Contract" class="w-full md:w-14rem" :disabled="isDeleted"/>
        </div>
        <div v-if="employee.deletedAt" class="input-box">
          <div class="terminated-date-box-container">
            <label for="employeeTerminatedDate">Terminated Date</label>
            <div v-if="!displayTerminatedDateCalendar" class="terminated-date-box">
              <InputText v-model="employeeTerminatedDate" readonly class="capitalize" :disabled="isDeleted"/>
              <Button type="button" class="btn btn-block" id="display-input-terminateddate" @click="handlerDisplayTerminatedDate">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </Button>
            </div>
            <div v-if="displayTerminatedDateCalendar" class="terminated-date-box-controller">
              <Calendar v-if="displayTerminatedDateCalendar" v-model.lazy="employee.employeeTerminatedDate" placeholder="Select Terminated Date" dateFormat="yy-mm-dd"
              dataType="string"/>
              <Button type="button" class="btn btn-block" id="display-input-terminateddate" @click="displayTerminatedDateCalendar = false">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </Button>
            </div>
          </div>
        </div>
        <div class="input-box" v-show="!pilot && !flightAttendant">
          <label for="employee-type">
            Employee type
          </label>
          <Dropdown v-model="employee.employeeTypeId" :options="employeeTypes" optionLabel="employeeTypeName" optionValue="employeeTypeId"
            placeholder="Select a Employee Type" filter class="w-full md:w-14rem" :invalid="submitted && !employee.employeeTypeId" :disabled="isDeleted"/>
          <small class="p-error" v-if="submitted && !employee.employeeTypeId">Employee type is required.</small>
        </div>
        <div class="input-box" v-if="pilot || flightAttendant">
          <div v-if="hasPhotoEmployee()" class="p-d-flex p-ai-center p-mb-2 image-pilot">
            <img role="presentation"
              class="p-fileupload-file-thumbnail" width="50" :src="getUrlPhoto()" />
          </div>
          <FileUpload v-model="files" name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"
          :custom-upload="true" :showUploadButton="false" :maxFileSize="6000000" :fileLimit="1" @select="validateFiles">
          <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
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
        </div> -->
        <div class="box-tools-footer">
          <!-- <Button label="Proceeding files" severity="primary" @click="getProceedingFiles()" /> -->
          <!-- <Button label="Shift exceptions" severity="primary" @click="getShiftExceptions()" /> -->
          <Button v-if="employee.deletedAt" label="Reactivate" severity="primary" @click="onReactivate()" />
          <Button label="Save" severity="primary" @click="onSave()" />
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