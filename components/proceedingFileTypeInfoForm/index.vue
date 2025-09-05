<template>
  <div class="box proceeding-file-type-info-form">

    <h4>
      {{ isNewProceedingFileType ? $t('new_proceeding_file_type') : $t('update_proceeding_file_type') }}
    </h4>
    <div v-if="isReady" class="form">
      <div class="input-box">
        <label for="aircraftActive">
          {{ activeSwicht ? $t('active') : $t('inactive') }}
        </label>
        <InputSwitch v-model="activeSwicht" />
      </div>
      <div class="input-box">
        <label for="firstName">{{ capitalizeFirstLetter($t('name')) }}</label>
        <InputText v-model="proceedingFileType.proceedingFileTypeName"
          :placeholder="`${$t('enter')} ${capitalizeFirstLetter($t('name'))}`" />
        <small class="p-error" v-if="submitted && !proceedingFileType.proceedingFileTypeName">{{
          capitalizeFirstLetter($t('name')) }} {{
          $t('is_required') }}</small>
      </div>
      <div class="input-box">
        <label for="firstName">{{ $t('slug') }}</label>
        <InputText v-model="proceedingFileType.proceedingFileTypeSlug" :placeholder="`${$t('enter')} ${$t('slug')}`" />
        <small class="p-error" v-if="submitted && !proceedingFileType.proceedingFileTypeSlug">{{ $t('slug') }} {{
          $t('is_required') }}</small>
      </div>
      <div class="input-box">
        <label for="proceeding-file">
          {{ $t('area_to_use') }}
        </label>
        <Dropdown v-model="proceedingFileType.proceedingFileTypeAreaToUse" :options="getProceedingFileTypeAreaToUseList"
          optionLabel="label" optionValue="proceedingFileTypeAreaToUse"
          :placeholder="`${$t('select')} ${$t('area_to_use')}`" filter class="w-full md:w-14rem"
          :invalid="submitted && !proceedingFileType.proceedingFileTypeAreaToUse" />
        <small class="p-error" v-if="submitted && !proceedingFileType.proceedingFileTypeAreaToUse">{{ $t('area_to_use')
          }} {{ $t('is_required') }}</small>
      </div>
      <div class="box-tools-footer">
        <Button :label="$t('save')" severity="primary" @click="onSave()" />
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

<style scoped>
  :deep(p-button)[aria-label="Upload"] {
    display: none;
  }

  :deep(p-button)[aria-label="Cancel"] {
    display: none;
  }

  :deep(p-button)[aria-label="Choose"] {
    display: block;
  }
</style>