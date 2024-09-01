<template>
  <div class="attendance-calendar-day-wrapper" v-if="checkAssist">
    <div v-if="checkAssist && checkAssist.assist.dateShift" class="attendance-calendar-day">
      <div class="day" :class="{ future: checkAssist.assist.isFutureDay, rest: checkAssist.assist.isRestDay && !chekInTime && checkAssist.assist.checkInStatus !== 'working' }">
        <div class="date">
          <div>
            {{ calendarDay }}
            <small class="week-day">
              {{ weekDayName }}
            </small>
          </div>
          <div class="icons">
            <div v-if="checkAssist.assist.hasExceptions && !checkAssist.assist.isVacationDate" class="calendar-icon-info">
              <svg style="width: 1.3rem;" viewBox="0 0 48 48" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g fill="#33D4AD" class="fill-241f20"><path d="M25.916 8v15.359l7.076 7.075-2.828 2.828L21.9 25l.016-.017V8zM2.216 34.138H0v4.747h2.216a9.432 9.432 0 0 0 1.306 2.934l-1.521 1.522 2.693 2.691 1.544-1.543a9.443 9.443 0 0 0 2.808 1.231v2.216h4.761V45.72a9.461 9.461 0 0 0 2.867-1.269l1.486 1.484 2.692-2.691-1.485-1.484c.572-.864 1-1.831 1.268-2.862h2.218v-4.776h-2.218a9.51 9.51 0 0 0-1.23-2.8l1.448-1.449-2.692-2.692-1.426 1.425a9.487 9.487 0 0 0-2.918-1.302v-2.22h-4.78v2.22a9.477 9.477 0 0 0-2.858 1.267l-1.483-1.486-2.693 2.694 1.484 1.484a9.376 9.376 0 0 0-1.271 2.875zm5.294 2.373a3.917 3.917 0 1 1 7.834 0 3.917 3.917 0 0 1-7.834 0zM.025 22.997v2.007C.012 24.67 0 24.336 0 24s.012-.67.025-1.003z"></path><path d="M30.083 9.958 31.041 9H31l2.555-2.555A19.857 19.857 0 0 0 24 4C13.322 4 4.624 12.375 4.055 22.911H.027C.598 10.162 11.11 0 24 0c4.576 0 8.845 1.293 12.483 3.517L39 1v.042L40.041 0v9.715l-.243.243h-9.715zM44 24a19.81 19.81 0 0 0-1.709-8.048l2.998-2.998A23.804 23.804 0 0 1 48 24c0 13.255-10.745 24-24 24v-4c11.046 0 20-8.954 20-20z"></path></g></svg>
            </div>
            <div v-if="checkAssist.assist.isHoliday && chekInTime" class="calendar-icon-info">
              <span v-if="checkAssist.assist.holiday" v-html="checkAssist.assist.holiday.holidayIcon" v-tooltip.top="checkAssist.assist.holiday.holidayName"></span>
            </div>
            <div v-else-if="(checkAssist.assist.isRestDay && chekInTime) || (checkAssist.assist.isRestDay && checkAssist.assist.checkInStatus === 'working')" class="calendar-icon-info">
              <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.1c.1 35.5-28.6 64.3-64 64.3H128.1c-35.35 0-64.01-28.7-64.01-64V287.6H32.05C14.02 287.6 0 273.5 0 255.5c0-9 3.004-17 10.01-24L266.4 8.016c7-7.014 15-8.016 22-8.016s15 2.004 21.1 7.014L564.8 231.5c8 7 12.1 15 11 24zM288 160c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm-32 160c-44.2 0-80 35.8-80 80 0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16 0-44.2-35.8-80-80-80h-64z" fill="#87a4bf" class="fill-000000"></path></svg>
            </div>
            <div v-else-if="checkAssist.assist.isVacationDate && chekInTime" class="calendar-icon-info">
              <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512"><path d="M443.9 109.1h-50.8V64.2c8.7-1 15.5-8.3 15.5-17.3 0-9.6-7.8-17.4-17.4-17.4h-87.6c-9.6 0-17.4 7.8-17.4 17.4 0 8.6 6.2 15.7 14.4 17.2v45.1h-55.1c-11.8 0-21.4 9.6-21.4 21.5v24.6h38c12.4 0 23.3 6.7 29.2 16.7h115.9c3.9 0 7 3.1 7 7s-3.1 7-7 7H389v9.9c0 3.9-3.1 7-7 7s-7-3.1-7-7V186h-77.9c-.4 0-.8 0-1.2-.1h-.1c.1 1.1.2 2.2.2 3.3v44.9h48.8c20.9 0 38 17 38 38v186.8c0 9.1-3.2 17.4-8.6 24H444c11.8 0 21.4-9.6 21.4-21.4v-331c-.1-11.8-9.7-21.4-21.5-21.4zm-129.3 0V64.3h64.5v44.8h-64.5zM46.7 271.9v186.8c0 13.3 10.7 24 24 24h33.6V247.9H70.7c-13.3 0-24 10.7-24 24z" fill="#87a4bf" class="fill-333333"></path><path d="M344.7 247.9h-33.6v234.7h33.6c13.2 0 24-10.7 24-24V271.9c0-13.3-10.8-24-24-24zM176.6 247.9h62.1v234.7h-62.1z" fill="#87a4bf" class="fill-333333"></path><path d="M281.9 247.9V189c0-11-8.9-19.9-19.9-19.9H153.4c-11 0-19.9 8.9-19.9 19.9v58.9h-15.2v234.7h44.3V247.9h-15.2V189c0-3.3 2.6-5.9 5.9-5.9H262c3.3 0 5.9 2.6 5.9 5.9v58.9h-15.2v234.7H297V247.9h-15.1z" fill="#87a4bf" class="fill-333333"></path></svg>
            </div>
          </div>
        </div>
        <div v-if="checkAssist.assist.isFutureDay && !checkAssist.assist.isHoliday" class="no-work-day">
          <div>
            <div class="icon">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.75 3A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5ZM21 8.5v3.522A6.5 6.5 0 0 0 12.022 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18Z" fill="#87a4bf" class="fill-212121"></path><path d="M23 17.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0Zm-5.5 0h2a.5.5 0 1 1 0 1H17a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v2.5Z" fill="#87a4bf" class="fill-212121"></path></svg>
            </div>
            <div class="text">
              Next
            </div>
          </div>
        </div>
        <div v-else-if="checkAssist.assist.isRestDay && !chekInTime && checkAssist.assist.checkInStatus !== 'working'" class="no-work-day">
          <div>
            <div class="icon">
              <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.1c.1 35.5-28.6 64.3-64 64.3H128.1c-35.35 0-64.01-28.7-64.01-64V287.6H32.05C14.02 287.6 0 273.5 0 255.5c0-9 3.004-17 10.01-24L266.4 8.016c7-7.014 15-8.016 22-8.016s15 2.004 21.1 7.014L564.8 231.5c8 7 12.1 15 11 24zM288 160c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm-32 160c-44.2 0-80 35.8-80 80 0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16 0-44.2-35.8-80-80-80h-64z" fill="#87a4bf" class="fill-000000"></path></svg>
            </div>
            <div class="text">
              Rest
            </div>
          </div>
        </div>
        <div v-else-if="checkAssist.assist.isVacationDate && !chekInTime" class="no-work-day">
          <div>
            <div class="icon">
              <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512"><path d="M443.9 109.1h-50.8V64.2c8.7-1 15.5-8.3 15.5-17.3 0-9.6-7.8-17.4-17.4-17.4h-87.6c-9.6 0-17.4 7.8-17.4 17.4 0 8.6 6.2 15.7 14.4 17.2v45.1h-55.1c-11.8 0-21.4 9.6-21.4 21.5v24.6h38c12.4 0 23.3 6.7 29.2 16.7h115.9c3.9 0 7 3.1 7 7s-3.1 7-7 7H389v9.9c0 3.9-3.1 7-7 7s-7-3.1-7-7V186h-77.9c-.4 0-.8 0-1.2-.1h-.1c.1 1.1.2 2.2.2 3.3v44.9h48.8c20.9 0 38 17 38 38v186.8c0 9.1-3.2 17.4-8.6 24H444c11.8 0 21.4-9.6 21.4-21.4v-331c-.1-11.8-9.7-21.4-21.5-21.4zm-129.3 0V64.3h64.5v44.8h-64.5zM46.7 271.9v186.8c0 13.3 10.7 24 24 24h33.6V247.9H70.7c-13.3 0-24 10.7-24 24z" fill="#87a4bf" class="fill-333333"></path><path d="M344.7 247.9h-33.6v234.7h33.6c13.2 0 24-10.7 24-24V271.9c0-13.3-10.8-24-24-24zM176.6 247.9h62.1v234.7h-62.1z" fill="#87a4bf" class="fill-333333"></path><path d="M281.9 247.9V189c0-11-8.9-19.9-19.9-19.9H153.4c-11 0-19.9 8.9-19.9 19.9v58.9h-15.2v234.7h44.3V247.9h-15.2V189c0-3.3 2.6-5.9 5.9-5.9H262c3.3 0 5.9 2.6 5.9 5.9v58.9h-15.2v234.7H297V247.9h-15.1z" fill="#87a4bf" class="fill-333333"></path></svg>
            </div>
            <div class="text">
              Vacation Day
            </div>
          </div>
        </div>
        <div v-else-if="checkAssist.assist.isHoliday && checkAssist.assist.holiday && !checkAssist.assist.checkIn && !checkAssist.assist.checkOut" class="no-work-day">
          <div>
            <div class="icon">
              <span v-html="checkAssist.assist.holiday.holidayIcon"></span>
            </div>
            <div class="text">
              {{ checkAssist.assist.holiday.holidayName }}
            </div>
          </div>
        </div>
        <div v-else>
          <div class="check">
            <div class="icon">
              <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h256v256H0z"></path><path d="M136 80v43.4l37.6 21.7a8 8 0 0 1-4 14.9 7.1 7.1 0 0 1-4-1.1l-41.6-24h-.2l-.4-.2-.3-.3-.3-.2-.3-.3-.2-.2c-.2-.1-.3-.3-.4-.4l-.2-.2-.2-.4-.2-.3-.2-.3a.5.5 0 0 1-.2-.4l-.2-.3c0-.1-.1-.2-.1-.4a.4.4 0 0 1-.1-.3l-.2-.4a.4.4 0 0 0-.1-.3c0-.2 0-.3-.1-.4v-.4c0-.2-.1-.3-.1-.4V80a8 8 0 0 1 16 0Zm59.9-19.9a96.2 96.2 0 0 0-135.8 0l-8.3 8.3-14.3-14.3a8 8 0 0 0-8.7-1.8 8.2 8.2 0 0 0-5 7.4v40a8 8 0 0 0 8 8h40a8 8 0 0 0 5.7-13.6L63.1 79.7l8.3-8.3a80 80 0 1 1 0 113.2 7.9 7.9 0 0 0-11.3 0 8 8 0 0 0 0 11.3A96 96 0 0 0 195.9 60.1Z" fill="#303e67" class="fill-000000"></path></svg>
            </div>
            <div class="time" :class="checkAssist.assist.checkInStatus">
              {{ chekInTime || ((checkAssist.assist.checkInStatus === 'fault') ? 'Fault' : checkAssist.assist.checkInStatus === 'working' ? 'Working' : '---') }}
            </div>
          </div>
          <div class="check">
            <div class="icon">
              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 0A2.508 2.508 0 0 0 7 2.5c0 .563.194 1.08.512 1.5H7.5A2.508 2.508 0 0 0 5 6.5v4c0 1.203.864 2.215 2 2.45v5.55A1.5 1.5 0 0 0 8.5 20h2a1.5 1.5 0 0 0 1.5-1.5V18h-1v.5a.5.5 0 0 1-.5.5H10v-5.5a.5.5 0 0 0-1 0V19h-.5a.5.5 0 0 1-.5-.5v-11a.5.5 0 1 0-1 0v4.41c-.584-.204-1-.752-1-1.41v-4C6 5.666 6.666 5 7.5 5h.012a1 1 0 0 0 1-1c0-.217-.072-.429-.23-.643A1.451 1.451 0 0 1 8 2.5C8 1.666 8.666 1 9.5 1s1.5.666 1.5 1.5c0 .342-.122.644-.281.857-.16.214-.23.426-.23.643a1 1 0 0 0 1 1h.011c.834 0 1.5.666 1.5 1.5v4c0 .658-.416 1.206-1 1.41V7.5a.5.5 0 0 0-1 0V15h1v-2.05h.002A2.51 2.51 0 0 0 14 10.5v-4C14 5.125 12.875 4 11.5 4h-.012c.318-.42.512-.937.512-1.5C12 1.125 10.875 0 9.5 0zM15 13l3 3h-7v1h7l-3 3h1.5l3.5-3.5-3.5-3.5H15z" fill="#303e67" fill-opacity="1" stroke="none" stroke-width="0" class="fill-222222"></path></svg>
            </div>
            <div class="time eat-time">
              {{ chekEatInTime || ((checkAssist.assist.checkInStatus === 'fault') ? 'Fault' : '---') }}
            </div>
          </div>
          <div class="check">
            <div class="icon">
              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 0A2.508 2.508 0 0 0 7 2.5c0 .563.194 1.08.512 1.5H7.5A2.508 2.508 0 0 0 5 6.5v4c0 1.203.864 2.215 2 2.45v5.55A1.5 1.5 0 0 0 8.5 20h2c.702 0 1.286-.485 1.45-1.137l-.95-.949v.586a.5.5 0 0 1-.5.5H10v-2.086l-.414-.414.414-.414V13.5a.5.5 0 0 0-1 0V19h-.5a.5.5 0 0 1-.5-.5v-11a.5.5 0 1 0-1 0v4.41c-.584-.204-1-.752-1-1.41v-4C6 5.666 6.666 5 7.5 5h.012a1 1 0 0 0 1-1c0-.217-.072-.429-.23-.643A1.451 1.451 0 0 1 8 2.5C8 1.666 8.666 1 9.5 1s1.5.666 1.5 1.5c0 .342-.122.644-.281.857-.16.214-.23.426-.23.643a1 1 0 0 0 1 1h.011c.834 0 1.5.666 1.5 1.5v4c0 .658-.416 1.206-1 1.41V7.5a.5.5 0 0 0-1 0v7.586l1-1v-1.137h.002A2.51 2.51 0 0 0 14 10.5v-4C14 5.125 12.875 4 11.5 4h-.012c.318-.42.512-.937.512-1.5C12 1.125 10.875 0 9.5 0zm5 13L11 16.5l3.5 3.5H16l-3-3h7v-1h-7l3-3h-1.5z" fill="#303e67" fill-opacity="1" stroke="none" stroke-width="0" class="fill-222222"></path></svg>
            </div>
            <div class="time eat-time">
              {{ chekEatOutTime || ((checkAssist.assist.checkInStatus === 'fault') ? 'Fault' : '---') }}
            </div>
          </div>
          <div class="check">
            <div class="icon">
              <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h256v256H0z"></path><path d="M136 80v43.4l37.6 21.7a8 8 0 0 1-4 14.9 7.1 7.1 0 0 1-4-1.1l-41.6-24h-.2l-.4-.2-.3-.3-.3-.2-.3-.3-.2-.2c-.2-.1-.3-.3-.4-.4l-.2-.2-.2-.4-.2-.3-.2-.3a.5.5 0 0 1-.2-.4l-.2-.3c0-.1-.1-.2-.1-.4a.4.4 0 0 1-.1-.3l-.2-.4a.4.4 0 0 0-.1-.3c0-.2 0-.3-.1-.4v-.4c0-.2-.1-.3-.1-.4V80a8 8 0 0 1 16 0Zm91.2-27.7a8 8 0 0 0-8.7 1.8l-14.3 14.3-8.3-8.3a96 96 0 1 0 0 135.8 8 8 0 0 0 0-11.3 7.9 7.9 0 0 0-11.3 0 80 80 0 1 1 0-113.2l8.3 8.3-14.4 14.4a8 8 0 0 0 5.7 13.6h40a8 8 0 0 0 8-8v-40a8.2 8.2 0 0 0-5-7.4Z" fill="#303e67" class="fill-000000"></path></svg>
            </div>
            <div class="time" :class="checkAssist.assist.checkOutStatus">
              {{ chekOutTime || (checkAssist.assist.checkOutStatus === 'working' ? 'Working' : '---')}}
            </div>
          </div>
          <div class="check info check-notes" :class="{ inactive: !checkAssist.assist.hasExceptions }" @click="displayExceptionComments(checkAssist)">
            <div class="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 3A9.51 9.51 0 0 0 3 12.5a9.39 9.39 0 0 0 2.44 6.35l-2.29 2.3a.47.47 0 0 0-.11.54.5.5 0 0 0 .46.31h9a9.5 9.5 0 0 0 0-19Zm-4 11.5a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm4 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm4 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z" fill="#33D4AD" class="fill-464646"></path></svg>
            </div>
            <div class="note">
              {{ checkAssist.assist.hasExceptions ? 'Exception Notes' : 'Without notes' }}
            </div>
          </div>
          <div class="check info inactive">
            <div class="icon">
              <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h256v256H0z"></path><path d="m235.7 136.9-42.7 64a15.9 15.9 0 0 1-13.3 7.1H24a7.8 7.8 0 0 1-7-4.2 8 8 0 0 1 .3-8.2L62.4 128 17.3 60.4a8 8 0 0 1-.3-8.2 7.8 7.8 0 0 1 7-4.2h155.7a15.9 15.9 0 0 1 13.3 7.1l42.7 64a16 16 0 0 1 0 17.8Z" fill="#33D4AD" class="fill-000000"></path></svg>
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
            <svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17 14.5V7H3v2.468a4.5 4.5 0 0 1 6.061 5.972l1.56 1.56H14.5a2.5 2.5 0 0 0 2.5-2.5Zm0-9A2.5 2.5 0 0 0 14.5 3h-9A2.5 2.5 0 0 0 3 5.5V6h14v-.5ZM7.096 16.303a3.5 3.5 0 1 1 .707-.707l2.55 2.55a.5.5 0 0 1-.707.708l-2.55-2.55ZM7.5 13.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" fill="#87a4bf" class="fill-212121"></path></svg>
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
      <div v-for="(item, index) in dayExceptions" :key="`dayExceptions-${index}-${item.shiftExceptionId}`" class="exception-date">
        <div class="day">
          {{ calendarDay }}
          <small class="week-day">
            {{ weekDayName }}
          </small>
        </div>
        <div class="exception-type">
          <div class="dot">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="8" fill="#093057" class="fill-000000"></circle><path data-name="<Transparent Rectangle>" d="M0 0h32v32H0z" fill="none"></path></svg>
          </div>
          {{ item.exceptionType.exceptionTypeTypeName }}
        </div>
        <div class="exception-description">
          {{ item.shiftExceptionsDescription }}
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