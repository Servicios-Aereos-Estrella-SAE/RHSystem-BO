<template class="supply-type-form-container">
  <div class="supply-type-form">
    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">{{ t("supply_type_information") }}</h3>

        <div class="form-grid">
          <div class="form-field">
            <label class="field-label required">{{
              t("supply_type_name")
            }}</label>
            <InputText
              v-if="supplyType"
              v-model="supplyType.supplyTypeName"
              :placeholder="t('enter_supply_type_name')"
              class="form-input"
              :class="{ 'p-invalid': submitted && !supplyType.supplyTypeName }"
            />
            <small
              v-if="submitted && !supplyType.supplyTypeName"
              class="p-error"
            >
              {{ t("supply_type_name_required") }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label">{{ t("supply_type_identifier") }}</label>
            <InputText
              v-if="supplyType"
              v-model="supplyType.supplyTypeIdentifier"
              :placeholder="t('enter_supply_type_identifier')"
              class="form-input"
            />
          </div>

          <div class="form-field full-width">
            <label class="field-label required">{{
              t("supply_type_description")
            }}</label>
            <Textarea
              v-if="supplyType"
              v-model="supplyType.supplyTypeDescription"
              :placeholder="t('enter_supply_type_description')"
              class="form-textarea"
              :class="{
                'p-invalid': submitted && !supplyType.supplyTypeDescription,
              }"
              rows="3"
            />
            <small
              v-if="submitted && !supplyType.supplyTypeDescription"
              class="p-error"
            >
              {{ t("supply_type_description_required") }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{
              t("supply_type_slug")
            }}</label>
            <InputText
              v-if="supplyType"
              v-model="supplyType.supplyTypeSlug"
              :placeholder="t('enter_supply_type_slug')"
              class="form-input"
              :class="{ 'p-invalid': submitted && !supplyType.supplyTypeSlug }"
              @input="generateSlug"
            />
            <small
              v-if="submitted && !supplyType.supplyTypeSlug"
              class="p-error"
            >
              {{ t("supply_type_slug_required") }}
            </small>
            <small class="field-help">{{ t("slug_help_text") }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <Button v-if="supplyType && canUpdate"
        :label="supplyType.supplyTypeId ? t('update') : t('create')"
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
