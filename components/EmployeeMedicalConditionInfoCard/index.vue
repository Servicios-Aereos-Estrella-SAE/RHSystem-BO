<template>
  <div class="employee-medical-condition-card">
    <div class="card-header">
      <div class="medical-condition-info">
        <h4>{{ getMedicalConditionTypeName() }}</h4>
        <p class="diagnosis">{{ employeeMedicalCondition.employeeMedicalConditionDiagnosis }}</p>
        <div class="status-badge" :class="{ 'active': employeeMedicalCondition.employeeMedicalConditionActive === 1 }">
          {{ employeeMedicalCondition.employeeMedicalConditionActive === 1 ? $t('active') : $t('inactive') }}
        </div>
      </div>
      <div class="card-actions" v-if="canManageUserResponsible">
        <Button icon="pi pi-pencil" severity="info" size="small" @click="clickOnEdit" />
        <Button icon="pi pi-trash" severity="danger" size="small" @click="clickOnDelete" />
      </div>
    </div>

    <div class="card-content">
      <div v-if="employeeMedicalCondition.employeeMedicalConditionTreatment" class="info-section">
        <label>{{ $t('treatment') }}:</label>
        <p>{{ employeeMedicalCondition.employeeMedicalConditionTreatment }}</p>
      </div>

      <div v-if="employeeMedicalCondition.employeeMedicalConditionNotes" class="info-section">
        <label>{{ $t('notes') }}:</label>
        <p>{{ employeeMedicalCondition.employeeMedicalConditionNotes }}</p>
      </div>

      <div v-if="getValidPropertyValues().length > 0" class="info-section">
        <label>{{ $t('additional_properties') }}:</label>
        <div class="property-values">
          <div v-for="propertyValue in getValidPropertyValues()" :key="propertyValue.medicalConditionTypePropertyValueId"
            class="property-value-item">
            <span class="property-name">{{ getPropertyName(propertyValue.medicalConditionTypePropertyId) }}:</span>
            <span class="property-type">{{ getPropertyType(propertyValue.medicalConditionTypePropertyId) }}</span>
            <span class="property-value">{{ propertyValue.medicalConditionTypePropertyValue }}</span>
          </div>
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
