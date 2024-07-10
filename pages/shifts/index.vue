<template>
  <div class="shift-page">
    <Toast />
    <Head>
      <Title>
        Shifts
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="shift-wrapper">
        <div class="box head-page">
          <div class="input-box">
            <label for="search">
              Buscar
            </label>
            <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchShift" @keyup.delete="handlerSearchShift"/>
          </div>
          <div class="input-box">
            <br/>
            <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
          </div>
        </div>
        <div>
          <h2>
            Shifts
          </h2>
          <div class="shift-card-wrapper">
            <div v-for="(shift, index) in filteredShifts" :key="`shift-${shift.shiftId}-${index}`">
              <ShiftInfoCard
                :shift="shift"
                :click-on-edit="() => { onEdit(shift) }"
                :click-on-delete="() => { onDelete(shift) }"
              />
            </div>
          </div>
          
          <div></div>
          <Paginator 
              class="paginator"
              :first="first" 
              :rows="rowsPerPage" 
              :totalRecords="totalRecords" 
              @page="onPageChange"
            />
          <!-- Form Shift -->
          <div class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerShiftForm" header="Shift form" position="right" class="shift-form-sidebar" :showCloseIcon="true">
              <shiftInfoForm
                :shift="shift"
                @onShiftSave="onSave"
              />
            </Sidebar>
          </div> 
        </div>
      </div>
      <Dialog v-model:visible="drawerShiftDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="shift">   Are you sure you want to delete
              ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerShiftDelete = false"/>
            <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
        </template>
    </Dialog>
    </NuxtLayout>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
@import './style';

.shift-card-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.shift-form-sidebar {
  width: 100% !important;
  max-width: 50rem !important;

  @media screen and (max-width: $sm) {
    width: 100% !important;
  }
}
</style>

<style lang="scss">
@import '/resources/styles/variables.scss';
:deep(.graph-label) {
  color: red;
}

.graph-label {
  color: red;
}
</style>
