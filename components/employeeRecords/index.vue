<template>
  <div v-if="isReady" class="employee-records">
    <Toast />
    <h2>
      Employee Records
    </h2>

    <div v-if="isReady" class="employee">
      <div>
        <div class="employee-record-wrapper">
          <div v-for="(properties, category) in employeeRecordCategories" :key="category" class="panel">
            <h3>{{ category }}</h3>
            <div v-for="(property, index) in properties" :key="index" class="property">
              <label :for="'input-' + category + '-' + index">{{ property.name }}</label>
              <div v-if="property.type === 'Text'" class="input-box">
                <InputText :id="'input-' + category + '-' + index" v-model="property.value" />
              </div>

              <div v-if="property.type === 'File'" class="input-box">
                <div>
                  <label for="file">
                    File
                  </label>
                  <Button v-if="property.value" label="Open file" severity="primary"
                    @click="openFile(property.value)" /><br /><br />
                  <FileUpload v-model="property.files" name="demo[]" url="/api/upload"
                    @upload="onAdvancedUpload($event)" :custom-upload="true" :maxFileSize="1000000" :maxFileCount="1"
                    :fileLimit="1" @select="validateFiles($event,property)" :key="'file-' + index"
                    :showUploadButton="false">
                    <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                      <div v-for="(file, indexFile) in files" :key="indexFile" class="p-d-flex p-ai-center p-mb-2">
                        <img v-if="file && file.type.startsWith('image/')" role="presentation"
                          class="p-fileupload-file-thumbnail" :alt="file.name" width="50" :src="getObjectURL(file)" />
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
              </div>

              <div v-if="property.type === 'Number'" class="input-box">
                <InputNumber :id="'input-' + category + '-' + index" v-model="property.value" mode="decimal" />
              </div>

              <div v-if="property.type === 'Decimal'" class="input-box">
                <InputNumber :id="'input-' + category + '-' + index" v-model="property.value" :minFractionDigits="2"
                  fluid />
              </div>

              <div v-if="property.type === 'Currency'" class="input-box">
                <InputNumber :id="'input-' + category + '-' + index" v-model="property.value" mode="currency"
                  currency="MXN" fluid />
              </div>
            </div>
          </div>
        </div>
        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
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
  @import '/resources/styles/variables.scss';
</style>