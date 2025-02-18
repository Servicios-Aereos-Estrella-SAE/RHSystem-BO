<template>
  <div class="box employee-person-info-form">
    <Toast />
    <div v-if="isReady" class="employee-person-form">
      <h4>Personal Information</h4>

      <div class="form-container">
        <div class="input-box">
          <div class="hire-date-box-container">
            <label for="employeeBirthDate">Birthday</label>
            <div v-if="!displayBirthDateCalendar" class="hire-date-box">
              <InputText v-model="personBirthday" readonly class="capitalize" :disabled="isDeleted" />
              <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="handlerDisplayBirthDate"
                :disabled="isDeleted">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayBirthDateCalendar" class="hire-date-box-controller">
              <Calendar v-model="employee.person.personBirthday" placeholder="Select birthday" :disabled="isDeleted" />
              <Button type="button" class="btn btn-block" id="display-input-hiredate"
                @click="displayBirthDateCalendar = false">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>
        <div v-if="employee.person.personBirthday" class="input-box">
          <label for="age">Age</label>
          {{ getAge }}
        </div>
        <div class="input-box">
          <label for="personPhone">Phone</label>
          <InputMask v-model="employee.person.personPhone" mask="(999) 999 99 99" placeholder="Enter employee phone"
            :disabled="isDeleted" />
        </div>
        <div class="input-box">
          <label for="personPhoneSecondary">Phone secondary</label>
          <InputMask v-model="employee.person.personPhoneSecondary" mask="(999) 999 99 99"
            placeholder="Enter employee phone" :disabled="isDeleted" />
        </div>
        <div class="input-box">
          <label for="personMaritalStatus">Marital status</label>
          <Dropdown v-model="employee.person.personMaritalStatus" :options="maritalStatus" optionLabel="label"
            optionValue="value" placeholder="Select Marital Status" class="w-full md:w-14rem" :disabled="isDeleted" />
        </div>
        <div class="input-box">
          <label for="search">
            Place of birth country
          </label>
          <AutoComplete v-model="selectCountry" :suggestions="filteredCountries"
            :item-value="option => option.personPlaceOfBirthCountry"
            :optionLabel="option => option.personPlaceOfBirthCountry" @complete="handlerSearchCountries"
            @change="onCountrySelect">
            <template #option="slotProps">
              <div>
                <div class="name">
                  {{ slotProps.option.personPlaceOfBirthCountry }}
                </div>
              </div>
            </template>
          </AutoComplete>
        </div>
        <div class="input-box">
          <label for="search">
            Place of birth state
          </label>
          <AutoComplete v-model="selectState" :suggestions="filteredStates"
            :optionLabel="option => option.personPlaceOfBirthState" @complete="handlerSearchStates"
            @change="onStateSelect">
            <template #option="state">
              <div>
                <div class="name">
                  {{ state.option.personPlaceOfBirthState }}
                </div>
              </div>
            </template>
          </AutoComplete>
        </div>
        <div class="input-box">
          <label for="search">
            Place of birth city
          </label>
          <AutoComplete v-model="selectCity" :suggestions="filteredCities"
            :optionLabel="option => option.personPlaceOfBirthCity" @complete="handlerSearchCities"
            @change="onCitySelect">
            <template #option="city">
              <div>
                <div class="name">
                  {{ city.option.personPlaceOfBirthCity }}
                </div>
              </div>
            </template>
          </AutoComplete>
        </div>
        <div class="box-tools-footer">
          <Button v-if="employee.deletedAt" label="Reactivate" severity="primary" @click="onReactivate()" />
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
        <transition name="page">
          <confirmReactivate v-if="drawerEmployeeReactivate" @confirmReactivate="confirmReactivate"
            @cancelReactivate="onCancelEmployeeReactivate" />
        </transition>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
    </div>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>