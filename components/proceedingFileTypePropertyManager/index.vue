<template>
  <div class="box proceeding-file-type-property-manager">
    <div class="property-manager-header">
      <h4>{{ $t('properties') }}</h4>
      <Button v-if="canManageFiles" class="btn btn-add-property" @click="showAddPropertyForm">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2.5a1.5 1.5 0 0 1 1.5 1.5v1.5h3.75a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V6a1.5 1.5 0 0 1 1.5-1.5H10.5V4a1.5 1.5 0 0 1 1.5-1.5ZM12 6H6.75v12h10.5V6H12Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
        {{ $t('add_property') }}
      </Button>
    </div>

    <div v-if="properties.length > 0" class="properties-list">
      <div v-for="(property, index) in properties" :key="index" class="property-item">
        <div class="property-info">
          <span class="property-name">{{ property.proceedingFileTypePropertyName }}</span>
          <span class="property-type">{{ property.proceedingFileTypePropertyType }}</span>
        </div>
        <Button v-if="canManageFiles" class="btn btn-delete-property" @click="deleteProperty(property)"
                v-tooltip="$t('delete_property')">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zM9 4v2h6V4H9zm8 4H7v12h10V8zM9 10h2v8H9v-8zm4 0h2v8h-2v-8z"
              fill="#dc3545" class="fill-212121"></path>
          </svg>
        </Button>
      </div>
    </div>

    <div v-else class="no-properties">
      {{ $t('no_properties_defined') }}
    </div>

    <!-- Property Form Sidebar -->
    <div class="card flex justify-content-center">
      <Sidebar v-model:visible="showAddForm" position="right"
        class="property-form-sidebar" :blockScroll="true" :closeOnEscape="false"
        :dismissable="false" :showCloseIcon="true" :header="$t('add_property')">
        <proceedingFileTypePropertyForm
          :proceedingFileTypeId="proceedingFileTypeId"
          @onSave="onPropertySave"
          @onCancel="onPropertyCancel" />
      </Sidebar>
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
