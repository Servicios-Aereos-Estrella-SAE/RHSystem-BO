<template>
  <div v-if="isReady" class="employee-user-assigned">
    <div v-if="isReady" class="employee">
      <div class="form-container">
        <div class="filters">
          <div class="box head-employees-page">
            <div class="input-search">
              <div class="input-box">
                <label for="search">
                  Search employee
                </label>
                <InputText v-model="search" placeholder="Employee name or id"
                  @keypress.enter="getUserAssignedEmployees" />
              </div>
              <div class="input-box">
                <button class="btn btn-block" @click="getUserAssignedEmployees">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </button>
              </div>

            </div>
            <div class="input-box">
              <label for="role">
                Department
              </label>
              <Dropdown v-model="departmentId" :options="departments" optionLabel="departmentName"
                optionValue="departmentId" placeholder="Select a Department" filter class="w-full md:w-14rem"
                showClear />
            </div>
            <div class="input-box">
              <label for="positionId">Position</label>
              <Dropdown v-model="positionId" :options="positions" optionLabel="positionName" optionValue="positionId"
                placeholder="Select a Position" filter class="w-full md:w-14rem" showClear />
            </div>

          </div>


        </div>
        <div class="user-assigned-wrapper">
          <div>
            <div class="employee-user-assigned-header">
              <div></div>
              <Button v-if="canManageAssignedEdit && canManageUserAssigned" class="btn btn-block" @click="addNew">
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                    fill="#88a4bf" class="fill-000000"></path>
                </svg>
                Add user assigned
              </Button>
            </div>
          </div>
        </div>

        <div v-if="userAssignedEmployeesList.length > 0" class="employee-user-assigned-wrapper">
          <div v-for="(userAssignedEmployee, index) in userAssignedEmployeesList"
            :key="`employee-user-assigned-${index}`">
            <employeeUserAssignedInfoCard :userAssignedEmployee="userAssignedEmployee"
              :click-on-edit="() => { onEdit(userAssignedEmployee) }"
              :click-on-delete="() => { onDelete(userAssignedEmployee) }" :isDeleted="isDeleted"
              :canManageAssignedEdit="canManageAssignedEdit" :canManageUserAssigned="canManageUserAssigned" />
          </div>
        </div>
        <div v-else class="empty">
          Empty user assigned list.
        </div>

        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerUserAssignedEmployeeForm" header="User" position="right"
            class="employee-user-assigned-form-sidebar" :showCloseIcon="true">
            <employeeUserAssignedInfoForm :userAssignedEmployee="userAssignedEmployee" :employee="employee"
              @onUserAssignedEmployeeSave="onSave" :usersAsigned="[]" />
          </Sidebar>
        </div>
      </div>
    </div>

    <transition name="page">
      <confirmDelete v-if="drawerUserAssignedEmployeeDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerUserAssignedEmployeeDelete = false" />
    </transition>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>

<style lang="scss">
  @import '/resources/styles/variables.scss';

  .employee-user-assigned-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>