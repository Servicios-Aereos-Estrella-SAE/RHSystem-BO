<template>
  <div v-if="isReady" class="box employee-shifts">
    <Toast />
    <h4>
      {{ employee.employeeFirstName }} {{ employee.employeeLastName }}
    </h4>
    <div v-if="isReady" class="employee">
      <div class="form-container">
        <div class="employee-shift-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="roles">
                Date range
              </label>
              <Calendar v-model="selectedDateRange" selectionMode="range" @update:model-value="handleDateChange"/>
            </div>
            <div class="input-box">
              <label for="roles">
                Shift
              </label>
              <Dropdown v-model="selectedShiftId" :options="shiftsList" optionLabel="shiftName" optionValue="shiftId"
                placeholder="" filter class="w-full md:w-14rem" @change="getEmployeeShift" />
            </div>
            <div class="input-box">
              <br />
              <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
        </div>
        <div class="employee-shift-wrapper">
          <div v-for="(employeeShift, index) in employeeShiftsList" :key="`shift-${index}`">
            <employeeShiftInfoCard
              :employeeShift="employeeShift"
              :click-on-edit="() => { onEdit(employeeShift) }"
              :click-on-delete="() => { onDelete(employeeShift) }" 
            />
          </div>
        </div>

         <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerEmployeeShiftForm" position="right" class="employee-shift-form-sidebar" :showCloseIcon="true">
            <employeeShiftInfoForm :employeeShift="employeeShift" @onEmployeeShiftSave="onSave" />
          </Sidebar>
        </div>
      </div>

      <Dialog v-model:visible="drawerEmployeeShiftDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="employeeShift">
            Are you sure you want to delete shift at
            <b>{{`${selectedDateTimeDeleted || ''}`}}</b>
            ?
          </span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="drawerEmployeeShiftDelete = false" />
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

  .employee-shift-form-sidebar{
    width: 100% !important;
    max-width: 35rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>