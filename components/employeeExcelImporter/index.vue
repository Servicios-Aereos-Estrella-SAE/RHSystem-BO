<template>
  <div class="employee-excel-importer">
    <div v-if="isReady" class="excel-import-form">
      <h4>{{ $t('excel_import') }}</h4>

      <div class="form-container">
        <div class="input-box">
          <label for="excelFile">{{ $t('excel_file') }}</label>
          <FileUpload ref="fileUpload" v-model="excelFiles" name="excel[]" :custom-upload="true" :showUploadButton="false"
            :maxFileSize="10000000" :fileLimit="1" accept=".xlsx,.xls"
            @select="validateExcelFiles" :chooseLabel="$t('select_excel_file')">
            <template #content="{ files, removeFileCallback }">
              <div v-for="(file, index) in files" :key="index" class="p-d-flex p-ai-center p-mb-2">
                <i class="pi pi-file-excel p-mr-2" style="color: #28a745; font-size: 1.2rem;"></i>
                <span v-if="file">{{ file.name }}</span>
                <Button v-if="file" @click="removeFileCallback(index)"
                  class="p-ml-auto p-button p-component p-button-text">
                  <span class="p-button-icon pi pi-times"></span>
                </Button>
              </div>
            </template>
            <template #empty>
              <div class="file-upload-empty">
                <i class="pi pi-cloud-upload" style="font-size: 2rem; color: #6b7280; margin-bottom: 1rem;"></i>
                <p>{{ $t('drag_and_drop_excel_file_or_click_to_select') }}</p>
                <Button type="button" class="btn btn-secondary btn-sm" @click="browseFiles">
                  <i class="pi pi-upload p-mr-2"></i>
                  {{ $t('browse_files') }}
                </Button>
              </div>
            </template>
          </FileUpload>
          <small class="p-error" v-if="submitted && !excelFiles.length">{{ $t('excel_file') }} {{ $t('is_required') }}</small>
        </div>

        <div class="box-tools-footer">
          <Button type="button" class="btn btn-success btn-block" @click="importExcel" :disabled="!canImportExcel">
            <i class="pi pi-upload p-mr-2"></i>
            {{ $t('import_employees') }}
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

<style lang="scss" scoped>
@import './style';
</style>
