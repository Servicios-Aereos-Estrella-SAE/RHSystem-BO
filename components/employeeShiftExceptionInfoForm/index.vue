<template>
  <div class="shift-exception-info-form">
    <Toast />
    
    <h1>
      {{ isNewShiftException ? 'Add shift exception' : 'Update shift exception' }}
    </h1>
    
    <div v-if="isReady" class="shift-exception-form">
      <div class="form-container">
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
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save exception
          </Button>
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