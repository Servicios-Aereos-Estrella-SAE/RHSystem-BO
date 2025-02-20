<template>
  <div>
    <Toast />
    <div class="pilots-page">

      <Head>
        <Title>
          Aircraft Reservations
        </Title>
      </Head>

      <NuxtLayout name="backoffice">
        <div class="wrapper-reservations-index">
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
              <div v-if="reservations.length && canRead" class="reservation-card-info-wrapper">
                <div v-for="(_reservation, index) in reservations" :key="`employee-${_reservation.reservationId}-${index}`">
                  <ReservationInfoCard  :reservation="_reservation"
                    :can-update="canUpdate" :can-delete="canDelete"
                    @click-on-detail="showDetails(_reservation.reservationId)"
                    @click-on-delete="onDelete(_reservation)" />
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

