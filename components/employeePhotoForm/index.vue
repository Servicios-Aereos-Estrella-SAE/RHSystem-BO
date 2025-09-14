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
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
              <div v-if="files.length > 0">
                <h5>{{ $t('pending') }}</h5>
                <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                  <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                    class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                    <div>
                      <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                    </div>
                    <span class="font-semibold">{{ file.name }}</span>
                    <div>{{ formatSize(file.size) }}</div>
                    <Badge :value="$t('pending')" severity="warning" />
                    <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined
                      rounded severity="danger" />
                  </div>
                </div>
              </div>

              <div v-if="uploadedFiles.length > 0">
                <h5>{{ $t('completed') }}</h5>
                <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                  <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size"
                    class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                    <div>
                      <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                    </div>
                    <span class="font-semibold">{{ file.name }}</span>
                    <div>{{ formatSize(file.size) }}</div>
                    <Badge :value="$t('completed')" class="mt-3" severity="success" />
                    <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded
                      severity="danger" />
                  </div>
                </div>
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