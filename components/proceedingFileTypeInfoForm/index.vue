<template>
  <div class="box proceeding-file-type-info-form">
    <Toast />
    <h4>
      {{ isNewProceedingFileType ? 'New proceeding file type' : 'Update proceeding file type' }}
    </h4>
    <div v-if="isReady" class="form">
      <div class="input-box">
        <label for="aircraftActive">
          {{ activeSwicht ? 'Active' : 'Inactive' }}
        </label>
        <InputSwitch v-model="activeSwicht" />
      </div>
      <div class="input-box">
        <label for="firstName">Name</label>
        <InputText v-model="proceedingFileType.proceedingFileTypeName" placeholder="Enter Name" />
        <small class="p-error" v-if="submitted && !proceedingFileType.proceedingFileTypeName">Name is required.</small>
      </div>
      <div class="input-box">
        <label for="firstName">Slug</label>
        <InputText v-model="proceedingFileType.proceedingFileTypeSlug" placeholder="Enter Slug" />
        <small class="p-error" v-if="submitted && !proceedingFileType.proceedingFileTypeSlug">Slug is required.</small>
      </div>
      <div class="input-box">
        <label for="proceeding-file">
          Area to Use
        </label>
        <Dropdown v-model="proceedingFileType.proceedingFileTypeAreaToUse" :options="proceedingFileTypeAreaToUseList"
          optionLabel="proceedingFileTypeAreaToUse" optionValue="proceedingFileTypeAreaToUse" placeholder="" filter
          class="w-full md:w-14rem" :invalid="submitted && !proceedingFileType.proceedingFileTypeAreaToUse" />
        <small class="p-error" v-if="submitted && !proceedingFileType.proceedingFileTypeAreaToUse">Area to use is
          required.</small>
      </div>
      <div class="box-tools-footer">
        <Button label="Save" severity="primary" @click="onSave()" />
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

<style scoped>
  :deep(p-button)[aria-label="Upload"] {
    display: none;
  }

  :deep(p-button)[aria-label="Cancel"] {
    display: none;
  }

  :deep(p-button)[aria-label="Choose"] {
    display: block;
  }
</style>