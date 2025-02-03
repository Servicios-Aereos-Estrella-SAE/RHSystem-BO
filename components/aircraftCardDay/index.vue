<template>
  <div class="attendance-calendar-day-wrapper" >
    <div  class="attendance-calendar-day">
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
          {{ calendarDay.aircraft.aircraftProperty?.aircraftPropertiesName }} | {{ calendarDay.aircraft.aircraftRegistrationNumber }}
        </span>
        <!-- Checks de asistencia -->
        <div v-for="(legFromToday, index) in legsFromToday" :key="`key-leg-${legFromToday.id}`">
          <div class="check">
            <div class="icon">
              <svg v-if="index === 0" fill="#737373" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#737373"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M176,216a8.00008,8.00008,0,0,1-8,8H24a8,8,0,0,1,0-16H168A8.00008,8.00008,0,0,1,176,216ZM247.0957,89.4668,228.45605,66.686a35.81374,35.81374,0,0,0-46.11523-8.2334L139.53906,83.62988,81.26465,64.20508a4.0083,4.0083,0,0,0-2.83985.11816l-16.5,7.0708A12.00078,12.00078,0,0,0,58.625,91.34375L85.21191,115.272l-21.46679,12.2666L37.5752,116.32324a4.00251,4.00251,0,0,0-3.1504,0l-16.75292,7.17969a12.00032,12.00032,0,0,0-3.48145,19.78418h.001l37.69531,35.33935a35.78229,35.78229,0,0,0,42.7168,4.85938L246.01074,95.458a4.001,4.001,0,0,0,1.085-5.99121Z"></path> </g></svg>
              <svg v-if="index !== 0 && legFromToday?.airportDestination?.airportIcaoCode === 'MMTO'" fill="#737373" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.024"></g><g id="SVGRepo_iconCarrier"> <path d="M248,216a8.00008,8.00008,0,0,1-8,8H96a8,8,0,0,1,0-16H240A8.00008,8.00008,0,0,1,248,216Zm-24-28a4.00035,4.00035,0,0,0,4-4V148.32275a36.10691,36.10691,0,0,0-26.36523-34.68652l-46.97852-13.0498L123.47266,46.01562a4.00193,4.00193,0,0,0-2.208-1.81054l-13.46973-4.49024A12.00071,12.00071,0,0,0,92,51.09961V82.55908L66.75781,74.6709,51.5293,46.11768a4.00065,4.00065,0,0,0-2.26465-1.9126L35.79492,39.71484A12.00071,12.00071,0,0,0,20,51.09961v52.62988A36.11994,36.11994,0,0,0,46.294,138.396l176.62793,49.45605A4.00591,4.00591,0,0,0,224,188Z"></path> </g></svg>
              <svg v-else-if="index !== 0" fill="#737373" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M224,216a8.00008,8.00008,0,0,1-8,8H72a8,8,0,0,1,0-16H216A8.00008,8.00008,0,0,1,224,216ZM208,100H153.75977L110.94824,53.29688A3.99911,3.99911,0,0,0,108,52H91.09961A12.00015,12.00015,0,0,0,79.71484,67.79492L90.4502,100H65.87305L47.07324,77.43945A4.001,4.001,0,0,0,44,76H26.752A11.99986,11.99986,0,0,0,15.25879,91.44824l14.06836,46.89649A35.77737,35.77737,0,0,0,63.80859,164H240a4.0002,4.0002,0,0,0,4-4V136A36.04061,36.04061,0,0,0,208,100Z"></path> </g></svg>
            </div>
            <div class="legs">
              {{ legFromToday?.airportDeparture?.airportIcaoCode }} - {{ legFromToday?.airportDestination?.airportIcaoCode }} 
              <br/>
              <p class="time">{{ formatTime(legFromToday?.reservationLegDepartureTime) }} - {{ formatTime(legFromToday?.reservationLegArriveTime) }}</p>
              <p class="time" v-if="legFromToday.reservationLegDepartureDate !== legFromToday.reservationLegArriveDate">{{ formatDate(legFromToday?.reservationLegDepartureDate) }} - {{ formatDate(legFromToday?.reservationLegArriveDate) }}</p>
            </div>
          </div>
          <div class="check" v-if="index === legsFromToday.length - 1 && legFromToday.airportDestination.airportIcaoCode !== 'MMTO' && legFromToday.reservationLegDepartureDate === legFromToday.reservationLegArriveDate">
            <div class="icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18 2.75C17.5858 2.75 17.25 2.41421 17.25 2C17.25 1.58579 17.5858 1.25 18 1.25H22C22.3034 1.25 22.5768 1.43273 22.6929 1.71299C22.809 1.99324 22.7449 2.31583 22.5304 2.53033L19.8107 5.25H22C22.4142 5.25 22.75 5.58579 22.75 6C22.75 6.41421 22.4142 6.75 22 6.75H18C17.6967 6.75 17.4232 6.56727 17.3071 6.28701C17.191 6.00676 17.2552 5.68417 17.4697 5.46967L20.1894 2.75H18ZM13.5 8.75C13.0858 8.75 12.75 8.41421 12.75 8C12.75 7.58579 13.0858 7.25 13.5 7.25H16.5C16.8034 7.25 17.0768 7.43273 17.1929 7.71299C17.309 7.99324 17.2449 8.31583 17.0304 8.53033L15.3107 10.25H16.5C16.9142 10.25 17.25 10.5858 17.25 11C17.25 11.4142 16.9142 11.75 16.5 11.75H13.5C13.1967 11.75 12.9232 11.5673 12.8071 11.287C12.691 11.0068 12.7552 10.6842 12.9697 10.4697L14.6894 8.75H13.5Z" fill="#1C274C"></path> <path opacity="0.5" d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#1C274C"></path> </g></svg>
            </div>
            <div class="legs">
              {{ legFromToday?.airportDestination?.airportIcaoCode }} 
              <br/>
              <p class="time">{{ formatTime(legFromToday?.reservationLegArriveTime)  }} - {{'11:59 PM'}}</p>
            </div>
          </div>
        </div>
        <div v-if="legsFromToday.length === 0" class="no-work-day">
          <div>
            <div class="icon">
              <svg v-if="!hasPeroctation" fill="#737373" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M503.551,397.939h-61.744l-16.246-141.94h7.02c4.124,0,7.646-2.978,8.332-7.044l9.4-55.763 c0.413-2.451-0.274-4.961-1.879-6.86s-3.966-2.993-6.452-2.993h-66.007v-55.762c0-4.666-3.783-8.449-8.449-8.449 c-4.666,0-8.449,3.783-8.449,8.449v55.762H293.07c-2.486,0-4.846,1.095-6.452,2.993c-1.605,1.898-2.294,4.408-1.879,6.86 l9.4,55.763c0.685,4.067,4.207,7.044,8.332,7.044h7.028l-5.899,51.555c-7.727-3.794-16.408-5.932-25.581-5.932H127.53 c-32.118,0-58.249,26.131-58.249,58.249v38.068H8.449c-4.666,0-8.449,3.783-8.449,8.449s3.783,8.449,8.449,8.449h495.102 c4.666,0,8.449-3.783,8.449-8.449S508.217,397.939,503.551,397.939z M168.88,397.94h-7.927v-12.58 c0-4.666-3.783-8.449-8.449-8.449c-4.666,0-8.449,3.783-8.449,8.449v12.58H86.179v-38.068c0-22.802,18.55-41.351,41.351-41.351 s41.351,18.55,41.351,41.351V397.94z M168.509,318.521h109.507c14.395,0,27.089,7.398,34.498,18.587H181.144 C178.16,330.105,173.839,323.804,168.509,318.521z M319.366,397.939H185.779v-13.515h133.587V397.939z M319.366,367.526H185.779 v-7.654c0-1.979-0.101-3.936-0.295-5.865h133.459c0.274,1.916,0.424,3.873,0.424,5.865V367.526z M336.265,397.939v-38.068 c0-15.992-6.481-30.497-16.95-41.034l7.191-62.839h82.047v0.001l16.247,141.94H336.265z M416.183,239.102 c-0.032,0-0.062-0.005-0.095-0.005h-97.121c-0.032,0-0.062,0.005-0.095,0.005h-9.26l-6.551-38.864h128.927l-6.551,38.864H416.183z "></path> </g> </g> <g> <g> <path d="M503.551,426.665H8.449c-4.666,0-8.449,3.783-8.449,8.449s3.783,8.449,8.449,8.449h495.102 c4.666,0,8.449-3.783,8.449-8.449S508.217,426.665,503.551,426.665z"></path> </g> </g> <g> <g> <path d="M234.879,68.436h-99.972c-14.209,0-25.77,11.56-25.77,25.769c0,3.115,0.557,6.104,1.573,8.871h-0.874 c-14.209,0-25.77,11.56-25.77,25.769c0,14.209,11.561,25.769,25.77,25.769h59.711c14.209,0,25.769-11.56,25.769-25.769 c0-3.115-0.557-6.104-1.573-8.871h41.135c14.209,0,25.77-11.56,25.77-25.769S249.089,68.436,234.879,68.436z M234.878,103.075 h-65.331c-4.666,0-8.449,3.783-8.449,8.449s3.783,8.449,8.449,8.449c4.892,0,8.871,3.979,8.871,8.871s-3.979,8.871-8.871,8.871 h-59.711c-4.892,0-8.872-3.979-8.872-8.871s3.98-8.871,8.872-8.871h25.071c4.666,0,8.449-3.783,8.449-8.449 s-3.783-8.449-8.449-8.449c-4.892,0-8.872-3.979-8.872-8.871c0-4.892,3.98-8.871,8.872-8.871h99.972 c4.892,0,8.872,3.979,8.872,8.871C243.75,99.096,239.77,103.075,234.878,103.075z"></path> </g> </g> <g> <g> <path d="M367.525,271.206c-4.666,0-8.449,3.783-8.449,8.449v10.139c0,4.667,3.783,8.449,8.449,8.449 c4.666,0,8.449-3.783,8.449-8.449v-10.139C375.974,274.989,372.191,271.206,367.525,271.206z"></path> </g> </g> <g> <g> <path d="M367.525,311.761c-4.666,0-8.449,3.783-8.449,8.449v10.139c0,4.666,3.783,8.449,8.449,8.449 c4.666,0,8.449-3.783,8.449-8.449V320.21C375.974,315.544,372.191,311.761,367.525,311.761z"></path> </g> </g> <g> <g> <path d="M406.39,211.221h-77.73c-4.666,0-8.449,3.783-8.449,8.449s3.783,8.449,8.449,8.449h77.73c4.666,0,8.449-3.783,8.449-8.449 S411.056,211.221,406.39,211.221z"></path> </g> </g> </g></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 22H16" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="0.5" d="M5 19H19" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 16H22" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="0.5" d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM21.25 12C21.25 13.3169 20.9752 14.5677 20.4806 15.6997L21.8552 16.3003C22.431 14.9824 22.75 13.5275 22.75 12H21.25ZM3.51935 15.6997C3.02475 14.5677 2.75 13.3169 2.75 12H1.25C1.25 13.5275 1.56904 14.9824 2.14482 16.3003L3.51935 15.6997ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z" fill="#737373"></path> <path d="M19.9001 2.30719C19.7392 1.8976 19.1616 1.8976 19.0007 2.30719L18.5703 3.40247C18.5212 3.52752 18.4226 3.62651 18.298 3.67583L17.2067 4.1078C16.7986 4.26934 16.7986 4.849 17.2067 5.01054L18.298 5.44252C18.4226 5.49184 18.5212 5.59082 18.5703 5.71587L19.0007 6.81115C19.1616 7.22074 19.7392 7.22074 19.9001 6.81116L20.3305 5.71587C20.3796 5.59082 20.4782 5.49184 20.6028 5.44252L21.6941 5.01054C22.1022 4.849 22.1022 4.26934 21.6941 4.1078L20.6028 3.67583C20.4782 3.62651 20.3796 3.52752 20.3305 3.40247L19.9001 2.30719Z" stroke="#737373"></path> <path d="M16.0328 8.12967C15.8718 7.72009 15.2943 7.72009 15.1333 8.12967L14.9764 8.52902C14.9273 8.65407 14.8287 8.75305 14.7041 8.80237L14.3062 8.95987C13.8981 9.12141 13.8981 9.70107 14.3062 9.86261L14.7041 10.0201C14.8287 10.0694 14.9273 10.1684 14.9764 10.2935L15.1333 10.6928C15.2943 11.1024 15.8718 11.1024 16.0328 10.6928L16.1897 10.2935C16.2388 10.1684 16.3374 10.0694 16.462 10.0201L16.8599 9.86261C17.268 9.70107 17.268 9.12141 16.8599 8.95987L16.462 8.80237C16.3374 8.75305 16.2388 8.65407 16.1897 8.52902L16.0328 8.12967Z" stroke="#737373"></path> </g></svg>
            </div>
            <div class="text" v-if="!hasPeroctation">
              There is no itinerary for this day.
            </div>
            <div class="text" v-else>
              The aircraft is scheduled to stay overnight.
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