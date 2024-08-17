<template>
  <div v-if="isReady" class="box flight-attendant-proceeding-files">
    <Toast />
    <h4>
      {{ `${flightAttendant.person.personFirstname || ''}` }} {{ `${flightAttendant.person.personLastname ||
        ''}`  }} {{ `${flightAttendant.person.personSecondLastname ||
          ''}`  }}
    </h4>
    <div v-if="isReady" class="flight-attendant">
      <div class="form-container">
        <div class="flight-attendant-proceeding-file-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <br />
              <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
        </div>
        <div class="flight-attendant-proceeding-file-wrapper">
          <div v-for="(flightAttendantProceedingFile, index) in flightAttendantProceedingFilesList" :key="`proceeding-file-${index}`">
            <flightAttendantProceedingFileInfoCard :flightAttendantProceedingFile="flightAttendantProceedingFile"
              :click-on-edit="() => { onEdit(flightAttendantProceedingFile) }"
              :click-on-delete="() => { onDelete(flightAttendantProceedingFile) }" />
          </div>
        </div>
        <!-- Rmployee Proceeding File form -->
        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerFlightAttendantProceedingFileForm" position="right"
            class="flight-attendant-proceeding-file-form-sidebar" :showCloseIcon="true">
            <flightAttendantProceedingFileInfoForm :flightAttendantProceedingFile="flightAttendantProceedingFile"
              @onFlightAttendantProceedingFileSave="onSave" />
          </Sidebar>
        </div>
      </div>
      <Dialog v-model:visible="drawerFlightAttendantProceedingFileDelete" :style="{width: '450px'}" header="Confirm"
        :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="flightAttendantProceedingFile"> Are you sure you want to delete proceeding file at
            <b>{{`${selectedDateTimeDeleted || ''}`}}</b>
            ?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="drawerFlightAttendantProceedingFileDelete = false" />
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

  .flight-attendant-proceeding-file-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>