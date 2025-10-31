<template>
  <div class="box medical-condition-type-info-form">
    <h4>
      {{ isNewMedicalConditionType ? t('new_medical_condition_type') : t('update_medical_condition_type') }}
    </h4>
    <div v-if="isReady" class="medical-condition-type-form">
      <div class="form-container">
        <div class="input-box">
          <label for="medicalConditionTypeActive">
            {{ activeSwicht ? t('active') : t('inactive') }}
          </label>
          <InputSwitch v-model="activeSwicht" />
        </div>

        <div class="input-box">
          <label for="medicalConditionTypeName">{{ t('medical_condition_type') }}</label>
          <InputText v-model="medicalConditionType.medicalConditionTypeName" :placeholder="t('enter_name')" />
          <small class="p-error" v-if="submitted && !medicalConditionType.medicalConditionTypeName">
            {{ t('name_is_required') }}
          </small>
        </div>

        <div class="input-box">
          <label for="medicalConditionTypeDescription">{{ t('description') }}</label>
          <Textarea v-model="medicalConditionType.medicalConditionTypeDescription"
            :placeholder="t('enter_description')" rows="3" />
        </div>

        <!-- Sección de propiedades -->
        <div class="input-box">
          <div class="properties-header">
            <label>{{ t('properties_of_the_medical_condition_type') }}</label>
            <Button :label="t('add_property')" severity="secondary" size="small"
              :disabled="isNewMedicalConditionType"
              @click="addProperty" />
          </div>
          <small v-if="isNewMedicalConditionType" class="p-info">
             {{ t('properties_cannot_be_added_to_new_types') }}
          </small>

          <div v-if="!isNewMedicalConditionType && medicalConditionType.properties && medicalConditionType.properties.length > 0"
            class="properties-list">
            <div v-for="(property, index) in medicalConditionType.properties" :key="index"
              class="property-item">
              <div class="property-form">
                <div class="property-inputs">
                  <div class="input-group">
                    <label>{{ t('name') }}</label>
                    <InputText v-model="property.medicalConditionTypePropertyName"
                      :placeholder="t('name')" />
                  </div>

                  <div class="input-group">
                    <label>{{ t('description') }}</label>
                    <InputText v-model="property.medicalConditionTypePropertyDescription"
                      :placeholder="t('description')" />
                  </div>

                  <div class="input-group">
                    <label>{{ t('data_type') }}</label>
                    <InputText v-model="property.medicalConditionTypePropertyDataType"
                      :placeholder="t('data_type')" />
                  </div>

                  <div class="input-group">
                    <label>{{ t('required') }}</label>
                    <InputSwitch v-model="property.medicalConditionTypePropertyRequired" />
                  </div>
                </div>

                <div class="property-actions">
                  <Button icon="pi pi-trash" severity="danger" size="small"
                    @click="removeProperty(index)" />
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

    <!-- Modal de confirmación para eliminar propiedad -->
    <transition name="page">
      <confirmDelete v-if="drawerPropertyDelete" @confirmDelete="confirmDeleteProperty"
        @cancelDelete="onCancelPropertyDelete" />
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
