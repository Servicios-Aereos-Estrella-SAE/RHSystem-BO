<template>
  <div class="characteristic-form">
    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">{{ t('characteristic_information') }}</h3>
        
        <div class="form-grid">
          <div class="form-field">
            <label class="field-label required">{{ t('characteristic_name') }}</label>
            <InputText 
              v-model="characteristic.supplieCaracteristicName" 
              :placeholder="t('enter_characteristic_name')"
              class="form-input"
              :class="{ 'p-invalid': submitted && !characteristic.supplieCaracteristicName }"
            />
            <small v-if="submitted && !characteristic.supplieCaracteristicName" class="p-error">
              {{ t('characteristic_name_required') }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{ t('characteristic_type') }}</label>
            <Dropdown 
              v-model="characteristic.supplieCaracteristicType" 
              :options="characteristicTypeOptions" 
              option-label="label"
              option-value="value"
              :placeholder="t('select_characteristic_type')"
              class="form-dropdown"
              :class="{ 'p-invalid': submitted && !characteristic.supplieCaracteristicType }"
            />
            <small v-if="submitted && !characteristic.supplieCaracteristicType" class="p-error">
              {{ t('characteristic_type_required') }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <Button 
        :label="t('cancel')" 
        icon="pi pi-times" 
        class="p-button-text"
        @click="handlerClickOnClose"
      />
      <Button 
        :label="characteristic.supplieCaracteristicId ? t('update') : t('create')" 
        icon="pi pi-check" 
        class="p-button-primary"
        :loading="isLoading"
        @click="onSave"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
