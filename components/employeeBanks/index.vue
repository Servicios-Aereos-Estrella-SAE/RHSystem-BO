<template>
  <div v-if="isReady" class="employee-banks">
    <div v-if="isReady" class="employee">
      <div class="form-container">
        <div class="files-wrapper">
          <div>
            <div class="files-header">
              <div></div>
              <Button class="btn btn-block" @click="addNew">
                <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                    fill="#88a4bf" class="fill-000000"></path>
                </svg>
                Add account bank
              </Button>
            </div>
          </div>
        </div>

        <div v-if="employeeBanksList.length > 0" class="employee-banks-wrapper">
          <div v-for="(employeeBank, index) in employeeBanksList" :key="`employee-bank-${index}`">
            <employeeBankInfoCard :employeeBank="employeeBank" :click-on-edit="() => { onEdit(employeeBank) }"
              :click-on-delete="() => { onDelete(employeeBank) }" :isDeleted="isDeleted" />
          </div>
        </div>
        <div v-else class="empty">
          Empty bank account list.
        </div>

        <div class="card flex justify-content-center">
          <Sidebar v-model:visible="drawerEmployeeBankForm" header="Bank" position="right"
            class="employee-bank-form-sidebar" :showCloseIcon="true">
            <employeeBankInfoForm :employeeBank="employeeBank" :employee="employee" @onEmployeeBankSave="onSave" />
          </Sidebar>
        </div>
      </div>
    </div>

    <transition name="page">
      <confirmDelete v-if="drawerEmployeeBankDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerEmployeeBankDelete = false" />
    </transition>
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

  .employee-bank-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
