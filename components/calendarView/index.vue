<template>
  <div>
    <div class="calendars-wrapper">
      <div v-for="month in calendarData" :key="`month-year-${month.monthNumber}`" class="calendar-month"
        :class="month.status">
        <div class="month-title">
          <h2>
            {{ capitalizeFirstLetter(month.monthName) }}, {{ year }}
          </h2>
        </div>
        <div class="month-week-head">
          <div v-for="numberDay in weekDays" :key="`week-day-${numberDay}`" class="week-day">
            {{ weekDayName(numberDay).substring(0, 3) }}
          </div>
        </div>
        <div class="month-days-wrapper">
          <div v-for="(week, weekIndex) in month.days" :key="`month-week-${weekIndex}`" class="month-week">
            <div v-for="(day, dayIndex) in week" :key="`month-day-${dayIndex}`" class="week-day-cell" :class="{
                'marked-day': !!day.marked,
                'today': day.isToday,
                'ghost': day.isEmpty
              }" @click="day.day && !day.isEmpty ? onDayClick(month.monthNumber, day.day) : null">
              <span v-if="!!day.marked && !hideIndicator" class="quantity">
                {{ day.quantity }}
              </span>

              <span v-if="!!day.marked" v-html="day.icon" class="cell-icon"></span>
              <span v-if="!!day.marked" class="cell-icon-day">
                {{ day.day }}
              </span>

              <span v-else-if="!day.isEmpty">
                {{ day.day }}
              </span>
            </div>
          </div>
        </div>
      </div>
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