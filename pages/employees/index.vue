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
            <div class="input-search">
              <div class="input-box">
                <label for="search">
                  Search employee
                </label>
                <InputText v-model="search" placeholder="Employee name or id" @keypress.enter="handlerSearchEmployee" />
              </div>
              <button class="btn btn-block" @click="handlerSearchEmployee">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </button>
            </div>
            <div></div>
            <div class="input-box">
              <Button v-if="canCreate" class="btn btn-block" @click="addNew">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
                New Employee
              </Button>
            </div>
            <div class="input-box">
              <Button v-if="canCreate" class="btn btn-block" @click="syncEmployees">
                <span>
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.052 5.029a1 1 0 0 0 .189 1.401 7.002 7.002 0 0 1-3.157 12.487l.709-.71a1 1 0 0 0-1.414-1.414l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414l-.843-.842A9.001 9.001 0 0 0 17.453 4.84a1 1 0 0 0-1.401.189Zm-1.93-1.736-2.5-2.5a1 1 0 0 0-1.498 1.32l.083.094.843.843a9.001 9.001 0 0 0-4.778 15.892A1 1 0 0 0 7.545 17.4a7.002 7.002 0 0 1 3.37-12.316l-.708.709a1 1 0 0 0 1.32 1.497l.094-.083 2.5-2.5a1 1 0 0 0 .083-1.32l-.083-.094Z" fill="#88a4bf" class="fill-212121"></path></svg>
                </span>
                <span>
                  Sync from BioTime
                </span>
              </Button>
            </div>
          </div>

          <div>
            <h2>
              Employees
            </h2>
            <div class="shift-card-wrapper">
              <div v-for="(employee, index) in filteredEmployees" :key="`employee-${employee.employeeId}-${index}`">
                <EmployeeInfoCard
                  :click-on-photo="() => { onPhoto(employee) }"
                  :employee="employee"
                  :can-update="canUpdate"
                  :can-delete="canDelete"
                  :click-on-edit="() => { onEdit(employee) }"
                  :click-on-delete="() => { onDelete(employee) }"
                  @clickShifts="handlerOpenShifts"
                  @clickProceedingFiles="onProceedingFiles"
                />
              </div>
            </div>

            <div></div>

            <Paginator
              class="paginator"
              :first="first"
              :rows="rowsPerPage"
              :totalRecords="totalRecords"
              :alwaysShow="false"
              template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
              @page="onPageChange"
            />
          </div>
        </div>

        <Sidebar v-model:visible="drawerEmployeeForm" header="Employee form" position="right" class="shift-form-sidebar" :showCloseIcon="true">
          <employeeInfoForm :employee="employee" @save="onSave" />
        </Sidebar>

        <Sidebar v-model:visible="drawerEmployeePhotoForm" header="Employee photo" position="right" class="shift-form-sidebar" :showCloseIcon="true">
          <employeePhotoForm :employee="employee" @save="onSave" />
        </Sidebar>

        <Sidebar v-model:visible="drawerShifts" :blockScroll="true" header="Employee shifts calendar" :dismissable="false" position="right" class="sidebar-shifts">
          <employeeShift :employee="employee" />
        </Sidebar>
        
        <Sidebar v-model:visible="drawerProceedingFiles" header="Employee proceeding files" position="right" class="proceeding-file-sidebar">
          <employeeProceedingFile :employee="employee" />
        </Sidebar>

        <transition name="page">
          <confirmDelete
            v-if="drawerEmployeeDelete"
            @confirmDelete="confirmDelete"
            @cancelDelete="onCancelEmployeeDelete"
          />
        </transition>

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

  .sidebar-shifts {
    width: 100% !important;
    max-width: 120rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .proceeding-file-sidebar {
    width: 100% !important;
    max-width: 90rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>