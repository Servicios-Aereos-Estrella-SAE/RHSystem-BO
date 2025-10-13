<template>
  <div class="employee-medical-condition-info-form">
    <h4>
      {{ isNewMedicalCondition ? t('new_medical_condition') : t('update_medical_condition') }}
    </h4>
    <div v-if="isReady" class="medical-condition-form">
      <div class="form-container">
        <div class="input-box">
          <label for="medicalConditionTypeActive">
            {{ activeSwicht ? t('active') : t('inactive') }}
          </label>
          <InputSwitch v-model="activeSwicht" />
        </div>

        <div class="input-box">
          <label for="medicalConditionTypeId">{{ t('medical_condition_type') }}</label>
          <Dropdown v-model="employeeMedicalCondition.medicalConditionTypeId"
            :options="displayedMedicalConditionTypes"
            optionDisabled="disabled"
            optionLabel="medicalConditionTypeName"
            optionValue="medicalConditionTypeId"
            :placeholder="t('select_medical_condition_type')"
            :disabled="!isNewMedicalCondition"
            class="w-full" />
          <small class="p-error" v-if="submitted && !employeeMedicalCondition.medicalConditionTypeId">
            {{ t('medical_condition_type_is_required') }}
          </small>
          <small v-if="!isNewMedicalCondition" class="p-info">
            {{ t('medical_condition_type_cannot_be_changed_in_existing_records') }}
          </small>
        </div>

        <div class="input-box">
          <label for="employeeMedicalConditionDiagnosis">{{ t('diagnosis') }}</label>
          <InputText v-model="employeeMedicalCondition.employeeMedicalConditionDiagnosis"
            :placeholder="t('enter_diagnosis')" />
          <small class="p-error" v-if="submitted && !employeeMedicalCondition.employeeMedicalConditionDiagnosis">
            {{ t('diagnosis_is_required') }}
          </small>
        </div>

        <div class="input-box">
          <label for="employeeMedicalConditionTreatment">{{ t('treatment') }}</label>
          <Textarea v-model="employeeMedicalCondition.employeeMedicalConditionTreatment"
            :placeholder="t('enter_treatment')" rows="3" />
        </div>

        <div class="input-box">
            <label for="employeeMedicalConditionNotes">{{ t('notes') }}</label>
          <Textarea v-model="employeeMedicalCondition.employeeMedicalConditionNotes"
            :placeholder="t('enter_notes')" rows="3" />
        </div>

        <!-- Sección de ajustes de condiciones médicas -->
        <div class="input-box">
          <div class="medical-settings-header">
            <label>{{ t('medical_condition_settings') }}</label>
            <Button :label="$t('manage_types_and_properties')" severity="secondary" size="small"
              @click="openMedicalConditionTypesManager" />
          </div>
          <p class="settings-description">
            {{ t('manage_medical_condition_types_and_properties') }}
          </p>
        </div>

        <!-- Sección de propiedades específicas del tipo -->
        <div v-if="getValidProperties().length > 0"
          class="input-box">
          <div class="properties-header">
            <label>{{ t('specific_properties') }}</label>
          </div>

          <div class="properties-list">
            <div v-for="(property, index) in getValidProperties()" :key="index"
              class="property-item">
              <div class="property-form">
                <div class="property-inputs">
                  <div class="input-group">
                    <label>{{ property.medicalConditionTypePropertyName }}
                        <span class="property-type-badge">{{ property.medicalConditionTypePropertyDataType }}</span>
                    </label>
                    <InputText v-model="getPropertyValue(property.medicalConditionTypePropertyId).medicalConditionTypePropertyValue"
                      :placeholder="property.medicalConditionTypePropertyDescription" />
                    <small v-if="property.medicalConditionTypePropertyRequired" class="p-error">
                      {{ t('this_field_is_required') }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box-tools-footer">
          <button type="button" class="btn btn-primary btn-block" @click="onSave()">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                fill="#ffffff" class="fill-212121"></path>
            </svg>
            {{ $t('save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar para administración de tipos médicos -->
    <Sidebar v-model:visible="drawerMedicalConditionTypesManager" :blockScroll="true" :closeOnEscape="false"
      :dismissable="false" header="Administración de tipos médicos" position="right" class="medical-condition-types-manager-sidebar"
      :showCloseIcon="true">
      <medicalConditionTypesManager @close="closeMedicalConditionTypesManager" @medicalConditionTypeCreated="onMedicalConditionTypeCreated" />
    </Sidebar>
  </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';
</style>
