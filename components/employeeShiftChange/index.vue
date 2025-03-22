<template>
  <div v-if="isReady" class="employee-shift-changes">
    <Toast />
    <div v-if="isReady" class="employee">
      <div class="form-container">
        <div class="files-wrapper">
          <div>
            <div class="files-header">
              <div></div>
              <Button class="btn btn-block" @click="addNew">
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                    fill="#88a4bf" class="fill-000000"></path>
                </svg>
                Add shift change
              </Button>
            </div>
          </div>
        </div>

        <div v-if="employeeShiftChangesList.length > 0" class="employee-shift-change-wrapper">
          <div v-for="(employeeShiftChange, index) in employeeShiftChangesList" :key="`employee-shift-change-${index}`">
            <employeeShiftChangeInfoCard :employeeShiftChange="employeeShiftChange"
              :click-on-edit="() => { onEdit(employeeShiftChange) }"
              :click-on-delete="() => { onDelete(employeeShiftChange) }" :isDeleted="isDeleted" />
          </div>
        </div>
        <div v-else class="empty">
          Empty file list.
          <br>
          Select other folder or add a file
        </div>

        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerEmployeeShiftChangeForm" header="Employee shift change" position="right"
            class="employee-shift-change-form-sidebar" :showCloseIcon="true">
            <employeeShiftChangeInfoForm :employeeShiftChange="employeeShiftChange" :employee="employee"
              @onEmployeeShiftChangeSave="onSave" />
          </Sidebar>
        </div>
      </div>
    </div>

    <transition name="page">
      <confirmDelete v-if="drawerEmployeeShiftChangeDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerEmployeeShiftChangeDelete = false" />
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

  .employee-shift-change-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>