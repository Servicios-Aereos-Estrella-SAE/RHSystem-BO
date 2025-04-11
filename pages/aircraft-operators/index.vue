<template>
  <div>

    <div class="pilots-page">

      <Head>
        <Title>
          Aircraft Operators
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="pilot-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="search">
                Search
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchAircraftOperator"
                @keyup.delete="handlerSearchAircraftOperator" />
            </div>
            <div class="input-box">
              <br />
              <Button v-if="canCreate" class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
          <div>
            <h2>
              Aircraft Operators
            </h2>
            <div class="pilot-card-wrapper">
              <div v-for="(aircraftOperator, index) in filteredAircraftOperators" :key="`pilot-${aircraftOperator.aircraftOperatorId}-${index}`">
                <AircraftOperatorInfoCard :click-on-photo="() => { onPhoto(aircraftOperator) }" :aircraftOperator="aircraftOperator"
                  :can-update="canUpdate" :can-delete="canDelete" :click-on-edit="() => { onEdit(aircraftOperator) }" :click-on-delete="() => { onDelete(aircraftOperator) }" />
              </div>
            </div>
            <div></div>
            <Paginator :alwaysShow="false" class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              @page="onPageChange" />
            <!-- Form Shift -->
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerPilotForm" header="Pilot form" position="right"
                class="aircraft-operator-form-sidebar" :showCloseIcon="true">
                <AircraftOperatorInfoForm :aircraftOperator="aircraftOperator" @save="onSave" />
              </Sidebar>
            </div>
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
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>

<style lang="scss">
  @import '/resources/styles/variables.scss';

  .aircraft-operator-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>

