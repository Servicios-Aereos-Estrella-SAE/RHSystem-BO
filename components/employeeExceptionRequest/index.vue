<template>
  <div v-if="isReady" class="employee-exception-request">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      Exception requests to
      {{ selectedExceptionDate }}
    </h1>

    <div v-if="isReady" class="employee">
      <div class="">
        <div v-if="!isDeleted && canManageException && canManageUserResponsible"
          class="employee-exception-request-wrapper">
          <div class="head-page">
            <div class="input-box">
              <Button class="btn btn-block" @click="addNew">
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                    fill="#88a4bf" class="fill-000000"></path>
                </svg>
                Add exception
              </Button>
            </div>
          </div>
        </div>
        <div v-if="exceptionRequestsList.length > 0" class="employee-exception-request-wrapper">
          <div v-for="(exceptionRequest, index) in exceptionRequestsList" :key="`exception-${index}`">
            <employeeExceptionRequestCard :exceptionRequest="exceptionRequest" :isDeleted="isDeleted"
              :canManageException="canManageException" :canManageUserResponsible="canManageUserResponsible"
              :click-on-edit-exception="() => { onEdit(exceptionRequest) }"
              :click-on-delete-exception="() => { onDelete(exceptionRequest) }" />
          </div>
        </div>
        <div v-else class="employee-exception-request-wrapper">
          <div class="empty-data">
            No exceptions
          </div>
        </div>
      </div>
    </div>

    <Sidebar v-model:visible="drawerExceptionRequestForm" header="form" position="right"
      class="exception-request-form-sidebar" :showCloseIcon="true">
      <employeeExceptionRequestInfoForm :exception-request="exceptionRequest" :employee="employee" :date="date"
        :canManageUserResponsible="canManageUserResponsible" @onExceptionRequestSave="onSave"
        @onExceptionRequestSaveAll="onSaveAll" />
    </Sidebar>

    <transition name="page">
      <confirmDelete v-if="drawerExceptionRequestDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerExceptionRequestDelete = false" />
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

  .exception-request-form-sidebar {
    width: 100% !important;
    max-width: 30rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>