<template>
  <div class="medical-condition-types-page">
    <div class="head-page">
      <div>
        <h1>{{ $t('medical_condition_types') }}</h1>
        <p>{{ $t('manage_medical_condition_types_and_properties') }}</p>
      </div>
      <Button v-if="canCreate" class="btn btn-block" @click="addNewMedicalConditionType">
        <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
            fill="#88a4bf" class="fill-000000"></path>
        </svg>
        {{ $t('add_medical_condition_type') }}
      </Button>
    </div>

    <div v-if="medicalConditionTypesList.length > 0" class="medical-condition-types-grid">
      <div v-for="(medicalConditionType, index) in medicalConditionTypesList" :key="index"
        class="medical-condition-type-card">
        <div class="card-header">
          <div class="type-info">
            <h3>{{ medicalConditionType.medicalConditionTypeName }}</h3>
            <p>{{ medicalConditionType.medicalConditionTypeDescription }}</p>
            <div class="status-badge" :class="{ 'active': medicalConditionType.medicalConditionTypeActive === 1 }">
              {{ medicalConditionType.medicalConditionTypeActive === 1 ? 'Activo' : 'Inactivo' }}
            </div>
          </div>
          <div class="card-actions" v-if="canManage">
            <Button icon="pi pi-pencil" severity="info" size="small"
              @click="onEditMedicalConditionType(medicalConditionType)" />
            <Button icon="pi pi-trash" severity="danger" size="small"
              @click="onDeleteMedicalConditionType(medicalConditionType)" />
          </div>
        </div>

        <div class="card-content">
          <div v-if="medicalConditionType.properties && medicalConditionType.properties.length > 0" class="properties-section">
            <h4>{{ $t('properties') }}:</h4>
            <div class="properties-list">
              <div v-for="property in medicalConditionType.properties" :key="property.medicalConditionTypePropertyId"
                class="property-item">
                <div class="property-info">
                  <span class="property-name">{{ property.medicalConditionTypePropertyName }}</span>
                  <span class="property-type">{{ property.medicalConditionTypePropertyDataType }}</span>
                  <span v-if="property.medicalConditionTypePropertyRequired" class="required-badge">{{ $t('required') }}</span>
                </div>
                <p class="property-description">{{ property.medicalConditionTypePropertyDescription }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-properties">
            <p>{{ $t('no_properties_defined_for_this_type') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <div>
        {{ $t('no_medical_condition_types_registered_yet') }}
      </div>
    </div>

    <!-- Sidebar para formulario de tipo médico -->
    <Sidebar v-model:visible="drawerMedicalConditionTypeForm" :blockScroll="true" :closeOnEscape="false"
      :dismissable="false" :header="$t('medical_condition_type_form')" position="right" class="medical-condition-type-form-sidebar"
      :showCloseIcon="true">
      <medicalConditionTypeInfoForm :medicalConditionType="medicalConditionType"
        :clickOnSave="onSaveMedicalConditionType" />
    </Sidebar>

    <!-- Modal de confirmación de eliminación -->
    <transition name="page">
      <confirmDelete v-if="drawerMedicalConditionTypeDelete" @confirmDelete="confirmDeleteMedicalConditionType"
        @cancelDelete="onCancelMedicalConditionTypeDelete" />
    </transition>
  </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';
</style>
