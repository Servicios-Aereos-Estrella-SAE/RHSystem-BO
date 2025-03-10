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
          <div class="filters">
            <div class="box head-page">
              <div class="input-search">
                <div class="input-box">
                  <label for="search">
                    Search employee
                  </label>
                  <InputText v-model="search" placeholder="Employee name or id"
                    @keypress.enter="handlerSearchEmployee" />
                </div>
                <button class="btn btn-block" @click="handlerSearchEmployee">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </button>
              </div>
              <div class="input-box">
                <label for="role">
                  Department
                </label>
                <Dropdown v-model="departmentId" :options="departments" optionLabel="departmentName"
                  optionValue="departmentId" placeholder="Select a Department" filter class="w-full md:w-14rem"
                  showClear />
              </div>
              <div class="input-box">
                <label for="positionId">Position</label>
                <Dropdown v-model="positionId" :options="positions" optionLabel="positionName" optionValue="positionId"
                  placeholder="Select a Position" filter class="w-full md:w-14rem" showClear />
              </div>
              <div class="input-box">
                <label for="employee-type">
                  Employee type
                </label>
                <Dropdown v-model="employeeTypeId" :options="employeeTypes" optionLabel="employeeTypeName"
                  optionValue="employeeTypeId" placeholder="Select a Employee Type" filter class="w-full md:w-14rem"
                  showClear />
              </div>
              <div class="input-box">
                <SelectButton v-model="status" :options="optionsActive" aria-labelledby="basic"
                  class="emp-status-control" />
              </div>

              <div></div>
            </div>

            <div class="buttons-group">
              <div class="input-box">
                <Button v-if="canCreate" class="btn btn-block" @click="addNew">
                  <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path>
                  </svg>
                  Employee
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
                    BioTime
                  </span>
                </Button>
              </div>
              <div class="input-box">
                <Button class="btn btn-block" @click="getVacationExcel">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.25 20.5h13.498a.75.75 0 0 1 .101 1.493l-.101.007H5.25a.75.75 0 0 1-.102-1.494l.102-.006h13.498H5.25Zm6.633-18.498L12 1.995a1 1 0 0 1 .993.883l.007.117v12.59l3.294-3.293a1 1 0 0 1 1.32-.083l.094.084a1 1 0 0 1 .083 1.32l-.083.094-4.997 4.996a1 1 0 0 1-1.32.084l-.094-.083-5.004-4.997a1 1 0 0 1 1.32-1.498l.094.083L11 15.58V2.995a1 1 0 0 1 .883-.993L12 1.995l-.117.007Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                  <span>
                    Vacations
                  </span>
                </Button>
              </div>
              <div class="input-box">
                <Button class="btn btn-block" @click="getExcel">
                  <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                      fill="#88a4bf" class="fill-000000"></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h2>
              Employees
            </h2>
            <div v-if="filteredEmployees.length > 0" class="shift-card-wrapper">
              <div v-for="(employee, index) in filteredEmployees" :key="`employee-${employee.employeeId}-${index}`">
                <EmployeeInfoCard :click-on-photo="() => { onPhoto(employee) }" :employee="employee"
                  :can-manage-shifts="hasAccessToManageShifts" :can-update="canUpdate" :can-delete="canDelete"
                  :canReadOnlyFiles="canReadOnlyFiles" :canManageFiles="canManageFiles"
                  :click-on-edit="() => { onEdit(employee) }" :click-on-delete="() => { onDelete(employee) }"
                  @clickShifts="handlerOpenShifts" @clickProceedingFiles="onProceedingFiles" />
              </div>
            </div>
            <div v-else class="empty">
              <div>
                <div class="icon">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.25 10a7.25 7.25 0 1 0-2.681 5.63l4.9 4.9.085.073a.75.75 0 0 0 .976-1.133l-4.9-4.901A7.22 7.22 0 0 0 17.25 10ZM11 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 2a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 9Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </div>
                No employee results
              </div>
            </div>

            <div></div>

            <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              :alwaysShow="false" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" @page="onPageChange" />
          </div>
        </div>

        <Sidebar v-model:visible="drawerEmployeeForm" :blockScroll="true" :closeOnEscape="false" :dismissable="false"
          header="Employee form" position="right" class="shift-form-sidebar" :showCloseIcon="true"
          @hide="onSidebarInfoHide">
          <div v-if="employee && employee.employeeId > 0" class="employee-info">
            <employeeModalInfoCard :employee="employee" />
          </div>

          <div v-if="employee && employee.employeeId > 0 && isRootUser" class="box-tools">
            <Button :class="{ 'btn-active': isActive('employee') }" class="btn" @click="onEditEmployee">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.821 6.5h5.929a2.25 2.25 0 0 1 2.229 1.938l.016.158.005.154v9a2.25 2.25 0 0 1-2.096 2.245L19.75 20H4.25a2.25 2.25 0 0 1-2.245-2.096L2 17.75v-7.251l6.207.001.196-.009a2.25 2.25 0 0 0 1.088-.393l.156-.12L13.821 6.5ZM8.207 4c.46 0 .908.141 1.284.402l.156.12 2.103 1.751-3.063 2.553-.085.061a.75.75 0 0 1-.29.106L8.206 9 2 8.999V6.25a2.25 2.25 0 0 1 2.096-2.245L4.25 4h3.957Z"
                  fill="#ffffff" class="fill-212121"></path>
              </svg>
              Work
            </Button>
            <Button :class="{ 'btn-active': isActive('person') }" class="btn" @click="onEditPerson">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 15c0-.35.06-.687.17-1H4.253a2.249 2.249 0 0 0-2.249 2.249v.92c0 .572.179 1.13.51 1.596C4.057 20.929 6.58 22 10 22c.397 0 .783-.014 1.156-.043A2.997 2.997 0 0 1 11 21v-6ZM10 2.005a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM12 15a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-6Zm2.5 1a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6Zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
              Personal
            </Button>
            <Button :class="{ 'btn-active': isActive('address') }" class="btn" @click="onEditAddress">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.55 2.533a2.25 2.25 0 0 1 2.9 0l6.75 5.695c.508.427.8 1.056.8 1.72v9.802a1.75 1.75 0 0 1-1.75 1.75h-3a1.75 1.75 0 0 1-1.75-1.75v-5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v5a1.75 1.75 0 0 1-1.75 1.75h-3A1.75 1.75 0 0 1 3 19.75V9.947c0-.663.292-1.292.8-1.72l6.75-5.694Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
              Address
            </Button>
            <Button :class="{ 'btn-active': isActive('records') }" class="btn" @click="onEditRecords">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.715 11c.427 0 .855.084 1.257.25C21.59 6.077 17.27 2 12 2 6.477 2 2 6.477 2 12c0 5.184 3.945 9.447 8.997 9.95a2.117 2.117 0 0 1 .064-.543l.458-1.83c.162-.648.497-1.24.97-1.712l5.902-5.903A3.28 3.28 0 0 1 20.713 11h.002Zm0 1h-.002c-.585 0-1.17.223-1.615.67l-5.902 5.902a2.684 2.684 0 0 0-.707 1.247l-.458 1.831a1.087 1.087 0 0 0 1.319 1.318l1.83-.457a2.684 2.684 0 0 0 1.248-.707l5.902-5.902A2.285 2.285 0 0 0 20.715 12Z"
                  fill="#ffffff" class="fill-212121"></path>
              </svg>
              Records
            </Button>
          </div>

          <employeeInfoForm v-if="!drawerEmployeePersonForm && !drawerAddressForm && !drawerRecords"
            :employee="employee" @save="onSave" :click-on-edit="() => { onEditPerson(employee) }" />
          <employeePersonInfoForm v-if="drawerEmployeePersonForm" :employee="employee" @save="onSave"
            :click-on-close="() => { onClosePerson() }" :can-update="canUpdate" :can-delete="canDelete" />
          <addressInfoForm v-if="drawerAddressForm" :address="address" @save="onSaveAddress"
            :click-on-close="() => { onCloseAddress() }" />
          <employeeRecords v-if="drawerRecords" :employee="employee" />
        </Sidebar>



        <Sidebar v-model:visible="drawerEmployeePhotoForm" :blockScroll="true" :closeOnEscape="false"
          :dismissable="false" header="Employee photo" position="right" class="shift-form-sidebar"
          :showCloseIcon="true">
          <employeePhotoForm :employee="employee" @save="onSave" />
        </Sidebar>

        <Sidebar v-model:visible="drawerShifts" :blockScroll="true" :closeOnEscape="false" :dismissable="false"
          header="Employee shifts calendar" position="right" class="sidebar-shifts">
          <employeeShift :employee="employee" :can-manage-vacation="canManageVacation"
            :can-manage-exception-request="canManageExceptionRequest"
            :canReadOnlyWorkDisabilities="canReadOnlyWorkDisabilities"
            :canManageWorkDisabilities="canManageWorkDisabilities" />
        </Sidebar>

        <Sidebar v-model:visible="drawerProceedingFiles" :blockScroll="true" :closeOnEscape="false" :dismissable="false"
          header="Employee proceeding files" position="right" class="proceeding-file-sidebar">
          <proceedingFiles :employee="employee" :canReadOnlyFiles="canReadOnlyFiles" :canManageFiles="canManageFiles"
            @onEmployeeContractSave="onEmployeeContractSave" />
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
    max-width: 40rem !important;

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

  .proceeding-file-sidebar {
    width: 90% !important;
    max-width: 90rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>