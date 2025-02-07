<template>
  <div class="box address-info-form">
    <Toast />
   <h4>Address</h4> 
    <div v-if="address" class="address-form">
      <div class="form-container">
        <div class="input-box">
          <label for="search">
            Country
          </label>
          <AutoComplete
          v-model="selectCountry"
          :suggestions="filteredCountries"
          :item-value="option => option.addressCountry"
          :optionLabel="option => option.addressCountry"
          @complete="handlerSearchCountries"
          @change="onCountrySelect"
        >
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
          <AutoComplete
            v-model="selectState"
            :suggestions="filteredStates"
            :optionLabel="option => option.addressState"
            @complete="handlerSearchStates"
            @change="onStateSelect"
          >
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
          <AutoComplete
            v-model="selectCity"
            :suggestions="filteredCities"
            :optionLabel="option => option.addressCity"
            @complete="handlerSearchCities"
            @change="onCitySelect"
          >
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
        <div class="input-box">
          <label for="addressZipcode">Zipcode</label>
          <InputNumber v-model="address.addressZipcode" :invalid="submitted && !address.addressZipcode" :useGrouping="false"/>
          <small class="p-error" v-if="submitted && !address.addressZipcode">Address zipcode is required.</small>
        </div>
        <div class="input-box">
          <label for="addressTownship">Township</label>
          <InputText v-model="address.addressTownship" :invalid="submitted && !address.addressTownship" />
          <small class="p-error" v-if="submitted && !address.addressTownship">Address township is required.</small>
        </div>
        <div class="input-box">
          <label for="addressSettlement">Settlement</label>
          <InputText v-model="address.addressSettlement" :invalid="submitted && !address.addressSettlement" />
          <small class="p-error" v-if="submitted && !address.addressSettlement">Address settlement is required.</small>
        </div>
        <div class="input-box">
          <label for="addressSettlementType">Settlement Type</label>
          <InputText v-model="address.addressSettlementType"/>
        </div>
        <div class="input-box">
          <label for="addressStreet">Street</label>
          <InputText v-model="address.addressStreet" :invalid="submitted && !address.addressStreet" />
          <small class="p-error" v-if="submitted && !address.addressStreet">Address street is required.</small>
        </div>
        <div class="input-box">
          <label for="addressInternalNumber">Internal Number</label>
          <InputText v-model="address.addressInternalNumber"/>
        </div>
        <div class="input-box">
          <label for="addressExternalNumber">External Number</label>
          <InputText v-model="address.addressExternalNumber"  :invalid="submitted && !address.addressExternalNumber" />
          <small class="p-error" v-if="submitted && !address.addressExternalNumber">Address external number is required.</small>
        </div>
        <div class="input-box">
          <label for="addressBetweenStreet1">Between Street 1</label>
          <InputText v-model="address.addressBetweenStreet1"/>
        </div>
        <div class="input-box">
          <label for="addressBetweenStreet2">Between Street 2</label>
          <InputText v-model="address.addressBetweenStreet2"/>
        </div>
        <div class="input-box address-type">
          <label for="address-type">
            Address Type
          </label>
          <Dropdown v-model="address.addressTypeId" :options="addressTypes" optionLabel="addressTypeName" optionValue="addressTypeId"
            placeholder="Select a Address Type" filter class="w-full md:w-14rem" :invalid="submitted && !address.addressTypeId"/>
          <small class="p-error" v-if="submitted && !address.addressTypeId">Address type is required.</small>
        </div>
        <div class="card flex justify-center"></div>

        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave" />
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
  display: none!important;
}

.p-errors{
  border: 1px solid red;
}
select{
  padding: 0.75rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

</style>
