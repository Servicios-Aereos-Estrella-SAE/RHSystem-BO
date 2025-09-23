<template>
  <div class="box system-setting-info-form">

    <h4>
      {{ isNewSystemSetting ? 'New system setting' : 'Update system setting' }}
    </h4>
    <div v-if="isReady" class="system-setting-form">
      <div class="form-container">
        <div class="input-box">
          <label for="userActive">
            {{ activeSwicht ? 'Active' : 'Inactive' }}</label>
          <InputSwitch v-model="activeSwicht" />
        </div>
        <div class="input-box">
          <label for="logo">Logo</label>
          <div v-if="systemSetting && systemSetting.systemSettingLogo"
            class="p-d-flex p-ai-center p-mb-2 image-system-setting">
            <img role="presentation" class="p-fileupload-file-thumbnail" width="50"
              :src="systemSetting.systemSettingLogo" />
          </div>
          <FileUpload v-model="files" name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"
            :custom-upload="true" :fileLimit="1" @select="validateFiles">
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
          <label for="logo">Banner</label>
          <div v-if="systemSetting && systemSetting.systemSettingBanner"
            class="p-d-flex p-ai-center p-mb-2 image-system-setting">
            <img role="presentation" class="p-fileupload-file-thumbnail" width="50"
              :src="systemSetting.systemSettingBanner" />
          </div>
          <FileUpload v-model="bannerFiles" name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"
            :custom-upload="true" :fileLimit="1" @select="validateBannerFiles">
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
              <div v-for="(file, index) in files" :key="index" class="p-d-flex p-ai-center p-mb-2">
                <img v-if="file && file.type.startsWith('image/')" role="presentation"
                  class="p-fileupload-file-thumbnail" :alt="file.name" width="50" :src="getBannerObjectURL(file)" />
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
          <label for="logo">Favicon</label>
          <div v-if="systemSetting && systemSetting.systemSettingFavicon"
            class="p-d-flex p-ai-center p-mb-2 image-system-setting">
            <img role="presentation" class="p-fileupload-file-thumbnail" width="50"
              :src="systemSetting.systemSettingFavicon" />
          </div>
          <FileUpload v-model="faviconFiles" name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"
            :custom-upload="true" :fileLimit="1" @select="validateFaviconFiles">
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
              <div v-for="(file, index) in files" :key="index" class="p-d-flex p-ai-center p-mb-2">
                <img v-if="file && file.type.startsWith('image/')" role="presentation"
                  class="p-fileupload-file-thumbnail" :alt="file.name" width="50" :src="getFaviconObjectURL(file)" />
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
          <label for="firstName">Trade Name</label>
          <InputText v-model="systemSetting.systemSettingTradeName" placeholder="Enter Trade Name" />
          <small class="p-error" v-if="submitted && !systemSetting.systemSettingTradeName">Trade name is
            required.</small>
        </div>
        <div class="iput-box">
          <label for="firstName">Sidebar Color</label>
          <div class="color-container">
            <InputText v-model="systemSetting.systemSettingSidebarColor" placeholder="Enter Color" @input="addHash"
              class="color-text" />
            <div class="color-input">
              <ColorPicker v-model="systemSetting.systemSettingSidebarColor" inputId="cp-hex" format="hex"
                class="mb-3 color " @change="updateColor" />
            </div>
          </div>
          <small class="p-error" v-if="submitted && !systemSetting.systemSettingSidebarColor">Sidebar color is
            required.</small>
        </div>


        <div class="input-box">
          <label for="systemSettingToleranceCountPerAbsence">Tolerance count to delay</label>
          <InputNumber id="ToleranceCountPerAbsence" v-model="systemSetting.systemSettingToleranceCountPerAbsence"
            :invalid="submitted" />
          <small class="p-error" v-if="submitted && !systemSetting.systemSettingToleranceCountPerAbsence">Tolerance
            count per absence is
            required.</small>
        </div>


        <div v-if="!isNewSystemSetting" class="input-box">
          <label for="toleranceDelay">Tolerance Delay (Minutes)</label>
          <div style="display: flex; align-items: center; gap: 40px;">
            <InputNumber id="toleranceDelay" v-model="toleranceDelay" :invalid="submitted" />
            <div style="display:flex; gap: 20px">
              <Button label="Save Delay" severity="primary" @click="saveDelay()" />
              <Button label="Delete" severity="danger" @click="deleteDelay()" />
            </div>
          </div>

        </div>

        <div v-if="!isNewSystemSetting" class="input-box">
          <label for="toleranceFault">Tolerance Fault (Minutes)</label>
          <div style="display: flex; align-items: center; gap: 40px;">
            <InputNumber id="toleranceFault" v-model="toleranceFault" :invalid="submitted" />
            <div style="display:flex; gap: 20px">

              <Button label="Save Fault" severity="primary" @click="saveFault()" />
              <Button label="Delete" severity="danger" @click="deleteFault()" />
            </div>
          </div>
        </div>
        <div v-if="isRoot" class="input-box">
          <DataTable :value="groupedSystemModules" tableStyle="min-width: 50rem">
            <Column v-for="(dept, index) in groupedSystemModules[0]" :key="index" header="System Module">
              <template #body="slotProps">
                <div v-if="slotProps.data[index]" class="item-system-modules">
                  <Checkbox v-model="systemModules[0]" name="permission" :disabled="!canUpdate"
                    :value="slotProps.data[index].systemModuleId" />
                  <label>&nbsp; {{ slotProps.data[index].systemModuleName }}</label>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <div v-if="!isNewSystemSetting" class="input-box">
          <label for="tardinessTolerance">Tardiness Tolerance (Occurrences)</label>
          <div style="display: flex; align-items: center; gap: 40px;">
            <InputNumber id="tardinessTolerance" v-model="tardinessTolerance" :invalid="submitted" />
            <div style="display:flex; gap: 20px">
              <Button label="Save Tardiness" severity="primary" @click="saveTardiness()" />
              <Button label="Delete" severity="danger" @click="deleteTardiness()" />
            </div>
          </div>
        </div>
        <div class="input-box">
          <label for="userActive">
            {{ restrictFutureVacationSwicht ? 'Active Restrict Future Vacation' : 'Inactive Restrict Future Vacation'
            }}</label>
          <InputSwitch v-model="restrictFutureVacationSwicht" />
        </div>

        <div v-if="!isNewSystemSetting" class="input-box">
          <label for="tardinessTolerance">Payroll Configs</label>
          <Button class="btn btn-block" @click="addNewPayrollConfig">
            <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
            Add New
          </Button>
        </div>
        <div v-if="!isNewSystemSetting" class="input-box">
          <div v-if="systemSettingPayrollConfigs.length > 0" class="payroll-config-wrapper">
            <div v-for="(systemSettingPayrollConfig, index) in systemSettingPayrollConfigs"
              :key="`system-setting-payroll-config-file-${index}`">
              <systemSettingPayrollConfigInfoCard :systemSettingPayrollConfig="systemSettingPayrollConfig"
                :click-on-edit="() => { onEditPayrollConfig(systemSettingPayrollConfig) }"
                :click-on-delete="() => { onDeletePayrollConfig(systemSettingPayrollConfig) }" />
            </div>
          </div>
          <div v-else class="empty">
            Empty list
          </div>
        </div>

        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
      </div>
      <transition name="page">
        <confirmDelete v-if="drawerPayrollConfigDelete" @confirmDelete="confirmDeletePayrollConfig"
          @cancelDelete="drawerPayrollConfigDelete = false" />
      </transition>
      <Sidebar v-model:visible="drawerPayrollConfigForm" header="Payroll Config form" position="right"
        class="payroll-config-form-sidebar" :showCloseIcon="true">
        <systemSettingPayrollConfigInfoForm :systemSettingPayrollConfig="systemSettingPayrollConfig"
          @onPayrollConfigSave="onPayrollConfigSave" />
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

  .payroll-config-form-sidebar {
    width: 100% !important;
    max-width: 25rem !important;

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