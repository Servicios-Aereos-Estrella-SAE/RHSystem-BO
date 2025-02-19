<template>
  <div v-if="isReady" class="box employee-shifts">
    <Toast />
    <!-- <Calendar view="month" dateFormat="MM" /> -->
    <div class="head-calendar">
      <div></div>
      <div></div>
      <div class="month-year">
        <span v-show="!displayInputCalendar" class="text">
          Aircraft Maintenance
        </span>
      </div>
    </div>
    <div class="form-container">
      <div class="input-box">
        <label for="maintenanceType">
          Maintenance Type
        </label>
        <Dropdown
          :options="maintenanceTypes"
          optionLabel="maintenanceTypeName"
          optionValue="maintenanceTypeId"
          placeholder="Select a Maintenance Type" filter 
          class="w-full md:w-14rem" v-model="aircraftMaintenance.maintenanceTypeId" 
          :invalid="submitted && !aircraftMaintenance.maintenanceTypeId" />
        <small class="p-error" v-if="submitted && !aircraftMaintenance.maintenanceTypeId">
          Maintenance Type is required.
        </small>
      </div>
      <div class="input-box">
        <label for="maintenanceType">
          Priority Level
        </label>
        <Dropdown
          :options="maintenanceUrgencyLevels"
          optionLabel="maintenanceUrgencyLevelName"
          optionValue="maintenanceUrgencyLevelId"
          placeholder="Select a Priority Level" filter 
          class="w-full md:w-14rem" 
          v-model="aircraftMaintenance.maintenanceUrgencyLevelId"
          :invalid="submitted && !aircraftMaintenance.maintenanceUrgencyLevelId" />
        <small class="p-error" v-if="submitted && !aircraftMaintenance.maintenanceUrgencyLevelId">
          Priority Level is required.
        </small>
      </div>

      <div class="input-box">
        <label for="maintenanceType">
          Maintenance Status
        </label>
        <Dropdown
          :options="aircraftMaintenanceStatuses"
          optionLabel="aircraftMaintenanceStatusName"
          optionValue="aircraftMaintenanceStatusId"
          placeholder="Select a maintenance status" filter 
          class="w-full md:w-14rem" 
          v-model="aircraftMaintenance.aircraftMaintenanceStatusId" 
          :invalid="submitted && !aircraftMaintenance.aircraftMaintenanceStatusId" />
        <small class="p-error" v-if="submitted && !aircraftMaintenance.aircraftMaintenanceStatusId">
          Maintenance Status is required.
        </small>
      </div>
      <div class="input-box">
        <label for="maintenanceType">
          Maintenance Start Date
        </label>
        <div class="hire-date-box-controller">
          <Calendar placeholder="Select Start Date" v-model="aircraftMaintenance.aircraftMaintenanceStartDate"/>
          <small class="p-error" v-if="submitted && !aircraftMaintenance.aircraftMaintenanceStartDate">
            Maintenance Start Date is required.
          </small>
        </div>
      </div>
      <div class="input-box">
        <label for="maintenanceType">
          Maintenance End Date
        </label>
        <div class="hire-date-box-controller">
          <Calendar placeholder="Select Start Date" v-model="aircraftMaintenance.aircraftMaintenanceEndDate"/>
          <small class="p-error" v-if="submitted && !aircraftMaintenance.aircraftMaintenanceEndDate">
            Maintenance End Date is required.
          </small>
        </div>
      </div>
      <div class="input-box">
          <label for="proceedingFileObservations">Description</label>
          <Textarea id="proceedingFileObservations"  autoResize
            rows="3" type="text" v-model="aircraftMaintenance.aircraftMaintenanceNotes" placeholder="Description Optional" />
      </div>
      <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
      </div>
    </div>
  </div>
  <div v-else class="loader">
    <ProgressSpinner />
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

  .employee-shift-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .shift-exception-sidebar {
    width: 100% !important;
    max-width: 33rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .shift-vacations-sidebar {
    width: 100% !important;
    max-width: 27rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .shift-vacations-manage-sidebar {
    width: 100% !important;
    max-width: 27rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .work-disabilities-sidebar {
    width: 100% !important;
    max-width: 33rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>