<template>
  <div class="box aircraftOperator-info-form">
    <Toast />
    <h4>
      {{ isNewAircraftOperator ? 'New Aircraft Operator' : 'Update Aircraft Operator' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <div v-if="aircraftOperator && aircraftOperator.aircraftOperatorImage" class="p-d-flex p-ai-center p-mb-2 image-aircraftOperator">
            <img role="presentation"
              class="p-fileupload-file-thumbnail" width="200" :src="aircraftOperator.aircraftOperatorImage" />
          </div>
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
            <p>Drag and drop the operator's photo here to upload.</p>
          </template>
        </FileUpload>
        </div>
        <div class="input-box">
          <label for="userActive">
            Status
            ( {{ activeSwicht ? 'Active' : 'Inactive' }} )
          </label>
          <InputSwitch v-model="activeSwicht"/>
        </div>
        <div class="input-box">
          <label for="aircraftOperatorName">Full Name</label>
          <InputText v-model="aircraftOperator.aircraftOperatorName" placeholder="Enter Full Name" />
          <small class="p-error" v-if="submitted && !aircraftOperator.aircraftOperatorName">Name is required.</small>
        </div>
        <div class="input-box">
          <label for="aircraftOperatorFiscalName">Full Name</label>
          <InputText v-model="aircraftOperator.aircraftOperatorFiscalName" placeholder="Enter Fiscal Name" />
        </div>
        <div class="input-box">
          <label for="aircraftOperatorLastName">Slug</label>
          <InputText readonly disabled v-model="aircraftOperator.aircraftOperatorSlug" placeholder="slug" />
          <small class="p-error" v-if="submitted && aircraftOperator.aircraftOperatorSlug && !isValidPhone">Slug is not valid.</small>
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
  .shift-exception-sidebar {
    width: 100% !important;
    max-width: 70rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  .shift-sidebar {
    width: 100% !important;
    max-width: 70rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  .proceeding-file-sidebar {
    width: 100% !important;
    max-width: 90rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
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