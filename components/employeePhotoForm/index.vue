<template>
  <div class="user-info-form">
    <employeeModalInfoCard :employee="employee" />
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div v-if="currentPhotoUrl">
          <img :src="currentPhotoUrl" :alt="$t('employee_photo')" style="max-width: 200px;" />
        </div>
        <div class="input-box">
          <label for="employeePhoto">{{ $t('employee_photo') }}</label>
          <FileUpload name="photo" accept="image/*" :maxFileSize="maxFileSize" @upload="onUpload" @select="onSelect"
            :chooseLabel="$t('choose_file')" :uploadLabel="$t('upload')" :cancelLabel="$t('cancel')"
            :progressLabel="$t('pending')">
            <template #content="{ files, uploadedFiles, removeFileCallback }">
              <div v-for="(file, index) in files" :key="index"
                class="p-d-flex p-ai-center p-mb-2 p-p-2 border border-gray-200 rounded-md">
                <i class="pi pi-file mr-2 text-blue-500" />

                <div class="flex-grow">
                  <div class="font-medium text-gray-800">
                    {{ file.name }}
                  </div>
                  <div class="mt-1">
                    <span v-if="uploadedFiles && uploadedFiles.some(f => f.name === file.name)"
                      class="status-badge-completed">
                      {{ $t('completed') }}
                    </span>
                    <span v-else class="status-badge-pending">
                      {{ $t('pending') }}
                    </span>
                  </div>
                </div>

                <Button icon="pi pi-times" class="p-button-text p-ml-2" @click="removeFileCallback(index)" />
              </div>
            </template>
          </FileUpload>
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