<template>
  <div class="box pilot-info-form">
    <Toast />
    <h4>
      {{ isNewPilot ? 'New pilot' : 'Update pilot' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div v-if="pilot && pilot.pilotPhoto" class="input-box">
          <div class="p-d-flex p-ai-center p-mb-2 image-pilot">
            <img role="presentation"
              class="p-fileupload-file-thumbnail" width="50" :src="pilot.pilotPhoto" />
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
            <p>Drag and drop file to here to upload.</p>
          </template>
        </FileUpload>
        </div>
        <div class="input-box">
          <label for="firstName">First Name</label>
          <InputText v-model="pilot.person.personFirstname" placeholder="Enter First Name" />
          <small class="p-error" v-if="submitted && !pilot.person.personFirstname">First Name is required.</small>
        </div>
        <div class="input-box">
          <label for="lastName">Last Name</label>
          <InputText v-model="pilot.person.personLastname" placeholder="Enter Last Name" />
          <small class="p-error" v-if="submitted && !pilot.person.personLastname">Last Name is required.</small>
        </div>
        <div class="input-box">
          <label for="lastName">Second Last Name</label>
          <InputText v-model="pilot.person.personSecondLastname" placeholder="Enter Second Last Name" />
          <small class="p-error" v-if="submitted && !pilot.person.personSecondLastname">Second Last Name is required.</small>
        </div>
        <div class="input-box">
          <label for="pilotHireDate">Birthday</label>
          <Calendar v-model="pilot.person.personBirthday" dateFormat="yy-mm-dd" placeholder="Select birthday" />
        </div>
        <div class="input-box">
          <label for="pilotLastName">Phone</label>
          <InputText v-model="pilot.person.personPhone" placeholder="Enter pilot phone" />
          <small class="p-error" v-if="submitted && pilot.person.personPhone && !isValidPhone">Phone number is not valid.</small>
        </div>
        <div class="input-box">
          <label for="personGender">Gender</label>
          <Dropdown v-model="pilot.person.personGender" :options="genders" optionLabel="label" optionValue="value"
            placeholder="Select Gender" class="w-full md:w-14rem" />
        </div>
        <div class="input-box">
          <label for="pilotLastName">Personal identification code</label>
          <InputText v-model="pilot.person.personCurp" placeholder="Enter pilot CURP" />
          <small class="p-error" v-if="submitted && pilot.person.personCurp && !isValidCURP">Personal identification is not valid.</small>
        </div>
        <div class="input-box">
          <label for="pilotLastName">Pilot RFC</label>
          <InputText v-model="pilot.person.personRfc" placeholder="Enter pilot RFC" />
          <small class="p-error" v-if="submitted && pilot.person.personRfc && !isValidRFC">RFC is not valid.</small>
        </div>
        <div class="input-box">
          <label for="pilotLastName">Pilot NSS</label>
          <InputText v-model="pilot.person.personImssNss" placeholder="Enter pilot NSS" />
        </div>
        <div class="input-box">
          <label for="pilotHireDate">Hire Date</label>
          <Calendar v-model="pilot.pilotHireDate" dateFormat="yy-mm-dd" placeholder="Select Hire Date" @update:model-value="formatDate"/>
          <small class="p-error" v-if="submitted && !pilot.pilotHireDate">Hire Date is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button label="Proceeding files" severity="primary" @click="getProceedingFiles()" />
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
      </div>
    </div>
    <div class="card flex justify-content-center">
      <Sidebar v-model:visible="drawerProceedingFiles" header="Pilot proceeding files" position="right" class="proceeding-file-sidebar"
        :showCloseIcon="true">
        <pilotProceedingFile :pilot="pilot" />
      </Sidebar>
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
  /deep/ .p-button[aria-label="Upload"] {
    display: none;
  }

  /deep/ .p-button[aria-label="Cancel"] {
    display: none;
  }

  /deep/ .p-button[aria-label="Choose"] {
    display: block;
  }
</style>