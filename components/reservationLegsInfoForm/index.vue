<template>
  <div class="itinerary-info-form">
    <Toast />
    <h2>
      Leg Information
    </h2>
    <div class="itinerary-form">
      <div class="legs-form">
        <div class="leg-form">
          <div class="input-box required">
            <label for="someField" class="input-label">
              From
            </label>
            <Dropdown :disabled="editMode && !canUpdate" filter v-model="reservationLeg.airportDepartureId"
              :options="formatAirports" optionLabel="customName" optionValue="airportId" placeholder="Select departure"
              class="w-full md:w-14rem" />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.airportDepartureId">departure airport is
              required.</small>
          </div>
          <div class="input-box required">
            <label for="someField" class="input-label">
              Departure date
            </label>
            <Calendar :disabled="editMode && !canUpdate" v-model="reservationLeg.reservationLegDepartureDate"
              dateFormat="dd/mm/yy" :minDate="new Date()" :showWeek="false" placeholder="dd/mm/yy" />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegDepartureDate">Departure date is
              required</small>
          </div>
          <div class="input-box required">
            <label hidden for="someField" class="input-label">
              Departure time
            </label>
            <InputText :disabled="editMode && !canUpdate" type="time"
              v-model="reservationLeg.reservationLegDepartureTime" />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegDepartureTime">Departure time is
              required</small>
          </div>
        </div>
        <div class="leg-form">
          <div class="input-box required">
            <label for="someField" class="input-label">
              To
            </label>
            <Dropdown :disabled="editMode && !canUpdate" filter v-model="reservationLeg.airportDestinationId"
              :options="formatAirports" optionLabel="customName" optionValue="airportId" placeholder="Select arrival"
              class="w-full md:w-14rem" />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.airportDestinationId">Arrival airport is
              required</small>
          </div>
          <div class="input-box required">
            <label for="someField" class="input-label">
              Arrive date
            </label>
            <Calendar :disabled="editMode && !canUpdate" v-model="reservationLeg.reservationLegArriveDate"
              dateFormat="dd/mm/yy" :minDate="new Date()" :showWeek="false" placeholder="dd/mm/yy" />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegArriveDate">Arrival date is
              required</small>
          </div>
          <div class="input-box">
            <label for="someField" class="input-label">
              Arrive Time
            </label>
            <InputText :disabled="editMode && !canUpdate" type="time" v-model="reservationLeg.reservationLegArriveTime" />
            <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegArriveTime">Arrival time is
              required</small>
          </div>
        </div>
      </div>
      <div class="travel-info-form">
        <div class="input-box required">
          <label for="someField" class="input-label">
            Pax
          </label>
          <InputText :disabled="editMode && !canUpdate" type="number" v-model="reservationLeg.reservationLegPax"
            placeholder="3" />
          <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegPax">Pax is required</small>
        </div>
        <div class="input-box required">
          <label for="someField" class="input-label">
            Leg travel time
          </label>
          <InputText :disabled="editMode && !canUpdate" type="number" v-model="reservationLeg.reservationLegTravelTime" />
          <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegTravelTime">Travel time is
            required</small>
        </div>
        <div class="input-box required">
          <label for="someField" class="input-label">
            Distance (NM)
          </label>
          <InputText :disabled="editMode && !canUpdate" type="number" v-model='reservationLeg.reservationLegDistanceMn'
            placeholder="MN" />
          <small class="p-error" v-if="isSubmitted && !reservationLeg.reservationLegDistanceMn">Distance is
            required</small>
        </div>
      </div>
      <div class="buttons-leg">
        <button v-if="index != 0 && ((editMode && canUpdate) || !editMode)" @click="removeLeg" class="btn btn-right">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
          Remove leg
        </button>
        <button v-if="isLast && ((editMode && canUpdate) || !editMode)" class="btn btn-middle" @click="addLeg">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M18.364 17.364 12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM11 10H8v2h3v3h2v-3h3v-2h-3V7h-2v3z" fill="#88a4bf" class="fill-000000"></path></svg>
          Add leg
        </button>
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
  box-sizing: border-box;
}
</style>
