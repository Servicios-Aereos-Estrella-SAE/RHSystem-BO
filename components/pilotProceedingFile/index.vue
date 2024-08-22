<template>
  <div v-if="isReady" class="box pilot-proceeding-files">
    <Toast />
    <h4>
      {{ `${pilot.person.personFirstname || ''}` }} {{ `${pilot.person.personLastname ||
        ''}`  }} {{ `${pilot.person.personSecondLastname ||
          ''}`  }}
    </h4>
    <div v-if="isReady" class="pilot">
      <div class="form-container">
        <div class="pilot-proceeding-file-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <br />
              <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
        </div>
        <div class="pilot-proceeding-file-wrapper">
          <div v-for="(pilotProceedingFile, index) in pilotProceedingFilesList" :key="`proceeding-file-${index}`">
            <pilotProceedingFileInfoCard :pilotProceedingFile="pilotProceedingFile"
              :click-on-edit="() => { onEdit(pilotProceedingFile) }"
              :click-on-delete="() => { onDelete(pilotProceedingFile) }" />
          </div>
        </div>
        <!-- Rmployee Proceeding File form -->
        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerPilotProceedingFileForm" position="right"
            class="pilot-proceeding-file-form-sidebar" :showCloseIcon="true">
            <pilotProceedingFileInfoForm :pilotProceedingFile="pilotProceedingFile"
              @onPilotProceedingFileSave="onSave" />
          </Sidebar>
        </div>
      </div>
      <Dialog v-model:visible="drawerPilotProceedingFileDelete" :style="{width: '450px'}" header="Confirm"
        :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="pilotProceedingFile"> Are you sure you want to delete proceeding file at
            <b>{{`${selectedDateTimeDeleted || ''}`}}</b>
            ?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="drawerPilotProceedingFileDelete = false" />
          <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
        </template>
      </Dialog>
    </div>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
  @import '/resources/styles/variables.scss';

  .pilot-proceeding-file-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>