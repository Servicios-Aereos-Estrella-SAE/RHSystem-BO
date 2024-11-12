<template>
    <div v-if="isReady" class="employee-shift-exceptions">
      <Toast />
      <employeeModalInfoCard :employee="employee"/>
      <h1>
        Exceptions to
        {{ selectedExceptionDate }}
      </h1>
  
      <div v-if="isReady" class="employee">
        <div class="">
          <div class="shift-exception-wrapper">
            <div class="head-page">
              <div class="input-box">
                <Button class="btn btn-block" @click="addNew">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  Add exception
                </Button>
              </div>
            </div>
          </div>
          <div v-if="shiftExceptionsList.length > 0" class="shift-exception-wrapper">
            <div v-for="(shiftException, index) in shiftExceptionsList" :key="`exception-${index}`">
              <employeeShiftExceptionCard
                :shiftException="shiftException"
                :click-on-edit-exception="() => { onEdit(shiftException) }"
                :click-on-delete-exception="() => { onDelete(shiftException) }" 
              />
            </div>
          </div>
          <div v-else class="shift-exception-wrapper">
            <div class="empty-data">
              No exceptions
            </div>
          </div>
        </div>
      </div>
  
      <Sidebar v-model:visible="drawerShiftExceptionForm" header="form" position="right" class="shift-exception-form-sidebar" :showCloseIcon="true">
        <employeeExceptionInfoForm
          :shiftException="shiftException"
          :employee="employee"
          :date="date"
          @onShiftExceptionSave="onSave"
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