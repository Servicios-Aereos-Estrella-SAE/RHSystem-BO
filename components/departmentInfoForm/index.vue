<template>
  <div class="user-info-form">
    <Toast />
    <h4>
      {{ isNewDepartment ? 'New department' : 'Update department' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <label for="parentDepartmentId">
            Type Department
          </label>
          <Dropdown v-model="prefix" :options="departmentPrefixList" optionLabel="label" optionValue="prefix" />
        </div>

        <div class="input-box">
          <label>Department Order Position</label>
          <InputNumber v-model="positionNumber" placeholder="Enter Department Position"  :min="1" :max="99" />
        </div>

        <div class="input-box">
          <label for="departmentName">Department Name</label>
          <InputText v-model="department.departmentName" placeholder="Enter Department Name" />
          <small class="p-error" v-if="submitted && !(department.departmentName)">First Name is required.</small>
        </div>

        <div class="input-box">
          <label for="parentDepartmentId">
            Parent Department
          </label>
          <Dropdown v-model="department.parentDepartmentId" :options="departmentsWithNone" optionLabel="departmentName" optionValue="departmentId"
            placeholder="Select a Department" filter class="w-full md:w-14rem" disabled />
        </div>
        <div class="box-tools-footer">
          <button type="button" class="btn btn-primary btn-block" @click="onSave">
            Save
          </button>
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
