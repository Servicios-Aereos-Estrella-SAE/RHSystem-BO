<template>
  <div class="box employee-proceeding-files">


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
          {{ $t('employee_proceeding_files') }}
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
            {{
            folderSelected.proceedingFileTypeName ? `${capitalizeFirstLetter($t(folderSelected.proceedingFileTypeName.toLocaleLowerCase()))}` : ''
            }}
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
                  {{ $t('search') }}
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
            <div v-if="canManageFiles" class="add-folder-button-container">
              <Button class="btn-add-folder" @click="addNewFolder">
                <div class="icon">
                  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><path d="M216.9,208H39.4a7.4,7.4,0,0,1-7.4-7.4V80H216a8,8,0,0,1,8,8V200.9A7.1,7.1,0,0,1,216.9,208Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M32,80V56a8,8,0,0,1,8-8H92.7a7.9,7.9,0,0,1,5.6,2.3L128,80" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="104" x2="152" y1="144" y2="144"/><line fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="128" x2="128" y1="120" y2="168"/></svg>
                </div>
                {{ $t('add_folder') }}
              </Button>
            </div>

            <proceedingFileTypeFolder v-for="(folder, index) in foldersFiltered"
              :key="`proceeding-file-folder-${index}`" :folder="folder" :canManageFiles="canManageFiles"
              @dblclick="handlerDoubleClick(folder)" @dblclickContracts="handlerContractsDoubleClick(folder)"
              @addSubfolder="handlerAddSubfolder" />
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
                  {{ $t('add_file') }}
                </Button>
                <Button class="btn btn-block btn-add-email" @click="addEmails">
                  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="16" height="16"><path  d="M24,10v9a5.006,5.006,0,0,1-5,5H5a5.006,5.006,0,0,1-5-5V8A5.006,5.006,0,0,1,5,3h8a1,1,0,0,1,0,2H5A2.99,2.99,0,0,0,2.361,6.6l7.517,7.518a3.008,3.008,0,0,0,4.244,0L17.943,10.3a1,1,0,0,1,1.414,1.414l-3.821,3.822a5.008,5.008,0,0,1-7.072,0L2,9.071V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V10A1,1,0,0,1,24,10ZM17,5h2V7a1,1,0,0,0,2,0V5h2a1,1,0,0,0,0-2H21V1a1,1,0,0,0-2,0V3H17A1,1,0,0,0,17,5Z"/></svg>
                </Button>
                <Button class="btn btn-add-folder" @click="addFolder">
                  <div class="icon">
                    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none"/><path d="M216.9,208H39.4a7.4,7.4,0,0,1-7.4-7.4V80H216a8,8,0,0,1,8,8V200.9A7.1,7.1,0,0,1,216.9,208Z" fill="none" stroke="#88a4bf" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M32,80V56a8,8,0,0,1,8-8H92.7a7.9,7.9,0,0,1,5.6,2.3L128,80" fill="none" stroke="#88a4bf" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line fill="none" stroke="#88a4bf" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="104" x2="152" y1="144" y2="144"/><line fill="none" stroke="#88a4bf" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="128" x2="128" y1="120" y2="168"/></svg>
                  </div>
                </Button>
              </div>

              <div v-if="folderSelected.children && folderSelected.children.length > 0"
                class="proceeding-file-wrapper children">
                <proceedingFileTypeFolder v-for="(folder, index) in childrenFoldersFiltered"
                  :key="`proceeding-file-folder-child-${index}`" :folder="folder" :canManageFiles="canManageFiles"
                  @dblclick="handlerDoubleClick(folder)" @addSubfolder="handlerAddSubfolder" />
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
                {{ $t('empty_file_list') }}
                <br>
                {{ $t('select_other_folder_or_add_a_file') }}
              </div>
            </div>
            <div v-else-if="drawerEmployeeContracts">
              <employeeContracts :employee="employee" @onEmployeeContractSave="onEmployeeContractSave" />
            </div>
          </div>

          <ProgressSpinner v-if="filesLoader" />

          <!-- Employee Proceeding File form -->
          <div class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerEmployeeProceedingFileForm" position="right"
              class="employee-proceeding-file-form-sidebar" :blockScroll="true" :closeOnEscape="false"
              :dismissable="false" :showCloseIcon="true">
              <employeeProceedingFileInfoForm :employee="employee" :employeeProceedingFile="employeeProceedingFile"
                :canReadOnlyFiles="canReadOnlyFiles" :canManageFiles="canManageFiles"
                @onEmployeeProceedingFileSave="onSave" />
            </Sidebar>
          </div>

          <div class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerProceedingFileTypeEmailForm" position="right"
              class="proceeding-file-type-email-form-sidebar" :blockScroll="true" :closeOnEscape="false"
              :dismissable="false" :showCloseIcon="true" :header="$t('email')">
              <proceedingFileTypeEmail :proceedingFileType="folderSelected" />
            </Sidebar>
          </div>

          <div class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerProceedingFileTypeFolderForm" position="right"
              class="proceeding-file-type-folder-form-sidebar" :blockScroll="true" :closeOnEscape="false"
              :dismissable="false" :showCloseIcon="true" :header="$t('new_folder')">
              <proceedingFileTypeFolderForm :parentId="currentParentId" @onSave="onFolderSave" @onCancel="onFolderCancel" />
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

  .proceeding-file-type-folder-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
