<template>
  <div v-if="isReady" class="employee-work-disabilities">
    <employeeModalInfoCard :employee="employee" />

    <h1>
      Employee Work Disabilities
    </h1>

    <div class="head">
      <Button v-if="displayAddButton" class="btn btn-block" @click="addNew">
        <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
        Add work disability
      </Button>
    </div>
    <div v-if="isReady">
      <div class="work-disabilities-wrapper">
        <div v-for="(workDisability, index) in workDisabilities" :key="`work-disability-${index}`">
          <workDisabilityInfoCard :isDeleted="isDeleted" :work-disability="workDisability"
            :click-on-edit="() => { onEdit(workDisability) }"
            :click-on-delete="() => { onDelete(workDisability) }"
            :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
            :canManageWorkDisabilities="canManageWorkDisabilities"
            :employee="employee"
          />
        </div>
      </div>
      <Sidebar v-model:visible="drawerWorkDisabilityForm" header="form" position="right" class="work-disability-form-sidebar" :showCloseIcon="true">
        <employeeWorkDisabilityInfoForm
          :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
          :canManageWorkDisabilities="canManageWorkDisabilities"
          :workDisability="workDisability" :employee="employee" @onWorkDisabilitySave="onSave" @save="onSave"
        />
      </Sidebar>
    </div>
    <ProgressSpinner v-else />


    <transition name="page">
      <confirmDelete
        v-if="drawerWorkDisabilityDelete"
        @confirmDelete="confirmDelete"
        @cancelDelete="drawerWorkDisabilityDelete = false"
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

  .work-disability-form-sidebar {
    width: 100% !important;
    max-width: 33rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
