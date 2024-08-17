<template>
  <div class="box user-info-form">
    <Toast />
    <h4>
      {{ isNewUser ? 'New employee' : 'Update employee' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <label for="userActive">
            {{ activeSwicht ? 'Onsite' : 'Remote' }}</label>
          <InputSwitch v-model="activeSwicht" />
        </div>
        <div class="input-box">
          <label for="employeeCode">Employee Code</label>
          <InputText v-model="employee.employeeCode" placeholder="Enter Employee Code" />
          <small class="p-error" v-if="submitted && !employee.employeeCode">Employee Code is required.</small>
        </div>
        <div class="input-box">
          <label for="employeeFirstName">First Name</label>
          <InputText v-model="employee.employeeFirstName" placeholder="Enter First Name" />
          <small class="p-error" v-if="submitted && !employee.employeeFirstName">First Name is required.</small>
        </div>
        <div class="input-box">
          <label for="employeeLastName">Last Name</label>
          <InputText v-model="employee.employeeLastName" placeholder="Enter Last Name" />
          <small class="p-error" v-if="submitted && !employee.employeeLastName">Last Name is required.</small>
        </div>
        <div class="input-box">
          <label for="role">
            Departamento
          </label>
          <Dropdown v-model="employee.departmentId" :options="departments" optionLabel="departmentName" optionValue="departmentId"
            placeholder="Select a Department" filter class="w-full md:w-14rem" :invalid="submitted && !employee.departmentId" />
          <small class="p-error" v-if="submitted && !employee.departmentId">Department is required.</small>
        </div>
        <div class="input-box">
          <label for="positionId">Position</label>
          <Dropdown v-model="employee.positionId" :options="positions" optionLabel="positionName" optionValue="positionId"
            placeholder="Select a Position" filter class="w-full md:w-14rem" :invalid="submitted && !employee.positionId" />
          <small class="p-error" v-if="submitted && !employee.positionId">Position is required.</small>
        </div>
        <div class="input-box">
          <label for="employeePayrollNum">Payroll Number</label>
          <InputText v-model="employee.employeePayrollNum" placeholder="Enter Payroll Number" />
        </div>
        <div class="input-box">
          <label for="employeeHireDate">Hire Date</label>
          <Calendar v-model="employee.employeeHireDate" dateFormat="yy-mm-dd" placeholder="Select Hire Date" />
        </div>
        <div class="input-box">
          <label for="employeeHireDate">Birthday</label>
          <Calendar v-model="employee.person.personBirthday" dateFormat="yy-mm-dd" placeholder="Select birthday" />
        </div>
        <div class="input-box">
          <label for="employeeLastName">Phone</label>
          <InputText v-model="employee.person.personPhone" placeholder="Enter employee phone" />
        </div>
        <div class="input-box">
          <label for="personGender">Gender</label>
          <Dropdown v-model="employee.person.personGender" :options="genders" optionLabel="label" optionValue="value"
            placeholder="Select Gender" class="w-full md:w-14rem" />
        </div>
        <div class="input-box">
          <label for="employeeLastName">Personal identification code</label>
          <InputText v-model="employee.person.personCurp" placeholder="Enter employee CURP" />
          <small class="p-error" v-if="submitted && employee.person.personCurp && !isValidCURP">Personal identification is not valid.</small>
        </div>
        <div class="input-box">
          <label for="employeeLastName">Employee RFC</label>
          <InputText v-model="employee.person.personRfc" placeholder="Enter employee RFC" />
          <small class="p-error" v-if="submitted && employee.person.personRfc && !isValidRFC">RFC is not valid.</small>
        </div>
        <div class="input-box">
          <label for="employeeLastName">Employee NSS</label>
          <InputText v-model="employee.person.personImssNss" placeholder="Enter employee NSS" />
        </div>
        <div class="box-tools-footer">
          <Button label="Proceeding files" severity="primary" @click="getProceedingFiles()" />
          <Button label="Shifts" severity="primary" @click="getShifts()" />
          <Button label="Shift exceptions" severity="primary" @click="getShiftExceptions()" />
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
      </div>
    </div>
    <div class="card flex justify-content-center">
      <Sidebar v-model:visible="drawerShiftExceptions" header="Employee shift exceptions" position="right"
        class="shift-exception-sidebar" :showCloseIcon="true">
        <employeeShiftException :employee="employee" />
      </Sidebar>
      <Sidebar v-model:visible="drawerShifts" header="Employee shifts" position="right" class="shift-sidebar"
        :showCloseIcon="true">
        <employeeShift :employee="employee" />
      </Sidebar>
      <Sidebar v-model:visible="drawerProceedingFiles" header="Employee proceeding files" position="right" class="proceeding-file-sidebar"
        :showCloseIcon="true">
        <employeeProceedingFile :employee="employee" />
      </Sidebar>
    </div>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
  .shift-exception-sidebar {
    width: 100% !important;
    max-width: 70rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  .shift-sidebar {
    width: 100% !important;
    max-width: 70rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  .proceeding-file-sidebar {
    width: 100% !important;
    max-width: 90rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>