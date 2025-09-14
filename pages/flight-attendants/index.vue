<template>
  <div>

    <div class="flight-attendants-page">

      <Head>
        <Title>
          {{ $t('flight_attendants') }}
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="flight-attendant-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="search">
                {{ $t('search') }}
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchFlightAttendant"
                @keyup.delete="handlerSearchFlightAttendant" />
            </div>
            <div class="input-box">
              <br />
              <Button v-if="canCreate" class="btn-add mr-2" :label="$t('add_flight_attendant') " icon="pi pi-plus"
                severity="primary" @click="addNew" />
            </div>
          </div>
          <div>
            <h2>
              {{ $t('flight_attendants') }}
            </h2>
            <div class="flight-attendant-card-wrapper">
              <div v-for="(flightAttendant, index) in filteredFlightAttendants"
                :key="`flight-attendant-${flightAttendant.flightAttendantId}-${index}`">
                <FlightAttendantInfoCard :click-on-photo="() => { onPhoto(flightAttendant) }"
                  :flightAttendant="flightAttendant" :click-on-edit="() => { onEdit(flightAttendant) }"
                  :click-on-delete="() => { onDelete(flightAttendant) }" :canUpdate="canUpdate"
                  :can-delete="canDelete" />
              </div>
            </div>
            <div></div>
            <Paginator :alwaysShow="false" class="paginator" :first="first" :rows="rowsPerPage"
              :totalRecords="totalRecords" @page="onPageChange" />
            <!-- Form -->
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerFlightAttendantForm" :header="`${$t('flight_attendant')} ${$t('form')}`"
                position="right" class="flight-attendant-form-sidebar" :showCloseIcon="true">
                <employeeInfoForm employeeType='pilot' :flightAttendant="flightAttendant"
                  :employee="flightAttendant.employee" @save="onSave" :canUpdate="canUpdate" />
              </Sidebar>
            </div>
          </div>
        </div>
        <Dialog v-model:visible="drawerFlightAttendantDelete" :style="{width: '450px'}" :header="$t('confirm')"
          :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="flightAttendant"> {{ $t('are_you_sure_you_want_to_delete') }}</span>
          </div>
          <template #footer>
            <Button :label="$t('no')" icon="pi pi-times" text @click="drawerFlightAttendantDelete = false" />
            <Button :label="$t('yes')" icon="pi pi-check" text @click="confirmDelete()" />
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