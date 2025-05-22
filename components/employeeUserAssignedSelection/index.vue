<template>
  <div v-if="isReady" class="employee-user-assigned">
    <employeeModalInfoCard :employee="employee" />
    <div v-if="isReady" class="employee">
      <div class="form-container">
        <div class="filters">
          <h4>
            Select employees to assign
          </h4>
          <div class="box head-employees-page">
            <div class="input-search">
              <div class="input-box">
                <label for="search">
                  Search employee
                </label>
                <InputText v-model="search" placeholder="Employee name or id" @keypress.enter="handlerSearchEmployee" />
              </div>
              <div class="input-box">
                <button class="btn btn-block" @click="handlerSearchEmployee">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </button>
              </div>

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

          </div>


        </div>
        <div class="user-assigned-wrapper">
          <div>
            <div class="employee-user-assigned-header">
              <div></div>
              <div class="checkbox-label-wrapper">
                <Checkbox v-model="selectAllChecked" binary @change="toggleSelectAll" />
                <label for="selectAll">{{ selectAllLabel }}</label>
              </div>
              <Button v-if="canManageAssignedEdit && canManageUserAssigned" class="btn btn-block"
                @click="onSaveSelection">
                <svg viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                  enable-background="new 0 0 24 24">
                  <path
                    d="M10 18c-.5 0-1-.2-1.4-.6l-4-4c-.8-.8-.8-2 0-2.8.8-.8 2.1-.8 2.8 0l2.6 2.6 6.6-6.6c.8-.8 2-.8 2.8 0 .8.8.8 2 0 2.8l-8 8c-.4.4-.9.6-1.4.6z"
                    fill="#fff" class="fill-000000"></path>
                </svg>
                Save selection
              </Button>
            </div>
          </div>
        </div>

        <div v-if="filteredEmployees.length > 0" class="employee-user-assigned-wrapper">
          <div v-for="(employee, index) in filteredEmployees" :key="`employee-user-assigned-${index}`">
            <employeeUserAssignedSelectionInfoCard :employee="employee" :click-on-edit="() => { onEdit(employee) }"
              :click-on-delete="() => { onDelete(employee) }" :isDeleted="isDeleted"
              :canManageAssignedEdit="canManageAssignedEdit" :canManageUserAssigned="canManageUserAssigned" />
          </div>
        </div>
        <div v-else class="empty">
          Empty employee list.
        </div>

      </div>
    </div>

    <transition name="page">
      <confirmDelete v-if="drawerUserAssignedEmployeeDelete" @confirmDelete="confirmDelete"
        @cancelDelete="drawerUserAssignedEmployeeDelete = false" />
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
</style>