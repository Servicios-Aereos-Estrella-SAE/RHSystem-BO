<template>
  <div v-if="isReady" class="employee-user-assigned">
    <div v-if="isReady" class="employee">
      <div class="form-container">
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
            <employeeUserResponsibleInfoCard :userResponsibleEmployee="userAssignedEmployee"
              :click-on-edit="() => { onEdit(userAssignedEmployee) }"
              :click-on-delete="() => { onDelete(userAssignedEmployee) }" :isDeleted="isDeleted"
              :canManageResponsibleEdit="canManageAssignedEdit" :canManageUserResponsible="canManageUserAssigned" />
          </div>
        </div>
        <div v-else class="empty">
          Empty user assigned list.
        </div>

        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerUserAssignedEmployeeForm" header="User" position="right"
            class="employee-user-assigned-form-sidebar" :showCloseIcon="true">
            <employeeUserAssignedInfoForm :userAssignedEmployee="userAssignedEmployee" :employee="employee"
              @onUserAssignedEmployeeSave="onSave" :usersAsigned="userAssignedEmployeesList" />
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