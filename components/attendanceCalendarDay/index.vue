<template>
  <div class="attendance-calendar-day-wrapper" v-if="checkAssist">
    <div v-if="checkAssist && checkAssist.assist.dateShift" class="attendance-calendar-day">
      <div class="day" :class="{ future: cardIsFuture, rest: cardIsRest }">
        <div class="date">
          <div>
            {{ calendarDay }}
            <small class="week-day">
              {{ weekDayName }}
            </small>
          </div>
          <div class="icons">
            <!-- Icono de permiso -->
            <div v-if="headIconIsException" class="calendar-icon-info">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 8.5v3.522A6.5 6.5 0 0 0 12.022 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18ZM17.75 3A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5ZM12 17.5a5.5 5.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0Zm8.5-3.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h1a2.496 2.496 0 0 0-2-1c-.833 0-1.572.407-2.027 1.036a.5.5 0 0 1-.81-.586A3.496 3.496 0 0 1 17.5 14c.98 0 1.865.403 2.5 1.05v-.55a.5.5 0 0 1 .5-.5ZM15 19.95v.55a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-1c.456.608 1.183 1 2 1 .766 0 1.452-.344 1.911-.888a.5.5 0 0 1 .764.645A3.493 3.493 0 0 1 17.5 21a3.49 3.49 0 0 1-2.5-1.05Z"
                  fill="#3CB4E5" class="fill-212121"></path>
              </svg>
            </div>
            <!-- Icono de cumpleaños -->
            <div v-if="headIconIsBirthday" class="calendar-icon-info">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 7c1.714 0 2-1.34 2-2.444C14 3.45 13.262 1.5 12 1.5s-2 1.951-2 3.056C10 5.66 10.286 7 12 7ZM3.5 10.25A2.25 2.25 0 0 1 5.75 8h12.5a2.25 2.25 0 0 1 2.25 2.25v.875l-3.634 2.726a1.25 1.25 0 0 1-1.384.077l-2.04-1.2a2.75 2.75 0 0 0-2.884.06l-1.761 1.136a1.25 1.25 0 0 1-1.35.003L3.5 11.408V10.25Z"
                  fill="#3CB4E5" class="fill-212121"></path>
                <path
                  d="M3.5 13.188V18.5h-.75a.75.75 0 0 0 0 1.5h18.5a.75.75 0 0 0 0-1.5h-.75V13l-2.734 2.05a2.75 2.75 0 0 1-3.044.171l-2.04-1.2a1.25 1.25 0 0 0-1.311.027l-1.76 1.136a2.75 2.75 0 0 1-2.971.008L3.5 13.187Z"
                  fill="#3CB4E5" class="fill-212121"></path>
              </svg>
            </div>
            <!-- Icono de cambio de turno -->
            <div v-if="headIconShiftIsChange" class="calendar-icon-info">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m15.207 2.292 4 3.995a1 1 0 0 1 .084 1.32l-.083.094-4 4.006a1 1 0 0 1-1.498-1.32l.083-.094L16.083 8H5.5a1 1 0 0 1-.994-.883L4.5 7a1 1 0 0 1 .883-.993L5.5 6h10.59l-2.296-2.293a1 1 0 0 1-.084-1.32l.083-.095a1 1 0 0 1 1.32-.084l.094.084 4 3.995-4-3.995Zm4.283 14.591.007.117a1 1 0 0 1-.883.993l-.117.007H7.913l2.294 2.293a1 1 0 0 1 .084 1.32l-.083.094a1 1 0 0 1-1.32.084l-.095-.084-4-3.996a1 1 0 0 1-.083-1.32l.083-.094 4-4.004a1 1 0 0 1 1.498 1.32l-.083.094L7.918 16h10.579a1 1 0 0 1 .993.883l.007.117-.007-.117Z"
                  fill="#3CB4E5" class="fill-212121"></path>
              </svg>
            </div>

            <!-- Icono de dia festivo -->
            <div v-if="headIconIsHoliday" class="calendar-icon-info">
              <span v-if="checkAssist.assist.holiday" v-html="checkAssist.assist.holiday.holidayIcon"
                v-tooltip.top="checkAssist.assist.holiday.holidayName"></span>
            </div>

            <!-- Icono de descanzo -->
            <div v-else-if="headIconIsRestDay" class="calendar-icon-info">
              <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.1c.1 35.5-28.6 64.3-64 64.3H128.1c-35.35 0-64.01-28.7-64.01-64V287.6H32.05C14.02 287.6 0 273.5 0 255.5c0-9 3.004-17 10.01-24L266.4 8.016c7-7.014 15-8.016 22-8.016s15 2.004 21.1 7.014L564.8 231.5c8 7 12.1 15 11 24zM288 160c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm-32 160c-44.2 0-80 35.8-80 80 0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16 0-44.2-35.8-80-80-80h-64z"
                  fill="#87a4bf" class="fill-000000"></path>
              </svg>
            </div>

            <!-- Icono de vacaciones -->
            <div v-else-if="headIconIsVacationDay" class="calendar-icon-info">
              <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 512 512">
                <path
                  d="M443.9 109.1h-50.8V64.2c8.7-1 15.5-8.3 15.5-17.3 0-9.6-7.8-17.4-17.4-17.4h-87.6c-9.6 0-17.4 7.8-17.4 17.4 0 8.6 6.2 15.7 14.4 17.2v45.1h-55.1c-11.8 0-21.4 9.6-21.4 21.5v24.6h38c12.4 0 23.3 6.7 29.2 16.7h115.9c3.9 0 7 3.1 7 7s-3.1 7-7 7H389v9.9c0 3.9-3.1 7-7 7s-7-3.1-7-7V186h-77.9c-.4 0-.8 0-1.2-.1h-.1c.1 1.1.2 2.2.2 3.3v44.9h48.8c20.9 0 38 17 38 38v186.8c0 9.1-3.2 17.4-8.6 24H444c11.8 0 21.4-9.6 21.4-21.4v-331c-.1-11.8-9.7-21.4-21.5-21.4zm-129.3 0V64.3h64.5v44.8h-64.5zM46.7 271.9v186.8c0 13.3 10.7 24 24 24h33.6V247.9H70.7c-13.3 0-24 10.7-24 24z"
                  fill="#87a4bf" class="fill-333333"></path>
                <path
                  d="M344.7 247.9h-33.6v234.7h33.6c13.2 0 24-10.7 24-24V271.9c0-13.3-10.8-24-24-24zM176.6 247.9h62.1v234.7h-62.1z"
                  fill="#87a4bf" class="fill-333333"></path>
                <path
                  d="M281.9 247.9V189c0-11-8.9-19.9-19.9-19.9H153.4c-11 0-19.9 8.9-19.9 19.9v58.9h-15.2v234.7h44.3V247.9h-15.2V189c0-3.3 2.6-5.9 5.9-5.9H262c3.3 0 5.9 2.6 5.9 5.9v58.9h-15.2v234.7H297V247.9h-15.1z"
                  fill="#87a4bf" class="fill-333333"></path>
              </svg>
            </div>
          </div>
        </div>

        <span class="shift">
          {{ checkAssist.assist?.dateShift?.shiftName || '---' }}
        </span>

        <!-- Es dia festivo -->
        <div v-if="calendarIsHoliday" class="no-work-day">
          <div>
            <div class="icon">
              <span v-html="checkAssist.assist.holiday.holidayIcon"></span>
            </div>
            <div class="text">
              {{ checkAssist.assist.holiday.holidayName }}
            </div>
          </div>
        </div>

        <!-- Es dia de vacaciones -->
        <div v-if="calendarIsVacationDay" class="no-work-day">
          <div>
            <div class="icon">
              <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 512 512">
                <path
                  d="M443.9 109.1h-50.8V64.2c8.7-1 15.5-8.3 15.5-17.3 0-9.6-7.8-17.4-17.4-17.4h-87.6c-9.6 0-17.4 7.8-17.4 17.4 0 8.6 6.2 15.7 14.4 17.2v45.1h-55.1c-11.8 0-21.4 9.6-21.4 21.5v24.6h38c12.4 0 23.3 6.7 29.2 16.7h115.9c3.9 0 7 3.1 7 7s-3.1 7-7 7H389v9.9c0 3.9-3.1 7-7 7s-7-3.1-7-7V186h-77.9c-.4 0-.8 0-1.2-.1h-.1c.1 1.1.2 2.2.2 3.3v44.9h48.8c20.9 0 38 17 38 38v186.8c0 9.1-3.2 17.4-8.6 24H444c11.8 0 21.4-9.6 21.4-21.4v-331c-.1-11.8-9.7-21.4-21.5-21.4zm-129.3 0V64.3h64.5v44.8h-64.5zM46.7 271.9v186.8c0 13.3 10.7 24 24 24h33.6V247.9H70.7c-13.3 0-24 10.7-24 24z"
                  fill="#87a4bf" class="fill-333333"></path>
                <path
                  d="M344.7 247.9h-33.6v234.7h33.6c13.2 0 24-10.7 24-24V271.9c0-13.3-10.8-24-24-24zM176.6 247.9h62.1v234.7h-62.1z"
                  fill="#87a4bf" class="fill-333333"></path>
                <path
                  d="M281.9 247.9V189c0-11-8.9-19.9-19.9-19.9H153.4c-11 0-19.9 8.9-19.9 19.9v58.9h-15.2v234.7h44.3V247.9h-15.2V189c0-3.3 2.6-5.9 5.9-5.9H262c3.3 0 5.9 2.6 5.9 5.9v58.9h-15.2v234.7H297V247.9h-15.1z"
                  fill="#87a4bf" class="fill-333333"></path>
              </svg>
            </div>
            <div class="text">
              Vacation Day
            </div>
          </div>
        </div>

        <!-- Es dia de descanzo -->
        <div v-if="calendarIsRestDay" class="no-work-day">
          <div>
            <div class="icon">
              <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.1c.1 35.5-28.6 64.3-64 64.3H128.1c-35.35 0-64.01-28.7-64.01-64V287.6H32.05C14.02 287.6 0 273.5 0 255.5c0-9 3.004-17 10.01-24L266.4 8.016c7-7.014 15-8.016 22-8.016s15 2.004 21.1 7.014L564.8 231.5c8 7 12.1 15 11 24zM288 160c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm-32 160c-44.2 0-80 35.8-80 80 0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16 0-44.2-35.8-80-80-80h-64z"
                  fill="#87a4bf" class="fill-000000"></path>
              </svg>
            </div>
            <div class="text">
              Rest
            </div>
          </div>
        </div>

        <!-- Es día futuro -->
        <div v-if="calendarIsNextDay" class="no-work-day">
          <div>
            <div class="icon">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.75 3A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5ZM21 8.5v3.522A6.5 6.5 0 0 0 12.022 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18Z"
                  fill="#87a4bf" class="fill-212121"></path>
                <path
                  d="M23 17.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0Zm-5.5 0h2a.5.5 0 1 1 0 1H17a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v2.5Z"
                  fill="#87a4bf" class="fill-212121"></path>
              </svg>
            </div>
            <div class="text">
              Next
            </div>
          </div>
        </div>

        <!-- Checks de asistencia -->
        <div v-if="calendarHasnotIncidences">
          <div class="check">
            <div class="icon">
              <svg v-if="!discriminated" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 17.5a6.47 6.47 0 0 1 1.022-3.5h-7.77a2.249 2.249 0 0 0-2.248 2.25v.577c0 .892.318 1.756.898 2.435 1.566 1.834 3.952 2.74 7.098 2.74.931 0 1.796-.08 2.593-.24A6.475 6.475 0 0 1 11 17.5ZM10 2.005a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
                  fill="#88a4bf" class="fill-212121"></path>
                <path
                  d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm2 5.5h-2V15a.5.5 0 1 0-1 0v3a.5.5 0 0 0 .5.5h2.5a.5.5 0 0 0 0-1Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
              <svg v-if="discriminated" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.25 13.5h-4a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0V12h3.25a.75.75 0 0 1 0 1.5ZM12 2C6.478 2 2 6.478 2 12s4.478 10 10 10 10-4.478 10-10S17.522 2 12 2Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </div>
            <div class="time" :class="checkAssist.assist.checkInStatus">
              {{ chekInTime || ((checkAssist.assist.checkInStatus === 'fault') ? 'Fault' :
              checkAssist.assist.checkInStatus === 'working' ? 'Working' : '---') }}
            </div>
          </div>
          <div class="check">
            <div class="icon">
              <svg v-if="!discriminated" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 17.5a6.47 6.47 0 0 1 1.022-3.5h-7.77a2.249 2.249 0 0 0-2.249 2.25v.919c0 .572.179 1.13.51 1.596C4.057 20.929 6.58 22 10 22c.931 0 1.796-.08 2.592-.238A6.475 6.475 0 0 1 11 17.5ZM10 2.005a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
                  fill="#88a4bf" class="fill-212121"></path>
                <path
                  d="M23 17.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Zm-4.647-2.853a.5.5 0 0 0-.707.707L19.293 17H15a.5.5 0 1 0 0 1h4.293l-1.647 1.647a.5.5 0 0 0 .707.707l2.5-2.5a.497.497 0 0 0 .147-.345V17.5a.498.498 0 0 0-.15-.357l-2.497-2.496Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
              <svg v-if="discriminated" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.25 13.5h-4a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0V12h3.25a.75.75 0 0 1 0 1.5ZM12 2C6.478 2 2 6.478 2 12s4.478 10 10 10 10-4.478 10-10S17.522 2 12 2Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </div>
            <div class="time eat-time">
              {{ chekEatInTime || ((checkAssist.assist.checkInStatus === 'fault') ? 'Fault' : '---') }}
              <span v-if="(chekOutTime && checkAssist.assist.isCheckInEatNextDay)">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.75 4.504a.75.75 0 0 1 .743.648l.007.102v13.499a.75.75 0 0 1-1.493.101L2 18.753v-13.5a.75.75 0 0 1 .75-.75Zm12.46 1.883.083-.094a1 1 0 0 1 1.32-.083l.094.083 4.997 4.998a1 1 0 0 1 .083 1.32l-.083.093-4.996 5.004a1 1 0 0 1-1.499-1.32l.083-.094L18.581 13H6a1 1 0 0 1-.993-.883L5 12a1 1 0 0 1 .883-.993L6 11h12.584l-3.291-3.293a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </span>
            </div>
          </div>
          <div class="check">
            <div class="icon">
              <svg v-if="!discriminated" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm-5.478 2A6.47 6.47 0 0 0 11 17.5c0 1.644.61 3.145 1.617 4.29-.802.141-1.675.21-2.617.21-2.89 0-5.128-.656-6.691-2a3.75 3.75 0 0 1-1.305-2.843v-.907A2.25 2.25 0 0 1 4.254 14h7.768Zm4.697.588-.069.058-2.515 2.517-.041.05-.035.058-.032.078-.012.043-.01.086.003.088.019.085.032.078.025.042.05.066 2.516 2.516a.5.5 0 0 0 .765-.638l-.058-.069L15.711 18h4.79a.5.5 0 0 0 .491-.41L21 17.5a.5.5 0 0 0-.41-.492L20.5 17h-4.789l1.646-1.647a.5.5 0 0 0 .058-.637l-.058-.07a.5.5 0 0 0-.638-.058ZM10 2.004a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
              <svg v-if="discriminated" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.25 13.5h-4a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0V12h3.25a.75.75 0 0 1 0 1.5ZM12 2C6.478 2 2 6.478 2 12s4.478 10 10 10 10-4.478 10-10S17.522 2 12 2Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </div>
            <div class="time eat-time">
              {{ chekEatOutTime || ((checkAssist.assist.checkInStatus === 'fault') ? 'Fault' : '---') }}
              <span v-if="(chekOutTime && checkAssist.assist.isCheckOutEatNextDay)">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.75 4.504a.75.75 0 0 1 .743.648l.007.102v13.499a.75.75 0 0 1-1.493.101L2 18.753v-13.5a.75.75 0 0 1 .75-.75Zm12.46 1.883.083-.094a1 1 0 0 1 1.32-.083l.094.083 4.997 4.998a1 1 0 0 1 .083 1.32l-.083.093-4.996 5.004a1 1 0 0 1-1.499-1.32l.083-.094L18.581 13H6a1 1 0 0 1-.993-.883L5 12a1 1 0 0 1 .883-.993L6 11h12.584l-3.291-3.293a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </span>
            </div>
          </div>
          <div class="check">
            <div class="icon">
              <svg v-if="!discriminated" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 17.5a6.47 6.47 0 0 1 1.022-3.5h-7.77a2.249 2.249 0 0 0-2.248 2.25v.577c0 .892.318 1.756.898 2.435 1.566 1.834 3.952 2.74 7.098 2.74.931 0 1.796-.08 2.593-.24A6.475 6.475 0 0 1 11 17.5ZM10 2.005a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
                  fill="#88a4bf" class="fill-212121"></path>
                <path
                  d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm2 5.5h-2V15a.5.5 0 1 0-1 0v3a.5.5 0 0 0 .5.5h2.5a.5.5 0 0 0 0-1Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
              <svg v-if="discriminated" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.25 13.5h-4a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0V12h3.25a.75.75 0 0 1 0 1.5ZM12 2C6.478 2 2 6.478 2 12s4.478 10 10 10 10-4.478 10-10S17.522 2 12 2Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </div>
            <div class="time" :class="checkAssist.assist.checkOutStatus">
              {{ chekOutTime || (checkAssist.assist.checkOutStatus === 'working' ? 'Working' : '---')}}
              <span v-if="(chekOutTime && checkAssist.assist.isCheckOutNextDay)">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.75 4.504a.75.75 0 0 1 .743.648l.007.102v13.499a.75.75 0 0 1-1.493.101L2 18.753v-13.5a.75.75 0 0 1 .75-.75Zm12.46 1.883.083-.094a1 1 0 0 1 1.32-.083l.094.083 4.997 4.998a1 1 0 0 1 .083 1.32l-.083.093-4.996 5.004a1 1 0 0 1-1.499-1.32l.083-.094L18.581 13H6a1 1 0 0 1-.993-.883L5 12a1 1 0 0 1 .883-.993L6 11h12.584l-3.291-3.293a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </span>
            </div>
          </div>
          <div class="check info check-notes" :class="{ inactive: !(checkAssist.assist.hasExceptions || hasNotes) }"
            @click="displayExceptionComments(checkAssist)">
            <div class="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.5 3A9.51 9.51 0 0 0 3 12.5a9.39 9.39 0 0 0 2.44 6.35l-2.29 2.3a.47.47 0 0 0-.11.54.5.5 0 0 0 .46.31h9a9.5 9.5 0 0 0 0-19Zm-4 11.5a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm4 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm4 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z"
                  fill="#3CB4E5" class="fill-464646"></path>
              </svg>
            </div>
            <div class="note">
              {{ (checkAssist.assist.hasExceptions || hasNotes) ? 'Notes' : 'Without notes' }}
            </div>
          </div>
          <div :class="{'check info': true, 'inactive': !checkAssist.assist.isSundayBonus}">
            <div class="icon">
              <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" d="M0 0h256v256H0z"></path>
                <path
                  d="m235.7 136.9-42.7 64a15.9 15.9 0 0 1-13.3 7.1H24a7.8 7.8 0 0 1-7-4.2 8 8 0 0 1 .3-8.2L62.4 128 17.3 60.4a8 8 0 0 1-.3-8.2 7.8 7.8 0 0 1 7-4.2h155.7a15.9 15.9 0 0 1 13.3 7.1l42.7 64a16 16 0 0 1 0 17.8Z"
                  fill="#3CB4E5" class="fill-000000"></path>
              </svg>
            </div>
            <div class="note" :class="{ active: checkAssist.assist.isSundayBonus }">
              Sunday bonus
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="attendance-calendar-day no-shift-calendar">
      <div class="day">
        <div>
          <div class="icon">
            <svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 14.5V7H3v2.468a4.5 4.5 0 0 1 6.061 5.972l1.56 1.56H14.5a2.5 2.5 0 0 0 2.5-2.5Zm0-9A2.5 2.5 0 0 0 14.5 3h-9A2.5 2.5 0 0 0 3 5.5V6h14v-.5ZM7.096 16.303a3.5 3.5 0 1 1 .707-.707l2.55 2.55a.5.5 0 0 1-.707.708l-2.55-2.55ZM7.5 13.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"
                fill="#87a4bf" class="fill-212121"></path>
            </svg>
          </div>
          <span>
            This day has not
            <br>
            assigned shift
          </span>
        </div>
      </div>
    </div>

    <Sidebar v-model:visible="commentsSidebar" header="Exception Notes" position="right" class="exception-day-sidebar">
      <h3 v-if="dayExceptions.length > 0">Exception notes</h3>
      <div v-for="(item, index) in dayExceptions" :key="`dayExceptions-${index}-${item.shiftExceptionId}`"
        class="exception-date">
        <div class="day">
          {{ calendarDay }}
          <small class="week-day">
            {{ weekDayName }}
          </small>
        </div>
        <div class="exception-type">
          <div class="dot">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="8" fill="#093057" class="fill-000000"></circle>
              <path data-name="<Transparent Rectangle>" d="M0 0h32v32H0z" fill="none"></path>
            </svg>
          </div>
          {{ item.exceptionType.exceptionTypeTypeName }}
        </div>
        <div class="exception-description">
          {{ item.shiftExceptionsDescription }}
        </div>
        <div v-if="item.shiftExceptionCheckInTime" class="exception-time">
          Check In Time: {{ item.shiftExceptionCheckInTime }}
        </div>
        <div v-if="item.shiftExceptionCheckOutTime" class="exception-time">
          Check Out Time: {{ item.shiftExceptionCheckOutTime }}
        </div>
      </div>
      <br>
      <h3 v-if="employeeShiftChangesList.length > 0">Shift change notes</h3>
      <div v-for="(item, index) in employeeShiftChangesList" :key="`dayExceptions-${index}-${item.shiftExceptionId}`"
        class="exception-date">
        <div class="day">
          {{ calendarDay }}
          <small class="week-day">
            {{ weekDayName }}
          </small>
        </div>
        <div class="exception-type">
          <div class="dot">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="8" fill="#093057" class="fill-000000"></circle>
              <path data-name="<Transparent Rectangle>" d="M0 0h32v32H0z" fill="none"></path>
            </svg>
          </div>
          Shift change
        </div>
        <div class="exception-description">
          {{ item.employeeShiftChangeNote }}
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

  .attendance-calendar-day {
    .no-work-day {
      .icon {
        height: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;

        svg {
          width: 4rem;
        }
      }
    }

    .calendar-icon-info {
      width: 2rem;
      text-align: center;

      svg {
        width: 1.5rem;
      }
    }
  }

  .p-sidebar.exception-day-sidebar {
    width: 100% !important;
    max-width: 30rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>