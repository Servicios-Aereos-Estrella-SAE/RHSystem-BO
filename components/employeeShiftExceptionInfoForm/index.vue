<template>
  <div class="shift-exception-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee"/>
    <h1>
      {{ isNewShiftException ? 'Add shift exception' : 'Update shift exception' }}
    </h1>
    
    <div v-if="isReady" class="shift-exception-form">
      <div class="form-container">
        <div v-if="!shiftException.shiftExceptionId" class="input-box">
          <label for="exception-type">
          </label>
          <div class="checkbox-item">
            <Checkbox v-model="applyToMoreThanOneDay" inputId="applyToMoreThanOneDay" name="applyToMoreThanOneDay" :binary="true" />
            <label for="applyToMoreThanOneDay" class="ml-2"> Apply to more than one day </label>
          </div>
        </div>
        <div v-if="applyToMoreThanOneDay" class="input-box">
          <label for="description">
            Days to apply
          </label>
          <InputNumber v-model="shiftException.daysToApply" inputId="daysToApply" prefix="Apply to " suffix=" days" />
          <small class="p-error" v-if="submitted && !shiftException.daysToApply">
            Days to apply is required.
          </small>
        </div>
        <div class="input-box">
          <label for="exception-type">
            Exception type
          </label>
          <Dropdown v-model="shiftException.exceptionTypeId" :options="exceptionTypeList" optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId"
          placeholder="" filter class="w-full md:w-14rem" @update:model-value="handleTypeChange"/>
          <small class="p-error" v-if="submitted && !shiftException.exceptionTypeId">Exception type is required.</small>
        </div>
        <div class="input-box">
          <label for="description">
            Description
          </label>
          <Textarea v-model="shiftException.shiftExceptionsDescription" rows="5" cols="30" />
          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionsDescription">
            Descritpion is required.
          </small>
        </div>
        <div v-if="needCheckInTime" class="input-box">
          <label for="check-in-time">
            Check in time
          </label>
          <Calendar v-model="shiftException.shiftExceptionCheckInTime" timeOnly />
          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionCheckInTime">
            Check in time is required.
          </small>
        </div>
        <div v-if="needCheckOutTime" class="input-box">
          <label for="check-out-time">
            Check out time
          </label>
          <Calendar v-model="shiftException.shiftExceptionCheckOutTime" timeOnly />
          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionCheckOutTime">
            Check out time is required.
          </small>
        </div>
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save exception
          </Button>
        </div>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
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