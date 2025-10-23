<template>
  <div class="supply-form">
    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">{{ t("supply_information") }}</h3>

        <div class="form-grid">
          <div class="form-field">
            <label class="field-label required">{{ t("supply_name") }}</label>
            <InputText v-if="supply && canUpdate"
              v-model="supply.supplyName"
              :placeholder="t('enter_supply_name')"
              class="form-input"
              :class="{ 'p-invalid': submitted && !supply.supplyName }"
            />
            <small v-if="submitted && !supply.supplyName" class="p-error">
              {{ t("supply_name_required") }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{
              t("supply_file_number")
            }}</label>
            <InputNumber
              v-if="supply && canUpdate"
              v-model="supply.supplyFileNumber"
              :placeholder="t('enter_supply_file_number')"
              class="form-input"
              :class="{ 'p-invalid': submitted && !supply.supplyFileNumber }"
              :min="1"
            />
            <small v-if="submitted && !supply.supplyFileNumber" class="p-error">
              {{ t("supply_file_number_required") }}
            </small>
          </div>

          <div class="form-field full-width">
            <label class="field-label required">{{
              t("supply_description")
            }}</label>
            <Textarea
              v-if="supply && canUpdate"
              v-model="supply.supplyDescription"
              :placeholder="t('enter_supply_description')"
              class="form-textarea"
              :class="{ 'p-invalid': submitted && !supply.supplyDescription }"
              rows="3"
            />
            <small
              v-if="submitted && !supply.supplyDescription"
              class="p-error"
            >
              {{ t("supply_description_required") }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{ t("supply_status") }}</label>
            <Dropdown
              v-if="supply && canUpdate"
              v-model="supply.supplyStatus"
              :options="supplyStatusOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('select_supply_status')"
              class="form-dropdown"
              :class="{ 'p-invalid': submitted && !supply.supplyStatus }"
            />
            <small v-if="submitted && !supply.supplyStatus" class="p-error">
              {{ t("supply_status_required") }}
            </small>
          </div>
        </div>
      </div>

      <div
        v-if="
          supply && canUpdate && (supply.supplyStatus === 'inactive' || supply.supplyStatus === 'damaged')
        "
        class="form-section"
      >
        <h3 class="section-title">{{ t("deactivation_information") }}</h3>

        <div class="form-grid">
          <div class="form-field full-width">
            <label class="field-label required">{{
              t("deactivation_reason")
            }}</label>
            <Textarea
              v-if="supply && canUpdate"
              v-model="supply.supplyDeactivationReason"
              :placeholder="t('enter_deactivation_reason')"
              class="form-textarea"
              :class="{
                'p-invalid': submitted && !supply.supplyDeactivationReason,
              }"
              rows="3"
            />
            <small
              v-if="submitted && !supply.supplyDeactivationReason"
              class="p-error"
            >
              {{ t("deactivation_reason_required") }}
            </small>
          </div>

          <div class="form-field">
            <label class="field-label required">{{
              t("deactivation_date")
            }}</label>
            <Calendar
              v-if="supply && canUpdate"
              v-model="supply.supplyDeactivationDate"
              :placeholder="t('select_deactivation_date')"
              class="form-calendar"
              :class="{
                'p-invalid': submitted && !supply.supplyDeactivationDate,
              }"
              date-format="yy-mm-dd"
              show-icon
            />
            <small
              v-if="submitted && !supply.supplyDeactivationDate"
              class="p-error"
            >
              {{ t("deactivation_date_required") }}
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
        v-if="supply && canUpdate"
        :label="supply.supplyId ? t('update') : t('create')"
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
