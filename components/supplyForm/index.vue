<template>
  <div class="supply-form">
    <div class="form-container">
      <div class="inputs-group group-2">
        <div class="input-box">
          <label for="supplyName">{{ t("supply_name") }}</label>
          <InputText v-if="supply && canUpdate"
            v-model="supply.supplyName"
            :placeholder="t('enter_supply_name')"
            :invalid="submitted && !supply.supplyName"
          />
          <small v-if="submitted && !supply.supplyName" class="p-error">
            {{ t("supply_name_required") }}
          </small>
        </div>

        <div class="input-box">
          <label for="supplyFileNumber">{{ t("supply_file_number") }}</label>
          <InputText
            v-if="supply && canUpdate"
            v-model="supplyFileNumberDisplay"
            :placeholder="t('enter_supply_file_number')"
            :invalid="submitted && !supply.supplyFileNumber"
            @blur="validateSupplyFileNumber(Number(supplyFileNumberDisplay) || 0)"
          />
        </div>

        <div class="input-box">
          <label for="supplyStatus">{{ t("supply_status") }}</label>
          <Dropdown
            v-if="supply && canUpdate && supply.supplyId"
            v-model="supply.supplyStatus"
            :options="supplyStatusOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('select_supply_status')"
            class="w-full md:w-14rem"
            :invalid="submitted && !supply.supplyStatus"
          />
          <div v-else-if="supply && !supply.supplyId" class="form-readonly">
            <span class="readonly-text">{{ t('supply_will_be_active') }}</span>
          </div>
          <small v-if="submitted && !supply.supplyStatus" class="p-error">
            {{ t("supply_status_required") }}
          </small>
        </div>
      </div>

      <div class="inputs-group">
        <div class="input-box">
          <label for="supplyDescription">{{ t("supply_description") }}</label>
          <Textarea
            v-if="supply && canUpdate"
            v-model="supply.supplyDescription"
            :placeholder="t('enter_supply_description')"
            :invalid="submitted"
            rows="3"
          />
        </div>
      </div>

      <div
        v-if="
          supply && canUpdate && (supply.supplyStatus === 'inactive' || supply.supplyStatus === 'damaged' || supply.supplyStatus === 'lost')
        "
        class="inputs-group"
      >
        <div class="input-box">
          <label for="deactivationReason">{{ t("deactivation_reason") }}</label>
          <Textarea
            v-if="supply && canUpdate"
            v-model="supply.supplyDeactivationReason"
            :placeholder="t('enter_deactivation_reason')"
            :invalid="submitted && !supply.supplyDeactivationReason"
            rows="3"
          />
          <small
            v-if="submitted && !supply.supplyDeactivationReason"
            class="p-error"
          >
            {{ t("deactivation_reason_required") }}
          </small>
        </div>

        <div class="input-box">
          <label for="deactivationDate">{{ t("deactivation_date") }}</label>
          <div v-if="!displayForm" class="read-date">
            <InputText type="text" v-model="supplyDeactivationDateDisplay" readonly />
            <Button v-if="canUpdate" class="btn" @click="onEditDate">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </Button>
            <Button v-if="canUpdate" class="btn" @click="onDeleteDate">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
                  fill="#88a4bf" class="fill-212121 fill-303e67"></path>
              </svg>
            </Button>
          </div>
          <div v-else class="form-date">
            <Calendar
              v-model="supply.supplyDeactivationDate"
              :placeholder="t('select_deactivation_date')"
              :invalid="submitted && !supply.supplyDeactivationDate"
              date-format="yy-mm-dd"
            />
            <Button v-if="canUpdate" class="btn" @click="onSaveDate">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </Button>
            <Button v-if="canUpdate" class="btn" @click="cancelEditDate">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </Button>
          </div>
          <small
            v-if="submitted && !supply.supplyDeactivationDate"
            class="p-error"
          >
            {{ t("deactivation_date_required") }}
          </small>
        </div>
      </div>

      <!-- Characteristics Values Section -->
      <div v-if="supply && supply.supplyId && supplyCharacteristics.length > 0" class="inputs-group group-2">
        <div
          v-for="characteristic in supplyCharacteristics"
          :key="characteristic.supplieCaracteristicId || `char-${Math.random()}`"
          class="input-box"
        >
          <label>{{ characteristic.supplieCaracteristicName }}</label>
            <InputText
              v-if="characteristic.supplieCaracteristicType === 'text'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_value')"
            />
            <InputText type="number"
              v-else-if="characteristic.supplieCaracteristicType === 'number'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_value')"
            />
            <div v-else-if="characteristic.supplieCaracteristicType === 'date'" class="characteristic-date-field">
              <div v-if="!getCharacteristicDateEditMode(characteristic.supplieCaracteristicId)" class="read-date">
                <InputText type="text" :value="getCharacteristicDateDisplay(characteristic.supplieCaracteristicId)" readonly />
                <Button v-if="canUpdate" class="btn" @click="onEditCharacteristicDate(characteristic.supplieCaracteristicId)">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </Button>
                <Button v-if="canUpdate" class="btn" @click="onDeleteCharacteristicDate(characteristic.supplieCaracteristicId)">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
                      fill="#88a4bf" class="fill-212121 fill-303e67"></path>
                  </svg>
                </Button>
              </div>
              <div v-else class="form-date">
                <Calendar
                  :model-value="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue ? new Date(getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue) : null"
                  @update:model-value="(value) => getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue = value && value instanceof Date ? value.toISOString().split('T')[0] : ''"
                  :placeholder="t('select_date')"
                  date-format="yy-mm-dd"
                />
                <Button v-if="canUpdate" class="btn" @click="onSaveCharacteristicDate(characteristic.supplieCaracteristicId)">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </Button>
                <Button v-if="canUpdate" class="btn" @click="cancelEditCharacteristicDate(characteristic.supplieCaracteristicId)">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </Button>
              </div>
            </div>
            <InputText type="email"
              v-else-if="characteristic.supplieCaracteristicType === 'email'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_email')"
            />
            <InputText type="url"
              v-else-if="characteristic.supplieCaracteristicType === 'url'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_url')"
            />
            <Dropdown
              v-else-if="characteristic.supplieCaracteristicType === 'boolean'"
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :options="booleanOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('select_option')"
              class="w-full md:w-14rem"
            />
            <InputText
              v-else
              v-model="getCharacteristicValue(characteristic.supplieCaracteristicId).supplieCaracteristicValueValue"
              :placeholder="t('enter_value')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="box-tools-footer">
      <button v-if="supply && canUpdate" type="button" class="btn btn-primary btn-block" @click="onSave">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
            fill="#ffffff" class="fill-212121"></path>
        </svg>
        {{ $t('save') }}
      </button>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
