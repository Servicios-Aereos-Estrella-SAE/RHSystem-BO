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
        <div class="wrapper-reservations" v-if="reservation">
          <div class="reservations-wrapper">
            <ReservationInfoForm v-if="reservation" :reservation="reservation" :editMode="editMode" :submitted="submitted" />
          </div>
          <div class="box aside-legs-details" v-if="reservation && reservation.reservationLegs">
            <ReservationDetailsCard :editMode="editMode" :reservation='reservation' @onSave="saveReservation"/>
          </div>
        </div>
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
  .p-dropdown {
    max-width: 73vw;
  }
</style>

