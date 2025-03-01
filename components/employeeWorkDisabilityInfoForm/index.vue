<template>
  <div class="work-disability-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewWorkDisability ? 'Add work disability' : 'Update work disability' }}
    </h1>

    <div v-if="isReady" class="shift-exception-form">
      <div class="form-container">
        <div class="input-box">
          <label for="exception-type">
            Insurance coverage type
          </label>
          <Dropdown v-model="workDisability.insuranceCoverageTypeId" :options="insuranceCoverageTypeList"
            optionLabel="insuranceCoverageTypeName" optionValue="insuranceCoverageTypeId" placeholder="" filter
            class="w-full md:w-14rem" :disabled="!canManageWorkDisabilities || !canManageCurrentPeriod" />
          <small class="p-error" v-if="submitted && !workDisability.insuranceCoverageTypeId">
            Insurance coverage type is
            required.
          </small>
        </div>
        <div v-if="!isNewWorkDisability" class="input-box uuid">
          <label for="uuid">
            UUID:
            <span>
              {{ workDisability.workDisabilityUuid.toLocaleUpperCase() }}
            </span>
          </label>
        </div>
        <div class="box-tools-footer">
          <Button v-if="!isNewWorkDisability && canManageWorkDisabilities" class="btn btn-block" @click="addNewPeriod">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 8.5v9.25A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18ZM7.25 15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM12 15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-4.75-4.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4.75 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4.75 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm1-7.5A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
            Add period
          </Button>
          <Button v-if="!isNewWorkDisability && canManageWorkDisabilities" class="btn btn-block" @click="addNewNote">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0ZM7 7l.001 2.504a.5.5 0 0 1-1 0V7H3.496a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 1 0V6h2.503a.5.5 0 0 1 0 1H7.001Z" fill="#88a4bf" class="fill-212121"></path><path d="M6.5 13a6.5 6.5 0 0 0 5.478-10h5.772A3.25 3.25 0 0 1 21 6.25V13h-4.75A3.25 3.25 0 0 0 13 16.25V21H6.25A3.25 3.25 0 0 1 3 17.75v-5.772A6.47 6.47 0 0 0 6.5 13Z" fill="#88a4bf" class="fill-212121"></path><path d="m20.56 14.5-6.06 6.06v-4.31c0-.966.784-1.75 1.75-1.75h4.31Z" fill="#88a4bf" class="fill-212121"></path></svg>
            Add note
          </Button>
          <Button v-if="canManageWorkDisabilities && canManageCurrentPeriod" class="btn btn-block btn-primary" @click="onSave">
            <svg viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"><path d="M10 18c-.5 0-1-.2-1.4-.6l-4-4c-.8-.8-.8-2 0-2.8.8-.8 2.1-.8 2.8 0l2.6 2.6 6.6-6.6c.8-.8 2-.8 2.8 0 .8.8.8 2 0 2.8l-8 8c-.4.4-.9.6-1.4.6z" fill="#fff" class="fill-000000"></path></svg>
            {{ isNewWorkDisability ? 'Save' : 'Update' }}
          </Button>
        </div>

        <div>
          <div v-if="workDisabilityPeriodsList.length > 0">
            <h2>
              Periods for shift exceptions
            </h2>
            <div class="work-disability-periods-wrapper">
              <workDisabilityPeriodInfoCard
                v-for="(workDisabilityPeriod, index) in workDisabilityPeriodsList"
                :key="`work-disability-period-${index}`"
                :isDeleted="isDeleted"
                :work-disability-period="workDisabilityPeriod"
                :click-on-edit="() => { onEditPeriod(workDisabilityPeriod) }"
                :click-on-delete="() => { onDeletePeriod(workDisabilityPeriod) }"
                :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
                :canManageWorkDisabilities="canManageWorkDisabilities"
              />
            </div>
          </div>

          <div v-if="workDisabilityNotesList.length > 0">
            <h2>
              Notes
            </h2>
            <div v-for="(workDisabilityNote, index) in workDisabilityNotesList" :key="`work-disability-note-${index}`">
              <workDisabilityNoteInfoCard 
                :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
                :canManageWorkDisabilities="canManageWorkDisabilities" :isDeleted="isDeleted"
                :work-disability-note="workDisabilityNote" :click-on-edit="() => { onEditNote(workDisabilityNote) }"
                :click-on-delete="() => { onDeleteNote(workDisabilityNote) }" 
              />
            </div>
          </div>
        </div>
      </div>

      <Sidebar v-model:visible="drawerWorkDisabilityPeriodForm" header="form" position="right"
        class="work-disability-period-form-sidebar" :showCloseIcon="true">
        <employeeWorkDisabilityPeriodInfoForm 
          :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
          :canManageWorkDisabilities="canManageWorkDisabilities"
          :workDisabilityPeriod="workDisabilityPeriod" :employee="employee"
          :workDisability="workDisability"
          @onWorkDisabilityPeriodSave="onSavePeriod" />
      </Sidebar>
      <Sidebar v-model:visible="drawerWorkDisabilityNoteForm" header="form" position="right"
        class="work-disability-note-form-sidebar" :showCloseIcon="true">
        <employeeWorkDisabilityNoteInfoForm
          :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
          :canManageWorkDisabilities="canManageWorkDisabilities"
          :workDisabilityNote="workDisabilityNote" :employee="employee" @onWorkDisabilityNoteSave="onSaveNote" />
      </Sidebar>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
    </div>
    <transition name="page">
      <confirmDelete v-if="drawerWorkDisabilityPeriodDelete" @confirmDelete="confirmDeletePeriod"
        @cancelDelete="drawerWorkDisabilityPeriodDelete = false" />
    </transition>
    <transition name="page">
      <confirmDelete v-if="drawerWorkDisabilityNoteDelete" @confirmDelete="confirmDeleteNote"
        @cancelDelete="drawerWorkDisabilityNoteDelete = false" />
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