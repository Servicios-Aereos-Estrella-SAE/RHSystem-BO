<template>
  <div class="aircraft-calendar-day-wrapper" >
    <div  class="aircraft-calendar-day">
      <div class="day" >
        <div class="date">
          <div>
            {{ calendarDay.formattedDate }}
            <small class="week-day">
              {{ calendarDay.day }}
            </small>
          </div>
        </div>

        <span class="shift">
          {{ calendarDay.aircraft.aircraftRegistrationNumber }} | {{ calendarDay.aircraft.aircraftProperty?.aircraftPropertiesName }}
        </span>

        <div class="date-times">
          <AircraftDateTimeAction
            v-for="timeline in dateTimeLine"
            :key="`key-time-${timeline.hour}-${Math.random()}`"
            :dateTimeLine="timeline"
          />
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
