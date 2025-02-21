<template>
  <div class="aircraft-selected-info">
    <div v-if="true" class="aircraft-info">

      <div class="">
        <p class="aircraft-title">Aircraft Selected</p>
      </div>

      <div class="aircraft-image" v-if="!reservation.aircraft">
        <div class="banner">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.989 11.946a1.991 1.991 0 0 1-2.05 1.99l-4.738-.139-3.454 7.143c-.277.574-.86.94-1.498.94a.926.926 0 0 1-.919-1.037l.862-7.193-3.765-.11-.49 1.341a1.29 1.29 0 0 1-1.211.847.901.901 0 0 1-.901-.902V13.35l-.81-.169a1.261 1.261 0 0 1 0-2.469l.81-.168V9.066c0-.46.343-.838.788-.894l.113-.007a1.29 1.29 0 0 1 1.21.846l.492 1.34 3.751-.11-.849-7.084a.93.93 0 0 1-.005-.055l-.002-.055c0-.511.415-.926.926-.926.585 0 1.123.307 1.423.8l.075.14 3.403 7.035 4.79-.14a1.991 1.991 0 0 1 2.048 1.932l.001.058Z" fill="#88a4bf" class="fill-212121"></path></svg>
        </div>
      </div>

      <div class="aircraft-image" v-if="reservation.aircraft">
        <div v-if="reservation.aircraft.aircraftProperty?.aircraftPropertiesBanner">
          <img :src="reservation.aircraft.aircraftProperty?.aircraftPropertiesBanner" :alt="reservation.aircraft.aircraftProperty.aircraftPropertiesName">
        </div>
        <div class="banner" v-else>
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.989 11.946a1.991 1.991 0 0 1-2.05 1.99l-4.738-.139-3.454 7.143c-.277.574-.86.94-1.498.94a.926.926 0 0 1-.919-1.037l.862-7.193-3.765-.11-.49 1.341a1.29 1.29 0 0 1-1.211.847.901.901 0 0 1-.901-.902V13.35l-.81-.169a1.261 1.261 0 0 1 0-2.469l.81-.168V9.066c0-.46.343-.838.788-.894l.113-.007a1.29 1.29 0 0 1 1.21.846l.492 1.34 3.751-.11-.849-7.084a.93.93 0 0 1-.005-.055l-.002-.055c0-.511.415-.926.926-.926.585 0 1.123.307 1.423.8l.075.14 3.403 7.035 4.79-.14a1.991 1.991 0 0 1 2.048 1.932l.001.058Z" fill="#88a4bf" class="fill-212121"></path></svg>
        </div>
      </div>

      <div class="details">
        <div class="aircraft-details-info">
          <p>Aircraft</p>
          <p v-if="reservation.aircraft?.aircraftProperty">{{reservation.aircraft.aircraftProperty.aircraftPropertiesName}}</p>
        </div>
        <div class="aircraft-details-info">
          <p>Aircraft Class</p>
          <p  v-if="reservation.aircraft?.aircraftProperty?.aircraftClass">
            {{reservation.aircraft?.aircraftProperty?.aircraftClass.aircraftClassName}}
          </p>
        </div>
        <div class="aircraft-details-info">
          <p>PAX Limit</p>
          <p v-if="reservation.aircraft?.aircraftProperty">{{reservation.aircraft.aircraftProperty.aircraftPropertiesPax}} PAX</p>
        </div>
        <div class="aircraft-details-info">
          <p>Autonomy</p>
          <p v-if="reservation.aircraft?.aircraftProperty">{{reservation.aircraft.aircraftProperty.aircraftPropertiesAutonomy}} mn</p>
        </div>
        <div class="aircraft-details-info">
          <p>Autonomy Hours</p>
          <p v-if="reservation.aircraft?.aircraftProperty">{{reservation.aircraft.aircraftProperty.aircraftPropertiesAutonomyHours}} Hrs</p>
        </div>
        <div class="aircraft-details-info">
          <p>Max Bggage</p>
          <p v-if="reservation.aircraft?.aircraftProperty">{{reservation.aircraft.aircraftProperty.aircraftPropertiesMaxKg}} kg</p>
        </div>
        <div class="aircraft-details-info">
          <p>Hourly Rate</p>
          <p v-if="reservation.aircraft?.aircraftProperty">${{reservation.aircraft.aircraftProperty.aircraftPropertiesMaxKg}}USD</p>
        </div>
      </div>



      <div class="detail-itinerary">
        <div class="itinerary-info" v-for="(leg, index) in reservation.reservationLegs" :key="leg.reservationLegId">
          <p class="title-itinerary">Itinerary Leg {{index + 1}} </p>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <svg viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M484.6 62c18-9.2 38-14 58.2-14h57.4c27 0 45.7 26.95 36.2 52.2-18.2 48.7-54.3 88.7-100.8 112L262.8 348.6c-4.5 2.2-9.4 3.4-14.4 3.4H110.7c-9.3 0-18.2-4.1-24.28-11.2l-73.08-85.2c-6.778-7.9-4.321-20.1 4.99-24.8l32.16-16c8.56-4.3 18.57-4.6 27.31-.7l57.3 25 99.5-49.4L87.64 95.2c-10.43-6.71-9.59-22.22 1.5-27.77L135 44.48c15.1-7.96 34.5-8.93 51.1-2.68L381 114.9 484.6 62zM0 480c0-17.7 14.33-32 32-32h576c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.67 0-32-14.3-32-32z" fill="#88a4bf" class="fill-000000"></path></svg>
            </div>
            <div v-if="leg.airportDeparture">
              <p>{{leg.airportDeparture?.airportIcaoCode}}</p>
              <p>{{leg.airportDeparture?.airportName}}</p>
              <p>{{leg.airportDeparture?.airportDisplayLocationName}}</p>
              <p v-if="leg.reservationLegDepartureDate">
                {{ legDateFormat(leg.reservationLegDepartureDate, leg.reservationLegDepartureTime) }} - ({{ leg.reservationLegPax }} PAX)
              </p>
            </div>

          </div>
          <br>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <svg viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="m.253 166.9-.21-98.91C.02 57.74 9.508 50.11 19.51 52.34l35.56 7.9a31.987 31.987 0 0 1 23.02 20L95.1 127.1l128.2 38.5-41.5-145.2C178.9 10.18 186.6.001 197.2.001h40.1c11.5 0 22.2 6.235 27.9 16.309l109 193.89 107.3 31.6c15.9 4.7 30.7 12.5 43.7 22.9l34.4 27.5c24.1 19.2 18.1 57.3-10.7 68.3-41.2 15.6-86.2 18-128.8 6.9l-298.4-77.6c-11.1-2.9-21.2-8.7-29.3-16.9L9.536 189.4c-5.93-6-9.265-14.1-9.283-22.5zM608 448c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.67 0-32-14.3-32-32s14.33-32 32-32h576zm-416-80c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zm32 16c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32z" fill="#88a4bf" class="fill-000000"></path></svg>
            </div>
            <div>
              <p>{{leg.airportDestination?.airportIcaoCode}}</p>
              <p>{{leg.airportDestination?.airportName}}</p>
              <p>{{leg.airportDestination?.airportDisplayLocationName}}</p>
              <p v-if="leg.reservationLegArriveDate">
                {{ legDateFormat(leg.reservationLegArriveDate, leg.reservationLegArriveTime) }} - ({{ leg.reservationLegPax }} PAX)
              </p>
            </div>

          </div>
        </div>
      </div>

      <div class="line-dash">
        <hr>
      </div>

      <div class="info-cost">
        <div class="info-cost-details">
          <div class="info-cost-item">
            <p>Quote Cost</p>
            <p>$ {{reservation.reservationSubtotal}} USD</p>
          </div>
          <div class="info-cost-item">
            <p>Tax Factor</p>
            <p> {{reservation.reservationTaxFactor}} </p>
          </div>
          <div class="info-cost-item">
            <p class="">Tax</p>
            <p class="">$ {{reservation.reservationTax}} USD</p>
          </div>
          <div class="info-cost-item">
            <p class="color-text">Quote Total</p>
            <p class="color-text">$ {{reservation.reservationTotal}} USD</p>
          </div>
          <!-- <div class="info-cost-item">
            <p>Exchange Rate</p>
            <p>$ 16.89 USD</p>
          </div> -->

        </div>
      </div>

      <div class="bnt-save">
        <button v-if="canUpdate || !editMode" @click="handlerClickOnSave" type="button" class="btn-quote">Save Quote</button>
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
