<template>
  <div class="box employee-shift-info-form">
    <Toast />
    <h4>
      {{ isNewEmployeeShift ? 'New employee shift' : 'Update employee shift' }}
    </h4>
    <div v-if="isReady" class="employee-shift-form">
      <div class="form-container">
        <div class="input-box">
          <label for="shift">
            Shift
          </label>
          <Dropdown v-model="employeeShift.shiftId" :options="shiftList" optionLabel="shiftName" optionValue="shiftId"
          placeholder="" filter class="w-full md:w-14rem"/>
          <small class="p-error" v-if="submitted && !employeeShift.shiftId">Shift is required.</small>
        </div>
        <div class="input-box">
          <label for="date">
            Date
          </label>
          <Calendar v-model="employeeShift.employeShiftsApplySince" @update:model-value="handleDateChange"/>
          <small class="p-error" v-if="submitted && !employeeShift.employeShiftsApplySince">Date is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
      </div>
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