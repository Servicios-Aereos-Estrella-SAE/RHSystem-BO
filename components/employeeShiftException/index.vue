<template>
  <div v-if="isReady" class="box employee-shift-exceptions">
    <Toast />
    <h4>
      {{ employee.employeeFirstName }} {{ employee.employeeLastName }}
    </h4>
    <div v-if="isReady" class="employee">
      <div class="form-container">
        <div class="shift-exception-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="roles">
                Date range
              </label>
              <Calendar v-model="selectedDateRange" selectionMode="range" @update:model-value="handleDateChange"/>
            </div>
            <div class="input-box">
              <label for="roles">
                Exception type
              </label>
              <Dropdown v-model="selectedExceptionTypeId" :options="exceptionTypesList" optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId"
                placeholder="" filter class="w-full md:w-14rem" @change="getShiftEmployee" />
            </div>
            <div class="input-box">
              <br />
              <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
        </div>
        <div class="shift-exception-wrapper">
            <div v-for="(shiftException, index) in shiftExceptionsList" :key="`exception-${index}`">
              <employeeShiftExceptionCard
                :shiftException="shiftException"
                :click-on-edit="() => { onEdit(shiftException) }"
                :click-on-delete="() => { onDelete(shiftException) }" 
              />
          </div>
        </div>
         <!-- ShiftException form -->
         <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerShiftExceptionForm" position="right" class="shift-exception-form-sidebar" :showCloseIcon="true">
            <employeeShiftExceptionInfoForm :shiftException="shiftException" @onShiftExceptionSave="onSave" />
          </Sidebar>
        </div>
      </div>
      <Dialog v-model:visible="drawerShiftExceptionDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="shiftException"> Are you sure you want to delete
            <b>{{`${shiftException.shiftExceptionsDescription || ''}`}}</b>
             in <b>{{`${selectedDateTimeDeleted || ''}`}}</b>
            ?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="drawerShiftExceptionDelete = false" />
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
</style>