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
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#fff" class="fill-212121"></path></svg>
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