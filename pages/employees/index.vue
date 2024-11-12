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
              <div class="input-box">
                <label for="role">
                  Department
                </label>
                <Dropdown v-model="departmentId" :options="departments" optionLabel="departmentName" optionValue="departmentId"
                  placeholder="Select a Department" filter class="w-full md:w-14rem" showClear/>
              </div>
              <div class="input-box">
                <label for="positionId">Position</label>
                <Dropdown v-model="positionId" :options="positions" optionLabel="positionName" optionValue="positionId"
                  placeholder="Select a Position" filter class="w-full md:w-14rem" showClear/>
              </div>
              <button class="btn btn-block" @click="handlerSearchEmployee">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </button>
            </div>
            <div>

            </div>
            <div class="input-box">
              <Button v-if="canCreate" class="btn btn-block" @click="addNew">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
                New Employee
              </Button>
            </div>
            <div v-if="canCreate" class="input-box">
              <Button class="btn btn-block" @click="syncEmployees">
                <span>
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.052 5.029a1 1 0 0 0 .189 1.401 7.002 7.002 0 0 1-3.157 12.487l.709-.71a1 1 0 0 0-1.414-1.414l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414l-.843-.842A9.001 9.001 0 0 0 17.453 4.84a1 1 0 0 0-1.401.189Zm-1.93-1.736-2.5-2.5a1 1 0 0 0-1.498 1.32l.083.094.843.843a9.001 9.001 0 0 0-4.778 15.892A1 1 0 0 0 7.545 17.4a7.002 7.002 0 0 1 3.37-12.316l-.708.709a1 1 0 0 0 1.32 1.497l.094-.083 2.5-2.5a1 1 0 0 0 .083-1.32l-.083-.094Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </span>
                <span>
                  Sync from BioTime
                </span>
              </Button>
            </div>
            <div class="input-box">
              <Button class="btn btn-block" @click="getVacationExcel">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 20.5h13.498a.75.75 0 0 1 .101 1.493l-.101.007H5.25a.75.75 0 0 1-.102-1.494l.102-.006h13.498H5.25Zm6.633-18.498L12 1.995a1 1 0 0 1 .993.883l.007.117v12.59l3.294-3.293a1 1 0 0 1 1.32-.083l.094.084a1 1 0 0 1 .083 1.32l-.083.094-4.997 4.996a1 1 0 0 1-1.32.084l-.094-.083-5.004-4.997a1 1 0 0 1 1.32-1.498l.094.083L11 15.58V2.995a1 1 0 0 1 .883-.993L12 1.995l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
                <span>
                 Vacations
                </span>
              </Button>
            </div>
            <div class="input-box">
              <Button class="btn btn-block" @click="getExcel">
                <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z" fill="#88a4bf" class="fill-000000"></path></svg>
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
                  :can-manage-shifts="hasAccessToManageShifts" :can-update="canUpdate" :can-delete="canDelete"
                  :click-on-edit="() => { onEdit(employee) }" :click-on-delete="() => { onDelete(employee) }"
                  @clickShifts="handlerOpenShifts" @clickProceedingFiles="onProceedingFiles" />
              </div>
            </div>

            <div></div>

            <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              :alwaysShow="false" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" @page="onPageChange" />
          </div>
        </div>

        <Sidebar v-model:visible="drawerEmployeeForm" :blockScroll="true" :closeOnEscape="false" :dismissable="false"
          header="Employee form" position="right" class="shift-form-sidebar" :showCloseIcon="true">
          <employeeInfoForm :employee="employee" @save="onSave" />
        </Sidebar>

        <Sidebar v-model:visible="drawerEmployeePhotoForm" :blockScroll="true" :closeOnEscape="false"
          :dismissable="false" header="Employee photo" position="right" class="shift-form-sidebar"
          :showCloseIcon="true">
          <employeePhotoForm :employee="employee" @save="onSave" />
        </Sidebar>

        <Sidebar v-model:visible="drawerShifts" :blockScroll="true" :closeOnEscape="false" :dismissable="false" header="Employee shifts calendar" position="right" class="sidebar-shifts">
          <employeeShift :employee="employee" :can-manage-vacation="canManageVacation"/>
        </Sidebar>

        <Sidebar v-model:visible="drawerProceedingFiles" :blockScroll="true" :closeOnEscape="false" :dismissable="false"
          header="Employee proceeding files" position="right" class="proceeding-file-sidebar">
          <employeeProceedingFile :employee="employee" />
        </Sidebar>

        <transition name="page">
          <confirmDelete v-if="drawerEmployeeDelete" @confirmDelete="confirmDelete"
            @cancelDelete="onCancelEmployeeDelete" />
        </transition>

        <Dialog v-model:visible="drawerEmployeeSync" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>
              Are you sure you want to sync?
            </span>
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
  width: 90% !important;
  max-width: 50rem !important;

  @media screen and (max-width: $sm) {
    width: 100% !important;
  }
}

.sidebar-shifts {
  width: 90% !important;
  max-width: 120rem !important;

  @media screen and (max-width: $sm) {
    width: 100% !important;
  }
}

.btn-excel-employee {
  background-color: #12763d !important;
  border-color: #12763d !important;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-top: 1rem;
  margin-left: 10%;

  svg {
    width: 1.25rem;
  }
}

.proceeding-file-sidebar {
  width: 90% !important;
  max-width: 90rem !important;

  @media screen and (max-width: $sm) {
    width: 100% !important;
  }
}
</style>