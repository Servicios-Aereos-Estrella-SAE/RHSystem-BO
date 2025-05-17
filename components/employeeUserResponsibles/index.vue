<template>
  <div v-if="isReady" class="employee-user-responsibles">
    <div v-if="isReady" class="employee">
      <div class="form-container">
        <div class="user-responsibles-wrapper">
          <div>
            <div class="employee-user-responsibles-header">
              <div></div>
              <Button v-if="canManageResponsibleEdit" class="btn btn-block" @click="addNew">
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                    fill="#88a4bf" class="fill-000000"></path>
                </svg>
                Add user responsible
              </Button>
            </div>
          </div>
        </div>

        <div v-if="userResponsibleEmployeesList.length > 0" class="employee-user-responsibles-wrapper">
          <div v-for="(userResponsibleEmployee, index) in userResponsibleEmployeesList"
            :key="`employee-user-responsible-${index}`">
            <employeeUserResponsibleInfoCard :userResponsibleEmployee="userResponsibleEmployee"
              :click-on-edit="() => { onEdit(userResponsibleEmployee) }"
              :click-on-delete="() => { onDelete(userResponsibleEmployee) }" :isDeleted="isDeleted"
              :canManageResponsibleEdit="canManageResponsibleEdit" />
          </div>
        </div>
        <div v-else class="empty">
          Empty user responsible list.
        </div>

        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerUserResponsibleEmployeeForm" header="User" position="right"
            class="employee-user-responsible-form-sidebar" :showCloseIcon="true">
            <employeeUserResponsibleInfoForm :userResponsibleEmployee="userResponsibleEmployee" :employee="employee"
              @onUserResponsibleEmployeeSave="onSave" :usersAsigned="userResponsibleEmployeesList" />
          </Sidebar>
        </div>
      </div>
    </div>

    <transition name="page">
      <confirmDelete v-if="drawerUserResponsibleEmployeeDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerUserResponsibleEmployeeDelete = false" />
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

  .employee-user-responsible-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>