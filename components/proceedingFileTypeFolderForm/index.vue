<template>
  <div class="proceeding-file-type-folder-form">
    <h4>{{ $t('new_folder') }}</h4>
    <div class="form-container">
      <div class="inputs-group">
        <div class="input-box">
          <label for="proceedingFileTypeName">{{ $t('folder_name') }}</label>
          <InputText
            id="proceedingFileTypeName"
            v-model="form.proceedingFileTypeName"
            :invalid="submitted && !form.proceedingFileTypeName"
            :placeholder="$t('enter_folder_name')"
          />
          <small class="p-error" v-if="submitted && !form.proceedingFileTypeName">
            {{ $t('folder_name_required') }}
          </small>
        </div>
      </div>

      <div class="box-tools-footer">
        <Button :label="$t('cancel')" class="btn btn-block"  @click="onCancel" />
        <Button :label="$t('save')"  class="btn btn-primary btn-block" @click="onSave" :loading="loading" />
      </div>
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
