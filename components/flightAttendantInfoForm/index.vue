<template>
  <div class="box flight-attendant-info-form">
    <Toast />
    <h4>
      {{ isNewFlightAttendant ? 'New flight attendant' : 'Update flight attendant' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <div v-if="flightAttendant && flightAttendant.flightAttendantPhoto" class="p-d-flex p-ai-center p-mb-2 image-flight-attendant">
            <img role="presentation"
              class="p-fileupload-file-thumbnail" width="50" :src="flightAttendant.flightAttendantPhoto" />
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
          <InputText v-model="flightAttendant.person.personFirstname" placeholder="Enter First Name" />
          <small class="p-error" v-if="submitted && !flightAttendant.person.personFirstname">First Name is required.</small>
        </div>
        <div class="input-box">
          <label for="lastName">Last Name</label>
          <InputText v-model="flightAttendant.person.personLastname" placeholder="Enter Last Name" />
          <small class="p-error" v-if="submitted && !flightAttendant.person.personLastname">Last Name is required.</small>
        </div>
        <div class="input-box">
          <label for="lastName">Second Last Name</label>
          <InputText v-model="flightAttendant.person.personSecondLastname" placeholder="Enter Second Last Name" />
          <small class="p-error" v-if="submitted && !flightAttendant.person.personSecondLastname">Second Last Name is required.</small>
        </div>
        <div class="input-box">
          <label for="flightAttendantHireDate">Birthday</label>
          <Calendar v-model="flightAttendant.person.personBirthday" dateFormat="yy-mm-dd" placeholder="Select birthday"  @update:model-value="formatDate('birthday')"/>
        </div>
        <div class="input-box">
          <label for="flightAttendantLastName">Phone</label>
          <InputText v-model="flightAttendant.person.personPhone" placeholder="Enter phone" />
          <small class="p-error" v-if="submitted && flightAttendant.person.personPhone && !isValidPhone">Phone number is not valid.</small>
        </div>
        <div class="input-box">
          <label for="personGender">Gender</label>
          <Dropdown v-model="flightAttendant.person.personGender" :options="genders" optionLabel="label" optionValue="value"
            placeholder="Select Gender" class="w-full md:w-14rem" />
        </div>
        <div class="input-box">
          <label for="flightAttendantLastName">Personal identification code</label>
          <InputText v-model="flightAttendant.person.personCurp" placeholder="Enter CURP" />
          <small class="p-error" v-if="submitted && flightAttendant.person.personCurp && !isValidCURP">Personal identification is not valid.</small>
        </div>
        <div class="input-box">
          <label for="flightAttendantLastName">RFC</label>
          <InputText v-model="flightAttendant.person.personRfc" placeholder="Enter RFC" />
          <small class="p-error" v-if="submitted && flightAttendant.person.personRfc && !isValidRFC">RFC is not valid.</small>
        </div>
        <div class="input-box">
          <label for="flightAttendantLastName">NSS</label>
          <InputText v-model="flightAttendant.person.personImssNss" placeholder="Enter NSS" />
        </div>
        <div class="input-box">
          <label for="flightAttendantHireDate">Hire Date</label>
          <Calendar v-model="flightAttendant.flightAttendantHireDate" dateFormat="yy-mm-dd" placeholder="Select Hire Date" @update:model-value="formatDate('hireDate')"/>
          <small class="p-error" v-if="submitted && !flightAttendant.flightAttendantHireDate">Hire Date is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button label="Proceeding files" severity="primary" @click="getProceedingFiles()" />
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
      </div>
    </div>
    <div class="card flex justify-content-center">
      <Sidebar v-model:visible="drawerProceedingFiles" header="Flight attendant proceeding files" position="right" class="proceeding-file-sidebar"
        :showCloseIcon="true">
        <flightAttendantProceedingFile :flightAttendant="flightAttendant" />
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