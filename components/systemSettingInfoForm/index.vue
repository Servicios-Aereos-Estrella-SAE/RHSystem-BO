<template>
  <div class="box system-setting-info-form">

    <h4>
      {{ isNewSystemSetting ? t('system_setting') : t('update_system_setting')}}
    </h4>
    <div v-if="isReady" class="system-setting-form">
      <div class="form-container">
        <div class="input-box">
          <label for="userActive">
            {{ activeSwicht ? t('active') : t('inactive') }}</label>
          <InputSwitch v-model="activeSwicht" />
        </div>
        <div class="input-box">
          <label for="logo">{{ t('logo') }}</label>
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
              <p>{{ t('drag_and_drop_file_to_here_to_upload.') }}</p>
            </template>
          </FileUpload>
        </div>
        <div class="input-box">
          <label for="logo">{{ t('banner') }}</label>
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
              <p>{{ t('drag_and_drop_file_to_here_to_upload.') }}</p>
            </template>
          </FileUpload>
        </div>
        <div class="input-box">
          <label for="logo">{{ t('favicon') }}</label>
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
              <p>{{ t('drag_and_drop_file_to_here_to_upload.') }}</p>
            </template>
          </FileUpload>
        </div>
        <div class="input-box">
          <label for="firstName">{{ t('trade_name') }}</label>
          <InputText v-model="systemSetting.systemSettingTradeName" placeholder="Enter Trade Name" />
          <small class="p-error" v-if="submitted && !systemSetting.systemSettingTradeName">{{ t('Trade_name_is_required.') }}
            </small>
        </div>
        <div class="iput-box">
          <label for="firstName">{{ t('Sidebar_color') }}</label>
          <div class="color-container">
            <InputText v-model="systemSetting.systemSettingSidebarColor" placeholder="Enter Color" @input="addHash"
              class="color-text" />
            <div class="color-input">
              <ColorPicker v-model="systemSetting.systemSettingSidebarColor" inputId="cp-hex" format="hex"
                class="mb-3 color " @change="updateColor" />
            </div>
          </div>
          <small class="p-error" v-if="submitted && !systemSetting.systemSettingSidebarColor">{{t('sidebar_color_is_required.')}}</small>
        </div>


        <div class="input-box">
          <label for="systemSettingToleranceCountPerAbsence">{{ t('tolerance_count_to_delay') }}</label>
          <InputNumber id="ToleranceCountPerAbsence" v-model="systemSetting.systemSettingToleranceCountPerAbsence"
            :invalid="submitted" />
          <small class="p-error" v-if="submitted && !systemSetting.systemSettingToleranceCountPerAbsence">{{ t('Tolerance_count_per_absence_is_required.') }}</small>
        </div>


        <div v-if="!isNewSystemSetting" class="input-box">
          <label for="toleranceDelay">{{ t('tolerance_delay_minutes') }}</label>
          <div style="display: flex; align-items: center; gap: 40px;">
            <InputNumber id="toleranceDelay" v-model="toleranceDelay" :invalid="submitted" />
            <div style="display:flex; gap: 20px">
              <Button :label="t('save_delay')" severity="primary" @click="saveDelay()" />
              <Button :label="t('delete')" severity="danger" @click="deleteDelay()" />
            </div>
          </div>

        </div>

        <div v-if="!isNewSystemSetting" class="input-box">
          <label for="toleranceFault">{{ t('tolerance_fault_minutes') }}</label>
          <div style="display: flex; align-items: center; gap: 40px;">
            <InputNumber id="toleranceFault" v-model="toleranceFault" :invalid="submitted" />
            <div style="display:flex; gap: 20px">

              <Button :label="t('save_fault')" severity="primary" @click="saveFault()" />
              <Button :label="t('delete')" severity="danger" @click="deleteFault()" />
            </div>
          </div>
        </div>

        <div v-if="!isNewSystemSetting" class="input-box">
          <label for="employeeLimit">{{ t('employee_limit') }}</label>
          <div style="display: flex; align-items: center; gap: 40px;">
            <InputNumber
              id="employeeLimit"
              v-model="employeeLimit"
              :invalid="submitted"
              :min="0"
              :max="999999"
              :allowEmpty="true"
              :useGrouping="false"
              :minFractionDigits="0"
              :maxFractionDigits="0"
              :placeholder="t('enter_employee_limit')"
            />
            <div style="display:flex; gap: 20px">
              <Button :label="t('save_employee_limit')" severity="primary" @click="saveEmployeeLimit()" />
              <Button :label="t('delete')" severity="danger" @click="deleteEmployeeLimit()" />
              <Button
                v-if="employeeLimitHistory.filter(emp => emp.isActive === 0).length > 0"
                :label="t('history')"
                severity="secondary"
                @click="toggleHistoryDropdown()"
              />
            </div>
          </div>

          <!-- History Dropdown -->
          <div v-if="showHistoryDropdown && employeeLimitHistory.filter(emp => emp.isActive === 0).length > 0" class="history-dropdown">
            <div class="history-header">
              <h4>{{ t('employee_limit_history') }}</h4>
              <Button icon="pi pi-times" severity="secondary" text @click="showHistoryDropdown = false" />
            </div>
            <div class="history-list">
              <div
                v-for="employee in employeeLimitHistory.filter(emp => emp.isActive === 0)"
                :key="employee.systemSettingEmployeeId"
                class="history-item"
              >
                <div class="history-info">
                  <span class="limit-value">{{ employee.employeeLimit }}</span>
                  <span class="limit-date">
                    {{ new Date(employee.systemSettingEmployeeCreatedAt || '').toLocaleDateString() }}
                  </span>
                </div>
                <div class="history-status inactive">
                  {{ t('inactive') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isRoot" class="input-box">
          <DataTable :value="groupedSystemModules" tableStyle="min-width: 50rem">
            <Column v-for="(dept, index) in groupedSystemModules[0]" :key="index" :header="t('system_module')">
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
          <label for="tardinessTolerance">{{ t('tardiness_tolerance_occurrences') }}</label>
          <div style="display: flex; align-items: center; gap: 40px;">
            <InputNumber id="tardinessTolerance" v-model="tardinessTolerance" :invalid="submitted" />
            <div style="display:flex; gap: 20px">
              <Button :label="t('save_tardiness')" severity="primary" @click="saveTardiness()" />
              <Button :label=" t('delete')" severity="danger" @click="deleteTardiness()" />
            </div>
          </div>
        </div>
        <div class="input-box">
          <label for="userActive">
            {{ restrictFutureVacationSwicht ? t('active_restrict_future_vacation') : t('inactive_restrict_future_vacation')
            }}</label>
          <InputSwitch v-model="restrictFutureVacationSwicht" />
        </div>

        <div class="box-tools-footer">
          <Button :label="t('save')" severity="primary" @click="onSave()" />
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
