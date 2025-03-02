<template>
  <div class="reservation-form-wrapper" v-if="reservation && customers.length">
    <div class="box head-page">
      <div class="input-box">
        <label>
          Select Aircraft
        </label>
        <Dropdown :disabled="reservation.reservationId && !canUpdate" placeholder="Select"
          v-model="reservation.aircraftId" :options="formatAircraft" optionLabel="aircraftName"
          optionValue="aircraftId" />
      </div>
      <div class="input-box">
        <div class="input-wrapper">
          <div>
            <label>
              Select Customer
            </label>
            <Dropdown :disabled="reservation.reservationId && !canUpdate" placeholder="Select"
              v-model="reservation.customerId" :options="formatContacts"
              optionLabel="customerFullName" optionValue="customerId" />
          </div>
          <div class="button-wrapper">
            <button v-if="(reservation.reservationId && canUpdate) || !reservation.reservationId"
              class="btn btn-block btn-add" @click="addNew">
              <svg data-v-66c44286="" baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path data-v-66c44286="" d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="box" v-if="reservation && reservation.reservationLegs">
      <h2>
        Reservation Itinerary Legs
      </h2>
      <div class="reservation-legs-wrapper">
        <ReservationLegsInfoForm
          v-for="(reservationLeg, index) in reservation.reservationLegs" :key="index"
          :add-leg="() => { reservationLegsAdd() }" :isSubmitted="submitted"
          :reservationLeg="reservationLeg" :remove-leg="() => { reservationLegsRemove(reservationLeg, index) }"
          :class="[(index + 1) !== reservation.reservationLegs.length ? 'border-button-dashed' : '']" :index="index"
          :editMode="reservation.reservationId !== null" :canUpdate="canUpdate"
          :isLast="(index + 1) === reservation.reservationLegs.length" />
      </div>
    </div>
    <div class="box">
      <h2>
        Reservation Crew Information
      </h2>
      <div class="crew-form-wrapper">
        <div class="input-box required">
          <label>
            PIC
          </label>
          <Dropdown :disabled="reservation.reservationId && !canUpdate" placeholder="Select"
            v-model="reservation.pilotPicId" :options="formatPilots" optionLabel="pilotName" optionValue="pilotId" />
          <small class="p-error" v-if="submitted && !reservation.pilotPicId">Pilot is required.</small>
        </div>
        <div class="input-box required">
          <label>
            SIC
          </label>
          <Dropdown :disabled="reservation.reservationId && !canUpdate" placeholder="Select"
            v-model="reservation.pilotSicId" :options="formatPilots" optionLabel="pilotName" optionValue="pilotId" />
          <small class="p-error" v-if="submitted && !reservation.pilotSicId">Pilot is required.</small>
        </div>
        <div class="input-box required">
          <label>
            SOB
          </label>
          <Dropdown :disabled="reservation.reservationId && !canUpdate" placeholder="Select"
            v-model="reservation.flightAttendantId" :options="formatFlightAttendants"
            optionLabel="flightAttendantName" optionValue="flightAttendantId" />
          <small class="p-error" v-if="submitted && !reservation.flightAttendantId">Second Last Name is
            required.</small>
        </div>
      </div>
    </div>
    <div class="box" v-if="reservation">
      <h2>
        Reservation Price Information
      </h2>
      <div class="prices-form-wrapper">
        <div class="input-box required">
          <label>
            Subtotal
          </label>
          <InputNumber
            v-model="reservation.reservationSubtotal"
            fluid mode="currency"
            currency="USD"
            locale="en-US"
            :minFractionDigits="2"
            :disabled="reservation.reservationId && !canUpdate"
          />
        </div>
        <div class="input-box required">
          <label>
            Tax Factor
          </label>
          <Dropdown :disabled="reservation.reservationId && !canUpdate" placeholder="Select tax factor"
            v-model="reservation.reservationTaxFactor" :options="taxFactors"
            optionLabel="taxFactor" optionValue="taxFactor" />
        </div>
        <div class="input-box required">
          <label>
            Total
          </label>
          <InputNumber
            v-model="reservation.reservationTotal"
            fluid mode="currency"
            currency="USD"
            locale="en-US"
            :minFractionDigits="2"
            :disabled="reservation.reservationId && !canUpdate"
          />
        </div>
      </div>
    </div>
    <div class="box">
      <div>
        <h2>
          Aditional Notes
        </h2>
      </div>
      <div class="note-wrapper">
        <div v-for="(note, index) in reservation.reservationNotes" :key="index" class="note">
          <label :for="'note-' + index">Internal note {{ index + 1 }}</label>
          <div class="note-content">
            <Textarea :id="'note-' + index" v-model="note.reservationNoteContent" autoResize :disabled="reservation.reservationId && !canUpdate" rows="5" />
            <button v-if="index !== 0" class="btn btn-block" @click="removeNote(note, index)">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="!reservation.reservationId || canUpdate" class="note-buttons-wrapper">
        <button class="btn btn-block" @click="addNewNote">
          <svg data-v-66c44286="" baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path data-v-66c44286="" d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
          Add Note
        </button>
      </div>
    </div>

    <Sidebar
      v-model:visible="drawerCustomerForm"
      header="Customer form"
      position="right"
      class="customer-form-sidebar-reservations"
      :showCloseIcon="true"
      :dismissable="false"
      :closeOnEscape="false"
    >
      <customerInfoForm :customer="customer" @save="onSave" />
    </Sidebar>
  </div>
</template>

<script>
import Reservations from './script.ts'
export default Reservations
</script>

<style lang="scss" scoped>
@import './style';
</style>

<style lang="scss">
@import '/resources/styles/variables.scss';

.customer-form-sidebar-reservations {
  width: 100% !important;
  max-width: 30rem !important;

  @media screen and (max-width: $sm) {
    width: 100% !important;
  }
}
</style>
