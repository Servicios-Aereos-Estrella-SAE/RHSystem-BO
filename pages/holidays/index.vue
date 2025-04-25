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

          <CalendarView
            :year="yearSelected"
            :marked-days="calendarHolidays"
            marked-day-class="holiday"
            hideIndicator
            @day-click="onDayClick"
          />
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

  .holiday-form-sidebar {
    width: 30rem !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>