<template>
  <div>
    <Toast />
    <div class="vacation-page">

      <Head>
        <Title>
          Vacations on the year
        </Title>
      </Head>

      <NuxtLayout name="backoffice">
        <div v-if="isReady" class="vacation-wrapper">
          <div class="filters">
            <div class="box head-employees-page">
              <div class="input-box">
                <label for="vacation">
                  Period
                </label>
                <Calendar v-if="isReady" v-model="periodSelected" view="year" dateFormat="yy"
                  @update:modelValue="handlerPeriodChange" />
              </div>
              <div class="input-search">
                <!-- -->
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
              <div>
                <Button class="btn btn-vacations" @click="getVacationExcel">
                  <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                      fill="#88a4bf" class="fill-000000"></path>
                  </svg>
                  <span>
                    Vacations
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <h2>
            Vacations days on year
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
                      vacation: !!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).vacation,
                      today: isToday(monthNumber, firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day),
                    }"
                    @click="onShowCurrentVacation(yearSelected, monthNumber, firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day)">
                    <span v-if="!!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).vacation" class="day">
                      {{ firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day }}
                    </span>
                    <span v-if="!!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).vacation" class="quantity">
                      {{ firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).quantity }}
                    </span>
                    <span v-if="!!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).vacation"
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
                      vacation: !!weekDay(monthNumber, iweekDayNumber).vacation,
                      today: isToday(monthNumber, weekDay(monthNumber, iweekDayNumber).day),
                    }"
                    @click="onShowCurrentVacation(yearSelected, monthNumber, weekDay(monthNumber, iweekDayNumber).day)">
                    <span v-if="!!weekDay(monthNumber, iweekDayNumber).vacation" class="day">
                      {{ weekDay(monthNumber, iweekDayNumber).day }}
                    </span>
                    <span v-if="!!weekDay(monthNumber, iweekDayNumber).vacation" class="quantity">
                      {{ weekDay(monthNumber, iweekDayNumber).quantity }}
                    </span>
                    <span v-if="!!weekDay(monthNumber, iweekDayNumber).vacation"
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
        <div v-else class="loader">
          <ProgressSpinner />
        </div>
      </NuxtLayout>
    </div>

    <Sidebar v-model:visible="drawerEmployeesVacation" header="Vacation form" position="right"
      class="vacation-form-sidebar" :showCloseIcon="true">
      <h4>Vacation {{ currentVacation }}</h4>
      <div v-if="filteredEmployeesVacation.length > 0" class="vacations-wrapper">
        <div v-for="(employee, index) in filteredEmployeesVacation" :key="`employee-${employee.employeeId}-${index}`">
          <EmployeeVacationInfoCard :employee="employee" :showDays="false" />
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

  .vacations-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .vacation-card-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .vacation-form-sidebar {
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