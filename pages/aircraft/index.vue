<template>
  <div class="aircrafts-page">
    <Toast />

    <Head>
      <Title>
        Aircrafts
      </Title>
    </Head>

    <NuxtLayout name="backoffice">
      <div class="aircraft-wrapper">
        <div class="box head-page">
          <div class="input-search">
            <div class="input-box">
              <label for="search">
                Search aircraft
              </label>
              <InputText
                v-model="search"
                aria-describedby="search"
                @keypress.enter="handlerSearchAircraft"
              />
            </div>
            <button class="btn btn-block" @click="handlerSearchAircraft">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#88a4bf" class="fill-212121"></path></svg>
            </button>
          </div>

          <div></div>

          <div class="input-box">
            <Button v-if="canCreate" class="btn btn-block" @click="addNew">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
              Add Aircraft
            </Button>
          </div>
        </div>

        <div>
          <h2>
            Aircrafts
          </h2>

          <div class="aircraft-card-wrapper">
            <div v-for="(aircraft, index) in filterAircrafts" :key="`aircraft-${aircraft.aircraftId}-${index}`">
              <aircraftInfoCard
                :aircraft="aircraft"
                :can-update="canUpdate"
                :can-delete="canDelete" 
                :click-on-edit="() => { onEdit(aircraft) }"
                :click-on-delete="() => { onDelete(aircraft) }" 
                :click-on-gallery="() => {onGallery(aircraft) }"
                @openProceedingFiles="handlerOpenProceedingFiles"
                @openMaintenance="handlerOpenMaintenance"
              />
            </div>
          </div>

          <Paginator
            class="paginator"
            :first="first"
            :rows="rowsPerPage"
            :totalRecords="totalRecords"
            :alwaysShow="false"
            @page="onPageChange"
          />

          <!-- Form Aircraft -->
          <div class="card flex justify-content-center">
            <Sidebar 
              v-model:visible="drawerAircraftForm"
              header="Aircraft form"
              position="right"
              class="aircraft-form-sidebar"
              :blockScroll="true"
              :closeOnEscape="false"
              :dismissable="false"
              :showCloseIcon="true"
            >
              <aircraftInfoForm
                :aircraft="aircraft"
                @onAircraftSave="onSave"
              />
            </Sidebar>
          </div>

          <!-- Form Sidebar Gallery -->
          <div class="card flex justify-content-center">
            <Sidebar
              v-model:visible="drawerAircraftFormGallery"
              header="Aircraft Gallery"
              position="right"
              class="aircraft-form-sidebar"
              :blockScroll="true"
              :closeOnEscape="false"
              :dismissable="false"
              :showCloseIcon="true"
            >
              <genericGallery  :aircraft="aircraft" @onGallerySave="onSaveGallery" /> 
            </Sidebar>
          </div>
        </div>
      </div>

      <Sidebar
        v-model:visible="drawerProceedingFiles"
        header="Aircraft proceeding files"
        position="right"
        class="proceeding-file-sidebar"
        :blockScroll="true"
        :closeOnEscape="false"
        :dismissable="false"
        :showCloseIcon="true"
      >
        <aircraftProceedingFile :aircraft="aircraft" />
      </Sidebar>

      <Sidebar
        v-model:visible="drawerMaintenance"
        header="Aircraft Maintenances"
        position="right"
        class="proceeding-file-sidebar"
        :blockScroll="true"
        :closeOnEscape="false"
        :dismissable="false"
        :showCloseIcon="true"
      >
        <aircraftMaintenanceInfo 
          :rand="randInfo" 
          @editMaintenance="editMaintenance" 
          v-if="aircraft && drawerMaintenance" 
          :aircraft="aircraft" 
          @addMaintenance="addNewMaintenance"
        />
      </Sidebar>

      <Sidebar
        v-model:visible="drawerMaintenanceForm"
        header="Aircraft Maintenances Form"
        position="right"
        class="aircraft-maintenance-form-sidebar"
        :blockScroll="true"
        :closeOnEscape="false"
        :dismissable="false"
        :showCloseIcon="true"
      >
        <!-- <aircraftProceedingFile :aircraft="aircraft" /> -->
        <aircraftMaintenanceInfoForm :rand="randInfo" @editMaintenanceExpense="editMaintenanceExpense" @addMaintenanceExpense="addNewMaintenanceExpense" @onSave="saveAircraftMaintenance" v-if="aircraft && aircraftMaintenance" :aircraft="aircraft" :aircraftMaintenance="aircraftMaintenance"/>
      </Sidebar>

      <Sidebar
        v-model:visible="drawerMaintenanceExpense"
        header="Maintenances Expense Form"
        position="right"
        class="aircraft-maintenance-form-sidebar"
        :blockScroll="true"
        :closeOnEscape="false"
        :dismissable="false"
        :showCloseIcon="true"
      >
        <!-- <aircraftProceedingFile :aircraft="aircraft" /> -->
        <maintenanceExpenseInfoForm @onSave="saveMaintenanceExpense" v-if="maintenanceExpense" :aircraft="aircraft" :maintenanceExpense="maintenanceExpense"/>
      </Sidebar>

      <transition name="page">
        <confirmDelete
          v-if="drawerAircraftDelete"
          @confirmDelete="confirmDelete"
          @cancelDelete="drawerAircraftDelete = false"
        />
      </transition>

    </NuxtLayout>
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

  .aircraft-card-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .aircraft-form-sidebar, .aircraft-maintenance-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  
</style>