<template>
  <div>

    <div class="holidays-page">
      <Head>
        <Title>
          Holidays
        </Title>
      </Head>

      <NuxtLayout name="backoffice">
        <div class="holiday-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="holidays">
                Period
              </label>
              <Calendar v-if="isReady" v-model="periodSelected" view="year" dateFormat="yy" @update:modelValue="handlerPeriodChange" />
            </div>
            <div></div>
            <div class="input-box">
              <button v-if="canCreate" class="btn btn-block" @click="addNew">
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
                Add holiday
              </button>
            </div>
          </div>

          <h2>
            Holidays on year
          </h2>
          <Message :closable="false">
            Please note that the holidays recorded will be considered rest days for employees.
          </Message>

          <div class="calendars-wrapper">
            <div v-for="monthNumber in 12" :key="`month-year-${monthNumber}`" class="calendar-month" :class="monthStatus(monthNumber)">
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
                  <div
                    v-for="(weekDayNumber, iweekDayNumber) in weekDays"
                    :key="`month-day-${weekDayNumber}`"
                    class="week-day-cell"
                    :class="{
                      holiday: !!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).holiday,
                      today: isToday(monthNumber, firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day),
                    }"
                    @click="onEdit(firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).holiday, monthNumber, firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day)"
                  >
                    <span v-if="!!firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).holiday" v-html="firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).holidayIcon" class="holyday-cell-icon"></span>
                    <span v-else>
                      {{ firstWeekDay(monthNumber, weekDayNumber, iweekDayNumber).day }}
                    </span>
                  </div>
                </div>

                <div class="month-weeks">
                  <div
                    v-for="(weekDayNumber, iweekDayNumber) in lastWeeksRestDays(monthNumber)"
                    :key="`month-day-${weekDayNumber}`"
                    class="week-day-cell"
                    :class="{
                      holiday: !!weekDay(monthNumber, iweekDayNumber).holiday,
                      today: isToday(monthNumber, weekDay(monthNumber, iweekDayNumber).day),
                    }"
                    @click="onEdit(weekDay(monthNumber, iweekDayNumber).holiday, monthNumber, weekDay(monthNumber, iweekDayNumber).day)"
                  >
                    <span v-if="!!weekDay(monthNumber, iweekDayNumber).holiday"
                      v-html="weekDay(monthNumber, iweekDayNumber).holidayIcon"
                      class="holyday-cell-icon"></span>
                    <span v-else>
                      {{ weekDay(monthNumber, iweekDayNumber).day }}
                    </span>
                  </div>
                </div>

                <div v-if="getMonthInfo(monthNumber).weeks === 5" class="month-weeks">
                  <div v-for="(weekDayNumber) in 7" :key="`month-day-${weekDayNumber}`" class="week-day-cell ghost"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NuxtLayout>
    </div>

    <Sidebar v-model:visible="drawerHolidayForm" header="Holiday form" position="right"
      class="holiday-form-sidebar" :showCloseIcon="true">
      <HolidayInfoForm :holiday="holiday" @save="onSave" @confirmDelete="confirmDelete" />
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

  .holiday-card-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .holiday-form-sidebar {
    width: 30rem !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
