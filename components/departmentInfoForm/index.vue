<template>
  <div class="box user-info-form">
    <Toast />
    <h4>
      {{ isNewUser ? 'New department' : 'Update department' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <label for="departmentName">Department Name</label>
          <InputText v-model="department.departmentName" placeholder="Enter Department Name" />
          <small class="p-error" v-if="submitted && !department.departmentName">First Name is required.</small>
        </div>
        <div class="input-box">
          <label for="parentDepartmentId">
            Parent Department
          </label>
          <Dropdown v-model="department.parentDepartmentId" :options="departmentsWithNone" optionLabel="departmentName" optionValue="departmentId"
            placeholder="Select a Department" filter class="w-full md:w-14rem" :disabled="isSubDeparment"/>
        </div>
        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
      </div>
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
</style>