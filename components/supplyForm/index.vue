<template>
  <div class="supply-form">
    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">{{ t("supply_information") }}</h3>

        <div class="form-grid">
          <div class="form-field full-width">
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

          <div class="form-field full-width">
            <label class="field-label">{{
              t("supply_file_number")
            }}</label>
            <InputNumber
              v-if="supply && canUpdate"
              v-model="supply.supplyFileNumber"
              :placeholder="t('enter_supply_file_number')"
              class="form-input"
              :class="{ 'p-invalid': submitted && !supply.supplyFileNumber }"
              :min="1"
              @blur="validateSupplyFileNumber(supply.supplyFileNumber || 0)"
            />
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
              :class="{ 'p-invalid': submitted }"
              rows="3"
            />
          </div>

          <div class="form-field">
            <label class="field-label required">{{ t("supply_status") }}</label>
            <Dropdown
              v-if="supply && canUpdate && supply.supplyId"
              v-model="supply.supplyStatus"
              :options="supplyStatusOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('select_supply_status')"
              class="form-dropdown"
              :class="{ 'p-invalid': submitted && !supply.supplyStatus }"
            />
            <div v-else-if="supply && !supply.supplyId" class="form-readonly">
              <span class="readonly-text">{{ t('supply_will_be_active') }}</span>
            </div>
            <small v-if="submitted && !supply.supplyStatus" class="p-error">
              {{ t("supply_status_required") }}
            </small>
          </div>
        </div>
      </div>

      <div
        v-if="
          supply && canUpdate && (supply.supplyStatus === 'inactive' || supply.supplyStatus === 'damaged' || supply.supplyStatus === 'lost')
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

      <!-- Characteristics Values Section -->
      <div v-if="supply && supply.supplyId && supplyCharacteristics.length > 0" class="form-section">
        <h3 class="section-title">{{ t("supply_characteristics") }}</h3>

        <div class="form-grid">
          <div
            v-for="characteristic in supplyCharacteristics"
            :key="characteristic.supplieCaracteristicId"
            class="form-field"
          >
            <label class="field-label">{{ characteristic.supplieCaracteristicName }}</label>
            <InputText
              v-if="characteristic.supplieCaracteristicType === 'text'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_value')"
              class="form-input"
            />
            <InputNumber
              v-else-if="characteristic.supplieCaracteristicType === 'number'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_value')"
              class="form-input"
            />
            <Calendar
              v-else-if="characteristic.supplieCaracteristicType === 'date'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('select_date')"
              class="form-calendar"
              date-format="yy-mm-dd"
              show-icon
            />
            <InputText
              v-else-if="characteristic.supplieCaracteristicType === 'email'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_email')"
              class="form-input"
              type="email"
            />
            <InputText
              v-else-if="characteristic.supplieCaracteristicType === 'url'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_url')"
              class="form-input"
              type="url"
            />
            <Dropdown
              v-else-if="characteristic.supplieCaracteristicType === 'boolean'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :options="booleanOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('select_option')"
              class="form-dropdown"
            />
            <InputText
              v-else
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_value')"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button
      v-if="supply && canUpdate"
        :label="supply.supplyId ? t('update') : t('create')"
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
