<template>
  <div class="box aircraft-proceeding-files">
    <Toast />

    <div v-if="isReady">
      <div class="head-title">
        <Button class="btn" @click="handlerUnselectFolder" :disabled="!(folderSelected)">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12l7.852-8.313Z" fill="#88a4bf" class="fill-212121"></path></svg>
        </Button>
        <h1>
          Aircraft proceeding files
          <div class="caret">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.273 3.687a1 1 0 1 1 1.454-1.374l8.5 9a1 1 0 0 1 0 1.374l-8.5 9.001a1 1 0 1 1-1.454-1.373L19.125 12l-7.852-8.313Z" fill="#88a4bf" class="fill-212121"></path></svg>
          </div>
          <span v-if="folderSelected" class="folder-path uppercase">
            <span class="icon-path">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.821 6.5h5.929a2.25 2.25 0 0 1 2.229 1.938l.016.158.005.154v9a2.25 2.25 0 0 1-2.096 2.245L19.75 20H4.25a2.25 2.25 0 0 1-2.245-2.096L2 17.75v-7.251l6.207.001.196-.009a2.25 2.25 0 0 0 1.088-.393l.156-.12L13.821 6.5ZM8.207 4c.46 0 .908.141 1.284.402l.156.12 2.103 1.751-3.063 2.553-.085.061a.75.75 0 0 1-.29.106L8.206 9 2 8.999V6.25a2.25 2.25 0 0 1 2.096-2.245L4.25 4h3.957Z" fill="#88a4bf" class="fill-212121"></path></svg>
            </span>
            {{ folderSelected.proceedingFileTypeName.toLocaleUpperCase() }}
          </span>
        </h1>
      </div>

      <div class="aircraft">
        <div class="form-container">

          <div class="box head-page">
            <div class="aircraft-info">
              <div class="banner">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.989 11.946a1.991 1.991 0 0 1-2.05 1.99l-4.738-.139-3.454 7.143c-.277.574-.86.94-1.498.94a.926.926 0 0 1-.919-1.037l.862-7.193-3.765-.11-.49 1.341a1.29 1.29 0 0 1-1.211.847.901.901 0 0 1-.901-.902V13.35l-.81-.169a1.261 1.261 0 0 1 0-2.469l.81-.168V9.066c0-.46.343-.838.788-.894l.113-.007a1.29 1.29 0 0 1 1.21.846l.492 1.34 3.751-.11-.849-7.084a.93.93 0 0 1-.005-.055l-.002-.055c0-.511.415-.926.926-.926.585 0 1.123.307 1.423.8l.075.14 3.403 7.035 4.79-.14a1.991 1.991 0 0 1 2.048 1.932l.001.058Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </div>
              <div class="info">
                <div>
                  <div class="tail">
                    {{ aircraft.aircraftRegistrationNumber }}
                  </div>
                  <div class="serial">
                    Serial number:
                    {{ aircraft.aircraftSerialNumber }}
                  </div>
                </div>
              </div>
            </div>

            <div></div>

            <div class="input-search">
              <div class="input-box">
                <label for="search">
                  Search
                </label>
                <InputText
                  v-model="filterFolderText"
                  aria-describedby="search"
                />
              </div>
              <button class="btn btn-block">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </button>
            </div>
            <!-- <div class="input-search">
              <div class="input-box">
                <label for="search">
                  Search file
                </label>
                <InputText
                  v-model="filterFileText"
                  aria-describedby="search"
                />
              </div>
              <button class="btn btn-block">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </button>
            </div> -->
          </div>

          <div v-if="!folderSelected" class="proceeding-file-wrapper">
            <proceedingFileTypeFolder
              v-for="(folder, index) in foldersFiltered"
              :key="`proceeding-file-folder-${index}`"
              :folder="folder"
              @dblclick="handlerDoubleClick(folder)"
            />
          </div>

          <div v-if="!filesLoader" class="files-wrapper">
            <div v-if="folderSelected">
              <div class="files-header">
                <div></div>
                <Button class="btn btn-primary btn-block" @click="addNew">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6a2 2 0 0 0 2 2h6v10a2 2 0 0 1-2 2h-6.81A6.5 6.5 0 0 0 4 11.498V4a2 2 0 0 1 2-2h6Z" fill="#fff" class="fill-212121"></path><path d="M13.5 2.5V8a.5.5 0 0 0 .5.5h5.5l-6-6ZM12 17.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0ZM7 18l.001 2.503a.5.5 0 1 1-1 0V18H3.496a.5.5 0 0 1 0-1H6v-2.5a.5.5 0 1 1 1 0V17h2.497a.5.5 0 0 1 0 1H7Z" fill="#fff" class="fill-212121"></path></svg>
                  Add file
                </Button>
              </div>

              <div v-if="folderSelected.children && folderSelected.children.length > 0" class="proceeding-file-wrapper children">
                <proceedingFileTypeFolder
                  v-for="(folder, index) in childrenFoldersFiltered"
                  :key="`proceeding-file-folder-child-${index}`"
                  :folder="folder"
                  @dblclick="handlerDoubleClick(folder)"
                />
              </div>

              <div v-if="filesFolderFiltered.length > 0" class="file-list-wrapper">
                <div v-for="(aircraftProceedingFile, index) in filesFolderFiltered" :key="`proceeding-file-${index}`">
                  <aircraftProceedingFileInfoCard
                    :aircraftProceedingFile="aircraftProceedingFile"
                    :click-on-edit="() => { onEdit(aircraftProceedingFile) }"
                    :click-on-delete="() => { onDelete(aircraftProceedingFile) }"
                  />
                </div>
              </div>
              <div v-else class="empty">
                Empty file list.
                <br>
                Select other folder or add a file
              </div>
            </div>
          </div>
          <ProgressSpinner v-if="filesLoader"/>

          <!-- Aircraft Proceeding File form -->
          <div class="card flex justify-content-center">
            <Sidebar
              v-model:visible="drawerAircraftProceedingFileForm"
              position="right"
              class="aircraft-proceeding-file-form-sidebar"
              :blockScroll="true"
              :closeOnEscape="false"
              :dismissable="false"
              :showCloseIcon="true"
            >
              <aircraftProceedingFileInfoForm :aircraftProceedingFile="aircraftProceedingFile"
                @onAircraftProceedingFileSave="onSave" />
            </Sidebar>
          </div>
        </div>

        <transition name="page">
          <confirmDelete
            v-if="drawerAircraftProceedingFileDelete"
            @confirmDelete="confirmDelete"
            @cancelDelete="drawerAircraftProceedingFileDelete = false"
          />
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

.aircraft-proceeding-file-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
        width: 100% !important;
    }
}
</style>
