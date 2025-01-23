<template>
  <div class="itinerary-info-form">
    <Toast />
    <div class="itinerary-form">
      <div class="input-text-row input-text-row-reservation-leg">
        <div class="input-box required">
          <label for="someField" class="input-label">
            From
          </label>
          <span class="icon" :class="{'translate-30': isSubmitted && !reservationLeg.airportDepartureId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-airplane-engines-fill" viewBox="0 0 16 16">
              <path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.35 4.35 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0"/>
            </svg>
          </span>
          <Dropdown 
            :disabled="!editMode"
            filter v-model="reservationLeg.airportDepartureId" :options="formatAirports" optionLabel="customName" optionValue="airportId"
            placeholder="Select departure" class="w-full md:w-14rem"/>
            <small class="p-error" v-if="isSubmitted && !reservationLeg.airportDepartureId">departure airport is required.</small>
        </div>
        <div class="input-box required">
          <label for="someField" class="input-label">
            Depart local
          </label>
          <span class="icon" :class="{'translate-30': isSubmitted && !reservationLeg.reservationLegDepartureDate}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check-fill" viewBox="0 0 16 16">
              <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
            </svg>
          </span>
          <Calendar
              :disabled="!editMode"
              v-model="reservationLeg.reservationLegDepartureDate"
              dateFormat="dd/mm/yy"
              :minDate="new Date()"
              :showWeek="false"
              placeholder="dd/mm/yy"
            />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegDepartureDate">Departure date is required</small>
        </div>
        <div class="input-box required">
          <label hidden for="someField" class="input-label">
            (24hrs)
          </label>
          <span class="icon" :class="{'translate-30': isSubmitted && !reservationLeg.reservationLegDepartureTime}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
            </svg>
          </span>
            <InputText :disabled="!editMode" type="time" v-model="reservationLeg.reservationLegDepartureTime" />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegDepartureTime">Departure time is required</small>
        </div>
        <div class="input-box required">
          <label for="someField" class="input-label">
            To
          </label>
          <!-- <span class="icon" :class="{'translate-30': isSubmitted && !reservationLeg.airportDestinationId}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </span> -->
          <Dropdown :disabled="!editMode" filter v-model="reservationLeg.airportDestinationId" :options="formatAirports" optionLabel="customName" optionValue="airportId"
            placeholder="Select arrival" class="w-full md:w-14rem"/>
            <small class="p-error" v-if="isSubmitted && !reservationLeg.airportDestinationId">Arrival airport is required</small>
        </div>
        <div class="input-box required">
          <label for="someField" class="input-label">
            Arrive local
          </label>
          <span class="icon" :class="{'translate-30': isSubmitted && !reservationLeg.reservationLegArriveDate}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check-fill" viewBox="0 0 16 16">
              <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
            </svg>
          </span>
          <Calendar
              :disabled="!editMode"
              v-model="reservationLeg.reservationLegArriveDate"
              dateFormat="dd/mm/yy"
              :minDate="new Date()"
              :showWeek="false"
              placeholder="dd/mm/yy"
            />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegArriveDate">Arrival date is required</small>
        </div>
        <div class="input-box">
          <label for="someField" class="input-label">
            (24hrs)
          </label>
          <span class="icon translate5" :class="{'translate-30': isSubmitted && !reservationLeg.reservationLegArriveTime}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
            </svg>
          </span>
            <InputText :disabled="!editMode" type="time" v-model="reservationLeg.reservationLegArriveTime" />
          <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegArriveTime">Arrival time is required</small>
        </div>
        <div class="input-box required">
          <label for="someField" class="input-label">
            Pax
          </label>
          <span class="icon translate5" :class="{'translate-30': isSubmitted && !reservationLeg.reservationLegPax}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
            </svg>
          </span>
          <InputText :disabled="!editMode" type="number" v-model="reservationLeg.reservationLegPax" placeholder="3" />
          <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegPax">Pax is required</small>
        </div>
        <div class="input-box required">
          <label for="someField" class="input-label">
            Leg travel time (mins)
          </label>
          <span class="icon translate5" :class="{'translate-30': isSubmitted && !reservationLeg.reservationLegTravelTime}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hourglass-split" viewBox="0 0 16 16">
              <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
            </svg>
          </span>
            <InputText :disabled="!editMode" type="number" v-model="reservationLeg.reservationLegTravelTime" />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegTravelTime">Travel time is required</small>
        </div>
        <div class="input-box required">
          <label for="someField" class="input-label">
            Distance (NM)
          </label>
          <span class="icon translate5" :class="{'translate-30': isSubmitted && !reservationLeg.reservationLegDistanceMn}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe-americas" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z"/>
            </svg>
          </span>
          <InputText :disabled="!editMode" type="number" v-model='reservationLeg.reservationLegDistanceMn' placeholder="MN" />
          <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegDistanceMn">Distance is required</small>
        </div>
        <div class="input-box required">
          <div class="btn-group btn-group-with-stops mt-5">
            <!-- Botón 1 (rojo clarito y ícono rojo intenso) -->

            <!-- Botón 2 (gris con ícono azul) -->
            <button class="btn btn-middle">
              <span class="icon translate5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                </svg>
              </span>
            </button>

            <!-- Botón 3 (rojo clarito y ícono rojo intenso) -->
            <button v-if="index != 0" @click="removeLeg()" class="btn btn-right">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                </svg>
              </span>
            </button>
            <button v-if="isLast && editMode" class="btn btn-middle" @click="addLeg()">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
              </span>
            </button>
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
 
  .pilot-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  .input-text-row-reservation-leg .p-calendar input {
      padding: 0.5rem 0.5rem 0.5rem 2rem !important;
      width: 100% !important;
  }
</style>

