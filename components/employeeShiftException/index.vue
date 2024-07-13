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
            <div v-for="(item, index) in shiftExceptionsList" :key="`exception-${index}`">
              <employeeShiftExceptionCard
                :shiftException="item"
              />
          </div>
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