<template>
  <div v-if="isReady" class="employee-shift-changes">
    <Toast />
    <employeeModalInfoCard :employee="employee" />
    <h1>
      Shift change to
      {{ selectedChangeDate }}
    </h1>

    <div v-if="isReady" class="employee">
      <div class="">
        <div v-if="displayAddButton" class="employee-shift-change-wrapper">
          <div class="head-page">
            <div class="input-box">
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
          <div v-for="(employeeShiftChange, index) in employeeShiftChangesList" :key="`change-${index}`">
            <employeeShiftChangeCard :employeeShiftChange="employeeShiftChange" :isDeleted="isDeleted"
              :click-on-edit="() => { onEdit(employeeShiftChange) }"
              :click-on-delete="() => { onDelete(employeeShiftChange) }"
              :canManageToPreviousDays="canManageToPreviousDays" :canManageShiftChange="canManageChange" />
          </div>
        </div>
        <div v-else class="employee-shift-change-wrapper">
          <div class="empty-data">
            No shift changes for today
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
    </div>

    <Sidebar v-model:visible="drawerEmployeeShiftChangeForm" header="form" position="right"
      class="employee-shift-change-form-sidebar" :showCloseIcon="true">
      <employeeShiftChangeInfoForm :employeeShiftChange="employeeShiftChange" :employee="employee" :date="date"
        :shift="shift" @onShiftChangeSave="onSave" @onEmployeeShiftChangeSaveAll="onSaveAll" />
    </Sidebar>

    <transition name="page">
      <confirmDelete v-if="drawerEmployeeShiftChangeDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerShiftChangeDelete = false" />
    </transition>


  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
  @import '/resources/styles/variables.scss';

  .employee-shift-change-form-sidebar {
    width: 100% !important;
    max-width: 30rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>