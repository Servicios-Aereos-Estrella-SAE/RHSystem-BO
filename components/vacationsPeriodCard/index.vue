<template>
  <div v-if="vacationPeriod" class="vacation-period-card">
    <div class="title">
      {{ vacationPeriod.vacationPeriodRange }}
    </div>
    <div class="info">
      <div class="prop">
        Active work years
      </div>
      <div class="value">
        {{ vacationPeriod.vacationPeriodActiveWorkYears.toString().padStart(2, '0') }}
      </div>
    </div>
    <div class="info">
      <div class="prop">
        Corresponding days
      </div>
      <div class="value">
        {{ vacationPeriod.vacationPeriodCorrespondingDays.toString().padStart(2, '0') }}
      </div>
    </div>
    <div class="info">
      <div class="prop">
        Used days
      </div>
      <div class="value">
        {{ vacationPeriod.vacationPeriodUsedDays.toString().padStart(2, '0') }}
      </div>
    </div>
    <div class="info">
      <div class="prop">
        Available days
      </div>
      <div class="value">
        {{ vacationPeriod.vacationPeriodAvailableDays.toString().padStart(2, '0') }}
      </div>
    </div>
    <br>
    <Button v-if="!hideManager" class="btn btn-block" @click="handlerClickManage">
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z" fill="#88a4bf" class="fill-212121"></path></svg>
      Manage vacations
    </Button>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>