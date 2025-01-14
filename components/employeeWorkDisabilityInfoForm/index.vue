<template>
  <div class="work-disability-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee" />
    <h1>
      <br /><br />
      {{ isNewWorkDisability ? 'Add work disability' : 'Update work disability' }}

    </h1>

    <div v-if="isReady" class="shift-exception-form">
      <div class="form-container">

        <div v-if="!isNewWorkDisability" class="input-box">
          <label for="uuid">
            UUID
          </label>
          {{ workDisability.workDisabilityUuid.toLocaleUpperCase() }}
        </div>
        <div class="input-box">
          <label for="exception-type">
            Insurance coverage type
          </label>
          <Dropdown v-model="workDisability.insuranceCoverageTypeId" :options="insuranceCoverageTypeList"
            optionLabel="insuranceCoverageTypeName" optionValue="insuranceCoverageTypeId" placeholder="" filter
            class="w-full md:w-14rem" :disabled="!isNewWorkDisability"/>
          <small class="p-error" v-if="submitted && !workDisability.insuranceCoverageTypeId">Insurance coverage type is
            required.</small>
        </div>
        <div class="box-tools-footer">
          <Button v-if="isNewWorkDisability && canManageWorkDisability" class="btn btn-block btn-primary" @click="onSave">
            Save work disability
          </Button>
          <Button v-if="!isNewWorkDisability && canManageWorkDisability" class="btn btn-block btn-primary" @click="addNewPeriod">
            Add period
          </Button>
          <Button v-if="!isNewWorkDisability && canManageWorkDisability" class="btn btn-block btn-primary" @click="addNewNote">
            Add note
          </Button>
        </div>
        <div v-if="workDisabilityPeriodsList.length > 0" class="work-disability-periods-wrapper">
          <h1>
            Periods
          </h1>
          <div v-for="(workDisabilityPeriod, index) in workDisabilityPeriodsList"
            :key="`work-disability-period-${index}`">
            <workDisabilityPeriodInfoCard :isDeleted="isDeleted" :work-disability-period="workDisabilityPeriod"
              :click-on-edit="() => { onEdit(workDisabilityPeriod) }"
              :click-on-delete="() => { onDelete(workDisabilityPeriod) }"
              :canManageWorkDisability="canManageWorkDisability"/>
          </div>
        </div>
      <div v-if="workDisabilityNotesList.length > 0" class="work-disability-notes-wrapper">
        <h1>
          Notes
        </h1>
        <div v-for="(workDisabilityNote, index) in workDisabilityNotesList"
          :key="`work-disability-note-${index}`">
          <workDisabilityNoteInfoCard :isDeleted="isDeleted" :work-disability-note="workDisabilityNote"
            :click-on-edit="() => { onEdit(workDisabilityNote) }"
            :click-on-delete="() => { onDelete(workDisabilityNote) }"
            />
        </div>
      </div>
    </div>
      <Sidebar v-model:visible="drawerWorkDisabilityPeriodForm" header="form" position="right"
        class="work-disability-period-form-sidebar" :showCloseIcon="true">
        <employeeWorkDisabilityPeriodInfoForm :canManageWorkDisability="canManageWorkDisability"
          :workDisabilityPeriod="workDisabilityPeriod" :employee="employee"
          @onWorkDisabilityPeriodSave="onSavePeriod" />
      </Sidebar>
     <Sidebar v-model:visible="drawerWorkDisabilityNoteForm" header="form" position="right"
      class="work-disability-note-form-sidebar" :showCloseIcon="true">
      <employeeWorkDisabilityNoteInfoForm :canManageWorkDisability="canManageWorkDisability"
        :workDisabilityNote="workDisabilityNote" :employee="employee"
        @onWorkDisabilityNoteSave="onSaveNote" />
    </Sidebar>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
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

  .work-disability-period-form-sidebar {
    width: 100% !important;
    max-width: 33rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  .work-disability-note-form-sidebar {
    width: 100% !important;
    max-width: 33rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>