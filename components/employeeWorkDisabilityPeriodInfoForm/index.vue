<template>
  <div class="work-disability-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee"/>
    <h1>
      <br/><br/>
      {{ isNewWorkDisabilityPeriod ? 'Add work disability period' : 'Update work disability period' }}
     
    </h1>
    
    <div v-if="isReady" class="work-disability-period-form">
      <div class="form-container">
        <div class="input-box">
          <label for="work-disability-period-file">
            File
          </label>
          <Button v-if="workDisabilityPeriod.workDisabilityPeriodFile" label="Open file" severity="primary" @click="openFile()" />
          <FileUpload
          ref="fileUpload"
          v-model="files"
          name="demo[]"
          url="/api/upload"
          @upload="onAdvancedUpload($event)"
          :custom-upload="true"
          :maxFileSize="1000000"
          :fileLimit="1"
          @select="validateFiles"
          :showUploadButton="false"
          accept="image/*,application/pdf"
        >
          <template #content="{ files, removeUploadedFileCallback, removeFileCallback }">
            <div v-for="(file, index) in files" :key="index" class="p-d-flex p-ai-center p-mb-2">
              <img
                v-if="file && file.type.startsWith('image/')"
                role="presentation"
                class="p-fileupload-file-thumbnail"
                :alt="file.name"
                width="50"
                :src="getObjectURL(file)"
              />
              <span v-if="file">{{ file.name }}</span>
              <Button
                v-if="file"
                @click="removeFileCallback(index)"
                class="p-ml-auto p-button p-component p-button-text"
              >
                <span class="p-button-icon pi pi-times"></span>
              </Button>
            </div>
          </template>
          <template #empty>
            <p>Drag and drop file to here to upload.</p>
          </template>
        </FileUpload>
        </div>
        <div  class="input-box">
          <label for="folio">
            Ticket folio
          </label>
          <InputText v-model="workDisabilityPeriod.workDisabilityPeriodTicketFolio"/>
          <small class="p-error" v-if="submitted && !workDisabilityPeriod.workDisabilityPeriodTicketFolio">Ticket folio is required.</small>
        </div>
        <div class="input-box">
          <label for="work-disability-type">
            Work disability type
          </label>
          <Dropdown v-model="workDisabilityPeriod.workDisabilityTypeId" :options="workDisabilityTypeList" optionLabel="workDisabilityTypeName" optionValue="workDisabilityTypeId"
          placeholder="" filter class="w-full md:w-14rem"
          />
          <small class="p-error" v-if="submitted && !workDisabilityPeriod.workDisabilityTypeId">Work disability type is required.</small>
        </div>
        <div class="input-box">
          <label for="requested-date">Date Range</label>
          <Calendar 
            v-model="dates" 
            selectionMode="range" 
            dateFormat="yy-mm-dd" 
            placeholder="Select date range"
            class="w-full md:w-14rem" 
          />
          <small class="p-error" v-if="submitted && (!dates || dates.length !== 2)">
          Dates are required.
          </small>
        </div>
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save work disability period
          </Button>
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
</style>