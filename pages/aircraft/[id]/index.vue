<template>
  <div class="aircrafts-page">
    <Toast />

    <Head>
      <Title>
        Aircrafts
      </Title>
    </Head>

    <NuxtLayout name="backoffice">
      <div class="aircraft-wrapper" v-if="aircraft">
        <div class="box head-page">
          <div class="employee-wrapper">
            <div class="avatar">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.989 11.946a1.991 1.991 0 0 1-2.05 1.99l-4.738-.139-3.454 7.143c-.277.574-.86.94-1.498.94a.926.926 0 0 1-.919-1.037l.862-7.193-3.765-.11-.49 1.341a1.29 1.29 0 0 1-1.211.847.901.901 0 0 1-.901-.902V13.35l-.81-.169a1.261 1.261 0 0 1 0-2.469l.81-.168V9.066c0-.46.343-.838.788-.894l.113-.007a1.29 1.29 0 0 1 1.21.846l.492 1.34 3.751-.11-.849-7.084a.93.93 0 0 1-.005-.055l-.002-.055c0-.511.415-.926.926-.926.585 0 1.123.307 1.423.8l.075.14 3.403 7.035 4.79-.14a1.991 1.991 0 0 1 2.048 1.932l.001.058Z" fill="#88a4bf" class="fill-212121"></path></svg>
            </div>
            <h1 class="capitalize">
              <div>
                {{ `${aircraft.aircraftProperty?.aircraftPropertiesName || ''}`.toLocaleLowerCase() }}
                <span class="name-emp-code">
                  ( Registration Number: {{ aircraft.aircraftRegistrationNumber }} )
                </span>
              </div>
              <small>
                Serial Number: {{ aircraft.aircraftSerialNumber }}
              </small>
              <small class="emp-code">
                Serial Number: {{ aircraft.aircraftSerialNumber }}
              </small>
            </h1>
          </div>
          <div></div>
          <div class="input-search">
            <div class="input-box">
              <label for="search">
                Search Aircraft
              </label>
              <AutoComplete
                v-model="aircraftSearch"
                :optionLabel="() => `${aircraftSearch.aircraftProperty?.aircraftPropertiesName} ${aircraftSearch.aircraftRegistrationNumber}`"
                :suggestions="filterAircrafts"
                @complete="handlerSearchAircraft"
                @item-select="onAircraftSelect"
              >
                <template #option="aircraft">
                  <div class="item-employee-filter-attendance-monitor">
                    <div class="name">
                      {{ aircraft.option.aircraftProperty?.aircraftPropertiesName }}
                      {{ aircraft.option.aircraftRegistrationNumber }}
                    </div>
                    <div class="position-department">
                      {{ aircraft.option.aircraftSerialNumber }}
                    </div>
                  </div>
                </template>
              </AutoComplete>
            </div>
            <button class="btn btn-block">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </button>
          </div>
          <div class="input-box">
            <label for="departments">
              Period
            </label>
            <Calendar
              v-model="periodSelected"
              :showWeek="false"
              @update:modelValue="handlerPeriodChange"
              view="month"
            />
          </div>
        </div>
        <div  class="box report-wrapper">
          <div class="head">
            <h2>
              Calendar Aircraft
            </h2>
          </div>
           <div class="days-wrapper">
              <div v-for="(calendarDay, index) in calendarDayReservation" :key="`key-calendar-day-${Math.random()}-${index}`">
                <aircraftCardDay
                  :calendarDay="calendarDay"
                />
              </div>
            </div>
        </div>
      </div>

      <Sidebar
        v-model:visible="drawerProceedingFiles"
        header="Aircraft proceeding files"
        position="right"
        class="proceeding-file-sidebar"
        :blockScroll="true"
        :closeOnEscape="false"
        :dismissable="false"
        :showCloseIcon="true"
      >
        <aircraftProceedingFile :aircraft="aircraft" />
      </Sidebar>

      <transition name="page">
        <confirmDelete
          v-if="drawerAircraftDelete"
          @confirmDelete="confirmDelete"
          @cancelDelete="drawerAircraftDelete = false"
        />
      </transition>

    </NuxtLayout>
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

  .aircraft-card-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .aircraft-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>