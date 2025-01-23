<template>
  <div>
    <Toast />
    <div class="pilots-page">

      <Head>
        <Title>
          Reservations
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="wrapper-reservations" v-if="reservation && showDetail">
          <div class="reservations-wrapper">
            <div class="box head-page">
              <div class="input-box">
                <label for="search">
                  Select Aircraft
                </label>
                <Dropdown
                  :disabled="!editMode"
                  placeholder="Select" class="w-full md:w-14rem" v-model="reservation.aircraftId" :options="formatAircraft" optionLabel="aircraftName" optionValue="aircraftId"/>
                <small class="p-error" v-if="submitted && !reservation.aircraftId">Aircraft is required.</small>

              </div>
              <div class="input-box">
                <div class="flex justify-content-center flex-wrap">
                  <div class="input-wrapper">
                    <label for="search">
                      Select Customer
                    </label>
                    <Dropdown
                      :disabled="!editMode"
                      placeholder="Select" v-model="reservation.customerId" class="w-full md:w-14rem" :options="formatContacts" optionLabel="customerFullName" optionValue="customerId" />
                      <small class="p-error" v-if="submitted && !reservation.customerId">Customer is required.</small>
                  </div>
                  <Button v-if="canCreate && editMode" class="btn-add flex justify-content-center ml-4" severity="primary" @click="addNew" >
                    <span class="circle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                      </svg>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <div class="box reservation-card-wrapper" v-if="reservation && reservation.reservationLegs">
              <h2>
                Itinerary
              </h2>
              <div v-for="(reservationLeg, index) in reservation.reservationLegs" :key="index">
                <itineraryInfoForm 
                  :add-leg="() => { reservationLegsAdd() }" 
                  :isSubmitted="submitted"
                  :reservationLeg="reservationLeg" 
                  :remove-leg="() => { reservationLegsRemove(index) }"
                  :class="[(index+1) !== reservation.reservationLegs.length ? 'border-button-dashed' : '']" 
                  :index="index"
                  :editMode="editMode"
                  :isLast="(index+1) === reservation.reservationLegs.length"
                />
              </div>
            </div>
            <div class="box reservation-card-wrapper">
              <h2>
                Flight Attendance
              </h2>
              <div class="input-box">
                  <label for="exception-type">
                  </label>
                  <div class="input-text-row">
                    <div class="input-box">
                      <label for="lastName">PIC</label>
                      <Dropdown
                        :disabled="!editMode"
                        placeholder="Select" class="w-full md:w-14rem" v-model="reservation.pilotPicId" :options="formatPilots" optionLabel="pilotName" optionValue="pilotId"/>
                        <small class="p-error" v-if="submitted && !reservation.pilotPicId">Pilot is required.</small>
                    </div>
                    <div class="input-box">
                      <label for="lastName">SIC</label>
                      <Dropdown
                        :disabled="!editMode"
                        placeholder="Select" class="w-full md:w-14rem" v-model="reservation.pilotSicId" :options="formatPilots" optionLabel="pilotName" optionValue="pilotId"/>
                      <small class="p-error" v-if="submitted && !reservation.pilotSicId">Pilot is required.</small>
                    </div>
                    <div class="input-box">
                      <label for="lastName">SOB</label>
                      <Dropdown
                        :disabled="!editMode"
                        placeholder="Select" class="w-full md:w-14rem" v-model="reservation.flightAttendantId" :options="formatFlightAttendants" optionLabel="flightAttendantName" optionValue="flightAttendantId"/>
                      <small class="p-error" v-if="submitted && !reservation.flightAttendantId">Second Last Name is required.</small>
                    </div>
                  </div>
              </div>
            </div>
            <div class="box reservation-card-wrapper" v-if="reservation">
              <h2>
                Quote Costo
              </h2>
              <div class="input-box">
                  <label for="exception-type">
                  </label>
                  <div class="input-text-row">
                    <div class="input-box">
                      <label for="lastName">Subtotal</label>
                      <InputText :disabled="!editMode" type="number" v-model="reservation.reservationSubtotal" />
                    </div>
                    <div class="input-box">
                      <label for="lastName">Tax Factor</label>
                      <Dropdown
                        :disabled="!editMode"
                        placeholder="Select tax factor" class="w-full md:w-14rem" v-model="reservation.reservationTaxFactor" :options="taxFactors" optionLabel="taxFactor" optionValue="taxFactor"/>
                    </div>
                    <div class="input-box">
                      <label for="lastName">Total</label>
                      <InputText :disabled="!editMode" v-model="reservation.reservationTotal" readonly disabled />
                    </div>
                  </div>
              </div>
            </div>
            <div class="box reservation-card-wrapper">
              <div>
                <h2>
                  Aditional Notes
                </h2>
              </div> 
              <div v-for="(note, index) in reservation.reservationNotes" :key="index" class="input-box mb-2 mt-2 input-note">
                <div class="note-header">
                  <label :for="'note-' + index">Internal note {{ index + 1 }}</label>
                  <span  
                    v-if="index !== 0"
                    class="delete-button"
                    @click="removeNote(index)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-x-circle"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
                      />
                      <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                      />
                    </svg>
                  </span>
                </div>
                <Textarea  
                  :id="'note-' + index"
                  v-model="note.reservationNoteContent"
                  autoResize
                  :disabled="!editMode"
                  rows="3" />
              </div>
              <div class="flex justify-content-center mt-4 wrapper-add-note">
                <Button v-if="canCreate && editMode" class="btn-add flex justify-content-center mt-2" severity="primary" @click="addNewNote" >
                  Add another note
                </Button>
              </div>
            </div>
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerCustomerForm" header="Customer form" position="right"
                class="customer-form-sidebar" :showCloseIcon="true">
                <customerInfoForm :customer="customer" @save="onSave" />
              </Sidebar>
            </div>
          </div>
          <div class="box aside-legs-details" v-if="reservation && reservation.reservationLegs">
            <aircraftSelectedInfoCard :editMode="editMode" :reservation='reservation' :click-on-save="() => saveReservation()" :click-on-cancel="() => showIndex()"/>
          </div>
        </div>
        <div class="wrapper-reservations-index" v-if="!showDetail">
          <div class="reservations-wrapper">
            <div class="box head-page">
              <div class="input-search">
                <div class="input-box">
                  <label for="search">
                    Search reservations
                  </label>
                  <InputText v-model="search" placeholder="Airport name or customer name" @keypress.enter="handlerSearch" />
                </div>
                <button class="btn btn-block" @click="handlerSearch">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </button>
              </div>
              <div class="input-box">
                <Button v-if="canCreate" class="btn btn-block" @click="addNewReservation">
                  <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
                  Add New Reservation
                </Button>
              </div>
            </div>
            <div>
              <h2>
                Reservations
              </h2>
              <div v-if="reservations.length" class="reservation-card-info-wrapper">
                <div v-for="(_reservation, index) in reservations" :key="`employee-${_reservation.reservationId}-${index}`">
                  <ReservationInfoCard  :reservation="_reservation"
                    :can-update="canUpdate" :can-delete="canDelete"
                    :click-on-detail="() => {showDetails(_reservation) }" :click-on-delete="() => { onDelete(_reservation) }" />
                </div>
              </div>
              <div></div>
              <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              :alwaysShow="false" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" @page="onPageChange" />
            </div>
          </div>
        </div>
        <transition name="page">
          <confirmDelete v-if="drawerReservationDelete" @confirmDelete="handlerDeleteReservation"
            @cancelDelete="onCancelReservationDelete" />
        </transition>
      </NuxtLayout>
    </div>
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
 
  .customer-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>

