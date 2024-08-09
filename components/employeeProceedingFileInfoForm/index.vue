<template>
  <div class="box employee-proceeding-file-info-form">
    <Toast />
    <h4>
      {{ isNewEmployeeProceedingFile ? 'New employee proceeding file' : 'Update employee proceeding file' }}
    </h4>
    <div v-if="isReady" class="employee-proceeding-file-form">
      <div class="form-container">
        <div class="input-box">
          <label for="userActive">
            {{ activeSwicht ? 'Active' : 'Inactive' }}</label>
          <InputSwitch v-model="activeSwicht" />
        </div>
        <div class="input-box">
          <label for="proceeding-file">
            Type
          </label>
          <Dropdown v-model="proceedingFile.proceedingFileTypeId" :options="proceedingFileTypesList" optionLabel="proceedingFileTypeName" optionValue="proceedingFileTypeId"
          placeholder="" filter class="w-full md:w-14rem"/>
          <small class="p-error" v-if="submitted && !proceedingFile.proceedingFileTypeId">Type is required.</small>
        </div>
        <div class="input-box">
          <label for="proceeding-file">
            Proceeding file
          </label>
          <Button v-if="proceedingFile.proceedingFilePath" label="Open file" link @click="openFile()"/>
          <FileUpload v-model="files" name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :custom-upload="true"
           :maxFileSize="1000000" :fileLimit="1" @select="validateFiles">
            <template #empty>
                <p>Drag and drop file to here to upload.</p>
            </template>
        </FileUpload>
        </div>
        <div class="input-box">
          <label for="proceedingFileName">Name</label>
          <InputText id="proceedingFileName" v-model="proceedingFile.proceedingFileName"/>
        </div>
        <div class="input-box">
          <label for="proceedingFileIdentify">Identify</label>
          <InputText id="proceedingFileIdentify" v-model="proceedingFile.proceedingFileIdentify"/>
        </div>
        <div class="input-box">
          <label for="proceedingFileExpirationAt">Expiration at</label>
          <Calendar v-model="proceedingFile.proceedingFileExpirationAt" @update:model-value="formatDate" dateFormat="yy-mm-dd"/>
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
<style scoped>
  /deep/ .p-button[aria-label="Upload"] {
    display: none;
  }
  /deep/ .p-button[aria-label="Cancel"] {
    display: none;
  }
  </style>