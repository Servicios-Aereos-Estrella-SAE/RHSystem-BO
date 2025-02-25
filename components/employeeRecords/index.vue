<template>
  <div v-if="isReady" class="employee-records">
    <Toast />
    <h2>
      Employee Record
    </h2>

    <div v-if="isReady" class="employee">
      <div>
        <div class="employee-record-wrapper">
          <div v-for="(properties, indexCategory) in employeeRecordCategories" :key="indexCategory" class="panel">
            <h3>{{ indexCategory }}</h3>
            <div v-for="(property, indexProperty) in properties" :key="indexProperty" class="property">
              <div class="flex-container">
                <label :for="'input-' + indexCategory + '-' + indexProperty">{{ property.name }}</label>
                <Button class="btn btn-block" @click="addNew(property)">
                  <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                      fill="#88a4bf" class="fill-000000"></path>
                  </svg>
                </Button>
              </div>
              <div v-for="(value, indexValue) in property.values" :key="indexValue">
                <div class="dotted-line"></div>
                <div class="property-value">
                  <div v-if="property.type === 'Text'" class="input-box">
                    <InputText :id="'input-' + indexCategory + '-' + indexProperty + '-' + indexValue"
                      v-model="value.employeeRecordValue" />
                  </div>


                  <div v-if="property.type === 'File'" class="input-box">
                    <div>
                      <label for="file">
                        File
                      </label>
                      <Button v-if="value.employeeRecordValue" label="Open file" severity="primary"
                        @click="openFile(value.employeeRecordValue)" /><br /><br />
                      <FileUpload v-model="value.files" name="demo[]" url="/api/upload"
                        @upload="onAdvancedUpload($event)" :custom-upload="true" :maxFileSize="1000000"
                        :maxFileCount="1" :fileLimit="1" @select="validateFiles($event,value)"
                        :key="'file-' + indexCategory + '-' + indexProperty + '-' + indexValue"
                        :showUploadButton="false">
                        <template #content="{ files, removeFileCallback }">
                          <div v-for="(file, indexFile) in files"
                            :key="indexFile + '-' + indexCategory + '-' + indexProperty + '-' + indexValue"
                            class="p-d-flex p-ai-center p-mb-2">
                            <img v-if="file && file.type.startsWith('image/')" role="presentation"
                              class="p-fileupload-file-thumbnail" :alt="file.name" width="50"
                              :src="getObjectURL(file)" />
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
                    <InputNumber :id="'input-' + indexCategory + '-' + indexProperty + '-' + indexValue"
                      v-model="value.employeeRecordValue" mode="decimal" />
                  </div>

                  <div v-if="property.type === 'Decimal'" class="input-box">
                    <InputNumber :id="'input-' + indexCategory + '-' + indexProperty + '-' + indexValue"
                      v-model="value.employeeRecordValue" :minFractionDigits="2" fluid />
                  </div>

                  <div v-if="property.type === 'Currency'" class="input-box">
                    <InputNumber :id="'input-' + indexCategory + '-' + indexProperty + '-' + indexValue"
                      v-model="value.employeeRecordValue" mode="currency" currency="MXN" fluid />
                  </div>
                  <Button class="btn" @click="onDelete(value, property)">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
                        fill="#88a4bf" class="fill-212121"></path>
                    </svg>
                  </Button>
                </div>

              </div>



            </div>
          </div>
        </div>
        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
        <transition name="page">
          <confirmDelete v-if="drawerEmployeeRecordDelete" @confirmDelete="confirmDelete"
            @cancelDelete="onCancelDelete" />
        </transition>
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