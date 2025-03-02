<template>
  <div v-if="isReady" class="box maintenance-shifts">
    <Toast />
    <!-- <Calendar view="month" dateFormat="MM" /> -->
    <div class="head-maintenance">
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
          :disabled="!isEdit"
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
          <Calendar hourFormat="12" showTime placeholder="Select Start Date" v-model="aircraftMaintenance.aircraftMaintenanceStartDate"/>
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
          <Calendar hourFormat="12" showTime placeholder="Select Start Date" v-model="aircraftMaintenance.aircraftMaintenanceEndDate"/>
          <small class="p-error" v-if="submitted && !aircraftMaintenance.aircraftMaintenanceEndDate">
            Maintenance End Date is required.
          </small>
        </div>
      </div>
      <div class="input-box" v-show="isEdit && aircraftMaintenance.aircraftMaintenanceStatusId === IdStatusCompleted">
        <label for="maintenanceType">
          Maintenance Finish Date
        </label>
        <div class="hire-date-box-controller">
          <Calendar hourFormat="12" showTime placeholder="Select Start Date" v-model="aircraftMaintenance.aircraftMaintenanceFinishDate"/>
          <small class="p-error" v-if="submitted && !aircraftMaintenance.aircraftMaintenanceFinishDate && isEdit && aircraftMaintenance.aircraftMaintenanceStatusId === IdStatusCompleted">
            Maintenance Finish Date is required.
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
          <Button v-if="aircraftMaintenance.aircraftMaintenanceId" label="Add maintenance expense" severity="primary" @click="hnadleAddNewMaintenanceExpense" />
      </div>
      <div class="subhead-maintenance" v-if="maintenanceExpenses.length > 0">
          <div></div>
          <div class="month-year">
            <span v-show="!displayInputCalendar" class="text">
              Maintenance Expenses
            </span>
          </div>
          <div></div>
      </div>
      <div class="expense-wrapper">
        <maintenanceExpenseInfoCard
          v-for="(maintenanceExpense, index) in maintenanceExpenses"
          :key="`maintenance-expense-${maintenanceExpense.maintenanceExpenseId}-${index}`"
          :maintenance-expense="maintenanceExpense"
          :can-update="true"
          :can-delete="true"
          @click-on-edit="onEditMaintenanceExpense"
          @click-on-delete="onDeleteMaintenanceExpense"
        />
      </div>
    </div>
  </div>
  <div v-else class="loader">
    <ProgressSpinner />
  </div>
  <transition name="page">
    <confirmDelete
      v-if="drawerMaintenanceDelete"
      @confirmDelete="deleteMaintenanceExpense"
      @cancelDelete="drawerMaintenanceDelete = false"
    />
  </transition>
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
</style>