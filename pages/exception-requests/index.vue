<template>
  <div class="exception-request-page">


    <Head>
      <Title>Exception Requests</Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="exception-request-wrapper">
        <div class="box head-page">
          <div class="input-box">
            <label for="role">
              Department
            </label>
            <Dropdown v-model="selectedDepartmentId" :options="departments" optionLabel="departmentName"
              optionValue="departmentId" placeholder="Select a Department" filter class="w-full md:w-14rem"
              @change="handlerSearchExceptionRequest" />
          </div>
          <div class="input-box">
            <label for="positionId">Position</label>
            <Dropdown v-model="selectedPositionId" :options="positions" optionLabel="positionName"
              optionValue="positionId" placeholder="Select a Position" filter class="w-full md:w-14rem" />
          </div>
          <div class="input-box">
            <label for="status">Status</label>
            <Dropdown v-model="selectedStatus" :options="statusOptions" optionLabel="label" optionValue="value"
              placeholder="Select a Status" filter class="w-full md:w-14rem" @change="handlerSearchExceptionRequest" />
          </div>
          <div class="input-box">
            <label for="search">Search employee</label>
            <AutoComplete v-model="selectedEmployee"
              :optionLabel="(employee) => `${employee.person?.personFirstname || ''} ${employee.person?.personLastname || ''} ${employee.person?.personSecondLastname || ''}`"
              :suggestions="filteredEmployees" @complete="handlerSearchEmployee" @item-select="onEmployeeSelect">
              <template #option="employee">
                <div class="item-employee-filter-attendance-monitor">
                  <div class="name">
                    {{ employee.option.person?.personFirstname }}
                    {{ employee.option.person?.personLastname }}
                    {{ employee.option.person?.personSecondLastname }}
                  </div>
                  <div class="position-department">
                    {{ employee.option.department?.departmentAlias ||
                    employee.option.department?.departmentName }}
                    /
                    {{ employee.option.position?.positionAlias ||
                    employee.option.position?.positionName }}
                  </div>
                </div>
              </template>
            </AutoComplete>
          </div>

          <div class="input-box">
            <Button label="Clear Filters " class="btn btn-block" icon="pi pi-times" @click="clearFilters" />
          </div>
        </div>
        <div>
          <h2>Exception Requests</h2>
          <div v-if="filteredExceptionRequests.length > 0" class="exception-request-card-wrapper">
            <div v-for="(exceptionRequest, index) in filteredExceptionRequests"
              :key="`exceptionRequest-${exceptionRequest.id}-${index}`">
              <exceptionRequestInfoCard :exceptionRequest="exceptionRequest" :can-update="canUpdate"
                :can-delete="canDelete" :click-on-edit="() => { onEdit(exceptionRequest) }"
                :click-on-delete="() => { onDelete(exceptionRequest) }" />
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
              No Exception Requests results
            </div>
          </div>
          <div></div>
          <Paginator v-if="first > 1" class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
            @page="onPageChange" />

        </div>
      </div>

    </NuxtLayout>
    <Sidebar v-model:visible="drawerExceptionRequestForm" header="form" position="right"
      class="exception-request-form-sidebar" :showCloseIcon="true">
      <employeeExceptionRequestInfoForm :exceptionRequest="exceptionRequest" :employee="employee"
        :date="selectedExceptionDate" :changeStatus="true" :can-update="canUpdate" :can-delete="canDelete"
        @onExceptionRequestAccept="onExceptionRequestAccept" @onExceptionRequestDecline="onExceptionRequestDecline" />
    </Sidebar>
    <transition name="page">
      <confirmRefuse v-if="drawerExceptionRequestDelete" :actionType="currentAction" @confirmRefuse="confirmDelete"
        @confirmAccept="confirmAccept" @cancelRefused="drawerExceptionRequestDelete = false" />
    </transition>
    <transition name="page">
      <div v-if="drawerExceptionRequestDeletes" class="modal-overlay">
        <div class="modal-content">
          <h3>{{ currentAction === 'refuse' ? 'Refuse Exception Request' : 'Accept Exception Request' }}</h3>
          <p v-if="currentAction === 'refuse'">Please provide a reason for refuse:</p>
          <textarea v-if="currentAction === 'refuse'" v-model="description" placeholder="Enter the reason for refuse..."
            class="textarea"></textarea>
          <div class="modal-actions">
            <Button label="Cancel" class="btn btn-cancel" @click="drawerExceptionRequestDeletes = false" />
            <Button label="Confirm" class="btn btn-confirm"
              :disabled="currentAction === 'refuse' && !description.trim()"
              @click="currentAction === 'refuse' ? (drawerExceptionRequestDelete = true, drawerExceptionRequestDeletes = false) : confirmAccept()" />
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';

  .exception-request-card-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .exception-request-form-sidebar {
    width: 100% !important;
    max-width: 30rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>

<style lang="scss">
  @import '/resources/styles/variables.scss';
</style>