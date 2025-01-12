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
        <div class="wrapper-reservations">
          <div class="reservations-wrapper">
            <div class="box head-page">
              <div class="input-box">
                <label for="search">
                  Select Aircraft
                </label>
                <Dropdown
                  placeholder="Select" class="w-full md:w-14rem" v-model="aircraftSelected" :options="formatAircraft" optionLabel="aircraftName"/>
              </div>
              <div class="input-box">
                <label for="search">
                  Select Customer
                </label>
                <Dropdown
                  placeholder="Select" v-model="customerSelected" class="w-full md:w-14rem" :options="formatContacts" optionLabel="customerFullName" />
              </div>
              <div class="input-box">
                <Button v-if="canCreate" class="btn-add flex justify-content-center" severity="primary" @click="addNew" >
                  <span class="circle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                  </span>
                </Button>
              </div>
            </div>
            <div class="box reservation-card-wrapper">
              <h2>
                Itinerary
              </h2>
              <itineraryInfoForm :hasStops="true" class="border-button-dashed"/>
              <itineraryInfoForm/>
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
                        placeholder="Select" class="w-full md:w-14rem" v-model="pilotSelectedPic" :options="formatPilots" optionLabel="pilotName"/>
                    </div>
                    <div class="input-box">
                      <label for="lastName">SIC</label>
                      <Dropdown
                        placeholder="Select" class="w-full md:w-14rem" v-model="pilotSelectedSic" :options="formatPilots" optionLabel="pilotName"/>
                      <small class="p-error" v-if="submitted">Second Last Name is required.</small>
                    </div>
                    <div class="input-box">
                      <label for="lastName">SOB</label>
                      <Dropdown
                        placeholder="Select" class="w-full md:w-14rem" v-model="flightAttendantSelected" :options="formatFlightAttendants" optionLabel="flightAttendantName"/>
                      <small class="p-error" v-if="submitted">Second Last Name is required.</small>
                    </div>
                  </div>
              </div>
            </div>
            <div class="box reservation-card-wrapper">
              <h2>
                Aditional Notes
              </h2>
              <div class="input-box ">
                <label for="proceedingFileObservations">Internal note</label>
                <Textarea  id="proceedingFileObservations" autoResize
                  rows="12" />
              </div>
            </div>
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerCustomerForm" header="Customer form" position="right"
                class="customer-form-sidebar" :showCloseIcon="true">
                <customerInfoForm :customer="customer" @save="onSave" />
              </Sidebar>
            </div>
          </div>
          <div class="box aside-legs-details">
            <aircraftSelectedInfoCard/>
          </div>
        </div>
        <Dialog v-model:visible="drawerPilotDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="aircraftOperator"> Are you sure you want to delete
              ?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerPilotDelete = false" />
            <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
          </template>
        </Dialog>
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

