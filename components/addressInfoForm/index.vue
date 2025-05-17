<template>
  <div class="address-info-form">
    <div v-if="address" class="address-form">
      <div class="form-container">
        <div class="inputs-group">
          <div class="group-3">
            <div class="input-box">
              <label for="search">
                Country
              </label>
              <AutoComplete v-model="selectCountry" :suggestions="filteredCountries"
                :item-value="option => option.addressCountry" :optionLabel="option => option.addressCountry"
                @complete="handlerSearchCountries" @change="onCountrySelect" :disabled="!canManageUserResponsible">
                <template #option="slotProps">
                  <div>
                    <div class="name">
                      {{ slotProps.option.addressCountry }}
                    </div>
                  </div>
                </template>
              </AutoComplete>
              <small class="p-error" v-if="submitted && !address.addressCountry">Address country is required.</small>
            </div>
            <div class="input-box">
              <label for="search">
                State
              </label>
              <AutoComplete v-model="selectState" :suggestions="filteredStates"
                :optionLabel="option => option.addressState" @complete="handlerSearchStates" @change="onStateSelect"
                :disabled="!canManageUserResponsible">
                <template #option="state">
                  <div>
                    <div class="name">
                      {{ state.option.addressState }}
                    </div>
                  </div>
                </template>
              </AutoComplete>
              <small class="p-error" v-if="submitted && !address.addressState">Address state is required.</small>
            </div>
            <div class="input-box">
              <label for="search">
                City
              </label>
              <AutoComplete v-model="selectCity" :suggestions="filteredCities"
                :optionLabel="option => option.addressCity" @complete="handlerSearchCities" @change="onCitySelect"
                :disabled="!canManageUserResponsible">
                <template #option="city">
                  <div>
                    <div class="name">
                      {{ city.option.addressCity }}
                    </div>
                  </div>
                </template>
              </AutoComplete>
              <small class="p-error" v-if="submitted && !address.addressCity">Address city is required.</small>
            </div>
          </div>

          <div class="group-2">
            <div class="input-box">
              <label for="addressZipcode">Zipcode</label>
              <InputNumber v-model="address.addressZipcode" :invalid="submitted && !address.addressZipcode"
                :useGrouping="false" :disabled="!canManageUserResponsible" />
              <small class="p-error" v-if="submitted && !address.addressZipcode">Address zipcode is required.</small>
            </div>
            <div class="input-box">
              <label for="addressTownship">Township</label>
              <InputText v-model="address.addressTownship" :invalid="submitted && !address.addressTownship"
                :disabled="!canManageUserResponsible" />
              <small class="p-error" v-if="submitted && !address.addressTownship">Address township is required.</small>
            </div>
          </div>

          <div class="group-2">
            <div class="input-box">
              <label for="addressSettlement">Settlement</label>
              <InputText v-model="address.addressSettlement" :invalid="submitted && !address.addressSettlement"
                :disabled="!canManageUserResponsible" />
              <small class="p-error" v-if="submitted && !address.addressSettlement">Address settlement is
                required.</small>
            </div>
            <div class="input-box">
              <label for="addressSettlementType">Settlement Type (Colonia)</label>
              <InputText v-model="address.addressSettlementType" :disabled="!canManageUserResponsible" />
            </div>
          </div>

          <div class="input-box">
            <label for="addressStreet">Street</label>
            <InputText v-model="address.addressStreet" :invalid="submitted && !address.addressStreet"
              :disabled="!canManageUserResponsible" />
            <small class="p-error" v-if="submitted && !address.addressStreet">Address street is required.</small>
          </div>

          <div class="group-2">
            <div class="input-box">
              <label for="addressExternalNumber">External Number</label>
              <InputText v-model="address.addressExternalNumber" :invalid="submitted && !address.addressExternalNumber"
                :disabled="!canManageUserResponsible" />
              <small class="p-error" v-if="submitted && !address.addressExternalNumber">Address external number is
                required.</small>
            </div>
            <div class="input-box">
              <label for="addressInternalNumber">Internal Number</label>
              <InputText v-model="address.addressInternalNumber" :disabled="!canManageUserResponsible" />
            </div>
          </div>

          <div class="group-2">
            <div class="input-box">
              <label for="addressBetweenStreet1">Between Street 1</label>
              <InputText v-model="address.addressBetweenStreet1" :disabled="!canManageUserResponsible" />
            </div>
            <div class="input-box">
              <label for="addressBetweenStreet2">Between Street 2</label>
              <InputText v-model="address.addressBetweenStreet2" :disabled="!canManageUserResponsible" />
            </div>
          </div>
        </div>

        <div class="input-box address-type">
          <label for="address-type">
            Address Type
          </label>
          <Dropdown v-model="address.addressTypeId" :options="addressTypes" optionLabel="addressTypeName"
            optionValue="addressTypeId" placeholder="Select a Address Type" filter class="w-full md:w-14rem"
            :invalid="submitted && !address.addressTypeId" :disabled="!canManageUserResponsible" />
          <small class="p-error" v-if="submitted && !address.addressTypeId">Address type is required.</small>
        </div>
        <div class="card flex justify-center"></div>

        <div class="box-tools-footer">
          <button v-if="canManageUserResponsible" type="button" class="btn btn-primary btn-block" @click="onSave">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                fill="#ffffff" class="fill-212121"></path>
            </svg>
            Save
          </button>
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

  .address-type {
    display: none !important;
  }

  .p-errors {
    border: 1px solid red;
  }

  select {
    padding: 0.75rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
  }
</style>