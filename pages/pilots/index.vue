<template>
  <div>
    <Toast />
    <div class="pilots-page">

      <Head>
        <Title>
          Pilots
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="pilot-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="search">
                Search
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchPilot"
                @keyup.delete="handlerSearchPilot" />
            </div>
            <div class="input-box">
              <br />
              <Button v-if="canCreate" class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
          <div>
            <h2>
              Pilots
            </h2>
            <div class="pilot-card-wrapper">
              <div v-for="(pilot, index) in filteredPilots" :key="`pilot-${pilot.pilotId}-${index}`">
                <PilotInfoCard :click-on-photo="() => { onPhoto(pilot) }" :pilot="pilot"
                  :can-update="canUpdate" :can-delete="canDelete" :click-on-edit="() => { onEdit(pilot) }" :click-on-delete="() => { onDelete(pilot) }" />
              </div>
            </div>
            <div></div>
            <Paginator :alwaysShow="false" class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              @page="onPageChange" />
            <!-- Form -->
            <div class="card flex justify-content-center">
               <Sidebar v-model:visible="drawerPilotForm" :blockScroll="true" :closeOnEscape="false" :dismissable="false"
                position="right" class="pilot-form-sidebar" :showCloseIcon="true">
                <employeeInfoForm employeeType='pilot' :pilot="pilot" :employee="pilot.employee" @save="onSave" />
              </Sidebar>
            </div>
          </div>
        </div>
        <Dialog v-model:visible="drawerPilotDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="pilot"> Are you sure you want to delete
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
 
  .pilot-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>

