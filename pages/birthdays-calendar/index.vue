<template>
  <div>
    <Toast />
    <div class="birthday-page">

      <Head>
        <Title>
          {{ $t('birthdays_on_the_year') }}
        </Title>
      </Head>

      <NuxtLayout name="backoffice">
        <div class="birthday-wrapper">
          <div class="filters">
            <div class="box head-employees-page">
              <div class="input-box">
                <label for="birthday">
                  {{ $t('period') }}
                </label>
                <Calendar v-if="isReady" v-model="periodSelected" view="year" dateFormat="yy"
                  @update:modelValue="handlerPeriodChange" />
              </div>
              <div class="input-search">
                <div class="input-box">
                  <label for="search">
                    {{ $t('search_employee') }}
                  </label>
                  <InputText v-model="search" :placeholder="$t('employee_name_or_id')"
                    @keypress.enter="handlerSearchEmployee" />
                </div>
                <button class="btn btn-block" @click="handlerSearchEmployee">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </button>
              </div>
              <div class="input-box">
                <label for="role">
                  {{ $t('department') }}
                </label>
                <Dropdown v-model="departmentId" :options="departments" optionLabel="departmentName"
                  optionValue="departmentId" :placeholder="$t('select_a_department')" filter class="w-full md:w-14rem"
                  showClear :emptyMessage="$t('no_available_options')" :emptyFilterMessage="$t('no_results_found')" />
              </div>
              <div class="input-box">
                <label for="positionId">{{ $t('position') }}</label>
                <Dropdown v-model="positionId" :options="positions" optionLabel="positionName" optionValue="positionId"
                  :placeholder="$t('select_a_position')" filter class="w-full md:w-14rem" showClear
                  :emptyMessage="$t('no_available_options')" :emptyFilterMessage="$t('no_results_found')" />
              </div>
              <div></div>
            </div>
          </div>

          <h2>
            {{ $t('birthdays_on_the_year') }}
          </h2>

          <CalendarView :year="yearSelected" :marked-days="filterBirthdays" marked-day-class="birthday"
            @day-click="onShowCurrentBirthday" />

        </div>
      </NuxtLayout>
    </div>

    <Sidebar v-model:visible="drawerEmployeesBirthday" header="Birthday form" position="right"
      class="birthday-form-sidebar" :showCloseIcon="true">
      <h4>{{ $t('birthday') }} {{ currentBirthday }}</h4>
      <div v-if="filteredEmployeesBirthday.length > 0" class="employee-card-wrapper">
        <div v-for="(employee, index) in filteredEmployeesBirthday" :key="`employee-${employee.employeeId}-${index}`">
          <EmployeeInfoCard :click-on-photo="() => { onPhoto(employee) }" :employee="employee"
            :can-manage-shifts="false" :can-update="false" :can-delete="false" :canReadOnlyFiles="false"
            :canManageFiles="false" :click-on-edit="() => { onEdit(employee) }"
            :click-on-delete="() => { onDelete(employee) }" />
        </div>
      </div>
      <div v-else class="employee-card-wrapper">
        <div class="empty-data">
          {{ $t('there_are_no_employees') }}
        </div>
      </div>
    </Sidebar>
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

  .birthday-form-sidebar {
    width: 30rem !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>