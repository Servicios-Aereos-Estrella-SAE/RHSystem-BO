<template>
  <div class="box reservation-info-card">
    <div class="banner">
      <img v-if="reservation.aircraft.aircraftProperty.aircraftPropertiesBanner" :src="reservation.aircraft.aircraftProperty.aircraftPropertiesBanner" alt="">
      <svg v-else fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.989 11.946a1.991 1.991 0 0 1-2.05 1.99l-4.738-.139-3.454 7.143c-.277.574-.86.94-1.498.94a.926.926 0 0 1-.919-1.037l.862-7.193-3.765-.11-.49 1.341a1.29 1.29 0 0 1-1.211.847.901.901 0 0 1-.901-.902V13.35l-.81-.169a1.261 1.261 0 0 1 0-2.469l.81-.168V9.066c0-.46.343-.838.788-.894l.113-.007a1.29 1.29 0 0 1 1.21.846l.492 1.34 3.751-.11-.849-7.084a.93.93 0 0 1-.005-.055l-.002-.055c0-.511.415-.926.926-.926.585 0 1.123.307 1.423.8l.075.14 3.403 7.035 4.79-.14a1.991 1.991 0 0 1 2.048 1.932l.001.058Z" fill="#88a4bf" class="fill-212121"></path></svg>
    </div>

    <div class="info-item customer">
      {{ customerName }}
    </div>
    <div class="aircraft-info">
      <div class="aircraft">
        {{ reservation.aircraft.aircraftRegistrationNumber }},
        {{ reservation.aircraft.aircraftProperty.aircraftPropertiesName }}
        <span class="operator">
          {{ reservation.aircraft.aircraftOperator.aircraftOperatorName }}
          ({{ reservation.aircraft.aircraftOperator.aircraftOperatorFiscalName }})
        </span>
      </div>
      <div class="pic">
        PIC: {{ picName }}
      </div>
      <div class="sic">
        SIC: {{ sicName }}
      </div>
    </div>

    <div v-if="firstLeg" class="info-item item-leg">
      <div>
        <div class="title">
          {{ lastLeg ? 'First Leg' : 'Leg' }}
        </div>
        <span class="leg">
          <span class="airport">
            {{ `${firstLeg.airportDeparture.airportIcaoCode} - ${firstLeg.airportDestination.airportIcaoCode}` }}
          </span>
          <span class="leg-datetime">
            {{ legDateFormat(firstLeg) }}
          </span>
        </span>
      </div>
    </div>
    <div class="info-item item-leg">
      <div>
        <div class="title">
          {{ lastLeg ? 'Last Leg' : '' }}
        </div>
        <span v-if="lastLeg" class="leg">
          <span class="airport">
            {{ `${lastLeg.airportDeparture.airportIcaoCode} - ${lastLeg.airportDestination.airportIcaoCode}` }}
          </span>
          <span class="leg-datetime">
            {{ legDateFormat(lastLeg) }}
          </span>
        </span>
      </div>
    </div>

    <div class="info-item prices">
      <div class="price">
        Subtotal
        <span>
          ${{ subtotal }} USD
        </span>
      </div>
      <div class="price">
        Tax
        <span>
          ${{ tax }} USD
        </span>
      </div>
      <div class="price">
        Total
        <span>
          ${{ total }} USD
        </span>
      </div>
    </div>

    <div class="box-tools-footer">
      <nuxt-link :to="`/reservations/${reservation.reservationId}`" class="btn btn-block">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </nuxt-link>
      <Button v-if="canDelete && !reservation.deletedAt" class="btn btn-block" @click="$emit('click-on-delete')">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
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
