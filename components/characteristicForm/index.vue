<template>
  <div class="characteristic-form">
    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">{{ t('characteristic_information') }}</h3>

        <div class="form-grid">
          <div class="form-field full-width">
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

          <div class="form-field full-width">
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
      <button
      v-if="characteristic && canUpdate"
        :label="characteristic.supplieCaracteristicId ? t('update') : t('create')"
        icon="pi pi-check"
        class="btn btn-primary btn-block"
        :loading="isLoading"
        @click="onSave">


        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
            fill="#ffffff" class="fill-212121"></path>
        </svg>
        {{ $t('save') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
