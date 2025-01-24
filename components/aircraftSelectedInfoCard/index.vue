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
              <img src="../aircraftSelectedInfoCard/icons/despegue.png" alt="">
            </div>
            <div v-if="leg.airportDeparture">
              <p>{{leg.airportDeparture?.airportName}}</p>
              <p>{{leg.airportDeparture?.airportDisplayLocationName}}</p>
              <p v-if="leg.reservationLegDepartureDate">{{formatDate(leg.reservationLegDepartureDate)}} - {{leg.reservationLegDepartureTime}} ({{leg.reservationLegPax}} PAX)</p>
            </div>
            
          </div>
          <br>
          <div class="itinerary-details">
            <div class="icon-itinerary">
              <img src="../aircraftSelectedInfoCard/icons/aterrizaje.png" alt="">
            </div>
            <div>
              <p>{{leg.airportDestination?.airportName}}</p>
            <p>{{leg.airportDestination?.airportDisplayLocationName}}</p>
            <p v-if="leg.reservationLegArriveDate">{{formatDate(leg.reservationLegArriveDate)}} - {{leg.reservationLegArriveTime}} ({{leg.reservationLegPax}} PAX)</p>
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
        <button v-if="editMode" @click="clickOnSave" type="button" class="btn-quote">Save Quote</button>
        <button @click="clickOnCancel" type="button" class="btn-quote">Go back</button>
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