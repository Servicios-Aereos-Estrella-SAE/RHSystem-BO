<template>
  <div class="box proceeding-file-type-property-form">
    <h4>{{ $t('add_property') }}</h4>
    <div class="form-container">
      <div class="input-box">
        <label for="proceedingFileTypePropertyName">{{ $t('property_name') }}</label>
        <InputText
          id="proceedingFileTypePropertyName"
          v-model="form.proceedingFileTypePropertyName"
          :invalid="submitted && !form.proceedingFileTypePropertyName"
          :placeholder="$t('enter_property_name')"
        />
        <small class="p-error" v-if="submitted && !form.proceedingFileTypePropertyName">
          {{ $t('property_name_required') }}
        </small>
      </div>

      <div class="input-box">
        <label for="proceedingFileTypePropertyType">{{ $t('property_type') }}</label>
        <Dropdown
          id="proceedingFileTypePropertyType"
          v-model="form.proceedingFileTypePropertyType"
          :options="propertyTypeOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('select_property_type')"
          :invalid="submitted && !form.proceedingFileTypePropertyType"
        />
        <small class="p-error" v-if="submitted && !form.proceedingFileTypePropertyType">
          {{ $t('property_type_required') }}
        </small>
      </div>

      <div class="box-tools-footer">
        <Button :label="$t('cancel')" severity="secondary" @click="onCancel" />
        <Button :label="$t('save')" severity="primary" @click="onSave" :loading="loading" />
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
