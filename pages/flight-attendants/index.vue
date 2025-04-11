<template>
  <div>

    <div class="flight-attendants-page">

      <Head>
        <Title>
          Flight Attendants
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="flight-attendant-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="search">
                Search
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchFlightAttendant"
                @keyup.delete="handlerSearchFlightAttendant" />
            </div>
            <div class="input-box">
              <br />
              <Button v-if="canCreate" class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
          <div>
            <h2>
              Flight Attendants
            </h2>
            <div class="flight-attendant-card-wrapper">
              <div v-for="(flightAttendant, index) in filteredFlightAttendants" :key="`flight-attendant-${flightAttendant.flightAttendantId}-${index}`">
                <FlightAttendantInfoCard :click-on-photo="() => { onPhoto(flightAttendant) }" :flightAttendant="flightAttendant"
                  :click-on-edit="() => { onEdit(flightAttendant) }" :click-on-delete="() => { onDelete(flightAttendant) }"
                  :can-update="canUpdate" :can-delete="canDelete" />
              </div>
            </div>
            <div></div>
            <Paginator
              :alwaysShow="false"
              class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              @page="onPageChange"
            />
            <!-- Form -->
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerFlightAttendantForm" header="Flight attendant form" position="right"
                class="flight-attendant-form-sidebar" :showCloseIcon="true">
                <employeeInfoForm employeeType='pilot' :flightAttendant="flightAttendant" :employee="flightAttendant.employee" @save="onSave" />
              </Sidebar>
            </div>
          </div>
        </div>
        <Dialog v-model:visible="drawerFlightAttendantDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="flightAttendant"> Are you sure you want to delete
              ?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerFlightAttendantDelete = false" />
            <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
          </template>
        </Dialog>
      </NuxtLayout>
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

  .flight-attendant-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>

