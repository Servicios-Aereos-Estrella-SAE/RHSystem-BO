<template>
  <div class="box employee-permissions-excel-form">
    <h4>
      {{ $t('download_permissions_excel') }}
    </h4>
    <div v-if="isReady" class="permissions-excel-form">
      <div class="form-container">
        <div class="input-box">
          <label for="start-date">
            {{ $t('start_date') }}
          </label>
          <Calendar
            v-model="startDate"
            :placeholder="$t('select_start_date')"
            dateFormat="yy-mm-dd"
            :minDate="minDate"
            :maxDate="maxDate"
            class="w-full"
          />
        </div>
        <div class="input-box">
          <label for="end-date">
            {{ $t('end_date') }}
          </label>
          <Calendar
            v-model="endDate"
            :placeholder="$t('select_end_date')"
            dateFormat="yy-mm-dd"
            :minDate="startDate || minDate"
            :maxDate="maxDate"
            class="w-full"
          />
        </div>
        <div class="box-tools-footer">
          <Button
            :label="$t('download_excel')"
            severity="primary"
            @click="downloadExcel"
            :disabled="!startDate || !endDate || isDownloading"
            :loading="isDownloading"
          />
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
