<template>
  <div class="box employee-proceeding-file-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h4>
      {{ isNewEmployeeProceedingFile ? 'New employee proceeding file' : 'Update employee proceeding file' }}
    </h4>
    <div v-if="isReady" class="employee-proceeding-file-form">
      <div class="form-container">
        <div v-if="!employeeProceedingFile.proceedingFile?.proceedingFileTypeId" class="input-box">
          <label for="proceeding-file">
            Type
          </label>
          <Dropdown v-model="proceedingFile.proceedingFileTypeId" :options="proceedingFileTypesList"
            optionLabel="proceedingFileTypeName" optionValue="proceedingFileTypeId" placeholder="" filter
            class="w-full md:w-14rem" :invalid="submitted && !proceedingFile.proceedingFileTypeId"
            :disabled="!canManageFiles" />
          <small class="p-error" v-if="submitted && !proceedingFile.proceedingFileTypeId">Type is required.</small>
        </div>
        <div class="input-box">
          <label for="proceeding-file">
            Proceeding file
          </label>
          <Button v-if="proceedingFile.proceedingFilePath" label="Open file" severity="primary" @click="openFile()" />
          <FileUpload v-if="canManageFiles" v-model="files" name="demo[]" url="/api/upload"
            @upload="onAdvancedUpload($event)" :custom-upload="true" :maxFileSize="1000000" :fileLimit="1"
            @select="validateFiles" :disabled="!canManageFiles">
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
          <InputText id="proceedingFileName" v-model="proceedingFile.proceedingFileName" :disabled="!canManageFiles" />
        </div>
        <div class="input-box">
          <div class="date-box-container">
            <label>Expiration at</label>
            <div v-if="!displayExpirationAtCalendar" class="date-box">
              <InputText v-model="expirationAt" readonly class="capitalize" :disabled="!canManageFiles" />
              <Button v-if="canManageFiles" type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="handlerDisplayExpirationAt">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayExpirationAtCalendar" class="date-box-controller">
              <Calendar v-if="displayExpirationAtCalendar" dateFormat="yy-mm-dd"
                v-model.lazy="proceedingFile.proceedingFileExpirationAt" placeholder="Select expiration at date"
                :disabled="!canManageFiles" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="displayExpirationAtCalendar = false" :disabled="!canManageFiles">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>
        <div class="input-box">
          <label for="proceedingFileObservations">Observations</label>
          <Textarea id="proceedingFileObservations" v-model="proceedingFile.proceedingFileObservations" autoResize
            rows="3" :disabled="!canManageFiles" />
        </div>
        <div>
          <div class="employee-record-wrapper">
            <div v-for="(properties, indexCategory) in proceedingFileTypePropertyCategories" :key="indexCategory"
              class="inputs-group">
              <div v-for="(property, indexProperty) in properties" :key="indexProperty" class="property">
                <div class="property-value-wrapper">
                  <div v-for="(value, indexValue) in property.values" :key="indexValue" class="property-value">
                    <div class="input">
                      <div class="input-box">
                        <label for="proceeding-file-property">
                          {{ property.name }}
                        </label>
                        <div v-if="property.type === 'Text'">
                          <InputText :id="'input-' + indexCategory + '-' + indexProperty"
                            v-model="value.proceedingFileTypePropertyValueValue" />
                        </div>
                        <div v-if="property.type === 'File'" class="input-box">
                          <Button v-if="value.proceedingFileTypePropertyValueValue" label="Open file" severity="primary"
                            @click="openFileProperty(value.proceedingFileTypePropertyValueValue)" /><br
                            v-if="value.proceedingFileTypePropertyValueValue" />
                          <FileUpload v-model="value.files" name="demo[]" url="/api/upload"
                            @upload="onAdvancedUpload($event)" :custom-upload="true" :maxFileSize="1000000"
                            :maxFileCount="1" :fileLimit="1" @select="validateFilesProperty($event, value)"
                            :key="'file-' + indexCategory + '-' + indexProperty" :showUploadButton="false">
                            <template #content="{ files, removeFileCallback }">
                              <div v-for="(file, indexFile) in files"
                                :key="indexFile + '-' + indexCategory + '-' + indexProperty"
                                class="p-d-flex p-ai-center p-mb-2">
                                <img v-if="file && file.type.startsWith('image/')" role="presentation"
                                  class="p-fileupload-file-thumbnail" :alt="file.name" width="50"
                                  :src="getObjectURLProperty(file)" />
                                <span v-if="file">{{ file.name }}</span>
                                <Button v-if="file" @click="removeFileCallback(indexFile)"
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
                        <div v-if="property.type === 'Number'">
                          <InputNumber :id="'input-' + indexCategory + '-' + indexProperty"
                            v-model="value.proceedingFileTypePropertyValueValue" mode="decimal" />
                        </div>
                        <div v-if="property.type === 'Decimal'">
                          <InputNumber :id="'input-' + indexCategory + '-' + indexProperty"
                            v-model="value.proceedingFileTypePropertyValueValue" :minFractionDigits="2" fluid />
                        </div>
                        <div v-if="property.type === 'Currency'">
                          <InputNumber :id="'input-' + indexCategory + '-' + indexProperty"
                            v-model="value.proceedingFileTypePropertyValueValue" mode="currency" currency="MXN" fluid />
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-tools-footer">
          <Button v-if="canManageFiles" label="Save" severity="primary" @click="onSave()" />
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
