<template>
  <div class="supply-type-form">
    <div class="form-container">
      <div class="inputs-group group-2">
        <div class="input-box">
          <label for="supplyTypeName">{{ t("supply_type_name") }}</label>
          <InputText
            v-if="supplyType"
            v-model="supplyType.supplyTypeName"
            :placeholder="t('enter_supply_type_name')"
            :invalid="submitted && !supplyType.supplyTypeName"
          />
          <small
            v-if="submitted && !supplyType.supplyTypeName"
            class="p-error"
          >
            {{ t("supply_type_name_required") }}
          </small>
        </div>

        <div class="input-box">
          <label for="supplyTypeSlug">{{ t("supply_type_slug") }}</label>
          <InputText
            v-if="supplyType"
            v-model="supplyType.supplyTypeSlug"
            :placeholder="t('enter_supply_type_slug')"
            :invalid="submitted && !supplyType.supplyTypeSlug"
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

      <div class="inputs-group">
        <div class="input-box">
          <label for="supplyTypeDescription">{{ t("supply_type_description") }}</label>
          <Textarea
            v-if="supplyType"
            v-model="supplyType.supplyTypeDescription"
            :placeholder="t('enter_supply_type_description')"
            :invalid="submitted"
            rows="3"
          />
        </div>
      </div>
    </div>

    <div class="box-tools-footer">
      <button
        v-if="supplyType && canUpdate"
        type="button"
        class="btn btn-primary btn-block"
        @click="onSave"
      >
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
            fill="#ffffff" class="fill-212121"></path>
        </svg>
        {{ $t('save') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
