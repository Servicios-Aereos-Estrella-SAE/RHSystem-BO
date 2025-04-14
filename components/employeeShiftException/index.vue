<template>
  <div v-if="isReady" class="employee-shift-exceptions">
    <employeeModalInfoCard :employee="employee"/>
    <h1>
      Exceptions to
      {{ selectedExceptionDate }}
    </h1>

    <div v-if="isReady" class="employee">
      <div class="">
        <div v-if="displayAddButton" class="shift-exception-wrapper">
          <div class="head-page">
            <div class="input-box">
              <Button class="btn btn-block" @click="addNew" >
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path>
                </svg>
                Add shift exception
              </Button>
            </div>
          </div>
        </div>
        <div v-if="shiftExceptionsList.length > 0" class="shift-exception-wrapper">
          <div v-for="(shiftException, index) in shiftExceptionsList" :key="`exception-${index}`">
            <employeeShiftExceptionCard
              :shiftException="shiftException"
              :isDeleted="isDeleted"
              :click-on-edit="() => { onEdit(shiftException) }"
              :click-on-delete="() => { onDelete(shiftException) }"
              :canManageToPreviousDays="canManageToPreviousDays"
              :canManageException="canManageException"
            />
          </div>
        </div>
        <div v-else class="shift-exception-wrapper">
          <div class="empty-data">
            No shifts exceptions for today
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
    </div>

    <Sidebar v-model:visible="drawerShiftExceptionForm" header="form" position="right" class="shift-exception-form-sidebar" :showCloseIcon="true">
      <employeeShiftExceptionInfoForm
        :shiftException="shiftException"
        :employee="employee"
        :date="date"
        :shift="shift"
        @onShiftExceptionSave="onSave"
        @onShiftExceptionSaveAll="onSaveAll"
      />
    </Sidebar>

    <transition name="page">
      <confirmDelete
        v-if="drawerShiftExceptionDelete"
        @confirmDelete="confirmDelete"
        @cancelDelete="drawerShiftExceptionDelete = false"
      />
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

  .shift-exception-form-sidebar {
    width: 100% !important;
    max-width: 30rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
