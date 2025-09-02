<template>
  <div class="employee-person-info-form">
    <div v-if="isReady" class="employee-person-form">
      <div class="form-container">
        <div class="inputs-group">
          <div class="group-2">
            <div class="input-box">
              <label for="personPhone">{{ $t('phone') }}</label>
              <InputMask v-model="employee.person.personPhone" mask="(999) 999 99 99"
                :placeholder="`${$t('enter')} ${$t('phone')}`" :disabled="isDeleted || !canManageUserResponsible" />
            </div>
            <div class="input-box">
              <label for="personPhoneSecondary">{{ $t('phone_secondary') }}</label>
              <InputMask v-model="employee.person.personPhoneSecondary" mask="(999) 999 99 99"
                :placeholder="`${$t('enter')} ${$t('phone')}`" :disabled="isDeleted || !canManageUserResponsible" />
            </div>
          </div>
          <div class="input-box">
            <label for="useremail">
              {{ $t('email') }}</label>
            <InputText id="useremail" v-model="employee.person.personEmail" type="email"
              :invalid="submitted && isEmailInvalid" :disabled="isDeleted || !canManageUserResponsible"
              :placeholder="`${$t('enter')} ${$t('email')}`" />
            <small class="p-error" v-if="submitted && isEmailInvalid">{{ $t('email') }} {{ $t('is_not_valid') }}</small>
          </div>
        </div>

        <div class="inputs-group">
          <div class="input-box">
            <label for="personGender">{{ $t('gender') }}</label>
            <Dropdown v-model="employee.person.personGender" :options="genders" optionLabel="label" optionValue="value"
              :placeholder="`${$t('select')} ${$t('gender')}`" class="w-full md:w-14rem"
              :disabled="isDeleted || !canManageUserResponsible" :emptyMessage="$t('no_available_options')"
              :emptyFilterMessage="$t('no_results_found')" />
          </div>
          <div class="input-box">
            <div class="hire-date-box-container">
              <label for="employeeBirthDate">{{ $t('birthday') }}</label>
              <div v-if="!displayBirthDateCalendar" class="hire-date-box">
                <InputText v-model="personBirthday" readonly class="capitalize"
                  :disabled="isDeleted || !canManageUserResponsible"
                  :placeholder="`${$t('enter')} ${$t('birthday')}`" />
                <Button type="button" class="btn btn-block" id="display-input-hiredate" @click="handlerDisplayBirthDate"
                  :disabled="isDeleted || !canManageUserResponsible">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </Button>
              </div>
              <div v-if="displayBirthDateCalendar" class="hire-date-box-controller">
                <Calendar v-model="employee.person.personBirthday" :placeholder="`${$t('select')} ${$t('birthday')}`"
                  :disabled="isDeleted || !canManageUserResponsible" />
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
            <div class="age-box">
              <span class="icon">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 7c1.714 0 2-1.34 2-2.444C14 3.45 13.262 1.5 12 1.5s-2 1.951-2 3.056C10 5.66 10.286 7 12 7ZM3.5 10.25A2.25 2.25 0 0 1 5.75 8h12.5a2.25 2.25 0 0 1 2.25 2.25v.875l-3.634 2.726a1.25 1.25 0 0 1-1.384.077l-2.04-1.2a2.75 2.75 0 0 0-2.884.06l-1.761 1.136a1.25 1.25 0 0 1-1.35.003L3.5 11.408V10.25Z"
                    fill="#fff" class="fill-212121"></path>
                  <path
                    d="M3.5 13.188V18.5h-.75a.75.75 0 0 0 0 1.5h18.5a.75.75 0 0 0 0-1.5h-.75V13l-2.734 2.05a2.75 2.75 0 0 1-3.044.171l-2.04-1.2a1.25 1.25 0 0 0-1.311.027l-1.76 1.136a2.75 2.75 0 0 1-2.971.008L3.5 13.187Z"
                    fill="#fff" class="fill-212121"></path>
                </svg>
              </span>
              <span>
                {{ getAge }} {{ $t('years_old') }}
              </span>
            </div>
          </div>
          <div class="group-3">
            <div class="input-box">
              <label for="country">
                {{ $t('place_of_birth_country') }}
              </label>
              <AutoComplete v-model="selectCountry" :suggestions="filteredCountries"
                :item-value="option => option.personPlaceOfBirthCountry"
                :optionLabel="option => option.personPlaceOfBirthCountry" @complete="handlerSearchCountries"
                @change="onCountrySelect" :disabled="isDeleted || !canManageUserResponsible">
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
              <label for="state">
                {{ $t('place_of_birth_state') }}
              </label>
              <AutoComplete v-model="selectState" :suggestions="filteredStates"
                :optionLabel="option => option.personPlaceOfBirthState" @complete="handlerSearchStates"
                @change="onStateSelect" :disabled="isDeleted || !canManageUserResponsible">
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
              <label for="city">
                {{ $t('place_of_birth_city') }}
              </label>
              <AutoComplete v-model="selectCity" :suggestions="filteredCities"
                :optionLabel="option => option.personPlaceOfBirthCity" @complete="handlerSearchCities"
                @change="onCitySelect" :disabled="isDeleted || !canManageUserResponsible">
                <template #option="city">
                  <div>
                    <div class="name">
                      {{ city.option.personPlaceOfBirthCity }}
                    </div>
                  </div>
                </template>
              </AutoComplete>
            </div>
          </div>
        </div>

        <div class="inputs-group">
          <div class="input-box">
            <label for="personMaritalStatus">{{ $t('marital_status') }}</label>
            <Dropdown v-model="employee.person.personMaritalStatus" :options="maritalStatus" optionLabel="label"
              optionValue="value" :placeholder="`${$t('select')} ${$t('marital_status')}`" class="w-full md:w-14rem"
              :disabled="isDeleted || !canManageUserResponsible" :emptyMessage="$t('no_available_options')"
              :emptyFilterMessage="$t('no_results_found')" />
          </div>
          <div
            v-if="employee.person.personMaritalStatus === 'Married' || employee.person.personMaritalStatus === 'Free Union'"
            class="spouse-info">
            <h2>
              {{ $t('spouse_information') }}
            </h2>

            <div class="inputs-group">
              <div class="group-3">
                <div class="input-box">
                  <label for="employeeSpouseFirstname">{{ $t('first_name') }}</label>
                  <InputText v-model="employeeSpouse.employeeSpouseFirstname"
                    :placeholder="`${$t('enter')} ${$t('first_name')}`"
                    :disabled="isDeleted || !canManageUserResponsible" />
                  <small class="p-error" v-if="submitted && !employeeSpouse.employeeSpouseFirstname">{{ $t('first_name')
                    }} {{
                    $t('is_required') }}</small>
                </div>
                <div class="input-box">
                  <label for="employeeSpouseLastname">{{ $t('last_name') }}</label>
                  <InputText v-model="employeeSpouse.employeeSpouseLastname"
                    :placeholder="`${$t('enter')} ${$t('last_name')}`"
                    :disabled="isDeleted || !canManageUserResponsible" />
                  <small class="p-error" v-if="submitted && !employeeSpouse.employeeSpouseLastname">{{ $t('last_name')
                    }} {{
                    $t('is_required') }}</small>
                </div>
                <div class="input-box">
                  <label for="employeeSpouseSecondLastName">{{ $t('second_last_name') }}</label>
                  <InputText v-model="employeeSpouse.employeeSpouseSecondLastname"
                    :placeholder="`${$t('enter')} ${$t('second_last_name')}`"
                    :disabled="isDeleted || !canManageUserResponsible" />
                  <small class="p-error" v-if="submitted && !employeeSpouse.employeeSpouseSecondLastname">{{
                    $t('second_last_name') }}
                    {{ $t('is_required') }}</small>
                </div>
              </div>
              <div class="input-box">
                <label for="employeeSpousePhone">{{ $t('phone') }}</label>
                <InputMask v-model="employeeSpouse.employeeSpousePhone" mask="(999) 999 99 99"
                  :placeholder="`${$t('enter')} ${$t('phone')}`" :disabled="isDeleted || !canManageUserResponsible" />
              </div>
              <div class="input-box">
                <label for="employeeSpouseOcupation">{{ $t('occupation') }}</label>
                <InputText v-model="employeeSpouse.employeeSpouseOcupation"
                  :placeholder="`${$t('enter')} ${$t('ocupation')}`"
                  :disabled="isDeleted || !canManageUserResponsible" />
                <small class="p-error" v-if="submitted && !employeeSpouse.employeeSpouseOcupation">{{ $t('occupation')
                  }} {{ $t('is_required') }}</small>
              </div>
              <div class="input-box">
                <div class="hire-date-box-container">
                  <label for="employeeSpouseBirthDate">{{ $t('birthday') }}</label>
                  <div v-if="!displaySpouseBirthDateCalendar" class="hire-date-box">
                    <InputText v-model="spouseBirthday" readonly class="capitalize"
                      :disabled="isDeleted || !canManageUserResponsible" />
                    <Button type="button" class="btn btn-block" id="display-input-hiredate"
                      @click="handlerDisplaySpouseBirthDate" :disabled="isDeleted || !canManageUserResponsible">
                      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                          fill="#88a4bf" class="fill-212121"></path>
                      </svg>
                    </Button>
                  </div>
                  <div v-if="displaySpouseBirthDateCalendar" class="hire-date-box-controller">
                    <Calendar v-model="employeeSpouse.employeeSpouseBirthday"
                      :placeholder="`${$t('select')} ${$t('birthday')}`"
                      :disabled="isDeleted || !canManageUserResponsible" />
                    <Button type="button" class="btn btn-block" id="display-input-hiredate"
                      @click="displaySpouseBirthDateCalendar = false">
                      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                          fill="#88a4bf" class="fill-212121"></path>
                      </svg>
                    </Button>
                  </div><br>
                </div><small style="position: absolute;" class="p-error"
                  v-if="submitted && !employeeSpouse.employeeSpouseBirthday">{{ $t('birthday') }} {{ $t('is_required')
                  }}</small>
              </div>

            </div>
          </div>

          <div class="children-info">
            <h2>
              {{ $t('children_information') }}
            </h2>
            <div class="head-page">
              <div></div>
              <Button v-if="!isDeleted && canManageUserResponsible" class="btn btn-block" @click="addNewChildren">
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                    fill="#88a4bf" class="fill-000000"></path>
                </svg>
                {{ $t('add_children') }}
              </Button>
            </div>
            <div v-if="employeeChildrenList.length > 0" class="employee-children-card-wrapper">
              <EmployeeChildrenInfoCard v-for="(employeeChildren, index) in employeeChildrenList"
                :key="`employee-children-${employeeChildren.employeeChildrenId}-${index}`"
                :employeeChildren="employeeChildren" :can-update="canUpdate" :can-delete="canDelete"
                :canManageUserResponsible="canManageUserResponsible"
                :click-on-edit="() => { onEditEmployeeChildren(employeeChildren) }"
                :click-on-delete="() => { onDeleteEmployeeChildren(employeeChildren) }" />
            </div>
            <div v-else class="empty">
              <div>
                {{ $t('no_children_registered_yet') }}
              </div>
            </div>
          </div>
          <div class="emergency-contact-info">
            <h2>
              {{ $t('emergency_contact_information') }}
            </h2>

            <div class="inputs-group">
              <div class="group-3">
                <div class="input-box">
                  <label for="employeeEmergencyContactFirstname">{{ $t('first_name') }}</label>
                  <InputText v-model="employeeEmergencyContact.employeeEmergencyContactFirstname"
                    :placeholder="`${$t('enter')} ${$t('first_name')}`"
                    :disabled="isDeleted || !canManageUserResponsible" />
                  <small class="p-error"
                    v-if="submitted && emergencyContactIsRequired && !employeeEmergencyContact.employeeEmergencyContactFirstname">{{
                    $t('first_name') }} {{ $t('is_required') }}</small>
                </div>
                <div class="input-box">
                  <label for="employeeEmergencyContactLastname">{{ $t('last_name') }}</label>
                  <InputText v-model="employeeEmergencyContact.employeeEmergencyContactLastname"
                    :placeholder="`${$t('enter')} ${$t('last_name')}`"
                    :disabled="isDeleted || !canManageUserResponsible" />
                  <small class="p-error"
                    v-if="submitted && emergencyContactIsRequired && !employeeEmergencyContact.employeeEmergencyContactLastname">{{
                    $t('last_name') }} {{ $t('is_required') }}</small>
                </div>
                <div class="input-box">
                  <label for="employeeEmergencyContactSecondLastName">{{ $t('second_last_name') }}</label>
                  <InputText v-model="employeeEmergencyContact.employeeEmergencyContactSecondLastname"
                    :placeholder="`${$t('enter')} ${$t('second_last_name')}`"
                    :disabled="isDeleted || !canManageUserResponsible" />
                  <small class="p-error"
                    v-if="submitted && emergencyContactIsRequired && !employeeEmergencyContact.employeeEmergencyContactSecondLastname">{{
                    $t('second_last_name') }}
                    {{ $t('is_required') }}</small>
                </div>
              </div>
              <div class="input-box">
                <label for="employeeEmergencyContactPhone">{{ $t('phone') }}</label>
                <InputMask v-model="employeeEmergencyContact.employeeEmergencyContactPhone" mask="(999) 999 99 99"
                  :placeholder="`${$t('enter')} ${$t('phone')}`" :disabled="isDeleted || !canManageUserResponsible" />
                <small class="p-error"
                  v-if="submitted && emergencyContactIsRequired && !employeeEmergencyContact.employeeEmergencyContactPhone">{{
                  $t('phone') }} {{ $t('is_required') }}</small>
              </div>
              <div class="input-box">
                <label for="employeeEmergencyContactRelationship">{{ $t('relationship') }}</label>
                <InputText v-model="employeeEmergencyContact.employeeEmergencyContactRelationship"
                  :placeholder="`${$t('enter')} ${$t('relationship')}`"
                  :disabled="isDeleted || !canManageUserResponsible" />
                <small class="p-error"
                  v-if="submitted && emergencyContactIsRequired && !employeeEmergencyContact.employeeEmergencyContactRelationship">{{
                  $t('relationship') }}{{ $t('is_required') }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="box-tools-footer">
          <button v-if="canManageUserResponsible" type="button" class="btn btn-primary btn-block" @click="onSave">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                fill="#ffffff" class="fill-212121"></path>
            </svg>
            {{ $t('save') }}
          </button>
        </div>
        <transition name="page">
          <confirmReactivate v-if="drawerEmployeeReactivate" @confirmReactivate="confirmReactivate"
            @cancelReactivate="onCancelEmployeeReactivate" />
        </transition>

        <Sidebar v-model:visible="drawerEmployeeChildrenForm" :blockScroll="true" :closeOnEscape="false"
          :dismissable="false" header="Employee form" position="right" class="children-form-sidebar"
          :showCloseIcon="true">
          <div v-if="employee && employee.employeeId > 0">
            <employeeModalInfoCard :employee="employee" />
          </div>
          <employeeChildrenInfoForm :employeeChildren="employeeChildren" :isDeleted="isDeleted" @save="onSaveChildren"
            :canManageUserResponsible="canManageUserResponsible" />
        </Sidebar>
        <transition name="page">
          <confirmDelete v-if="drawerEmployeeChildrenDelete" @confirmDelete="confirmDeleteEmployeeChildren"
            @cancelDelete="onCancelEmployeeChildrenDelete" />
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
<style lang="scss">
  @import '/resources/styles/variables.scss';

  .children-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>