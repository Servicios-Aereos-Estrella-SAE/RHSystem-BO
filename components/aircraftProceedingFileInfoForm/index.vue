<template>
  <div class="box aircraft-proceeding-file-info-form">
    <h4>
      {{ isNewAircraftProceedingFile ? 'New aircraft proceeding file' : 'Update aircraft proceeding file' }}
    </h4>
    <div v-if="isReady" class="aircraft-proceeding-file-form">
      <div class="form-container">
        <div class="input-box">
          <label for="proceeding-file">
            Proceeding file
          </label>
          <Button v-if="proceedingFile.proceedingFilePath" label="Open file" severity="primary" @click="openFile()" />
          <FileUpload v-model="files" name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"
            :custom-upload="true" :fileLimit="1" :showUploadButton="false" @select="validateFiles">
            <template #content="{ files }">
              <div v-for="(file, index) in files" :key="index" class="p-d-flex p-ai-center p-mb-2">
                <!-- <img
                    v-if="file && file.type.startsWith('image/')"
                    role="presentation"
                    class="p-fileupload-file-thumbnail"
                    width="50"
                    :alt="file.name"
                    :src="getObjectURL(file)" /> -->
                <span v-if="file">
                  {{ file.name }}
                </span>
              </div>
            </template>
            <template #empty>
              <p>Drag and drop file here to upload.</p>
            </template>
          </FileUpload>

        </div>
        <div class="input-box">
          <label for="proceedingFileName">Name</label>
          <InputText id="proceedingFileName" v-model="proceedingFile.proceedingFileName" />
        </div>
        <div class="input-box">
          <div class="date-box-container">
            <label>Expiration at</label>
            <div v-if="!displayExpirationAtCalendar" class="date-box">
              <InputText v-model="expirationAt" readonly class="capitalize" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
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
                v-model.lazy="proceedingFile.proceedingFileExpirationAt" placeholder="Select expiration at date" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="displayExpirationAtCalendar = false">
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
            rows="3" />
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
  .p-button[aria-label="Upload"] {
    display: none;
  }

  .p-button[aria-label="Cancel"] {
    display: none;
  }

  .p-button[aria-label="Choose"] {
    display: block;
  }
</style>
