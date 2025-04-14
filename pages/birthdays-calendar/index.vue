<template>
  <div>
    <Toast />
    <div class="birthday-page">

      <Head>
        <Title>
          Birthday's on the year
        </Title>
      </Head>

      <NuxtLayout name="backoffice">
        <div class="birthday-wrapper">
          <div class="filters">
            <div class="box head-employees-page">
              <div class="input-box">
                <label for="birthday">
                  Period
                </label>
                <Calendar v-if="isReady" v-model="periodSelected" view="year" dateFormat="yy"
                  @update:modelValue="handlerPeriodChange" />
              </div>
              <div class="input-search">
                <div class="input-box">
                  <label for="search">
                    Search employee
                  </label>
                  <InputText v-model="search" placeholder="Employee name or id"
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
                  Department
                </label>
                <Dropdown v-model="departmentId" :options="departments" optionLabel="departmentName"
                  optionValue="departmentId" placeholder="Select a Department" filter class="w-full md:w-14rem"
                  showClear />
              </div>
              <div class="input-box">
                <label for="positionId">Position</label>
                <Dropdown v-model="positionId" :options="positions" optionLabel="positionName" optionValue="positionId"
                  placeholder="Select a Position" filter class="w-full md:w-14rem" showClear />
              </div>
              <div></div>
            </div>
          </div>

          <h2>
            Birthday days on year
          </h2>

          <div class="calendars-wrapper">
            <div v-for="monthNumber in 12" :key="`month-year-${monthNumber}`" class="calendar-month"
              :class="monthStatus(monthNumber)">
              <div class="month-title">
                <h2>
                  {{ getMonthInfo(monthNumber).monthName }}, {{ yearSelected }}
                </h2>
              </div>
              <div class="month-week-head">
                <div v-for="numberDay in weekDays" :key="`week-day-${numberDay}`" class="week-day">
                  {{ weekDayName(numberDay) }}
                </div>
              </div>
              <div class="month-days-wrapper">
                <div v-for="week in 1" :key="`month-week-${week}`" class="month-week">
                  <div v-for="(weekDayNumber, iweekDayNumber) in weekDays" :key="`month-day-${weekDayNumber}`"
                    class="week-day-cell" :class="{
                      birthday: !!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).birthday,
                      today: isToday(monthNumber, firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day),
                    }"
                    @click="onShowCurrentBirthday(yearSelected, monthNumber, firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day)">
                    <span v-if="!!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).birthday" class="quantity">
                      {{ firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).quantity }}
                    </span>
                    <span v-if="!!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).birthday"
                      v-html="firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).icon"
                      class="holyday-cell-icon"></span>
                    <span v-else>
                      {{ firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day }}
                    </span>
                  </div>
                </div>

                <div class="month-weeks">
                  <div v-for="(weekDayNumber, iweekDayNumber) in lastWeeksRestDays(monthNumber)"
                    :key="`month-day-${weekDayNumber}`" class="week-day-cell" :class="{
                      birthday: !!weekDay(monthNumber, iweekDayNumber).birthday,
                      today: isToday(monthNumber, weekDay(monthNumber, iweekDayNumber).day),
                    }"
                    @click="onShowCurrentBirthday(yearSelected, monthNumber, weekDay(monthNumber, iweekDayNumber).day)">
                    <span v-if="!!weekDay(monthNumber, iweekDayNumber).birthday" class="quantity">
                      {{ weekDay(monthNumber, iweekDayNumber).quantity }}
                    </span>
                    <span v-if="!!weekDay(monthNumber, iweekDayNumber).birthday"
                      v-html="weekDay(monthNumber, iweekDayNumber).icon" class="holyday-cell-icon"></span>
                    <span v-else>
                      {{ weekDay(monthNumber, iweekDayNumber).day }}
                    </span>
                  </div>
                </div>

                <div v-if="getMonthInfo(monthNumber).weeks === 5" class="month-weeks">
                  <div v-for="(weekDayNumber) in 7" :key="`month-day-${weekDayNumber}`" class="week-day-cell ghost">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NuxtLayout>
    </div>

    <Sidebar v-model:visible="drawerEmployeesBirthday" header="Birthday form" position="right"
      class="birthday-form-sidebar" :showCloseIcon="true">
      <h4>Birthday {{ currentBirthday }}</h4>
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
          There are no employees
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

  .holyday-cell-icon {

    svg {
      width: 2rem;
    }
  }

  .birthday-card-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .birthday-form-sidebar {
    width: 30rem !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .empty-data {
    text-align: center;
    background-color: $gray;
    padding: 2rem;
    color: $icon;
    border-radius: $radius;
    font-size: 0.8rem;
    height: 10rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
