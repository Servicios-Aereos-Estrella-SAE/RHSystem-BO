<template>
  <div class="box employee-proceeding-files">
    <Toast />

    <div v-if="isReady">
      <div class="head-title">
        <Button class="btn" @click="handlerUnselectFolder" :disabled="!(folderSelected)">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12l7.852-8.313Z"
              fill="#88a4bf" class="fill-212121"></path>
          </svg>
        </Button>
        <h1>
          Employee proceeding files
          <div class="caret">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.273 3.687a1 1 0 1 1 1.454-1.374l8.5 9a1 1 0 0 1 0 1.374l-8.5 9.001a1 1 0 1 1-1.454-1.373L19.125 12l-7.852-8.313Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
          </div>
          <span v-if="folderSelected" class="folder-path uppercase">
            <span class="icon-path">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.821 6.5h5.929a2.25 2.25 0 0 1 2.229 1.938l.016.158.005.154v9a2.25 2.25 0 0 1-2.096 2.245L19.75 20H4.25a2.25 2.25 0 0 1-2.245-2.096L2 17.75v-7.251l6.207.001.196-.009a2.25 2.25 0 0 0 1.088-.393l.156-.12L13.821 6.5ZM8.207 4c.46 0 .908.141 1.284.402l.156.12 2.103 1.751-3.063 2.553-.085.061a.75.75 0 0 1-.29.106L8.206 9 2 8.999V6.25a2.25 2.25 0 0 1 2.096-2.245L4.25 4h3.957Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </span>
            {{ folderSelected.proceedingFileTypeName.toLocaleUpperCase() }}
          </span>
        </h1>
      </div>

      <div class="employee">
        <div class="form-container">
          <employeeModalInfoCard :employee="employee" />
          <div v-if="displaySearchInput" class="box head-page">
            <div></div>
            <div class="input-search">
              <div class="input-box">
                <label for="search">
                  Search
                </label>
                <InputText v-model="filterFolderText" aria-describedby="search" />
              </div>
              <button class="btn btn-block">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="!folderSelected" class="proceeding-file-wrapper">
            <proceedingFileTypeFolder v-for="(folder, index) in foldersFiltered"
              :key="`proceeding-file-folder-${index}`" :folder="folder" @dblclick="handlerDoubleClick(folder)"
              @dblclickContracts="handlerContractsDoubleClick(folder)" />
          </div>

          <div v-if="!filesLoader" class="files-wrapper">
            <div v-if="folderSelected && (!drawerEmployeeContracts)">
              <div v-if="canManageFiles" class="files-header">
                <div></div>
                <Button class="btn btn-block" @click="addNew">
                  <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                      fill="#88a4bf" class="fill-000000"></path>
                  </svg>
                  Add file
                </Button>
                <Button class="btn btn-block" @click="addEmails">
                  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M493.6 163c-24.88-19.62-45.5-35.37-164.3-121.6C312.7 29.21 279.7 0 256.4 0h-.8c-23.3 0-56.3 29.21-73 41.38-118.8 86.25-139.4 101.1-164.3 121.6C6.75 172 0 186 0 200.8V464c0 26.5 21.49 48 48 48h416c26.51 0 48-21.49 48-47.1V200.8c0-14.8-6.7-28.8-18.4-37.8zM303.2 367.5c-14.1 11-30.7 16.5-47.2 16.5s-33.06-5.484-47.16-16.47L64 254.9v-46.4c21.16-16.59 46.48-35.66 156.4-115.5 3.18-2.328 6.891-5.187 10.98-8.353C236.9 80.44 247.8 71.97 256 66.84c8.207 5.131 19.14 13.6 24.61 17.84 4.09 3.166 7.801 6.027 11.15 8.478C400.9 172.5 426.6 191.7 448 208.5v46.32L303.2 367.5z"
                      fill="#88a4bf" class="fill-000000"></path>
                  </svg>
                </Button>
              </div>

              <div v-if="folderSelected.children && folderSelected.children.length > 0"
                class="proceeding-file-wrapper children">
                <proceedingFileTypeFolder v-for="(folder, index) in childrenFoldersFiltered"
                  :key="`proceeding-file-folder-child-${index}`" :folder="folder"
                  @dblclick="handlerDoubleClick(folder)" />
              </div>

              <div v-if="filesFolderFiltered.length > 0" class="file-list-wrapper">
                <div v-for="(employeeProceedingFile, index) in filesFolderFiltered" :key="`proceeding-file-${index}`">
                  <employeeProceedingFileInfoCard :employeeProceedingFile="employeeProceedingFile"
                    :canReadOnlyFiles="canReadOnlyFiles" :canManageFiles="canManageFiles"
                    :click-on-edit="() => { onEdit(employeeProceedingFile) }"
                    :click-on-delete="() => { onDelete(employeeProceedingFile) }" />
                </div>
              </div>
              <div v-else class="empty">
                Empty file list.
                <br>
                Select other folder or add a file
              </div>
            </div>
            <div v-else-if="drawerEmployeeContracts">
              <employeeContracts :employee="employee" />
            </div>
          </div>

          <ProgressSpinner v-if="filesLoader" />

          <!-- Employee Proceeding File form -->
          <div class="card flex justify-content-center">
            <Sidebar
              v-model:visible="drawerEmployeeProceedingFileForm"
              position="right"
              class="employee-proceeding-file-form-sidebar"
              :blockScroll="true"
              :closeOnEscape="false"
              :dismissable="false"
              :showCloseIcon="true"
            >
              <employeeProceedingFileInfoForm
                :employee="employee"
                :employeeProceedingFile="employeeProceedingFile"
                :canReadOnlyFiles="canReadOnlyFiles"
                :canManageFiles="canManageFiles"
                @onEmployeeProceedingFileSave="onSave" />
            </Sidebar>
          </div>

          <div class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerProceedingFileTypeEmailForm" position="right"
              class="proceeding-file-type-email-form-sidebar" :blockScroll="true" :closeOnEscape="false"
              :dismissable="false" :showCloseIcon="true" header="emails">
              <proceedingFileTypeEmail :proceedingFileType="folderSelected" />
            </Sidebar>
          </div>
        </div>

        <transition name="page">
          <confirmDelete v-if="drawerEmployeeProceedingFileDelete" @confirmDelete="confirmDelete"
            @cancelDelete="drawerEmployeeProceedingFileDelete = false" />
        </transition>
      </div>
    </div>
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

  .proceeding-file-type-email-form-sidebar {
    width: 100% !important;
    max-width: 30rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
