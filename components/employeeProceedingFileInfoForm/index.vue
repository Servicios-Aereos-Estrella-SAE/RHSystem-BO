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
          <Dropdown v-model="proceedingFile.proceedingFileTypeId" :options="proceedingFileTypesList"
            optionLabel="proceedingFileTypeName" optionValue="proceedingFileTypeId" placeholder="" filter
            class="w-full md:w-14rem" :invalid="submitted && !proceedingFile.proceedingFileTypeId" />
          <small class="p-error" v-if="submitted && !proceedingFile.proceedingFileTypeId">Type is required.</small>
        </div>
        <div class="input-box">
          <label for="proceeding-file">
            Proceeding file
          </label>
          <Button v-if="proceedingFile.proceedingFilePath" label="Open file" severity="primary" @click="openFile()" />
          <FileUpload v-model="files" name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"
            :custom-upload="true" :maxFileSize="1000000" :fileLimit="1" @select="validateFiles">
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
              <div v-for="(file, index) in files" :key="index" class="p-d-flex p-ai-center p-mb-2">
                <img v-if="file && file.type.startsWith('image/')" role="presentation"
                  class="p-fileupload-file-thumbnail" :alt="file.name" width="50" :src="getObjectURL(file)" />
                <span v-if="file">{{ file.name }}</span>
                <Button v-if="file" @click="removeFileCallback(index)"
                  class="p-ml-auto p-button p-component p-button-text">
                  <span class="p-button-icon pi pi-times"></span>
                </Button>
              </div>
            </template>
            <template #empty>
              <p>Drag and drop file to here to upload.</p>
            </template>
          </FileUpload>
        </div>
        <div class="input-box">
          <label for="proceedingFileName">Name</label>
          <InputText id="proceedingFileName" v-model="proceedingFile.proceedingFileName" />
        </div>
        <div class="input-box">
          <label for="proceedingFileIdentify">Identify</label>
          <InputText id="proceedingFileIdentify" v-model="proceedingFile.proceedingFileIdentify" />
        </div>
        <div class="input-box">
          <label for="proceedingFileExpirationAt">Expiration at</label>
          <Calendar v-model="proceedingFile.proceedingFileExpirationAt" dateFormat="yy-mm-dd" @update:model-value="formatDate('proceedingFileExpirationAt')"
             />
        </div>
        <div class="input-box">
          <label for="proceedingFileObservations">Observations</label>
          <Textarea id="proceedingFileObservations" v-model="proceedingFile.proceedingFileObservations" autoResize rows="3"
               />
      </div>
      <div class="input-box">
        <label for="proceedingFileAfacRights">AFAC rights</label>
        <InputText id="proceedingFileAfacRights" v-model="proceedingFile.proceedingFileAfacRights" />
      </div>
      <div class="input-box">
        <label for="proceedingFileSignatureDate">Signature date</label>
        <Calendar v-model="proceedingFile.proceedingFileSignatureDate" @update:model-value="formatDate('proceedingFileSignatureDate')"
          dateFormat="yy-mm-dd" />
      </div>
      <div class="input-box">
        <label for="proceedingFileEffectiveStartDate">Effective start date</label>
        <Calendar v-model="proceedingFile.proceedingFileEffectiveStartDate" @update:model-value="formatDate('proceedingFileEffectiveStartDate')"
          dateFormat="yy-mm-dd" />
      </div>
      <div class="input-box">
        <label for="proceedingFileEffectiveEndDate">Effective end date</label>
        <Calendar v-model="proceedingFile.proceedingFileEffectiveEndDate" @update:model-value="formatDate('proceedingFileEffectiveEndDate')"
          dateFormat="yy-mm-dd" />
      </div>
      <div class="input-box">
        <label for="proceedingFileInclusionInTheFilesDate">Inclusion in the files date</label>
        <Calendar v-model="proceedingFile.proceedingFileInclusionInTheFilesDate" @update:model-value="formatDate('proceedingFileInclusionInTheFilesDate')"
          dateFormat="yy-mm-dd" />
      </div>
      <div class="input-box">
        <label for="proceedingFileOperationCost">Operation cost</label>
        <InputNumber v-model="proceedingFile.proceedingFileOperationCost" :minFractionDigits="2" fluid />
      </div>
      <div class="input-box">
        <label for="proceedingFileCompleteProcess">
          {{ processCompleteSwicht ? 'Complete process' : 'Incomplete process' }}</label>
        <InputSwitch v-model="processCompleteSwicht" />
      </div>
      <div class="input-box">
        <label for="proceeding-file">
          Status
        </label>
        <Dropdown v-model="proceedingFile.proceedingFileStatusId" :options="proceedingFileStatusList"
          optionLabel="proceedingFileStatusName" optionValue="proceedingFileStatusId" placeholder="" filter
          class="w-full md:w-14rem" />
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
  :deep(.p-button)[aria-label="Upload"] {
    display: none;
  }

  :deep(.p-button)[aria-label="Cancel"] {
    display: none;
  }

  :deep(.p-button)[aria-label="Choose"] {
    display: block;
  }
</style>