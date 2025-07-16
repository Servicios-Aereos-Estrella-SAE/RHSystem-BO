<template>
  <div v-if="isReady" class="employee-sync-list">
    <h4>Employee sync list</h4>
    <div v-if="employeesSync.length > 0" class="employee-sync-wrapper">
      <div v-for="(employee, index) in employeesSync" :key="`employee-${employee.employeeId}-${index}`">
        <employeeSyncInfoCard :employee="employee" />
      </div>
    </div>
    <div v-else class="employee-card-wrapper">
      <div class="empty-data">
        There are no employees
      </div>
    </div>
    <div class="employee-sync-button">
      <Button class="btn btn-block" @click="syncEmployees">
        <span>
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.052 5.029a1 1 0 0 0 .189 1.401 7.002 7.002 0 0 1-3.157 12.487l.709-.71a1 1 0 0 0-1.414-1.414l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414l-.843-.842A9.001 9.001 0 0 0 17.453 4.84a1 1 0 0 0-1.401.189Zm-1.93-1.736-2.5-2.5a1 1 0 0 0-1.498 1.32l.083.094.843.843a9.001 9.001 0 0 0-4.778 15.892A1 1 0 0 0 7.545 17.4a7.002 7.002 0 0 1 3.37-12.316l-.708.709a1 1 0 0 0 1.32 1.497l.094-.083 2.5-2.5a1 1 0 0 0 .083-1.32l-.083-.094Z"
              fill="#88a4bf" class="fill-212121"></path>
          </svg>
        </span>
        <span>
          Synchronize
        </span>
      </Button>
    </div>

  </div>
  <ProgressSpinner v-else />
  <transition name="page">
    <confirmRefuse v-if="drawerEmployeeSync" :actionType="'accept'" @confirmAccept="confirmSync"
      @cancelRefused="drawerEmployeeSync = false" />
  </transition>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>