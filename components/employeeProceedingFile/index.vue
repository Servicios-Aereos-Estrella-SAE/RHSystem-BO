<template>
  <div v-if="isReady" class="employee-proceeding-files">
    <Toast />
    <employeeModalInfoCard :employee="employee"/>
    <div v-if="isReady" class="employee">
      <div class="form-container">
        <div class="employee-proceeding-file-wrapper">
          <div class="head-page">
            <div></div>
            <div class="input-box">
              <Button class="btn btn-block btn-primary" @click="addNew">
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
                Add file
              </Button>
            </div>
          </div>
        </div>

        <div class="proceeding-files-wrapper">
          <div v-for="(employeeProceedingFile, index) in employeeProceedingFilesList" :key="`proceeding-file-${index}`">
            <employeeProceedingFileInfoCard :employeeProceedingFile="employeeProceedingFile"
              :click-on-edit="() => { onEdit(employeeProceedingFile) }"
              :click-on-delete="() => { onDelete(employeeProceedingFile) }" />
          </div>
        </div>

        <!-- Rmployee Proceeding File form -->
        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerEmployeeProceedingFileForm" header="Files" position="right"
            class="employee-proceeding-file-form-sidebar" :showCloseIcon="true">
            <employeeProceedingFileInfoForm
              :employeeProceedingFile="employeeProceedingFile"
              :employee="employee"
              @onEmployeeProceedingFileSave="onSave" />
          </Sidebar>
        </div>
      </div>
    </div>

    <transition name="page">
      <confirmDelete
        v-if="drawerEmployeeProceedingFileDelete"
        @confirmDelete="confirmDelete"
        @cancelDelete="drawerEmployeeProceedingFileDelete = false"
      />
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

  .employee-proceeding-file-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>