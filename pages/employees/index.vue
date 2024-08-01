<template>
  <div>
    <Toast />
    <div class="employees-page">

      <Head>
        <Title>
          Employees
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="shift-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="search">
                Buscar
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchEmployee"
                @keyup.delete="handlerSearchEmployee" />
            </div>
            <div class="input-box">
              <label for="work-schedule">Work Schema:</label>
              <Dropdown id="shift" v-model="selectedWorkSchedule" :options="workSchedules" showClear optionLabel="employeeWorkSchedule"
                  placeholder="Select Work Schema" @change="handlerSearchEmployee"/>
          </div>
            <div class="input-box">
              <br />
              <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
            <div class="input-box">
              <Button class="btn-sync btn-block" @click="syncEmployees">
                <svg viewBox="0 0 48 48" xml:space="preserve" xmlns="
http://www.w3.org/2000/svg"><path
d="M41.115 20.33C40.213 9.822 31.79 1.478 21.248.681c6.77 3.647 11.373 10.798 11.373 19.026 0 .211-.026.414-.032.623h-7.793l11.563 13.779L47.923 20.33h-6.808zM15.155 28.293c0-.234.026-.461.034-.692h8.015L11.642 13.822.077 27.601h6.579c.872 10.54 9.307 18.921 19.87 19.719-6.769-3.649-11.371-10.799-11.371-19.027z" fill="#ffffff" class="fill-000000"></path></svg>
              </Button>
            </div>
          </div>
          <div>
            <h2>
              Employees
            </h2>
            <div class="shift-card-wrapper">
              <div v-for="(employee, index) in filteredEmployees" :key="`employee-${employee.employeeId}-${index}`">
                <EmployeeInfoCard :click-on-photo="() => { onPhoto(employee) }" :employee="employee"
                  :click-on-edit="() => { onEdit(employee) }" :click-on-delete="() => { onDelete(employee) }" />
              </div>
            </div>
            <div></div>
            <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              @page="onPageChange" />
            <!-- Form Shift -->
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerEmployeeForm" header="Employee form" position="right"
                class="shift-form-sidebar" :showCloseIcon="true">
                <employeeInfoForm :employee="employee" @save="onSave" />
              </Sidebar>

              <Sidebar v-model:visible="drawerEmployeePhotoForm" header="Employee photo" position="right"
                class="shift-form-sidebar" :showCloseIcon="true">
                <employeePhotoForm :employee="employee" @save="onSave" />
              </Sidebar>
            </div>
          </div>
        </div>
        <Dialog v-model:visible="drawerEmployeeDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="employee"> Are you sure you want to delete
              ?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerEmployeeDelete = false" />
            <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
          </template>
        </Dialog>
        <Dialog v-model:visible="drawerEmployeeSync" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span> Are you sure you want to sync
              ?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerEmployeeSync = false" />
            <Button label="Yes" icon="pi pi-check" text @click="confirmSync()" />
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
 
  .shift-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>

