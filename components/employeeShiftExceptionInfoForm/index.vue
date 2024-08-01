<template>
  <div class="box shift-exception-info-form">
    <Toast />
    <h4>
      {{ isNewShiftException ? 'New shift exception' : 'Update shift exception' }}
    </h4>
    <div v-if="isReady" class="shift-exception-form">
      <div class="form-container">
        <div class="input-box">
          <label for="exception-type">
            Exception type
          </label>
          <Dropdown v-model="shiftException.exceptionTypeId" :options="exceptionTypeList" optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId"
          placeholder="" filter class="w-full md:w-14rem"/>
          <small class="p-error" v-if="submitted && !shiftException.exceptionTypeId">Exception type is required.</small>
        </div>
        <div class="input-box">
          <label for="date">
            Date
          </label>
          <Calendar v-model="shiftException.shiftExceptionsDate" showTime hourFormat="24" @update:model-value="handleDateChange"/>
          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionsDate">Date is required.</small>
        </div>
        <div class="input-box">
          <label for="description">
            Description</label>
            <Textarea v-model="shiftException.shiftExceptionsDescription" rows="5" cols="30" />

          <small class="p-error" v-if="submitted && !shiftException.shiftExceptionsDescription">Descritpion is required.</small>
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