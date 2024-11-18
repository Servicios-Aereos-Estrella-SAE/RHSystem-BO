<template>
  <div class="box user-info-form">
    <Toast />
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
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
        </div>
        <div class="input-box">
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
        </div>
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
          <label for="employeeLastName">Phone</label>
          <InputMask v-model="employee.person.personPhone" mask="(999) 999 99 99" placeholder="Enter employee phone" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
          <label for="personGender">Gender</label>
          <Dropdown v-model="employee.person.personGender" :options="genders" optionLabel="label" optionValue="value"
            placeholder="Select Gender" class="w-full md:w-14rem" :disabled="isDeleted"/>
        </div>
        <div class="input-box">
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
        <div class="box-tools-footer">
          <!-- <Button label="Proceeding files" severity="primary" @click="getProceedingFiles()" /> -->
          <!-- <Button label="Shift exceptions" severity="primary" @click="getShiftExceptions()" /> -->
          <Button label="Save" severity="primary" @click="onSave()" />
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

<style lang="scss" scoped>
  @import './style';
</style>