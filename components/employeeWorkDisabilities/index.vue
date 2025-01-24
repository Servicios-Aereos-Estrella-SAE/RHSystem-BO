<template>
  <div v-if="isReady" class="employee-work-disabilities">
    <employeeModalInfoCard :employee="employee" />

    <h1>
      Employee Work Disabilities
    </h1>
    <div class="head">
      <Button v-if="canManageWorkDisability && !isDeleted && canManageWorkDisability" class="btn btn-block" @click="addNew">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
        Add work disability
      </Button>
    </div>
    <div v-if="isReady">
      <div class="work-disabilities-wrapper">
        <div v-for="(workDisability, index) in workDisabilities" :key="`work-disability-${index}`">
          <workDisabilityInfoCard :isDeleted="isDeleted" :work-disability="workDisability"
            :click-on-edit="() => { onEdit(workDisability) }" :click-on-delete="() => { onDelete(workDisability) }"
            :canManageWorkDisability="canManageWorkDisability" />
        </div>
      </div>
      <Sidebar v-model:visible="drawerWorkDisabilityForm" header="form" position="right"
      class="work-disability-form-sidebar" :showCloseIcon="true">
      <employeeWorkDisabilityInfoForm :canManageWorkDisability="canManageWorkDisability"
        :workDisability="workDisability" :employee="employee" @onWorkDisabilitySave="onSave" @save="onSave" />
    </Sidebar>
    </div>
    <ProgressSpinner v-else />
   

    <transition name="page">
      <confirmDelete v-if="drawerWorkDisabilityDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerWorkDisabilityDelete = false" />
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